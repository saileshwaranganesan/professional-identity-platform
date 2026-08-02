# Professional Identity Platform (v1.0.0)

A enterprise-grade full-stack professional portfolio and content management platform built with Spring Boot 3 / Java 21, React 19 / TypeScript, PostgreSQL, and Docker.

---

## 🌟 Overview

The **Professional Identity Platform** allows tech professionals to publish a public portfolio while providing a secure administration CMS dashboard for managing projects, career experience, technical skills, education credentials, and visitor messages.

Engineered with a **strict layered architecture**, **HttpOnly JWT authentication**, **Spring Security hardening**, **TanStack Query caching**, **multi-stage Docker containerization**, and a comprehensive **automated testing suite (JUnit 5, Vitest, Playwright)**.

---

## ✨ Features

### Public Portfolio Experience
- **Dynamic Content Showcase**: Displays published projects, career timeline, categorized technical skills, and educational qualifications.
- **Visitor Contact System**: Direct message submission with real-time Zod validation and backend persistence.
- **Fast Initial Paint**: Optimized asset bundle with route-based code-splitting for high performance.

### Admin CMS Dashboard
- **Authentication & RBAC**: Secure admin authentication using HttpOnly JWT cookies with automated session refresh and CSRF mitigation.
- **Full CRUD Management**: Management modules for Projects, Work Experience, Skills, Education, and Contact Messages.
- **Optimistic Mutations & Toast UX**: Smooth UI updates with instant user feedback via a global Toast notification system.
- **Inbox Management**: View, filter, and track incoming visitor contact inquiries.

### Production Engineering & DevOps
- **Security Hardened**: Enforces Security Headers (HSTS, CSP, X-Frame-Options), Rate Limiting, CORS origin controls, and fail-fast `JWT_SECRET` environment validation.
- **Automated Testing Suite**: 100% passing automated test coverage across Spring Boot integration tests, Vitest component suites, and Playwright E2E tests.
- **Docker & Docker Compose**: Multi-stage production container builds served via Nginx and managed with health-check dependency chains.
- **GitHub Actions CI/CD**: Automated CI pipeline verifying code formatting, type checking, unit tests, integration tests, E2E tests, and Docker compilation.

---

## 🛠️ Technology Stack

### Frontend Application (`apps/frontend`)
- **Core**: React 19, TypeScript, Vite
- **Routing & State**: TanStack React Router, TanStack React Query v5
- **Forms & Validation**: React Hook Form, Zod
- **Styling**: Vanilla CSS Modules (Design System with CSS Variables)
- **Testing**: Vitest, React Testing Library, Playwright E2E

### Backend API (`apps/backend`)
- **Core**: Java 21, Spring Boot 3 (Spring WebMVC, Spring Security)
- **Persistence**: Spring Data JPA, Hibernate, PostgreSQL 17, Flyway Database Migrations
- **Security**: JJWT (JSON Web Token), BCrypt Password Hashing, HttpOnly Cookie Handler
- **API Documentation**: SpringDoc OpenAPI / Swagger UI
- **Testing**: JUnit 5, Spring Boot Test, MockMvc, H2 Database

### Infrastructure & DevOps
- **Containerization**: Docker (Multi-Stage), Docker Compose
- **Web Server**: Nginx 1.27 Alpine (SPA Serving & Caching)
- **CI/CD Pipeline**: GitHub Actions

---

## 📐 System Architecture

```text
+-----------------------------------------------------------------------+
|                            Client Browser                             |
|       (React 19 SPA served via Nginx on Port 80 / Port 5173)          |
+-----------------------------------------------------------------------+
                                   |
                          HTTP / Cookie Auth
                                   v
+-----------------------------------------------------------------------+
|                    Spring Boot API (Port 8080)                        |
|                                                                       |
|  [ Presentation Layer ]  --> REST Controllers, DTO Mappers            |
|  [ Security Layer ]      --> Spring Security, JWT Cookie Filter       |
|  [ Application Layer ]   --> Service Interfaces & Implementations     |
|  [ Domain Layer ]        --> Domain Entities & Repositories           |
+-----------------------------------------------------------------------+
                                   |
                             JDBC Connection
                                   v
+-----------------------------------------------------------------------+
|                   PostgreSQL 17 Database (Port 5432)                  |
|                  (Managed with Flyway Schema Migrations)              |
+-----------------------------------------------------------------------+
```

