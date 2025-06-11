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

          withCredentials([sshUserPrivateKey(credentialsId: 'ssh-key-serverb', keyFileVariable: 'SSH_KEY')]) {
            sh """
              ssh -i \$SSH_KEY deployadmin@38.242.243.201 '
                # Detener proceso PM2 si existe
                pm2 delete ${runName} || true
                
                # Limpiar carpeta de despliegue
                rm -rf ${path}/*

                exit 0
              '

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
}