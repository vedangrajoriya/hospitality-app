# Deployment Guide

This project is configured for Docker, Kubernetes, and CI/CD deployment.

## Quick Start

### 1. Build and Run Locally with Docker

```bash
# Build the Docker image
docker build -t hospitality-frontend .

# Run the container
docker run -p 8080:80 hospitality-frontend

# Access at http://localhost:8080
```

### 2. Deploy to Kubernetes (Minikube)

**Prerequisites:**
- Install [Minikube](https://minikube.sigs.k8s.io/docs/start/)
- Install [kubectl](https://kubernetes.io/docs/tasks/tools/)

**Steps:**

```bash
# Start Minikube
minikube start

# Build the image in Minikube environment
minikube image build -t hospitality-frontend .

# Or if you built locally, load it into Minikube:
minikube image load hospitality-frontend:latest

# Apply Kubernetes manifests
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml

# Open the service in your browser
minikube service hospitality-service

# View deployment status
kubectl get deployments
kubectl get pods
kubectl get services
```

**Useful Commands:**

```bash
# View logs
kubectl logs -l app=hospitality

# Port forward (alternative to minikube service)
kubectl port-forward svc/hospitality-service 8080:80

# Delete deployment
kubectl delete -f deployment.yaml
kubectl delete -f service.yaml

# Scale replicas
kubectl scale deployment hospitality-frontend --replicas=3
```

### 3. CI/CD Pipeline with GitHub Actions

The `.github/workflows/deploy.yml` automatically:

- Installs dependencies on every push
- Runs linters and tests
- Builds the Vite app
- Builds Docker image (on main branch push)

**To enable Docker Hub push:**

1. Create a [Docker Hub](https://hub.docker.com/) account
2. Add secrets to your GitHub repo:
   - `DOCKER_USERNAME`
   - `DOCKER_PASSWORD`
3. Uncomment the Docker Hub login and push steps in `.github/workflows/deploy.yml`

## Files Created

- **Dockerfile** - Multi-stage Docker build for optimization
- **nginx.conf** - Nginx configuration for serving SPA with proper routing
- **.dockerignore** - Excludes unnecessary files from Docker build
- **deployment.yaml** - Kubernetes Deployment with 2 replicas, health checks, and resource limits
- **service.yaml** - Kubernetes Service for exposing the app (NodePort on 30080)
- **.github/workflows/deploy.yml** - GitHub Actions CI/CD pipeline

## Environment-Specific Builds

```bash
# Development build
npm run build:dev

# Production build
npm run build
```

## Troubleshooting

**Port already in use:**
```bash
docker run -p 8081:80 hospitality-frontend  # Use different port
```

**Minikube can't find image:**
```bash
# Rebuild in Minikube
minikube image build -t hospitality-frontend .

# List Minikube images
minikube image ls
```

**Kubernetes pod not starting:**
```bash
# Check pod status and events
kubectl describe pod <pod-name>
kubectl logs <pod-name>
```

## Next Steps

1. Push to GitHub to trigger CI/CD
2. Monitor GitHub Actions workflow
3. Customize resource limits in `deployment.yaml` based on your needs
4. Add environment-specific configurations (dev, staging, prod)
5. Consider using Kustomize or Helm for advanced deployments
