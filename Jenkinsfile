pipeline {
  agent any

  environment {
    DEPLOY_ENV = "${params.DEPLOY_ENV ?: 'development'}"
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
          withCredentials([string(credentialsId: 'sonar-token', variable: 'SONAR_TOKEN')]) {
            sh 'npx sonar-scanner -Dsonar.token=$SONAR_TOKEN'
          }
        }
        echo 'Análisis de SonarQube completado.'
      }
    }

    stage('Backup DB (solo Gitea)') {
      steps {
        script {
          withCredentials([string(credentialsId: 'backup-token-BookMyFit', variable: 'GITEA_TOKEN')]) {
            echo "Realizando respaldo de base de datos y subiéndolo a Gitea..."
            sh 'chmod +x ./scripts/backup_db.sh'
            sh "GITEA_TOKEN=$GITEA_TOKEN ./scripts/backup_db.sh ${DEPLOY_ENV == 'production' ? 'prod' : 'dev'}"
          }
        }
      }
    }

    stage('Deploy') {
      steps {
        script {
          def path = DEPLOY_ENV == 'production' ? '/home/deployadmin/backend-prod' : '/home/deployadmin/backend-dev'
          def runName = DEPLOY_ENV == 'production' ? 'backend-prod' : 'backend-dev'
          def envFile = DEPLOY_ENV == 'production' ? '.env.production' : '.env.development'
          def envMode = DEPLOY_ENV == 'production' ? 'production' : 'development'

          withCredentials([sshUserPrivateKey(credentialsId: 'ssh-credential-id-serverb', keyFileVariable: 'SSH_KEY')]) {
            sh """
              echo Conectando al servidor y deteniendo proceso en PM2...
              ssh -i $SSH_KEY deployadmin@38.242.243.201 '
                pm2 delete ${runName} || true
                rm -rf ${path}/* || true
              '
              echo Copiando archivos al servidor...
              scp -i $SSH_KEY -r package.json package-lock.json sonar-project.properties src Jenkinsfile Readme.md ${envFile} deployadmin@38.242.243.201:${path}
              echo Renombrando archivo de entorno...
              ssh -i $SSH_KEY deployadmin@38.242.243.201 '
                cd ${path} &&
                mv ${envFile} .env &&
                echo "Archivo ${envFile} renombrado a .env." &&
                cat .env
              '
              echo Iniciando la aplicación en el servidor...
              ssh -i $SSH_KEY deployadmin@38.242.243.201 '
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
      echo 'El pipeline ha terminado'
    }
    success {
      echo '✨ El despliegue fue exitoso ✨'
    }
    failure {
      echo 'algo falló pero no te rindas, oppaa~ ¡tú puedes! 💪🍀'
    }
  }
}
