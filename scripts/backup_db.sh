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

# Comando para crear carpeta en remoto (si no existe)
sshpass -p 'MO4Vy692' ssh -o StrictHostKeyChecking=no ${REMOTE_USER}@${REMOTE_IP} "mkdir -p ${REMOTE_BACKUP_DIR}"

# Comando para hacer el dump de la base de datos en remoto y guardarlo en la ruta que quieres
sshpass -p 'MO4Vy692' ssh -o StrictHostKeyChecking=no ${REMOTE_USER}@${REMOTE_IP} "PGPASSWORD='tu_password_postgres' pg_dump -U postgresuser $DB_NAME > ${REMOTE_BACKUP_DIR}/${BACKUP_FILE}"

# Validar resultado
if [ $? -eq 0 ]; then
  echo "✅ Backup remoto exitoso en ${REMOTE_BACKUP_DIR}/${BACKUP_FILE}"
else
  echo "❌ Error durante el backup remoto"
  exit 1
fi
