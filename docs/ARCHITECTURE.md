# Architecture Specification — Professional Identity Platform (v1.0.0)

This document provides a comprehensive technical overview of the architecture, design principles, data flow, security model, and scalability considerations of the **Professional Identity Platform**.

---

## 1. High-Level Architecture Overview

The platform uses a decoupled monorepo architecture consisting of a **React 19 SPA** frontend served via **Nginx**, a **Spring Boot 3 REST API** backend, and a **PostgreSQL 17** relational database.

```text
+-----------------------------------------------------------------------------------+
|                                  CLIENT LAYER                                     |
|                                                                                   |
|  +-----------------------------------------------------------------------------+  |
|  |                     React 19 Single Page Application                         |  |
|  |   - TanStack React Router (Client-side routing with code-splitting)         |  |
|  |   - TanStack React Query v5 (Server state management & optimistic cache)   |  |
|  |   - Zod + React Hook Form (Schema validation & form state handling)        |  |
|  +-----------------------------------------------------------------------------+  |
+-----------------------------------------------------------------------------------+
                                         |
                       REST HTTP API (JSON) / HttpOnly Cookie
                                         v
+-----------------------------------------------------------------------------------+
|                                 APPLICATION LAYER                                 |
|                                                                                   |
|  +-----------------------------------------------------------------------------+  |
|  |                        Spring Boot 3 REST Backend                          |  |
|  |                                                                             |  |
|  |  [ Presentation Layer ]  --> REST Controllers, Request/Response DTOs       |  |
|  |  [ Security Filter ]      --> JWT Cookie Auth Filter, Security Headers      |  |
|  |  [ Service Layer ]       --> Transactional Business Logic & Mappers         |  |
|  |  [ Persistence Layer ]   --> Spring Data JPA Repositories                   |  |
|  +-----------------------------------------------------------------------------+  |
+-----------------------------------------------------------------------------------+
                                         |
                                  JDBC Driver
                                         v
+-----------------------------------------------------------------------------------+
|                                DATA STORAGE LAYER                                 |
|                                                                                   |
|  +-----------------------------------------------------------------------------+  |
|  |                        PostgreSQL 17 Database                              |  |
|  |   - Versioned Migrations: Flyway (V1__init_schema.sql)                        |  |
|  |   - Relational Tables: Users, Projects, Experience, Skills, Education, Messages|  |
|  +-----------------------------------------------------------------------------+  |
+-----------------------------------------------------------------------------------+
```

---

## 2. Layered Architecture Principles

Both backend and frontend applications enforce strict separation of concerns:

### Backend Layers
1. **Presentation Layer (`controller`)**: Handles HTTP requests, path variables, query parameters, request validation (`@Valid`), and maps responses into DTOs.
2. **Security Layer (`security`)**: Intercepts inbound requests, extracts and verifies JWTs from HttpOnly cookies, and establishes `SecurityContextHolder` authentication.
3. **Service Layer (`service`)**: Contains business rules, entity state transitions, transactional boundaries (`@Transactional`), and entity-DTO conversions.
4. **Domain/Persistence Layer (`entity`, `repository`)**: Encapsulates database entities (extending `BaseEntity` for audit timestamps) and Spring Data JPA interfaces.

### Frontend Layers
1. **Presentation Layer (`components`, `features`)**: Modular React components styled with isolated CSS Modules.
2. **Application Layer (`app`, `router`, `layouts`)**: App initialization, global providers (QueryClient, Toast, ErrorBoundary), and route definitions.
3. **Domain Layer (`domain`)**: Data access schemas (Zod), API functions, custom React Query mutation/query hooks, and TypeScript interfaces.
4. **Infrastructure Layer (`lib/api`)**: Axios `httpClient` instance configured with credentials forwarding, base URLs, and response interceptors.

---

## 3. Data & Authentication Flow

### Authentication Sequence
```text
Client (React SPA)          Spring Boot API           Spring Security / JWT       PostgreSQL
      |                            |                            |                     |
      |--- POST /auth/login ------>|                            |                     |
      |    (email, password)       |--- Validate Credentials -->|                     |
      |                            |                            |--- Query User ----->|
      |                            |<-- User Account Found -----|                     |
      |                            |                            |                     |
      |                            |--- Generate Signed JWT --->|                     |
      |                            |<-- Secret JWT String ------|                     |
      |                            |                            |                     |
      |<-- 200 OK Response --------|                            |                     |
      |    Set-Cookie: jwt=...     |                            |                     |
      |    (HttpOnly, Secure,      |                            |                     |
      |     SameSite=Strict)       |                            |                     |
```

1. **Login Request**: User submits credentials via `LoginForm`.
2. **Credential Validation**: `AuthenticationManager` verifies BCrypt password hash.
3. **Token Issuance**: API generates a 256-bit signed JWT token and attaches it to an `HttpOnly`, `SameSite=Strict` cookie header.
4. **Session Persistence**: On subsequent admin requests, `JwtAuthenticationFilter` inspects the incoming cookie, validates signature and expiration, and populates `SecurityContext`.

---

## 4. Query & State Architecture

- **Server State**: Managed via **TanStack React Query v5**. Data queries (`useQuery`) specify `staleTime: 5 * 60 * 1000` to prevent redundant network fetches.
- **Mutations & Cache Invalidation**: Data updates (`useMutation`) execute optimistic updates or invalidate affected query keys (e.g. `['projects']`), triggering silent background refetches.
- **Local Component State**: Transient form states and modal visibility are encapsulated strictly within local React state (`useState`, `useReducer`).

---

## 5. Scalability & Operational Considerations

- **Stateless Backend Scaling**: Because session state is stored in JWTs (not server-side HTTP sessions), the backend container can scale horizontally behind a load balancer without sticky sessions.
- **Static Asset Serving**: The React SPA is compiled into static assets served via Nginx with long-term caching headers (`Cache-Control: public, max-age=31536000`).
- **Database Migration Isolation**: Flyway migrations run automatically on startup to ensure database schema compatibility across version upgrades.
