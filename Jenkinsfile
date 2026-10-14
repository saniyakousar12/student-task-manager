pipeline {
    agent any

    environment {
        IMAGE_NAME = 'student-task-manager'
        IMAGE_TAG  = "${BUILD_NUMBER}"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Validate') {
            steps {
                sh '''
                    for f in index.html style.css script.js Dockerfile nginx.conf k8s/deployment.yaml k8s/service.yaml; do
                        test -f "$f" || { echo "Missing file: $f"; exit 1; }
                    done
                    echo "All required files are present."
                '''
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t ${IMAGE_NAME}:${IMAGE_TAG} -t ${IMAGE_NAME}:latest .'
            }
        }

        stage('Test Container') {
            steps {
                sh '''
                    docker rm -f stm-test || true
                    docker run -d --name stm-test -p 8089:80 ${IMAGE_NAME}:${IMAGE_TAG}
                    sleep 4
                    curl -f http://localhost:8089/health
                    curl -f http://localhost:8089/ | grep "Student Task Manager"
                    docker rm -f stm-test
                '''
            }
        }

        stage('Load Image into Kubernetes') {
            steps {
                sh 'kind load docker-image ${IMAGE_NAME}:${IMAGE_TAG}'
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh '''
                    kubectl apply -f k8s/
                    kubectl set image deployment/student-task-manager app=${IMAGE_NAME}:${IMAGE_TAG}
                    kubectl rollout status deployment/student-task-manager --timeout=90s
                    kubectl get pods,svc
                '''
            }
        }
    }

    post {
        success { echo 'Pipeline completed successfully.' }
        failure { sh 'docker rm -f stm-test || true'; echo 'Pipeline failed.' }
    }
}
