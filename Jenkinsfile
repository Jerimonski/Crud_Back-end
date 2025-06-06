pipeline {
  agent any

  parameters {
    choice(name: 'DEPLOY_ENV', choices: ['development', 'production'], description: 'Elige el entorno de despliegue')
  }

  stages {
    stage('Clonar') {
      steps {
        git branch: 'main', url: 'http://194.163.140.23:3000/lacomarcaja/Back-end.git'
      }
    }

    stage('Instalar dependencias') {
      steps {
        sh 'npm install'
      }
    }

    stage('Deploy') {
      steps {
        script {
          def path = params.DEPLOY_ENV == 'development' ? '/home/deployadmin/backend-dev' : '/home/deployadmin/backend-prod'
          def runName = params.DEPLOY_ENV == 'development' ? 'backend-dev' : 'backend-prod'

          withCredentials([sshUserPrivateKey(credentialsId: 'ssh-credential-id-serverb', keyFileVariable: 'SSH_KEY')]) {
            sh """
              ssh -i \$SSH_KEY deployadmin@194.163.140.23 'pkill -f "${runName}" || true'
              ssh -i \$SSH_KEY deployadmin@194.163.140.23 'rm -rf ${path}/*'
              scp -i \$SSH_KEY -r * deployadmin@194.163.140.23:${path}
              ssh -i \$SSH_KEY deployadmin@194.163.140.23 "cd ${path} && nohup npx nodemon src/index.js > log.txt 2>&1 & echo \$! > ${runName}.pid"
            """
          }
        }
      }
    }
  }
}
