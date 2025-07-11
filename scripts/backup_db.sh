#!/bin/bash

# --- Variables de entrada desde Jenkins ---
# $1 será 'dev' o 'prod' (el entorno de despliegue)
ENV=$1

# El GITEA_TOKEN es inyectado por Jenkinsfile como una variable de entorno.
# Asegúrate de que tu Jenkinsfile la está pasando correctamente.
# Ejemplo: sh "GITEA_TOKEN=$GITEA_TOKEN ./scripts/backup_db.sh ${backupEnv}"

# --- Validación del entorno ---
if [ "$ENV" == "dev" ]; then
  DB_NAME="taller01_dev"
elif [ "$ENV" == "prod" ]; then
  # AJUSTA ESTOS VALORES PARA TU BASE DE DATOS DE PRODUCCIÓN
  DB_NAME="taller01_prod"
else
  echo "❌ Entorno no válido. Usa 'dev' o 'prod'."
  exit 1
fi

# --- Configuración del servidor remoto (donde se encuentra la DB y se hará el backup inicial) ---
REMOTE_USER="root"
REMOTE_IP="38.242.243.201"
# ¡ADVERTENCIA DE SEGURIDAD! Poner la contraseña aquí no es seguro para producción.
# Considera usar autenticación SSH con claves en Jenkins.
REMOTE_PASSWORD="MO4Vy692"
REMOTE_BACKUP_DIR="/home/deployadmin/db_backups" # Directorio de backups en el servidor remoto

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE_NAME="backup_${DB_NAME}_${TIMESTAMP}.sql" # Nombre del archivo SQL para el backup y el commit

echo "Iniciando backup de la base de datos ${DB_NAME} en el servidor remoto ${REMOTE_IP}..."

# --- 1. Crear la carpeta de backups en el servidor remoto si no existe ---
sshpass -p "${REMOTE_PASSWORD}" ssh -o StrictHostKeyChecking=no ${REMOTE_USER}@${REMOTE_IP} "mkdir -p ${REMOTE_BACKUP_DIR}"

# --- 2. Realizar el backup en el servidor remoto ---
# Ejecuta pg_dump como el usuario 'postgres' en el servidor remoto
sshpass -p "${REMOTE_PASSWORD}" ssh -o StrictHostKeyChecking=no ${REMOTE_USER}@${REMOTE_IP} "sudo -u postgres pg_dump ${DB_NAME} > ${REMOTE_BACKUP_DIR}/${BACKUP_FILE_NAME}"

# Validar si el backup remoto fue exitoso
if [ $? -ne 0 ]; then
  echo "❌ Error durante el backup remoto en ${REMOTE_IP}."
  exit 1
fi
echo "✅ Backup remoto exitoso en ${REMOTE_BACKUP_DIR}/${BACKUP_FILE_NAME} en el servidor ${REMOTE_IP}."

# --- Operaciones para subir el backup a Gitea (ejecutadas en la máquina de Jenkins) ---

echo "--- Iniciando proceso de subida a Gitea ---"

# --- 3. Copiar el archivo de backup desde el servidor remoto a la máquina de Jenkins ---
echo "Copiando backup desde ${REMOTE_IP}:${REMOTE_BACKUP_DIR}/${BACKUP_FILE_NAME} a la máquina de Jenkins..."
# Usamos sshpass aquí para la autenticación en el scp
sshpass -p "${REMOTE_PASSWORD}" scp -o StrictHostKeyChecking=no ${REMOTE_USER}@${REMOTE_IP}:${REMOTE_BACKUP_DIR}/${BACKUP_FILE_NAME} ${BACKUP_FILE_NAME}

if [ $? -ne 0 ]; then
    echo "❌ Error al copiar el archivo de backup del servidor remoto a la máquina de Jenkins."
    exit 1
fi
echo "✅ Backup copiado localmente a: ${BACKUP_FILE_NAME}"

# --- Configuración del repositorio de Gitea para el backup ---
GITEA_REPO_URL_HTTP="http://lacomarcaja:${GITEA_TOKEN}@194.163.140.23:3000/lacomarcaja/BD_BookMyFit.git"
GITEA_REPO_CLONE_PATH="/tmp/BD_BookMyFit_repo" # Directorio temporal para clonar el repositorio de Gitea en el agente de Jenkins

# --- 4. Clonar o actualizar el repositorio de Gitea en la máquina de Jenkins ---
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
    git pull origin main # <--- ¡IMPORTANTE! Asegúrate de que 'main' es la rama correcta (podría ser 'master').
    if [ $? -ne 0 ]; then
        echo "⚠️ Advertencia: Error al hacer git pull en el repositorio de Gitea. Intentando continuar."
    fi
    cd - > /dev/null # Volver al directorio anterior para mantener el contexto
fi

# --- 5. Copiar el backup copiado localmente al directorio del repositorio de Gitea clonado ---
echo "Copiando ${BACKUP_FILE_NAME} al directorio del repositorio Gitea..."
cp "${BACKUP_FILE_NAME}" "${GITEA_REPO_CLONE_PATH}/"
if [ $? -ne 0 ]; then
    echo "❌ Error al copiar el archivo de backup al directorio del repositorio Gitea clonado."
    exit 1
fi

# --- 6. Navegar al directorio del repositorio clonado y realizar las operaciones Git ---
cd "$GITEA_REPO_CLONE_PATH"

# Configurar el usuario de Git (necesario para el commit)
git config user.email "jenkins-backup@lacomarcaja.com" # Puedes usar un email genérico para Jenkins
git config user.name "Jenkins Backup System"

# Añadir el archivo de backup
echo "Añadiendo el archivo ${BACKUP_FILE_NAME} al control de versiones de Git..."
git add "${BACKUP_FILE_NAME}"

# Hacer commit de los cambios
echo "Haciendo commit de los cambios..."
git commit -m "Automated DB backup for ${DB_NAME} (${ENV}) - ${TIMESTAMP}"

# Subir los cambios a Gitea usando el token en la URL HTTP
echo "Subiendo el backup a Gitea..."
git push "${GITEA_REPO_URL_HTTP}" main # <--- ¡IMPORTANTE! Asegúrate de que 'main' es la rama correcta.

if [ $? -eq 0 ]; then
    echo "✅ Backup subido exitosamente a Gitea en el repositorio BD_BookMyFit."
    # Opcional: limpiar los archivos temporales después de una subida exitosa
    echo "Limpiando archivos temporales..."
    rm -f "${BACKUP_FILE_NAME}" # Eliminar el archivo temporal copiado
    rm -rf "$GITEA_REPO_CLONE_PATH" # Eliminar el clon del repositorio de Gitea
    echo "Limpieza completada."
else
    echo "❌ Error al subir el backup a Gitea."
    exit 1
fi