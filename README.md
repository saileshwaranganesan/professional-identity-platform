# Professional Identity Platform

A production-style full-stack application for creating, managing, and publishing a professional portfolio through a secure dashboard and a public portfolio experience.

The project is designed with a clean, scalable architecture and follows modern software engineering practices to provide a maintainable foundation for long-term development.

---

## Current Status

### Backend

**Version:** v1.0 (Feature Complete)

The backend has been completed, tested, and frozen as the stable API for frontend development.

### Frontend

Currently under development.

### Deployment

Infrastructure prepared using Docker and Docker Compose.

---

# Features

## Authentication & Security

* JWT Authentication
* Spring Security
* Role-Based Access Control (RBAC)
* Ownership-based resource access
* Global exception handling
* Request validation

## Portfolio Management

Manage professional information through secure REST APIs.

* Profile
* Projects
* Experience
* Education
* Skills
* Certifications
* Achievements
* Social Links

## Business Features

* Portfolio Aggregation API
* Profile Completion Engine

## Production Features

* PostgreSQL
* Flyway Database Migrations
* Swagger / OpenAPI Documentation
* Docker & Docker Compose
* Bean Validation
* Layered Architecture

---

# Architecture

The backend follows a layered architecture.

```text
Controller
      ↓
Service
      ↓
Mapper
      ↓
Repository
      ↓
PostgreSQL
```

Business logic is isolated inside the service layer while controllers remain thin and focused on HTTP request handling.

---

# Technology Stack

## Frontend

* React (In Progress)
* TypeScript
* Vite
* Tailwind CSS
* shadcn/ui
* React Router
* TanStack Query
* React Hook Form
* Zod
* Axios
* Framer Motion

## Backend

* Java 21
* Spring Boot
* Spring Security
* JWT Authentication
* Spring Data JPA
* Hibernate
* PostgreSQL
* Flyway
* Bean Validation
* OpenAPI / Swagger

## DevOps

* Docker
* Docker Compose

---

# Repository Structure

```text
professional-identity-platform/

├── apps/
│   ├── backend/
│   └── frontend/
│
├── docs/
│
├── postman/
│
├── scripts/
│
├── .github/
│
└── README.md
```

---

# Backend Highlights

* Production-style layered architecture
* UUID-based entities
* Manual DTO mapping
* Constructor dependency injection
* RESTful API design
* Transaction management
* Global exception handling
* Validation using Jakarta Bean Validation
* JWT-secured endpoints
* Portfolio aggregation endpoint
* Profile completion calculation
* Dockerized development environment
* Flyway versioned migrations

---

# Getting Started

## Prerequisites

* Java 21
* Maven
* Docker
* Docker Compose

## Clone the Repository

```bash
git clone <repository-url>
cd professional-identity-platform
```

## Configure Environment Variables

Copy the example environment file.

```bash
cp .env.example .env
```

Update the values inside `.env` before starting the application.

## Run with Docker

```bash
docker compose up --build
```

The backend will be available after startup.

---

# API Documentation

Swagger/OpenAPI documentation is available when the backend is running.

```text
http://localhost:8080/swagger-ui/index.html
```

OpenAPI specification:

```text
http://localhost:8080/api-docs
```

---

# Project Roadmap

## Backend

* [x] Authentication
* [x] JWT Security
* [x] Portfolio Management APIs
* [x] Portfolio Aggregation
* [x] Profile Completion
* [x] Swagger
* [x] Flyway
* [x] Docker

## Frontend

* [ ] Authentication
* [ ] Dashboard
* [ ] Portfolio Editor
* [ ] Public Portfolio
* [ ] Responsive Design
* [ ] Deployment

---

# Documentation

Project documentation is available under the `docs/` directory and includes architecture decisions, database design, implementation roadmap, naming conventions, and other technical references.

---

# License

This project is currently under active development.

A license will be added before the first public release.

---

# Author

Developed by **Saileshwaran Ganesan**.
