#!/bin/bash

# Parámetro: env (dev o prod)
ENV=$1

# Configuración según el entorno
if [ "$ENV" == "dev" ]; then
  DB_NAME="taller01_dev"
elif [ "$ENV" == "prod" ]; then
  DB_NAME="taller01_prod"
else
  echo "❌ Entorno no válido. Usa 'dev' o 'prod'."
  exit 1
fi

# Ruta para backups (cambiada a deployadmin)
BACKUP_DIR="/home/deployadmin/db_backups"

# Crear carpeta si no existe
mkdir -p "$BACKUP_DIR"

# Archivo de backup con fecha y hora
BACKUP_FILE="$BACKUP_DIR/backup_${DB_NAME}_$(date +%Y%m%d_%H%M%S).sql"

# Host de la DB (IP)
DB_HOST="38.242.243.201"

echo "📦 Respaldando base de datos '$DB_NAME' desde $DB_HOST..."

# Comando de backup (ajusta según tu configuración de postgres)
PGPASSWORD="tu_password_de_postgres" pg_dump -h $DB_HOST -U postgresuser $DB_NAME > "$BACKUP_FILE"

if [ $? -eq 0 ]; then
  echo "✅ Backup exitoso: $BACKUP_FILE"
else
  echo "❌ Error durante el backup"
  exit 1
fi