---

## 📁 Repository Structure

```text
professional-identity-platform/
├── .github/
│   └── workflows/
│       └── ci.yml                 # GitHub Actions CI Pipeline Configuration
├── apps/
│   ├── backend/                   # Spring Boot 3 API Monorepo Application
│   │   ├── src/main/java/         # Application Code (Controllers, Services, Security)
│   │   ├── src/main/resources/    # Application Config & Flyway DB Migrations
│   │   ├── src/test/              # JUnit 5 & Integration Test Suites
│   │   └── Dockerfile             # Multi-stage Backend Dockerfile
│   └── frontend/                  # React 19 TypeScript SPA Monorepo Application
│       ├── e2e/                   # Playwright End-to-End Test Specifications
│       ├── src/                   # React Application Source (Components, Features, Domain)
│       ├── Dockerfile             # Multi-stage Nginx Frontend Dockerfile
│       └── nginx.conf             # Production Nginx Web Server Configuration
├── docs/                          # Architecture, Deployment, and Contributing Specs
│   ├── ARCHITECTURE.md
│   ├── DEPLOYMENT.md
│   └── CONTRIBUTING.md
├── docker-compose.yml             # Production Container Orchestration Spec
├── .env.example                   # Local Development Environment Template
├── .env.production.example        # Production Environment Variable Template
├── RELEASE_NOTES.md               # Version 1.0.0 Release Notes
└── README.md                      # Project Documentation Root
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v22+ & `pnpm`
- **Java JDK**: 21+ & Maven (`mvnw`)
- **Docker**: Docker Desktop or Docker Engine + Docker Compose

### 1. Clone & Configure Environment
```bash
git clone https://github.com/saileshwaran-ganesan/professional-identity-platform.git
cd professional-identity-platform

# Create local environment config
cp .env.example .env
```

### 2. Local Development Execution

#### Running Backend
```bash
cd apps/backend
./mvnw spring-boot:run
```

#### Running Frontend
```bash
cd apps/frontend
pnpm install
pnpm run dev
```
Open `http://localhost:5173` in your browser.

---

## 🐳 Docker Deployment

To launch the complete containerized stack (PostgreSQL, Spring Boot Backend, and Nginx SPA Frontend):

```bash
# Build and start all services in detached mode
docker compose up --build -d

# Verify container health status
docker compose ps
```
- **Public Portfolio & Admin Portal**: `http://localhost`
- **Backend API Base**: `http://localhost:8080/api/v1`
- **Actuator Health**: `http://localhost:8080/actuator/health`
- **Swagger Documentation**: `http://localhost:8080/swagger-ui.html`

---

## 🧪 Running Tests

### Frontend Tests
```bash
cd apps/frontend

# Run Type Checker
pnpm exec tsc --noEmit

# Run ESLint Audit
pnpm exec eslint . --max-warnings 0

# Run Vitest Component Unit Tests
pnpm test

# Run Playwright E2E Tests (Mocked API Mode)
pnpm exec playwright test

# Run Playwright E2E Tests (Real Backend Integration Mode)
pnpm run test:e2e:integration
```

### Backend Tests
```bash
cd apps/backend

# Run JUnit 5 Unit & Spring Boot Integration Tests
./mvnw test
```

---

## 🔒 Security Architecture

- **HttpOnly JWT Cookie**: Tokens are stored strictly in `HttpOnly`, `SameSite=Strict` cookies to eliminate XSS token theft vectors.
- **Fail-Fast Configuration**: Startup validation (`SecurityEnvironmentValidator.java`) halts application boot if `JWT_SECRET` environment variable is omitted in production.
- **Strict CORS & Security Headers**: Enforces `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, and HSTS.

---

## 📜 License & Author

Developed with ❤️ by **Saileshwaran Ganesan**.
Licensed under the [MIT License](LICENSE).
