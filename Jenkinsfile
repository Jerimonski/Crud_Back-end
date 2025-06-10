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

          withCredentials([sshUserPrivateKey(credentialsId: 'ssh-key-serverb', keyFileVariable: 'SSH_KEY')]) {
            sh """
              ssh -i \$SSH_KEY deployadmin@38.242.243.201 '
                if pgrep -f "${runName}" > /dev/null; then
                  pkill -f "${runName}" || true
                else
                  echo "No hay procesos ${runName} corriendo"
                fi
              ' || true
              
              ssh -i \$SSH_KEY deployadmin@38.242.243.201 'rm -rf ${path}/*'

              scp -i \$SSH_KEY -r package.json package-lock.json sonar-project.properties src Jenkinsfile Readme.md deployadmin@38.242.243.201:${path}

              ssh -i \$SSH_KEY deployadmin@38.242.243.201 '
                cd ${path} &&
                npm install &&
                nohup node src/index.js > log.txt 2>&1 & echo \$! > ${runName}.pid
              '
            """
          }
        }
      }
    }
  }
}