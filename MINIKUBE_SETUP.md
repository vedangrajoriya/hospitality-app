# Minikube Setup & Kubernetes Deployment Guide

## ✅ Current Status

Your Docker image is built and running successfully on port 8080 via Docker Compose.

## 📋 Prerequisites for Minikube

Before deploying to Kubernetes with Minikube, you need:

1. **Minikube** - Local Kubernetes cluster
2. **kubectl** - Already installed on your system ✓
3. **Docker** - Already installed on your system ✓
4. **Hyper-V or VirtualBox** - For running Minikube VM (using Docker driver works too)

## 🔧 Step 1: Install Minikube on Windows

### Option A: Using Quick Download (Recommended)

```powershell
# Download Minikube executable
$minikubeUrl = 'https://github.com/kubernetes/minikube/releases/download/v1.32.0/minikube-windows-amd64.exe'
$outputPath = "$env:USERPROFILE\AppData\Local\Programs\minikube\minikube.exe"

# Create directory if it doesn't exist
New-Item -ItemType Directory -Force -Path (Split-Path $outputPath)

# Download
Invoke-WebRequest -Uri $minikubeUrl -OutFile $outputPath -UseBasicParsing

# Add to PATH permanently
$pathEnv = [Environment]::GetEnvironmentVariable('Path', 'User')
if ($pathEnv -notlike "*minikube*") {
    [Environment]::SetEnvironmentVariable('Path', "$pathEnv;$(Split-Path $outputPath)", 'User')
}

# Verify installation (restart terminal after this)
minikube --version
```

### Option B: Using Chocolatey

```powershell
# Install Chocolate if not already installed
Set-ExecutionPolicy Bypass -Scope Process -Force
[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# Install Minikube
choco install minikube -y

# Restart terminal and verify
minikube --version
```

## 🚀 Step 2: Start Minikube Cluster

```powershell
# Start Minikube with Docker driver (requires Docker Desktop)
minikube start --driver=docker

# OR with Hyper-V driver (if you have Hyper-V enabled)
minikube start --driver=hyperv --hyperv-virtual-switch "Default Switch"

# Check status
minikube status
```

**Expected output:**
```
minikube
type: Control Plane
host: Running
kubelet: Running
apiserver: Running
kubeconfig: Configured
```

## 📦 Step 3: Load Docker Image to Minikube

```powershell
# Option A: Build directly in Minikube environment
minikube image build -t hospitality-frontend:latest .

# Option B: Load existing Docker image
minikube image load hospitality-frontend:latest

# Verify image is available in Minikube
minikube image ls | Select-String hospitality
```

## 🎯 Step 4: Deploy to Kubernetes

```powershell
# Apply Kubernetes manifests
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml

# Check deployment status
kubectl get deployments
kubectl get pods
kubectl get svc

# Wait for pods to be ready (READY column shows 1/1)
kubectl get pods -w
```

## 🌐 Step 5: Access Your Application

```powershell
# Method 1: Open in browser automatically
minikube service hospitality-service

# Method 2: Get the URL
minikube service hospitality-service --url

# Method 3: Port forward to localhost
kubectl port-forward svc/hospitality-service 8080:80

# Then visit: http://localhost:8080
```

## 📊 Useful Kubectl Commands

```powershell
# View pod logs
kubectl logs -l app=hospitality

# Describe a pod (useful for debugging)
kubectl describe pod <pod-name>

# Scale replicas
kubectl scale deployment hospitality-frontend --replicas=3

# View resource usage
kubectl top pods

# Port forward specific pod
kubectl port-forward pod/<pod-name> 8080:80

# Delete deployment
kubectl delete -f deployment.yaml
kubectl delete -f service.yaml

# Open Kubernetes dashboard
minikube dashboard
```

## 🛠️ Troubleshooting

### Minikube won't start
```powershell
# Delete and restart
minikube delete
minikube start --driver=docker

# Check logs
minikube logs
```

### Pod stuck in "ImagePullBackOff"
```powershell
# Make sure image is loaded in Minikube
minikube image load hospitality-frontend:latest

# Or check if image name matches in deployment.yaml
kubectl describe pod <pod-name>
```

### Can't access service
```powershell
# Check service is created
kubectl get svc hospitality-service

# Check pods are running
kubectl get pods

# Port forward as alternative
kubectl port-forward svc/hospitality-service 8080:80
```

### Resource constraints
```powershell
# Increase Minikube resources
minikube delete
minikube start --cpus=4 --memory=4096 --driver=docker
```

## 🧹 Cleanup

```powershell
# Stop Minikube
minikube stop

# Delete Minikube cluster (removes all data)
minikube delete

# Remove Docker image
docker rmi hospitality-frontend:latest
```

## 📝 Running Both Docker Compose and Minikube

If you want to run both:

```powershell
# Docker Compose (local testing)
docker-compose up -d

# Check logs
docker-compose logs -f

# Stop Docker Compose
docker-compose down

# Switch to Minikube
minikube start --driver=docker
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml
```

## Next: GitHub Actions Integration

Once Minikube is set up, you can extend `.github/workflows/deploy.yml` to:
1. Build Docker image
2. Push to Docker Hub
3. Deploy to Kubernetes cluster (using kubectl with kubeconfig)

See the commented sections in `.github/workflows/deploy.yml` for Docker Hub integration.
