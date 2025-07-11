#!/bin/bash

set -e

ENV=$1

if [ "$ENV" == "dev" ]; then
  DB_NAME="taller01_dev"
  BRANCH="dev"
elif [ "$ENV" == "prod" ]; then
  DB_NAME="taller01_prod"
  BRANCH="prod"
else
  echo "⚠️ Entorno no válido. Usa 'dev' o 'prod'."
  exit 1
fi

DATE=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="backup_${DB_NAME}_${DATE}.sql"

# Crear dump local
pg_dump -h 38.242.243.201 -p 5432 -U postgresuser -d $DB_NAME > $BACKUP_FILE
echo "📦 Backup generado: $BACKUP_FILE"

# Clonar repo de backup
git clone https://oauth2:$GITEA_TOKEN@194.163.140.23:3000/lacomarcaja/BD_BookMyFit.git
cd BD_BookMyFit

mkdir -p $BRANCH
mv ../$BACKUP_FILE $BRANCH/

git config user.email "jenkins@bookmyfit.local"
git config user.name "Jenkins CI"
git add $BRANCH/$BACKUP_FILE
git commit -m "Respaldo automático $ENV - $DATE"
git push origin main

echo "✅ Backup subido al repositorio BD_BookMyFit/$BRANCH"
