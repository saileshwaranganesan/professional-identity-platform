# Contributing Guide — Professional Identity Platform

Thank you for contributing to the **Professional Identity Platform**! This document outlines our development workflow, coding standards, testing requirements, and pull request process.

---

## 1. Development Workflow

1. **Fork & Clone**: Fork the repository and clone it locally.
2. **Branching Strategy**: Create a feature branch off `main`:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bugfix-name
   ```
3. **Local Setup**: Follow [DEPLOYMENT.md](DEPLOYMENT.md) to launch local development servers.

---

## 2. Coding Standards

### Frontend (TypeScript & React 19)
- **Strict Typing**: No `any` types. Define explicit interfaces or Zod schemas in `src/domain/<feature>/schema.ts`.
- **CSS Modules**: Place styles in `[ComponentName].module.css`. Use design system CSS variables (`var(--color-primary-500)`).
- **ESLint & Prettier**: Enforce 0 warnings:
  ```bash
  cd apps/frontend
  pnpm exec eslint . --max-warnings 0
  ```

### Backend (Java 21 & Spring Boot 3)
- **Layered Architecture**: Keep controllers thin. Business logic belongs exclusively in the `@Service` layer.
- **DTO Immutability**: Use Java `record` classes or explicit DTOs. Never expose raw JPA entities over REST endpoints.
- **Validation**: Use Jakarta Bean Validation annotations (`@NotNull`, `@Size`, `@Email`, `@Valid`).

---

## 3. Mandatory Testing Requirements

Before submitting a Pull Request, all Quality Gates must pass cleanly:

```bash
# Frontend Validation
cd apps/frontend
pnpm exec tsc --noEmit           # Type Checking
pnpm exec eslint . --max-warnings 0  # Linting
pnpm test                         # Vitest Component Tests
pnpm exec playwright test         # Playwright E2E Tests

# Backend Validation
cd apps/backend
./mvnw test                       # JUnit 5 & Integration Tests
```

---

## 4. Pull Request Process

1. Commit changes using clear, imperative commit messages (`feat: add project category filter`).
2. Push your feature branch to your fork.
3. Open a Pull Request against `main`.
4. Ensure all GitHub Actions CI status checks pass.
