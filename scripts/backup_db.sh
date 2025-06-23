#!/bin/bash

ENV=$1
DATE=$(date +"%Y%m%d_%H%M%S")

if [ "$ENV" = "dev" ]; then
    DB_NAME="taller01_dev"
elif [ "$ENV" = "prod" ]; then
    DB_NAME="taller01_prod"
else
    echo "❌ Entorno inválido. Usa 'dev' o 'prod'."
    exit 1
fi

REMOTE_HOST="38.242.243.201"
DB_USER="postgresuser"
DB_PASSWORD="postgresUser"  # ⚠️ No compartas este archivo si tiene esta info 🙈

BACKUP_DIR="/home/jenkins/db_backups"
FILENAME="backup_${DB_NAME}_${DATE}.sql"

mkdir -p "$BACKUP_DIR"

echo "📦 Respaldando base de datos '$DB_NAME' desde $REMOTE_HOST..."

# Usamos PGPASSWORD para pasar la contraseña
ssh root@$REMOTE_HOST "PGPASSWORD=$DB_PASSWORD pg_dump -U $DB_USER $DB_NAME" > "$BACKUP_DIR/$FILENAME"

if [ $? -eq 0 ]; then
    echo "✅ Backup completado: $BACKUP_DIR/$FILENAME"
else
    echo "❌ Error durante el backup"
    exit 1
fi
