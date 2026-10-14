# Student Task Manager - CI/CD with Jenkins, Docker and Kubernetes

A simple HTML/CSS/JavaScript app (add, delete, complete and filter tasks; data stored in `localStorage`),
served by Nginx in a Docker container, built and deployed to Kubernetes by a Jenkins pipeline.

## Structure
- `index.html`, `style.css`, `script.js` - the application
- `Dockerfile`, `nginx.conf` - containerization
- `Jenkinsfile` - pipeline: Checkout -> Validate -> Docker Build -> Container Test -> Load Image -> Deploy
- `k8s/deployment.yaml`, `k8s/service.yaml` - Kubernetes Deployment (2 replicas) and NodePort Service
- `screenshots/` - evidence of the running pipeline and application

## Run locally with Docker
    docker build -t student-task-manager .
    docker run -p 8080:80 student-task-manager
    # open http://localhost:8080

## Deploy to Kubernetes manually (kind)
    kind create cluster
    kind load docker-image student-task-manager:latest
    kubectl apply -f k8s/
    kubectl port-forward svc/student-task-manager-svc 8081:80
    # open http://localhost:8081

## CI/CD
Create a Jenkins "Pipeline" job with "Pipeline script from SCM" pointing to this repository.
Jenkins needs access to `docker`, `kubectl` and `kind` on its agent.
