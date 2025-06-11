pipeline {
  agent any

  parameters {
    choice(name: 'DEPLOY_ENV', choices: ['development', 'production'], description: 'Elige el entorno de despliegue')
  }

  stages {
    stage('Instalar dependencias') {
      steps {
        sh 'npm install'
      }
    }

    stage('SonarQube Analysis') {
      steps {
        withSonarQubeEnv('SonarQubeCommunity') {
          withCredentials([string(credentialsId: 'sonar-token-back', variable: 'SONAR_TOKEN')]) {
            sh 'npx sonar-scanner -Dsonar.token=$SONAR_TOKEN'
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

          echo "Preparando el despliegue para el entorno: ${params.DEPLOY_ENV}"

          withCredentials([sshUserPrivateKey(credentialsId: 'ssh-key-serverb', keyFileVariable: 'SSH_KEY')]) {
            sh """
              # Conexión SSH al servidor para detener el proceso PM2 y limpiar el directorio de despliegue
              ssh -i \$SSH_KEY deployadmin@38.242.243.201 '
                pm2 delete ${runName} || true
                rm -rf ${path}/*
                exit 0
              '

              # Renombrar el archivo .env en el sistema local antes de copiarlo
              if [ "${params.DEPLOY_ENV}" == "development" ]; then
                mv .env.development ${envFile}
              else
                mv .env.production ${envFile}
              fi

              # Copiar los archivos necesarios al servidor
              scp -i \$SSH_KEY -r package.json package-lock.json sonar-project.properties src Jenkinsfile Readme.md ${envFile} deployadmin@38.242.243.201:${path}

              # Conexión SSH al servidor para renombrar el archivo de entorno y arrancar la aplicación
              ssh -i \$SSH_KEY deployadmin@38.242.243.201 '
                cd ${path} &&
                mv ${envFile} .env &&  # Renombrar el archivo .env
                npm install &&  # Instalar dependencias
                pm2 start src/index.js --name ${runName} --env ${envMode} --update-env &&  # Iniciar la aplicación con PM2
                pm2 save  # Guardar el estado de PM2
              '
            """
          }
        }
      }
    }
  }

  post {
    always {
      echo 'El pipeline ha terminado.'
    }

    success {
      echo 'El despliegue fue exitoso.'
    }

    failure {
      echo 'Hubo un error durante el despliegue.'
    }
  }
}
