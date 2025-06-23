pipeline {
  agent any

  parameters {
    choice(name: 'DEPLOY_ENV', choices: ['development', 'production'], description: 'Elige el entorno de despliegue')
  }

  stages {
    stage('Instalar dependencias') {
      steps {
        echo 'Instalando dependencias...'
        sh 'npm install'
        echo 'Dependencias instaladas correctamente.'
      }
    }

    stage('SonarQube Analysis') {
      steps {
        echo 'Iniciando análisis en SonarQube...'
        withSonarQubeEnv('SonarQubeCommunity') {
          withCredentials([string(credentialsId: 'sonar-token-back', variable: 'SONAR_TOKEN')]) {
            sh 'npx sonar-scanner -Dsonar.token=$SONAR_TOKEN'
          }
        }
        echo 'Análisis de SonarQube completado.'
      }
    }

    stage('Deploy') {
      steps {
        script {
          echo "Preparando despliegue para el entorno: ${params.DEPLOY_ENV}"
          
          def path = params.DEPLOY_ENV == 'development' ? '/home/deployadmin/backend-dev' : '/home/deployadmin/backend-prod'
          def runName = params.DEPLOY_ENV == 'development' ? 'backend-dev' : 'backend-prod'
          def envFile = params.DEPLOY_ENV == 'development' ? '.env.development' : '.env.production'
          def envMode = params.DEPLOY_ENV == 'development' ? 'development' : 'production'
          def backupEnv = params.DEPLOY_ENV == 'development' ? 'dev' : 'prod'

          echo "Configuración: path=${path}, runName=${runName}, envFile=${envFile}, envMode=${envMode}"

          // Forzamos permiso ejecutable antes de correr el backup, oppa 💪✨
          echo "Dando permiso de ejecución al script de backup..."
          sh 'chmod +x ./scripts/backup_db.sh'

          echo "Ejecutando respaldo automático de la base de datos para el entorno '${backupEnv}'..."
          sh "./scripts/backup_db.sh ${backupEnv}"

          withCredentials([sshUserPrivateKey(credentialsId: 'ssh-key-serverb', keyFileVariable: 'SSH_KEY')]) {
            sh """
              echo 'Conectando al servidor y deteniendo cualquier proceso existente en PM2...'
              ssh -i \$SSH_KEY deployadmin@38.242.243.201 '
                pm2 delete ${runName} || true
                echo 'Proceso PM2 detenido, limpiando directorio de despliegue...'
                rm -rf ${path}/*
                exit 0
              '

              echo 'Copiando archivos al servidor...'
              scp -i \$SSH_KEY -r package.json package-lock.json sonar-project.properties src Jenkinsfile Readme.md ${envFile} deployadmin@38.242.243.201:${path}

              echo 'Renombrando archivo de entorno...'
              ssh -i \$SSH_KEY deployadmin@38.242.243.201 '
                cd ${path} &&
                mv ${envFile} .env &&
                echo "Archivo ${envFile} renombrado a .env." &&
                cat .env
              '

              echo 'Iniciando la aplicación en el servidor...'
              ssh -i \$SSH_KEY deployadmin@38.242.243.201 '
                cd ${path} &&
                npm install &&
                echo "Dependencias instaladas." &&
                pm2 start src/index.js --name ${runName} --env ${envMode} --update-env &&
                echo "Aplicación arrancada en el modo ${envMode}." &&
                pm2 save
              '
            """
          }
        }
      }
    }
  }

  post {
    always {
      echo 'El pipeline ha terminado, oppa 💜'
    }

    success {
      echo 'El despliegue fue exitoso, ¡sigue brillando! 🌟✨'
    }

    failure {
      echo 'Oppa, hubo un error durante el despliegue, pero ¡ánimo, lo lograrás! 💪💖'
    }
  }
}