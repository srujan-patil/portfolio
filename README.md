# Srujan — Portfolio

![CI](https://github.com/YOUR_USERNAME/portfolio/actions/workflows/ci.yml/badge.svg)
![Deploy](https://github.com/YOUR_USERNAME/portfolio/actions/workflows/deploy.yml/badge.svg)

> Cloud Support & DevOps Engineer — AWS · Docker · Kubernetes (E2E Cloud) · GitHub Actions

## Project Structure

```
portfolio/
├── src/
│   ├── index.js          ← Express server + API
│   └── index.test.js     ← Jest tests
├── public/
│   ├── index.html        ← Portfolio UI
│   ├── css/style.css     ← Styles
│   └── js/main.js        ← Frontend JS
├── k8s/
│   ├── deployment.yaml   ← K8s Deployment (production)
│   ├── service.yaml      ← K8s Service (LoadBalancer)
│   └── staging.yaml      ← K8s Staging manifests
├── .github/workflows/
│   ├── ci.yml            ← Test + Trivy scan + Docker build
│   └── deploy.yml        ← Deploy to E2E Cloud K8s
├── .env.example          ← Copy to .env
└── package.json
```

## Local Development (without Docker)

```bash
git clone https://github.com/YOUR_USERNAME/portfolio
cd portfolio
cp .env.example .env
npm install
npm run dev        # http://localhost:3000
```

## Run Tests

```bash
npm test
```

## CI/CD Pipeline

```
git push main
    ↓
🧪  Jest tests
    ↓
🔍  Trivy security scan (image + filesystem)
    ↓
🐳  Build Docker image → push to ghcr.io
    ↓
🧪  Deploy to E2E Cloud K8s → staging namespace
    ↓
✅  Health check on staging
    ↓
🚀  Deploy to E2E Cloud K8s → production namespace
    ↓
✅  Health check + auto-rollback if failed
```

## GitHub Secrets Required

| Secret | Value |
|--------|-------|
| `KUBECONFIG_E2E` | Base64 of your E2E kubeconfig |

## K8s Setup (one time)

```bash
# Download kubeconfig from E2E portal → myaccount.e2enetworks.com
cp kubeconfig.yaml ~/.kube/config

# Create namespaces
kubectl create namespace staging
kubectl create namespace production

# Create image pull secret
kubectl create secret docker-registry ghcr-secret \
  --docker-server=ghcr.io \
  --docker-username=YOUR_GITHUB_USERNAME \
  --docker-password=YOUR_GITHUB_PAT \
  -n production

kubectl create secret docker-registry ghcr-secret \
  --docker-server=ghcr.io \
  --docker-username=YOUR_GITHUB_USERNAME \
  --docker-password=YOUR_GITHUB_PAT \
  -n staging

# First deploy (manual)
kubectl apply -f k8s/staging.yaml
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
```

## Stack

- **App:** Node.js + Express
- **Testing:** Jest + Supertest
- **Security:** Trivy (image + filesystem scan)
- **Container:** Docker (multi-stage)
- **Registry:** GitHub Container Registry (ghcr.io)
- **CI/CD:** GitHub Actions
- **Production:** E2E Cloud Managed Kubernetes
