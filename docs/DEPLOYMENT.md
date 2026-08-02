# Deployment Guide — Professional Identity Platform (v1.0.0)

This guide provides instructions for deploying the **Professional Identity Platform** in development, testing, and production environments using Docker Compose and GitHub Actions.

---

## 1. Local Development Setup

### Prerequisites
- Node.js 22+ & pnpm
- Java JDK 21 & Maven
- PostgreSQL 17 (or local Docker container)

### Step-by-Step Launch
```bash
# 1. Clone repository
git clone https://github.com/saileshwaran-ganesan/professional-identity-platform.git
cd professional-identity-platform

# 2. Configure local environment variables
cp .env.example .env

# 3. Start Backend
cd apps/backend
./mvnw spring-boot:run

# 4. Start Frontend (in a separate terminal)
cd apps/frontend
pnpm install
pnpm run dev
```

---

## 2. Docker Compose Deployment

Docker Compose orchestrates PostgreSQL 17, Spring Boot API, and Nginx SPA in isolated containers connected via a bridge network.

### Execution Commands
```bash
# Copy environment template
cp .env.production.example .env

# Edit .env with strong production secrets
nano .env

# Build and start container stack
docker compose up --build -d

# Check service status
docker compose ps

# View container logs
docker compose logs -f
```

---

## 3. Production Environment Variables Reference

| Variable | Description | Security Requirement | Default / Example |
| :--- | :--- | :--- | :--- |
| `POSTGRES_DB` | Database name | Mandatory | `professional_identity` |
| `POSTGRES_USER` | Database username | Mandatory | `prod_user` |
| `POSTGRES_PASSWORD` | PostgreSQL user password | **Secret** (Min 16 chars) | `ComplexPassword!123` |
| `POSTGRES_PORT` | Exposed database port | Optional | `5432` |
| `BACKEND_PORT` | Spring Boot container port | Optional | `8080` |
| `JWT_SECRET` | 256-bit HMAC signing key | **Secret** (Min 64 hex chars) | `9a8f7e...` (**Fails startup if missing**) |
| `JWT_EXPIRATION` | JWT Token duration | Optional | `24h` |
| `ADMIN_NAME` | Seed admin account name | Optional | `Platform Admin` |
| `ADMIN_EMAIL` | Seed admin email address | Mandatory | `admin@yourdomain.com` |
| `ADMIN_PASSWORD` | Seed admin password | **Secret** (Min 12 chars) | `ComplexAdminPass!123` |
| `CORS_ALLOWED_ORIGINS` | Allowed CORS origins | Mandatory | `https://yourdomain.com` |
| `SECURITY_HSTS_ENABLED` | Enable HTTP Strict Transport | Recommended `true` in prod | `true` |
| `VITE_API_BASE_URL` | Frontend API client base URL | Mandatory | `https://yourdomain.com/api/v1` |

---

## 4. Container Health Checks & Monitoring

The Docker Compose configuration relies on explicit health checks:

- **PostgreSQL**: `pg_isready -U ${POSTGRES_USER} -d ${POSTGRES_DB}`
- **Backend API**: `curl --fail --silent http://localhost:8080/actuator/health`
- **Frontend Nginx**: `wget --quiet --tries=1 --spider http://localhost:80/health`

Startup dependency order ensures PostgreSQL becomes healthy before the Spring Boot container starts, and Spring Boot becomes healthy before Nginx serves traffic.

---

## 5. GitHub Actions CI/CD Pipeline

The repository includes an automated pipeline in `.github/workflows/ci.yml`:

- **Triggers**: `push` to `main`/`master` and pull requests.
- **Workflow Sequence**:
  1. Source checkout
  2. Setup Java 21 JDK & Node.js 22 with pnpm caching
  3. Frontend Type Check (`tsc --noEmit`) & ESLint Audit (`eslint . --max-warnings 0`)
  4. Backend JUnit 5 Integration Tests (`./mvnw test`)
  5. Frontend Vitest Component Tests (`pnpm test`)
  6. Playwright E2E Tests (`pnpm exec playwright test`)
  7. Frontend Production Bundle Build (`pnpm run build`)
  8. Docker Build Verification (`docker compose build`)

---

## 6. Troubleshooting

### Startup Failures
- **Symptom**: `IllegalStateException: FATAL: JWT Secret configuration (jwt.secret) is missing or blank.`
  - **Fix**: Supply a valid `JWT_SECRET` environment variable in `.env`.
- **Symptom**: Database connection timeout.
  - **Fix**: Ensure PostgreSQL container is running and `DB_URL` points to `postgres:5432` inside Docker network.
