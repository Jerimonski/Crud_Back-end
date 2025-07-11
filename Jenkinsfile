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

    stage('Backup DB (solo Gitea)') {
      steps {
        script {
          def backupEnv = params.DEPLOY_ENV == 'development' ? 'dev' : 'prod'

          withCredentials([
            string(credentialsId: 'backup-token-BookMyFit', variable: 'GITEA_TOKEN')
          ]) {
            echo "Realizando respaldo de base de datos y subiéndolo a Gitea..."
            sh 'chmod +x ./scripts/backup_db.sh'
            sh "GITEA_TOKEN=$GITEA_TOKEN ./scripts/backup_db.sh ${backupEnv}"
          }
        }
      }
    }

    stage('Deploy') {
      steps {
        script {
          def path = params.DEPLOY_ENV == 'development' ? '/home/deployadmin/backend-dev' : '/home/deployadmin/backend-prod'
          def runName = params.DEPLOY_ENV == 'development' ? 'backend-dev' : 'backend-prod'
          def envFile = params.DEPLOY_ENV == 'development' ? '.env.development' : '.env.production'
          def envMode = params.DEPLOY_ENV == 'development' ? 'development' : 'production'

          withCredentials([sshUserPrivateKey(credentialsId: 'ssh-key-serverb', keyFileVariable: 'SSH_KEY')]) {
            sh """
              echo 'Conectando al servidor y deteniendo proceso en PM2...'
              ssh -i \$SSH_KEY deployadmin@38.242.243.201 '
                pm2 delete ${runName} || true
                rm -rf ${path}/*
              '

              echo 'Copiando archivos al servidor...'
              scp -i \$SSH_KEY -r package.json package-lock.json sonar-project.properties src Jenkinsfile Readme.md ${envFile} deployadmin@38.242.243.201:${path}

              ssh -i \$SSH_KEY deployadmin@38.242.243.201 '
                cd ${path} &&
                mv ${envFile} .env &&
                npm install &&
                pm2 start src/index.js --name ${runName} --env ${envMode} --update-env &&
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
      echo 'El despliegue fue exitoso'
    }

    failure {
      echo 'algo falló pero no te rindas'
    }
  }
}
