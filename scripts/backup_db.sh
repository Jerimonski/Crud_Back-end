#!/bin/bash

ENV=$1

if [ "$ENV" == "dev" ]; then
  DB_NAME="taller01_dev"
elif [ "$ENV" == "prod" ]; then
  DB_NAME="taller01_prod"
else
  echo "❌ Entorno no válido. Usa 'dev' o 'prod'."
  exit 1
fi

# Datos del servidor remoto
REMOTE_USER="root"
REMOTE_IP="38.242.243.201"

# Ruta donde guardar backup en servidor remoto
REMOTE_BACKUP_DIR="/home/deployadmin/db_backups"

# Archivo de backup remoto
BACKUP_FILE="backup_${DB_NAME}_$(date +%Y%m%d_%H%M%S).sql"

# Crear la carpeta de backups en el servidor remoto
sshpass -p 'MO4Vy692' ssh -o StrictHostKeyChecking=no ${REMOTE_USER}@${REMOTE_IP} "mkdir -p ${REMOTE_BACKUP_DIR}"

# Hacer el backup usando peer auth (requiere que el usuario del sistema sea postgresuser)
sshpass -p 'MO4Vy692' ssh -o StrictHostKeyChecking=no ${REMOTE_USER}@${REMOTE_IP} "sudo -u postgresuser pg_dump $DB_NAME > ${REMOTE_BACKUP_DIR}/${BACKUP_FILE}"

# Validar resultado
if [ $? -eq 0 ]; then
  echo "✅ Backup remoto exitoso en ${REMOTE_BACKUP_DIR}/${BACKUP_FILE}"
else
  echo "❌ Error durante el backup remoto"
  exit 1
fi
