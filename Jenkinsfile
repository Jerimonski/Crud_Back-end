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
          def port = params.DEPLOY_ENV == 'development' ? 3000 : 8000

          withCredentials([sshUserPrivateKey(credentialsId: 'ssh-key-serverb', keyFileVariable: 'SSH_KEY')]) {
            sh """
              ssh -i \$SSH_KEY deployadmin@38.242.243.201 '
                if lsof -i :${port} > /dev/null; then
                  echo "Matando proceso que usa el puerto ${port}..."
                  lsof -ti :${port} | xargs kill -9 || true
                else
                  echo "No hay procesos usando el puerto ${port}."
                fi
              ' || true

              ssh -i \$SSH_KEY deployadmin@38.242.243.201 'rm -rf ${path}/*'

              scp -i \$SSH_KEY -r package.json package-lock.json sonar-project.properties src Jenkinsfile Readme.md ${envFile} deployadmin@38.242.243.201:${path}

              ssh -i \$SSH_KEY deployadmin@38.242.243.201 '
                cd ${path} &&
                mv ${envFile} .env &&
                npm install &&
                nohup npm ${params.DEPLOY_ENV == "development" ? "run start:dev" : "run start:prod"} > log.txt 2>&1 < /dev/null & disown;
                echo \$! > ${runName}.pid;
                sleep 1;
                exit 0
              '
            """
          }
        }
      }
    }
  }
}
