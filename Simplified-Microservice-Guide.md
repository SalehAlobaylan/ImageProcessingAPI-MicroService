# Image Processing Microservice – Simplified Complete Guide

> **Purpose** – One markdown file that contains everything you need to understand, run and deploy the micro-service in three simple ways: Local (Node), Docker Compose and Kubernetes.  
> **Audience** – Developers who just want to get the service up & running quickly without digging through multiple documents.

---

## 1. What You Get

- 🟢 Production-ready Node/TypeScript micro-service
- 🔌 REST API `POST /api/v1/images/process` (Sharp-based resize/convert)
- 🛠 Service Discovery (Consul) + Message Queue (RabbitMQ) + Cache (Redis)
- 📊 Observability – Prometheus metrics + Jaeger tracing + Winston logging
- 🐳 Docker Compose stack **OR** ☸️ Single-file Kubernetes deployment

---

## 2. Minimal Project Layout

```txt
image-processing/
├── src/            # TypeScript source
│   ├── app.ts      # Express initialisation
│   ├── server.ts   # HTTP bootstrap + graceful shutdown
│   ├── services/   # Business logic (ImageProcessingService.ts)
│   └── …
└── README.md / *this guide*
```

---

## 3. Quick Start – Three Options

### 3-a :rocket: Local Development (no Docker)

```bash
# 1. Install deps
npm install

# 2. Environment (copy defaults)
cp .env.example .env

# 3. Start API (nodemon hot-reload)
npm run dev      # http://localhost:3000
```

### 3-b 🐳 Docker Compose (everything on your laptop)

```bash
# Bring up the full stack (API + DB + MQ + etc.)
docker compose up        # Ctrl-C to stop
# …or in background
docker compose up -d
```

_Main URLs (default credentials in file)_
| Service | URL |
|---------|-----|
| API | http://localhost:3000 |
| RabbitMQ | http://localhost:15672 |
| Consul | http://localhost:8500 |
| Jaeger | http://localhost:16686 |
| Prometheus | http://localhost:9090 |
| Grafana | http://localhost:3001 |
| MinIO | http://localhost:9001 |

### 3-c ☸️ Kubernetes (single manifest)

```bash
# Deploy to current K8s context
kubectl apply -f k8s.yaml

# Follow roll-out
kubectl get pods -n image-processing
kubectl logs -f deploy/image-processing -n image-processing

# Port-forward API
kubectl port-forward svc/image-processing 3000:80 -n image-processing
```

---

## 4. One-Line Scaffold (optional)

If you are **starting from scratch**, run the provided shell script to generate boiler-plate code:

```bash
chmod +x setup-microservice.sh
./setup-microservice.sh   # creates src/ structure and example configs
```

> The script content is available in the repository root – no need to copy it here.

---

## 5. Docker Compose & Kubernetes

Docker-Compose and Kubernetes examples are included in separate files (`docker-compose.microservice.yml`, `k8s.yaml`).  
They show how to run the micro-service together with Postgres, Redis, RabbitMQ, Consul, Jaeger, Prometheus and Grafana.

- **Local:** `docker compose up`
- **Cluster:** `kubectl apply -f k8s.yaml`

Feel free to tailor these manifests to your environment.

---

## 6. API Usage Examples

### Resize an image

```bash
curl -X POST http://localhost:3000/api/v1/images/process \
  -F "image=@/path/to/image.jpg" \
  -F "width=800" -F "height=600" -F "format=webp"
```

### Health & Metrics

```bash
curl http://localhost:3000/health      # basic health
curl http://localhost:3000/metrics     # Prometheus metrics
```

---

## 8. Minimal Environment (.env.example)

```
SERVICE_NAME=image-processing-service
SERVICE_PORT=3000
NODE_ENV=development

# External services (match compose/K8s)
RABBITMQ_URL=amqp://admin:admin@rabbitmq:5672
DATABASE_URL=postgresql://imageuser:imagepass@postgres:5432/imagedb
REDIS_URL=redis://redis:6379
CONSUL_HOST=consul
JAEGER_ENDPOINT=http://jaeger:14268/api/traces
JWT_SECRET=secret
```

---

## 9. Architecture at a Glance

```mermaid
graph TD
  C[Client] -->|HTTP| API[Image API]
  API --> MQ[RabbitMQ]
  API --> DB[(Postgres)]
  API --> REDIS[(Redis Cache)]
  API --> MINIO[(MinIO)]
  subgraph Observability
    API -.-> Prom[Prometheus]
    API -.-> Tracer[Jaeger]
    API -.-> Log[ELK]
  end
```

- **API** – Express + Sharp resize
- **RabbitMQ** – async events (future expansion)
- **Postgres** – image metadata
- **Redis** – cache thumbnails
- **MinIO** – object storage (S3-compatible)

---

## 10. Next Steps

1. Replace Sharp logic in `src/services/ImageProcessingService.ts` with your own.
2. Configure domain name & TLS in `k8s.yaml` Ingress.
3. Hook CI/CD to build Docker image & `kubectl apply` on merge.
4. Add more micro-services following the same pattern.

> **Done – you now have ONE file that explains everything!**
