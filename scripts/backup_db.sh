#!/bin/bash

ENV=$1

# Validar el entorno
if [ "$ENV" == "dev" ]; then
  DB_NAME="taller01_dev"
elif [ "$ENV" == "prod" ]; then
  DB_NAME="taller01_prod"
else
  echo "❌ Entorno no válido. Usa 'dev' o 'prod'."
  exit 1
fi

# --- Configuración del servidor remoto donde se hace el backup ---
REMOTE_USER="root"
REMOTE_IP="38.242.243.201" # IP de tu servidor remoto donde está la DB
REMOTE_BACKUP_DIR="/home/deployadmin/db_backups" # Directorio de backups en el servidor remoto

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE_NAME="backup_${DB_NAME}_${TIMESTAMP}.sql" # Nombre del archivo SQL para el backup y el commit

echo "Iniciando backup de la base de datos ${DB_NAME} en el servidor remoto ${REMOTE_IP}..."

# Crear la carpeta de backups en el servidor remoto si no existe
sshpass -p 'MO4Vy692' ssh -o StrictHostKeyChecking=no ${REMOTE_USER}@${REMOTE_IP} "mkdir -p ${REMOTE_BACKUP_DIR}"

# Hacer el backup usando el usuario postgres en el servidor remoto
# Usamos `sudo -u postgres` para ejecutar pg_dump como el usuario postgres.
sshpass -p 'MO4Vy692' ssh -o StrictHostKeyChecking=no ${REMOTE_USER}@${REMOTE_IP} "sudo -u postgres pg_dump ${DB_NAME} > ${REMOTE_BACKUP_DIR}/${BACKUP_FILE_NAME}"

# Validar si el backup remoto fue exitoso
if [ $? -ne 0 ]; then
  echo "❌ Error durante el backup remoto en ${REMOTE_IP}."
  exit 1
fi
echo "✅ Backup remoto exitoso en ${REMOTE_BACKUP_DIR}/${BACKUP_FILE_NAME} en el servidor ${REMOTE_IP}."

# --- Configuración para Gitea (en la máquina donde se ejecuta Jenkins) ---
# El GITEA_TOKEN es inyectado por Jenkinsfile.
GITEA_REPO_URL_HTTP="http://lacomarcaja:${GITEA_TOKEN}@194.163.140.23:3000/lacomarcaja/BD_BookMyFit.git"
GITEA_REPO_CLONE_PATH="/tmp/BD_BookMyFit_repo" # Directorio temporal para clonar el repositorio de Gitea

echo "--- Iniciando proceso de subida a Gitea ---"

# 1. Copiar el archivo de backup desde el servidor remoto a la máquina de Jenkins
echo "Copiando backup desde ${REMOTE_IP}:${REMOTE_BACKUP_DIR}/${BACKUP_FILE_NAME} a la máquina de Jenkins..."
scp -o StrictHostKeyChecking=no ${REMOTE_USER}@${REMOTE_IP}:${REMOTE_BACKUP_DIR}/${BACKUP_FILE_NAME} ${BACKUP_FILE_NAME}

if [ $? -ne 0 ]; then
    echo "❌ Error al copiar el archivo de backup del servidor remoto a la máquina de Jenkins."
    exit 1
fi
echo "✅ Backup copiado localmente a: ${BACKUP_FILE_NAME}"

# 2. Clonar o actualizar el repositorio de Gitea en la máquina de Jenkins
if [ ! -d "$GITEA_REPO_CLONE_PATH/.git" ]; then
    echo "Clonando repositorio de Gitea: ${GITEA_REPO_URL_HTTP}"
    git clone "${GITEA_REPO_URL_HTTP}" "$GITEA_REPO_CLONE_PATH"
    if [ $? -ne 0 ]; then
        echo "❌ Error al clonar el repositorio de Gitea."
        exit 1
    fi
else
    echo "El repositorio de Gitea ya está clonado, actualizando..."
    cd "$GITEA_REPO_CLONE_PATH" || { echo "Error: No se pudo cambiar al directorio del repositorio Gitea."; exit 1; }
    git pull origin main # Asegúrate de que 'main' es la rama correcta (puede ser 'master')
    if [ $? -ne 0 ]; then
        echo "⚠️ Advertencia: Error al hacer git pull en el repositorio de Gitea. Intentando continuar."
    fi
    cd - > /dev/null # Volver al directorio anterior
fi

# 3. Copiar el backup copiado localmente al directorio del repositorio de Gitea clonado
echo "Copiando ${BACKUP_FILE_NAME} al directorio del repositorio Gitea..."
cp "${BACKUP_FILE_NAME}" "${GITEA_REPO_CLONE_PATH}/"
if [ $? -ne 0 ]; then
    echo "❌ Error al copiar el archivo de backup al directorio del repositorio Gitea clonado."
    exit 1
fi

# 4. Navegar al directorio del repositorio clonado y realizar las operaciones Git
cd "$GITEA_REPO_CLONE_PATH"

# Configurar el usuario de Git (necesario para el commit)
git config user.email "jenkins-backup@lacomarcaja.com" # Puedes usar un email genérico de Jenkins
git config user.name "Jenkins Backup System"

# Añadir el archivo de backup
echo "Añadiendo el archivo ${BACKUP_FILE_NAME} al control de versiones de Git..."
git add "${BACKUP_FILE_NAME}"

# Hacer commit de los cambios
echo "Haciendo commit de los cambios..."
git commit -m "Automated DB backup for ${DB_NAME} (${ENV}) - ${TIMESTAMP}"

# Subir los cambios a Gitea usando el token
echo "Subiendo el backup a Gitea..."
git push "${GITEA_REPO_URL_HTTP}" main # Asegúrate de que 'main' es la rama correcta.

if [ $? -eq 0 ]; then
    echo "✅ Backup subido exitosamente a Gitea en el repositorio BD_BookMyFit."
    # Opcional: limpiar el archivo de backup local y el clon del repo Gitea
    echo "Limpiando archivos temporales..."
    rm -f "${BACKUP_FILE_NAME}" # Eliminar el archivo temporal copiado
    rm -rf "$GITEA_REPO_CLONE_PATH" # Eliminar el clon del repositorio de Gitea
    echo "Limpieza completada."
else
    echo "❌ Error al subir el backup a Gitea."
    exit 1
fi