# Image Processing API - Microservices Architecture Guide - AI Generated ~ opus-4.1thinking

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Current Architecture Analysis](#current-architecture-analysis)
3. [Proposed Microservices Architecture](#proposed-microservices-architecture)
4. [Service Breakdown](#service-breakdown)
5. [Implementation Roadmap](#implementation-roadmap)
6. [Technology Stack](#technology-stack)
7. [Service Specifications](#service-specifications)
8. [Infrastructure Components](#infrastructure-components)
9. [Development Guidelines](#development-guidelines)
10. [Deployment Strategy](#deployment-strategy)
11. [Monitoring & Observability](#monitoring--observability)
12. [Security Implementation](#security-implementation)
13. [Scaling Strategies](#scaling-strategies)
14. [Migration Plan](#migration-plan)

---

## Executive Summary

This guide provides a complete roadmap for transforming the current monolithic Image Processing API into a scalable, resilient microservices architecture. The transformation will enable:

- Independent scaling of components
- Better fault isolation
- Technology diversity
- Faster deployment cycles
- Enhanced maintainability

## Current Architecture Analysis

### Current State

```
┌─────────────────────────┐
│   Monolithic Express    │
│         API             │
├─────────────────────────┤
│  - Image Upload         │
│  - Image Processing     │
│  - Cache Management     │
│  - File Storage         │
└─────────────────────────┘
```

### Limitations

- Single point of failure
- Cannot scale components independently
- Processing bottlenecks affect entire system
- Limited technology choices
- Difficult to maintain and update

## Proposed Microservices Architecture

### High-Level Architecture

```
                            ┌──────────────┐
                            │   CDN        │
                            └──────┬───────┘
                                   │
                            ┌──────▼───────┐
                            │  API Gateway │
                            │   (Kong)     │
                            └──────┬───────┘
                                   │
        ┌──────────────────────────┼──────────────────────────┐
        │                          │                          │
┌───────▼────────┐       ┌─────────▼────────┐      ┌─────────▼────────┐
│  Auth Service  │       │ Upload Service   │      │ Process Service  │
└────────────────┘       └──────────────────┘      └──────────────────┘
        │                          │                          │
        │                    ┌─────▼─────┐            ┌──────▼──────┐
        │                    │  Message   │            │  Process    │
        │                    │   Queue    │            │   Queue     │
        │                    │ (RabbitMQ) │            │ (Bull/Redis)│
        │                    └─────┬─────┘            └──────┬──────┘
        │                          │                          │
┌───────▼────────────────────────────────────────────────────▼────────┐
│                          Shared Services Layer                       │
├───────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐             │
│  │  Storage    │  │   Metadata   │  │    Cache     │             │
│  │  Service    │  │   Service    │  │   Service    │             │
│  │  (S3/MinIO) │  │  (PostgreSQL)│  │   (Redis)    │             │
│  └─────────────┘  └──────────────┘  └──────────────┘             │
└───────────────────────────────────────────────────────────────────┘
```

## Service Breakdown

### 1. API Gateway Service

**Purpose**: Central entry point for all client requests
**Responsibilities**:

- Request routing
- Rate limiting
- Authentication verification
- Request/Response transformation
- API versioning
- Circuit breaking

### 2. Authentication Service

**Purpose**: Handle user authentication and authorization
**Responsibilities**:

- JWT token generation/validation
- User registration/login
- API key management
- Permission management
- Session management

### 3. Upload Service

**Purpose**: Handle file uploads and validation
**Responsibilities**:

- Accept image uploads
- Validate file types and sizes
- Generate upload URLs for direct S3 uploads
- Emit upload events
- Handle chunked uploads

### 4. Image Processing Service

**Purpose**: Core image manipulation
**Responsibilities**:

- Image resizing
- Format conversion
- Quality optimization
- Watermarking
- Filter application
- Batch processing

### 5. Storage Service

**Purpose**: Manage file storage operations
**Responsibilities**:

- Interface with S3/MinIO
- Generate signed URLs
- Handle file lifecycle
- Manage storage buckets
- Implement retention policies

### 6. Metadata Service

**Purpose**: Store and retrieve image metadata
**Responsibilities**:

- Store image information
- Track processing history
- Maintain relationships
- Search functionality
- Analytics data

### 7. Cache Service

**Purpose**: Manage caching layer
**Responsibilities**:

- Cache processed images
- Implement cache strategies
- Cache invalidation
- Memory management
- Edge caching coordination

### 8. Notification Service

**Purpose**: Handle async notifications
**Responsibilities**:

- Email notifications
- Webhook callbacks
- WebSocket updates
- Processing status updates

### 9. Analytics Service

**Purpose**: Track usage and performance
**Responsibilities**:

- Usage metrics
- Performance monitoring
- Cost tracking
- Report generation

## Implementation Roadmap

### Phase 1: Foundation (Weeks 1-2)

```yaml
tasks:
  - Setup development environment
  - Configure Docker and Docker Compose
  - Setup service templates
  - Configure shared libraries
  - Setup CI/CD pipeline basics
```

### Phase 2: Core Services (Weeks 3-6)

```yaml
tasks:
  - Implement Authentication Service
  - Implement Storage Service
  - Implement basic API Gateway
  - Setup message queue infrastructure
  - Implement health checks
```

### Phase 3: Processing Services (Weeks 7-10)

```yaml
tasks:
  - Extract image processing logic
  - Implement Processing Service
  - Implement Upload Service
  - Setup processing queue
  - Implement retry mechanisms
```

### Phase 4: Supporting Services (Weeks 11-13)

```yaml
tasks:
  - Implement Metadata Service
  - Implement Cache Service
  - Implement Notification Service
  - Setup monitoring infrastructure
```

### Phase 5: Integration & Testing (Weeks 14-16)

```yaml
tasks:
  - Integration testing
  - Performance testing
  - Security testing
  - Documentation
  - Migration scripts
```

## Technology Stack

### Core Technologies

```yaml
Languages:
  - TypeScript/Node.js (Primary services)
  - Go (High-performance services)
  - Python (ML/AI services if needed)

Frameworks:
  - NestJS (Service framework)
  - Express.js (Lightweight services)
  - Fastify (High-performance APIs)

Databases:
  - PostgreSQL (Metadata, relational data)
  - MongoDB (Flexible document storage)
  - Redis (Caching, sessions, queues)

Message Queues:
  - RabbitMQ (Service communication)
  - Bull Queue (Job processing)
  - Apache Kafka (Event streaming)

Storage:
  - MinIO/S3 (Object storage)
  - Local NFS (Development)

Containers:
  - Docker (Containerization)
  - Kubernetes (Orchestration)
  - Helm (Package management)

API Gateway:
  - Kong or Traefik

Service Mesh:
  - Istio (Optional, for complex deployments)

Monitoring:
  - Prometheus (Metrics)
  - Grafana (Visualization)
  - ELK Stack (Logging)
  - Jaeger (Distributed tracing)
```

## Service Specifications

### Authentication Service

```typescript
// auth-service/src/main.ts
import { NestFactory } from "@nestjs/core";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AuthModule,
    {
      transport: Transport.TCP,
      options: {
        host: "0.0.0.0",
        port: 3001,
      },
    },
  );
  await app.listen();
}

// auth-service/src/auth.controller.ts
@Controller()
export class AuthController {
  @MessagePattern({ cmd: "validate-token" })
  async validateToken(data: { token: string }) {
    // JWT validation logic
  }

  @MessagePattern({ cmd: "generate-token" })
  async generateToken(data: { userId: string }) {
    // Token generation logic
  }
}
```

### Image Processing Service

```typescript
// processing-service/src/processing.service.ts
import * as sharp from "sharp";
import { Injectable } from "@nestjs/common";
import { Queue, Worker } from "bullmq";

@Injectable()
export class ProcessingService {
  private queue: Queue;
  private worker: Worker;

  constructor() {
    this.queue = new Queue("image-processing", {
      connection: {
        host: "redis",
        port: 6379,
      },
    });

    this.worker = new Worker(
      "image-processing",
      async (job) => {
        return this.processImage(job.data);
      },
      {
        connection: {
          host: "redis",
          port: 6379,
        },
        concurrency: 5,
      },
    );
  }

  async processImage(data: ProcessingJob) {
    const { inputPath, outputPath, operations } = data;

    let pipeline = sharp(inputPath);

    for (const operation of operations) {
      switch (operation.type) {
        case "resize":
          pipeline = pipeline.resize(operation.width, operation.height);
          break;
        case "format":
          pipeline = pipeline.toFormat(operation.format, operation.options);
          break;
        case "watermark":
          pipeline = pipeline.composite([
            {
              input: operation.watermarkPath,
              gravity: operation.position,
            },
          ]);
          break;
      }
    }

    await pipeline.toFile(outputPath);

    // Emit completion event
    await this.eventBus.emit("processing.completed", {
      jobId: data.jobId,
      outputPath,
    });
  }

  async queueJob(job: ProcessingJob) {
    return this.queue.add("process", job, {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 2000,
      },
    });
  }
}
```

### Storage Service Configuration

```typescript
// storage-service/src/storage.service.ts
import { S3 } from "aws-sdk";
import { Injectable } from "@nestjs/common";

@Injectable()
export class StorageService {
  private s3: S3;

  constructor() {
    this.s3 = new S3({
      endpoint: process.env.S3_ENDPOINT,
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECRET_KEY,
      s3ForcePathStyle: true,
    });
  }

  async uploadFile(buffer: Buffer, key: string, metadata?: any) {
    const params = {
      Bucket: process.env.S3_BUCKET,
      Key: key,
      Body: buffer,
      Metadata: metadata,
    };

    return this.s3.upload(params).promise();
  }

  async getSignedUrl(key: string, expires: number = 3600) {
    return this.s3.getSignedUrlPromise("getObject", {
      Bucket: process.env.S3_BUCKET,
      Key: key,
      Expires: expires,
    });
  }

  async deleteFile(key: string) {
    return this.s3
      .deleteObject({
        Bucket: process.env.S3_BUCKET,
        Key: key,
      })
      .promise();
  }
}
```

## Infrastructure Components

### Docker Compose Configuration

```yaml
# docker-compose.yml
version: "3.8"

services:
  # API Gateway
  kong:
    image: kong:latest
    environment:
      KONG_DATABASE: postgres
      KONG_PG_HOST: kong-db
      KONG_PG_USER: kong
      KONG_PG_PASSWORD: kong
    ports:
      - "8000:8000"
      - "8443:8443"
      - "8001:8001"
    depends_on:
      - kong-db

  kong-db:
    image: postgres:13
    environment:
      POSTGRES_USER: kong
      POSTGRES_PASSWORD: kong
      POSTGRES_DB: kong
    volumes:
      - kong-data:/var/lib/postgresql/data

  # Message Queue
  rabbitmq:
    image: rabbitmq:3-management
    ports:
      - "5672:5672"
      - "15672:15672"
    environment:
      RABBITMQ_DEFAULT_USER: admin
      RABBITMQ_DEFAULT_PASS: admin
    volumes:
      - rabbitmq-data:/var/lib/rabbitmq

  # Redis (Cache & Queue)
  redis:
    image: redis:alpine
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data
    command: redis-server --appendonly yes

  # PostgreSQL (Metadata)
  postgres:
    image: postgres:13
    environment:
      POSTGRES_USER: imageapi
      POSTGRES_PASSWORD: imageapi
      POSTGRES_DB: imageapi
    ports:
      - "5432:5432"
    volumes:
      - postgres-data:/var/lib/postgresql/data

  # MinIO (S3-compatible storage)
  minio:
    image: minio/minio
    ports:
      - "9000:9000"
      - "9001:9001"
    environment:
      MINIO_ROOT_USER: minioadmin
      MINIO_ROOT_PASSWORD: minioadmin
    volumes:
      - minio-data:/data
    command: server /data --console-address ":9001"

  # Services
  auth-service:
    build: ./services/auth-service
    environment:
      DATABASE_URL: postgresql://imageapi:imageapi@postgres:5432/imageapi
      REDIS_URL: redis://redis:6379
      JWT_SECRET: your-secret-key
    depends_on:
      - postgres
      - redis

  upload-service:
    build: ./services/upload-service
    environment:
      S3_ENDPOINT: http://minio:9000
      S3_ACCESS_KEY: minioadmin
      S3_SECRET_KEY: minioadmin
      RABBITMQ_URL: amqp://admin:admin@rabbitmq:5672
    depends_on:
      - minio
      - rabbitmq

  processing-service:
    build: ./services/processing-service
    environment:
      REDIS_URL: redis://redis:6379
      S3_ENDPOINT: http://minio:9000
    depends_on:
      - redis
      - minio
    deploy:
      replicas: 3

  metadata-service:
    build: ./services/metadata-service
    environment:
      DATABASE_URL: postgresql://imageapi:imageapi@postgres:5432/imageapi
      REDIS_URL: redis://redis:6379
    depends_on:
      - postgres
      - redis

  cache-service:
    build: ./services/cache-service
    environment:
      REDIS_URL: redis://redis:6379
      CDN_PURGE_URL: ${CDN_PURGE_URL}
    depends_on:
      - redis

volumes:
  kong-data:
  rabbitmq-data:
  redis-data:
  postgres-data:
  minio-data:
```

### Kubernetes Deployment

```yaml
# k8s/processing-service-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: processing-service
  labels:
    app: processing-service
spec:
  replicas: 5
  selector:
    matchLabels:
      app: processing-service
  template:
    metadata:
      labels:
        app: processing-service
    spec:
      containers:
        - name: processing-service
          image: imageapi/processing-service:latest
          ports:
            - containerPort: 3000
          env:
            - name: REDIS_URL
              valueFrom:
                secretKeyRef:
                  name: redis-secret
                  key: url
            - name: S3_ENDPOINT
              valueFrom:
                configMapKeyRef:
                  name: s3-config
                  key: endpoint
          resources:
            requests:
              memory: "256Mi"
              cpu: "250m"
            limits:
              memory: "512Mi"
              cpu: "500m"
          livenessProbe:
            httpGet:
              path: /health
              port: 3000
            initialDelaySeconds: 30
            periodSeconds: 10
          readinessProbe:
            httpGet:
              path: /ready
              port: 3000
            initialDelaySeconds: 5
            periodSeconds: 5
---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: processing-service-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: processing-service
  minReplicas: 3
  maxReplicas: 20
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
    - type: Resource
      resource:
        name: memory
        target:
          type: Utilization
          averageUtilization: 80
```

## Development Guidelines

### Service Communication Patterns

#### 1. Synchronous Communication (REST/gRPC)

```typescript
// Use for immediate responses
// Example: Auth validation
@Get('/validate')
async validateUser(@Headers('authorization') token: string) {
  const result = await this.authService.validate(token);
  return result;
}
```

#### 2. Asynchronous Communication (Message Queue)

```typescript
// Use for long-running operations
// Example: Image processing
@Post('/process')
async processImage(@Body() dto: ProcessImageDto) {
  const jobId = await this.queue.add('process', dto);
  return { jobId, status: 'queued' };
}
```

#### 3. Event-Driven Communication

```typescript
// Use for decoupled notifications
// Example: Processing completion
@EventPattern('image.processed')
async handleImageProcessed(data: any) {
  await this.notificationService.notify(data);
  await this.analyticsService.track(data);
}
```

### Error Handling Strategy

```typescript
// Centralized error handling
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status = exception.getStatus ? exception.getStatus() : 500;

    // Log to centralized logging
    logger.error({
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      error: exception.message,
      stack: exception.stack,
    });

    // Send to error tracking (e.g., Sentry)
    Sentry.captureException(exception);

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: exception.message,
    });
  }
}
```

### Circuit Breaker Implementation

```typescript
import * as CircuitBreaker from "opossum";

export class ResilientService {
  private circuitBreaker: CircuitBreaker;

  constructor() {
    const options = {
      timeout: 3000,
      errorThresholdPercentage: 50,
      resetTimeout: 30000,
    };

    this.circuitBreaker = new CircuitBreaker(
      this.callExternalService.bind(this),
      options,
    );

    this.circuitBreaker.on("open", () => console.log("Circuit breaker opened"));
    this.circuitBreaker.on("halfOpen", () =>
      console.log("Circuit breaker half-open"),
    );
    this.circuitBreaker.on("close", () =>
      console.log("Circuit breaker closed"),
    );
  }

  async callWithBreaker(params: any) {
    try {
      return await this.circuitBreaker.fire(params);
    } catch (error) {
      // Fallback logic
      return this.getFallbackResponse();
    }
  }
}
```

## Deployment Strategy

### CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy Microservices

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        service: [auth, upload, processing, metadata, cache]
    steps:
      - uses: actions/checkout@v2

      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: "16"

      - name: Install dependencies
        run: |
          cd services/${{ matrix.service }}-service
          npm ci

      - name: Run tests
        run: |
          cd services/${{ matrix.service }}-service
          npm run test:ci

      - name: Build service
        run: |
          cd services/${{ matrix.service }}-service
          npm run build

  build-and-push:
    needs: test
    runs-on: ubuntu-latest
    strategy:
      matrix:
        service: [auth, upload, processing, metadata, cache]
    steps:
      - uses: actions/checkout@v2

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v1

      - name: Login to DockerHub
        uses: docker/login-action@v1
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}

      - name: Build and push
        uses: docker/build-push-action@v2
        with:
          context: ./services/${{ matrix.service }}-service
          push: true
          tags: |
            imageapi/${{ matrix.service }}-service:latest
            imageapi/${{ matrix.service }}-service:${{ github.sha }}
          cache-from: type=registry,ref=imageapi/${{ matrix.service }}-service:buildcache
          cache-to: type=registry,ref=imageapi/${{ matrix.service }}-service:buildcache,mode=max

  deploy:
    needs: build-and-push
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to Kubernetes
        run: |
          # Setup kubectl
          # Apply new configurations
          kubectl apply -f k8s/
          # Update image tags
          kubectl set image deployment/processing-service \
            processing-service=imageapi/processing-service:${{ github.sha }}
```

### Blue-Green Deployment

```yaml
# k8s/blue-green-deployment.yaml
apiVersion: v1
kind: Service
metadata:
  name: processing-service
spec:
  selector:
    app: processing-service
    version: green # Switch between blue/green
  ports:
    - port: 80
      targetPort: 3000
---
# Blue Deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: processing-service-blue
spec:
  replicas: 3
  selector:
    matchLabels:
      app: processing-service
      version: blue
  template:
    metadata:
      labels:
        app: processing-service
        version: blue
    spec:
      containers:
        - name: processing-service
          image: imageapi/processing-service:stable
---
# Green Deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: processing-service-green
spec:
  replicas: 3
  selector:
    matchLabels:
      app: processing-service
      version: green
  template:
    metadata:
      labels:
        app: processing-service
        version: green
    spec:
      containers:
        - name: processing-service
          image: imageapi/processing-service:latest
```

## Monitoring & Observability

### Metrics Collection

```typescript
// Prometheus metrics
import { register, Counter, Histogram, Gauge } from "prom-client";

export class MetricsService {
  private processedImages: Counter;
  private processingDuration: Histogram;
  private queueSize: Gauge;

  constructor() {
    this.processedImages = new Counter({
      name: "processed_images_total",
      help: "Total number of processed images",
      labelNames: ["format", "status"],
    });

    this.processingDuration = new Histogram({
      name: "image_processing_duration_seconds",
      help: "Duration of image processing in seconds",
      labelNames: ["operation"],
      buckets: [0.1, 0.5, 1, 2, 5, 10],
    });

    this.queueSize = new Gauge({
      name: "processing_queue_size",
      help: "Current size of processing queue",
    });

    register.registerMetric(this.processedImages);
    register.registerMetric(this.processingDuration);
    register.registerMetric(this.queueSize);
  }

  recordProcessedImage(format: string, status: string) {
    this.processedImages.inc({ format, status });
  }

  recordProcessingTime(operation: string, duration: number) {
    this.processingDuration.observe({ operation }, duration);
  }

  setQueueSize(size: number) {
    this.queueSize.set(size);
  }
}
```

### Distributed Tracing

```typescript
// OpenTelemetry setup
import { NodeTracerProvider } from "@opentelemetry/node";
import { JaegerExporter } from "@opentelemetry/exporter-jaeger";
import { BatchSpanProcessor } from "@opentelemetry/tracing";

const provider = new NodeTracerProvider();

const jaegerExporter = new JaegerExporter({
  endpoint: "http://jaeger:14268/api/traces",
  serviceName: "processing-service",
});

provider.addSpanProcessor(new BatchSpanProcessor(jaegerExporter));
provider.register();

// Usage in service
import { trace } from "@opentelemetry/api";

const tracer = trace.getTracer("processing-service");

export class ProcessingService {
  async processImage(data: any) {
    const span = tracer.startSpan("processImage");

    try {
      span.setAttribute("image.format", data.format);
      span.setAttribute("image.size", data.size);

      // Processing logic
      const result = await this.doProcessing(data);

      span.setStatus({ code: SpanStatusCode.OK });
      return result;
    } catch (error) {
      span.recordException(error);
      span.setStatus({ code: SpanStatusCode.ERROR });
      throw error;
    } finally {
      span.end();
    }
  }
}
```

### Centralized Logging

```typescript
// Winston logger configuration
import * as winston from "winston";
import { ElasticsearchTransport } from "winston-elasticsearch";

const esTransportOpts = {
  level: "info",
  clientOpts: { node: "http://elasticsearch:9200" },
  index: "microservices-logs",
};

export const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json(),
  ),
  defaultMeta: {
    service: process.env.SERVICE_NAME,
    version: process.env.SERVICE_VERSION,
  },
  transports: [
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
    new ElasticsearchTransport(esTransportOpts),
  ],
});

// Correlation ID middleware
export function correlationIdMiddleware(req, res, next) {
  const correlationId = req.headers["x-correlation-id"] || uuid();
  req.correlationId = correlationId;
  res.setHeader("x-correlation-id", correlationId);

  // Add to logger context
  logger.defaultMeta.correlationId = correlationId;

  next();
}
```

## Security Implementation

### API Security

```typescript
// Rate limiting
import * as rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP",
  standardHeaders: true,
  legacyHeaders: false,
});

// API key validation
export class ApiKeyGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers["x-api-key"];

    if (!apiKey) {
      throw new UnauthorizedException("API key required");
    }

    const isValid = await this.validateApiKey(apiKey);
    if (!isValid) {
      throw new UnauthorizedException("Invalid API key");
    }

    return true;
  }
}

// Input validation
import { IsString, IsInt, Min, Max, IsEnum } from "class-validator";

export class ProcessImageDto {
  @IsString()
  imageUrl: string;

  @IsInt()
  @Min(1)
  @Max(5000)
  width: number;

  @IsInt()
  @Min(1)
  @Max(5000)
  height: number;

  @IsEnum(["jpg", "png", "webp"])
  format: string;
}
```

### Network Security

```yaml
# k8s/network-policy.yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: processing-service-netpol
spec:
  podSelector:
    matchLabels:
      app: processing-service
  policyTypes:
    - Ingress
    - Egress
  ingress:
    - from:
        - podSelector:
            matchLabels:
              app: api-gateway
      ports:
        - protocol: TCP
          port: 3000
  egress:
    - to:
        - podSelector:
            matchLabels:
              app: redis
      ports:
        - protocol: TCP
          port: 6379
    - to:
        - podSelector:
            matchLabels:
              app: minio
      ports:
        - protocol: TCP
          port: 9000
```

### Secrets Management

```yaml
# k8s/sealed-secret.yaml
apiVersion: bitnami.com/v1alpha1
kind: SealedSecret
metadata:
  name: processing-service-secrets
spec:
  encryptedData:
    JWT_SECRET: AgBvF3R4M2I1Y3J5cHRlZC1zZWNyZXQ=
    S3_ACCESS_KEY: AgCxY3J5cHRlZC1hY2Nlc3Mta2V5=
    S3_SECRET_KEY: AgDzY3J5cHRlZC1zZWNyZXQta2V5=
```

## Scaling Strategies

### Horizontal Scaling

```yaml
# Auto-scaling based on custom metrics
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: processing-service-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: processing-service
  minReplicas: 3
  maxReplicas: 50
  metrics:
    - type: Pods
      pods:
        metric:
          name: processing_queue_size
        target:
          type: AverageValue
          averageValue: "10"
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
  behavior:
    scaleDown:
      stabilizationWindowSeconds: 300
      policies:
        - type: Percent
          value: 50
          periodSeconds: 60
    scaleUp:
      stabilizationWindowSeconds: 0
      policies:
        - type: Percent
          value: 100
          periodSeconds: 30
        - type: Pods
          value: 5
          periodSeconds: 30
      selectPolicy: Max
```

### Vertical Scaling

```yaml
# Vertical Pod Autoscaler
apiVersion: autoscaling.k8s.io/v1
kind: VerticalPodAutoscaler
metadata:
  name: processing-service-vpa
spec:
  targetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: processing-service
  updatePolicy:
    updateMode: "Auto"
  resourcePolicy:
    containerPolicies:
      - containerName: processing-service
        minAllowed:
          cpu: 100m
          memory: 128Mi
        maxAllowed:
          cpu: 2
          memory: 2Gi
```

### Database Scaling

```yaml
# PostgreSQL Read Replicas
apiVersion: postgresql.cnpg.io/v1
kind: Cluster
metadata:
  name: postgres-cluster
spec:
  instances: 3
  primaryUpdateStrategy: unsupervised

  postgresql:
    parameters:
      max_connections: "200"
      shared_buffers: "256MB"
      effective_cache_size: "1GB"

  bootstrap:
    initdb:
      database: imageapi
      owner: imageapi

  monitoring:
    enabled: true
```

### Caching Strategy

```typescript
// Multi-level caching
export class CacheService {
  private l1Cache: NodeCache; // In-memory cache
  private l2Cache: Redis; // Redis cache
  private l3Cache: CDN; // CDN cache

  async get(key: string): Promise<any> {
    // Check L1 cache
    let value = this.l1Cache.get(key);
    if (value) return value;

    // Check L2 cache
    value = await this.l2Cache.get(key);
    if (value) {
      this.l1Cache.set(key, value, 60); // Cache for 1 minute
      return value;
    }

    // Check L3 cache
    value = await this.l3Cache.get(key);
    if (value) {
      await this.l2Cache.setex(key, 3600, value); // Cache for 1 hour
      this.l1Cache.set(key, value, 60);
      return value;
    }

    return null;
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    // Set in all cache levels
    this.l1Cache.set(key, value, ttl || 60);
    await this.l2Cache.setex(key, ttl || 3600, value);
    await this.l3Cache.put(key, value, ttl || 86400);
  }

  async invalidate(pattern: string): Promise<void> {
    // Invalidate across all levels
    this.l1Cache.flushAll();

    const keys = await this.l2Cache.keys(pattern);
    if (keys.length > 0) {
      await this.l2Cache.del(...keys);
    }

    await this.l3Cache.purge(pattern);
  }
}
```

## Migration Plan

### Phase 1: Preparation (Week 1)

1. **Environment Setup**

   - Setup development Kubernetes cluster
   - Configure CI/CD pipelines
   - Setup monitoring infrastructure
   - Create service templates

2. **Data Migration Planning**
   - Analyze current data structure
   - Design new database schemas
   - Plan data migration scripts
   - Setup backup strategies

### Phase 2: Service Extraction (Weeks 2-3)

1. **Extract Authentication**

   ```bash
   # Create new service
   mkdir services/auth-service
   cd services/auth-service
   npm init -y
   npm install @nestjs/core @nestjs/common @nestjs/microservices

   # Move authentication logic
   # Update API gateway routes
   ```

2. **Extract Storage Service**
   - Move file operations to storage service
   - Implement S3/MinIO integration
   - Update file references

### Phase 3: Gradual Migration (Weeks 4-6)

1. **Implement Strangler Fig Pattern**

   ```typescript
   // API Gateway routing
   export class RoutingService {
     async route(request: Request): Promise<Response> {
       const path = request.path;

       // New microservices
       if (path.startsWith("/api/v2/")) {
         return this.routeToMicroservice(request);
       }

       // Legacy monolith
       return this.routeToMonolith(request);
     }
   }
   ```

2. **Feature Toggle Implementation**

   ```typescript
   export class FeatureToggle {
     async isEnabled(feature: string): Promise<boolean> {
       const flags = await this.redis.get("feature-flags");
       return flags[feature] === true;
     }
   }

   // Usage
   if (await featureToggle.isEnabled("use-new-processing")) {
     return this.newProcessingService.process(data);
   } else {
     return this.legacyProcessing.process(data);
   }
   ```

### Phase 4: Testing & Validation (Week 7)

1. **Load Testing**

   ```yaml
   # k6 load test script
   import http from 'k6/http';
   import { check } from 'k6';

   export let options = {
     stages: [
       { duration: '5m', target: 100 },
       { duration: '10m', target: 100 },
       { duration: '5m', target: 200 },
       { duration: '10m', target: 200 },
       { duration: '5m', target: 0 },
     ],
   };

   export default function() {
     let response = http.post('http://api-gateway/process', {
       imageUrl: 'http://example.com/image.jpg',
       width: 800,
       height: 600,
       format: 'webp',
     });

     check(response, {
       'status is 200': (r) => r.status === 200,
       'response time < 500ms': (r) => r.timings.duration < 500,
     });
   }
   ```

2. **Chaos Engineering**
   ```yaml
   # Chaos Mesh experiment
   apiVersion: chaos-mesh.org/v1alpha1
   kind: PodChaos
   metadata:
     name: processing-service-chaos
   spec:
     action: pod-kill
     mode: one
     duration: "30s"
     selector:
       namespaces:
         - default
       labelSelectors:
         "app": "processing-service"
     scheduler:
       cron: "@every 10m"
   ```

### Phase 5: Cutover (Week 8)

1. **Traffic Migration**

   - Start with 10% traffic to new services
   - Monitor metrics and errors
   - Gradually increase to 100%
   - Keep rollback plan ready

2. **Decommission Monolith**
   - Archive monolith code
   - Remove unused resources
   - Update documentation
   - Conduct retrospective

## Performance Optimization

### 1. Connection Pooling

```typescript
// Database connection pool
import { Pool } from "pg";

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
```

### 2. Request Batching

```typescript
import * as DataLoader from "dataloader";

export class ImageMetadataLoader {
  private loader: DataLoader<string, ImageMetadata>;

  constructor(private metadataService: MetadataService) {
    this.loader = new DataLoader(
      async (ids: string[]) => {
        const metadata = await this.metadataService.getBatch(ids);
        return ids.map((id) => metadata.find((m) => m.id === id));
      },
      { cache: true, maxBatchSize: 100 },
    );
  }

  async load(id: string): Promise<ImageMetadata> {
    return this.loader.load(id);
  }
}
```

### 3. Streaming Processing

```typescript
// Stream large files
import { Transform } from "stream";

export class ImageStreamProcessor extends Transform {
  _transform(chunk: Buffer, encoding: string, callback: Function) {
    // Process chunk
    const processed = this.processChunk(chunk);
    callback(null, processed);
  }
}

// Usage
readStream.pipe(new ImageStreamProcessor()).pipe(writeStream);
```

## Cost Optimization

### Resource Optimization

```yaml
# Use spot instances for non-critical workloads
apiVersion: v1
kind: ConfigMap
metadata:
  name: cluster-autoscaler-status
data:
  nodes.k8s.io/purpose: spot
---
# Reserved instances for critical services
apiVersion: v1
kind: Node
metadata:
  labels:
    node.kubernetes.io/instance-type: t3.medium
    node.kubernetes.io/purchase-option: reserved
```

### Storage Optimization

```typescript
// Implement storage tiers
export class StorageTiering {
  async moveToArchive(key: string, age: number) {
    if (age > 30) {
      // 30 days
      await this.s3
        .copyObject({
          Bucket: "archive-bucket",
          CopySource: `active-bucket/${key}`,
          Key: key,
          StorageClass: "GLACIER",
        })
        .promise();

      await this.s3
        .deleteObject({
          Bucket: "active-bucket",
          Key: key,
        })
        .promise();
    }
  }
}
```

## Disaster Recovery

### Backup Strategy

```yaml
# Automated backups
apiVersion: batch/v1
kind: CronJob
metadata:
  name: database-backup
spec:
  schedule: "0 2 * * *" # Daily at 2 AM
  jobTemplate:
    spec:
      template:
        spec:
          containers:
            - name: postgres-backup
              image: postgres:13
              command:
                - /bin/bash
                - -c
                - |
                  pg_dump -h postgres -U imageapi imageapi | \
                  gzip > /backup/db-$(date +%Y%m%d).sql.gz
                  aws s3 cp /backup/db-$(date +%Y%m%d).sql.gz \
                  s3://backup-bucket/postgres/
          restartPolicy: OnFailure
```

### Multi-Region Deployment

```yaml
# Cross-region replication
apiVersion: v1
kind: Service
metadata:
  name: global-load-balancer
  annotations:
    service.beta.kubernetes.io/aws-load-balancer-type: "nlb"
    service.beta.kubernetes.io/aws-load-balancer-cross-zone-load-balancing-enabled: "true"
spec:
  type: LoadBalancer
  selector:
    app: api-gateway
  ports:
    - port: 443
      targetPort: 8443
```

## Conclusion

This comprehensive guide provides a complete roadmap for transforming your Image Processing API into a scalable, resilient microservices architecture. The implementation should be done incrementally, with careful monitoring at each stage.

### Key Success Factors:

1. **Incremental Migration**: Don't try to migrate everything at once
2. **Comprehensive Testing**: Test thoroughly at each stage
3. **Monitoring First**: Set up monitoring before migration
4. **Team Training**: Ensure team is comfortable with new technologies
5. **Documentation**: Keep documentation updated throughout

### Next Steps:

1. Review and customize this guide for your specific needs
2. Set up development environment
3. Create proof of concept for one service
4. Establish CI/CD pipeline
5. Begin incremental migration

### Resources:

- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Docker Documentation](https://docs.docker.com/)
- [NestJS Microservices](https://docs.nestjs.com/microservices/basics)
- [Microservices Patterns](https://microservices.io/patterns/)
- [12 Factor App](https://12factor.net/)

---

_This guide is a living document and should be updated as the architecture evolves._
