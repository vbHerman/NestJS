# Docker Setup Guide

## Building Docker Image

### Dockerfile

```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build application
RUN npm run build

# Runtime stage
FROM node:18-alpine

WORKDIR /app

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Copy package files
COPY package*.json ./

# Install production dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy built application from builder
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 3000

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start application
CMD ["node", "dist/main.js"]
```

## Docker Compose Setup

### docker-compose.yml

```yaml
version: '3.8'

services:
  sqlserver:
    image: mcr.microsoft.com/mssql/server:2019-latest
    environment:
      - ACCEPT_EULA=Y
      - SA_PASSWORD=YourPassword123!
      - MSSQL_PID=Developer
    ports:
      - '1433:1433'
    volumes:
      - sqlserver_data:/var/opt/mssql
    healthcheck:
      test:
        [
          'CMD-SHELL',
          "/opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P YourPassword123! -Q 'SELECT 1'",
        ]
      interval: 10s
      timeout: 5s
      retries: 5

  app:
    build: .
    environment:
      - DATABASE_URL=sqlserver://sqlserver:1433;database=NestTest;user=sa;password=YourPassword123!;encrypt=true;trustServerCertificate=true
      - PORT=3000
      - JWT_SECRET=your-secret-key
      - NODE_ENV=production
    ports:
      - '3000:3000'
    depends_on:
      sqlserver:
        condition: service_healthy
    command: sh -c "npx prisma migrate deploy && node dist/main.js"

volumes:
  sqlserver_data:
```

## Building and Running

### Build Image

```bash
docker build -t nestjs-app:latest .
```

### Run with Docker Compose

```bash
docker-compose up -d
```

### Run Container Manually

```bash
docker run -d \
  --name nestjs-app \
  -p 3000:3000 \
  -e DATABASE_URL="sqlserver://sqlserver:1433;..." \
  -e JWT_SECRET="your-secret" \
  nestjs-app:latest
```

## Multi-Stage Build Benefits

1. **Smaller image size**: Only runtime dependencies in final image
2. **Security**: Build tools not included in production image
3. **Faster deployment**: Less data to transfer

## SQL Server in Docker

### Creating Database

```bash
docker exec -it sqlserver /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P YourPassword123!
```

Then in SQL:

```sql
CREATE DATABASE NestTest;
GO
```

## Production Considerations

1. **Use environment variables** for sensitive data
2. **Health checks** to monitor container status
3. **Resource limits**:

   ```yaml
   resources:
     limits:
       cpus: '1'
       memory: 512M
     reservations:
       cpus: '0.5'
       memory: 256M
   ```

4. **Logging**:

   ```yaml
   logging:
     driver: 'json-file'
     options:
       max-size: '10m'
       max-file: '3'
   ```

5. **Restart policy**:
   ```yaml
   restart_policy:
     condition: on-failure
     delay: 5s
     max_attempts: 5
   ```

## Kubernetes Deployment

### Deployment YAML

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nestjs-app
spec:
  replicas: 2
  selector:
    matchLabels:
      app: nestjs-app
  template:
    metadata:
      labels:
        app: nestjs-app
    spec:
      containers:
        - name: nestjs-app
          image: nestjs-app:latest
          ports:
            - containerPort: 3000
          env:
            - name: DATABASE_URL
              valueFrom:
                secretKeyRef:
                  name: db-secret
                  key: connection-string
            - name: JWT_SECRET
              valueFrom:
                secretKeyRef:
                  name: jwt-secret
                  key: secret
          livenessProbe:
            httpGet:
              path: /
              port: 3000
            initialDelaySeconds: 30
            periodSeconds: 10
          readinessProbe:
            httpGet:
              path: /
              port: 3000
            initialDelaySeconds: 5
            periodSeconds: 5
```

## Troubleshooting

### Container won't start

Check logs:

```bash
docker logs container_name
```

### Database connection failed

Verify:

1. SQL Server container is running: `docker ps`
2. Connection string is correct
3. Database exists

### Port already in use

Change port mapping:

```bash
docker run -p 8080:3000 nestjs-app:latest
```

### Migrations fail

Run manually:

```bash
docker exec nestjs-app npx prisma migrate deploy
```
