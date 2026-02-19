# Alternative Kubernetes Deployment Strategies

## Current Status ✅
- **Docker Compose**: Running successfully on http://localhost:8080
- **Frontend**: Serving with health checks (HTTP 200)
- **Docker Image**: Built and ready (`hospitality-frontend:latest`)

## Why Minikube Had Issues
Minikube with Docker driver on Windows has known compatibility issues with the Docker Desktop API. This is a common problem documented in Minikube GitHub issues.

---

## Recommended Deployment Options

### Option 1: Docker Compose (Current - Best for Local Development)

**Already Working!** Continue using Docker Compose for local testing and development.

```powershell
# View running services
docker-compose ps

# View logs
docker-compose logs -f frontend

# Stop services
docker-compose down

# Restart services
docker-compose restart
```

**Advantages:**
- ✅ Works reliably on Windows
- ✅ Perfect for local development
- ✅ Easy to scale and manage
- ✅ No additional setup needed

---

### Option 2: Kubernetes on Azure (AKS) - Production Ready

Deploy to Azure Kubernetes Service for production environments.

```powershell
# Prerequisites
# 1. Install Azure CLI: https://learn.microsoft.com/en-us/cli/azure/install-azure-cli-windows
# 2. Create Azure account: https://azure.microsoft.com/en-us/free/

# Login to Azure
az login

# Create resource group
az group create --name hospitality-rg --location eastus

# Create AKS cluster
az aks create `
  --resource-group hospitality-rg `
  --name hospitality-cluster `
  --node-count 2 `
  --vm-set-type VirtualMachineScaleSets `
  --load-balancer-sku standard

# Get credentials
az aks get-credentials --resource-group hospitality-rg --name hospitality-cluster

# Verify connection
kubectl get nodes

# Deploy application
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml

# Get external IP
kubectl get svc hospitality-service
```

---

### Option 3: Kubernetes on Google Cloud (GKE) - Easy Setup

Google Kubernetes Engine with automatic scaling and monitoring.

```powershell
# Prerequisites
# 1. Install Google Cloud SDK: https://cloud.google.com/sdk/docs/install
# 2. Create Google Cloud account: https://console.cloud.google.com/

# Initialize gcloud
gcloud init

# Create GKE cluster
gcloud container clusters create hospitality-cluster `
  --zone us-central1-a `
  --num-nodes 2

# Get credentials
gcloud container clusters get-credentials hospitality-cluster --zone us-central1-a

# Verify connection
kubectl get nodes

# Deploy application
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml

# Get external IP
kubectl get svc hospitality-service
```

---

### Option 4: Kubernetes on DigitalOcean (DOKS) - Most Affordable

DigitalOcean-managed Kubernetes with great documentation.

```powershell
# Prerequisites
# 1. Install doctl CLI: https://docs.digitalocean.com/reference/doctl/how-to/install/
# 2. Create DigitalOcean account: https://www.digitalocean.com/

# Authenticate
doctl auth init

# Create cluster
doctl kubernetes cluster create hospitality-cluster --count 2 --region nyc3

# Save kubeconfig
doctl kubernetes cluster kubeconfig save hospitality-cluster

# Verify connection
kubectl get nodes

# Deploy application
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml

# Get external IP
kubectl get svc hospitality-service
```

---

### Option 5: Docker Swarm (Local Alternative to Kubernetes)

If you want container orchestration locally without Minikube.

```powershell
# Initialize Docker Swarm
docker swarm init

# Create service from compose file
docker stack deploy -c docker-compose.yml hospitality

# View services
docker service ls

# Scale service
docker service scale hospitality_frontend=3

# Remove stack
docker stack rm hospitality
```

---

## GitHub Actions CI/CD Pipeline Status

Your `.github/workflows/deploy.yml` is configured to:

✅ Build and test on every push
✅ Build Docker image on main branch
✅ Ready for Docker Hub integration (add secrets: DOCKER_USERNAME, DOCKER_PASSWORD)
✅ Ready to deploy to your chosen cloud provider

### Enable Docker Hub Push

1. Create [Docker Hub](https://hub.docker.com/) account
2. Add GitHub Secrets:
   - `DOCKER_USERNAME`
   - `DOCKER_PASSWORD`
3. Uncomment Docker Hub steps in `.github/workflows/deploy.yml`

### Deploy to Production Cloud Provider

Add a deployment step to your GitHub Actions workflow:

```yaml
  deploy-to-aks:
    needs: docker-build
    runs-on: ubuntu-latest
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        
      - name: Set up kubectl
        uses: azure/setup-kubectl@v3
        
      - name: Deploy to AKS
        run: |
          kubectl apply -f deployment.yaml
          kubectl apply -f service.yaml
```

---

## Comparison Table

| Option | Cost | Complexity | Local Dev | Production | Best For |
|--------|------|-----------|-----------|-----------|----------|
| Docker Compose | Free | ⭐ Easy | ✅ Yes | ❌ No | Development |
| Docker Swarm | Free | ⭐⭐ Medium | ✅ Yes | ⚠️ Limited | Small deployments |
| Minikube | Free | ⭐⭐⭐ Hard | ✅ Yes (with workarounds) | ❌ No | Learning K8s |
| AKS (Azure) | $$ | ⭐⭐ Medium | ⚠️ Complex | ✅ Yes | Enterprise |
| GKE (Google) | $$ | ⭐⭐ Medium | ⚠️ Complex | ✅ Yes | Enterprise |
| DOKS (DigitalOcean) | $ | ⭐⭐ Medium | ⚠️ Complex | ✅ Yes | Startups |

---

## Current Files Ready for Deployment

- ✅ `Dockerfile` - Production-optimized multi-stage build
- ✅ `nginx.conf` - SPA routing and caching configured
- ✅ `deployment.yaml` - K8s deployment manifest (ready for any cluster)
- ✅ `service.yaml` - K8s service manifest (NodePort for local, LoadBalancer for cloud)
- ✅ `docker-compose.yml` - Local development orchestration
- ✅ `.github/workflows/deploy.yml` - CI/CD pipeline automation

---

## Next Steps

**Immediate (Testing):**
```powershell
# Docker Compose is already running
docker-compose logs -f  # Watch logs
Invoke-WebRequest http://localhost:8080  # Test app
```

**For Production:**
1. Choose a cloud provider (AKS, GKE, or DOKS recommended)
2. Update `service.yaml` to use `type: LoadBalancer` instead of `NodePort`
3. Configure domain/DNS
4. Set up GitHub secrets for Docker Hub
5. Update GitHub Actions workflow with cloud provider deployment

**Alternative Local Testing:**
```powershell
# Use Docker Swarm instead of Kubernetes
docker swarm init
docker stack deploy -c docker-compose.yml hospitality
docker service ls
```

---

## Troubleshooting Docker Compose

```powershell
# Check container logs
docker-compose logs frontend

# Rebuild image
docker-compose build --no-cache

# Full restart
docker-compose down -v
docker-compose up -d

# Health check status
docker-compose ps

# Execute command in container
docker-compose exec frontend ls -la
```

---

## Resources

- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Azure Kubernetes Service (AKS)](https://learn.microsoft.com/en-us/azure/aks/)
- [Google Kubernetes Engine (GKE)](https://cloud.google.com/kubernetes-engine/docs)
- [DigitalOcean Kubernetes (DOKS)](https://docs.digitalocean.com/products/kubernetes/)
- [Docker Swarm Documentation](https://docs.docker.com/engine/swarm/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
