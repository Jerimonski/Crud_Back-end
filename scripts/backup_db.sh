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

REMOTE_USER="root"
REMOTE_IP="38.242.243.201"
REMOTE_BACKUP_DIR="/home/deployadmin/db_backups"
BACKUP_FILE="backup_${DB_NAME}_$(date +%Y%m%d_%H%M%S).sql"

# Crear carpeta remoto
sshpass -p 'MO4Vy692' ssh -o StrictHostKeyChecking=no ${REMOTE_USER}@${REMOTE_IP} "mkdir -p ${REMOTE_BACKUP_DIR}"

# Ejecutar pg_dump directamente sin sudo (como root o usuario con permisos)
sshpass -p 'MO4Vy692' ssh -o StrictHostKeyChecking=no ${REMOTE_USER}@${REMOTE_IP} "PGPASSWORD='deployAdmin' pg_dump -U postgresuser ${DB_NAME} > ${REMOTE_BACKUP_DIR}/${BACKUP_FILE}"

if [ $? -eq 0 ]; then
  echo "✅ Backup remoto exitoso en ${REMOTE_BACKUP_DIR}/${BACKUP_FILE}"
else
  echo "❌ Error durante el backup remoto"
  exit 1
fi
