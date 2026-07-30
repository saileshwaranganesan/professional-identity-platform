# PROJECT SPECIFICATION

Version: 1.0

Status: Active

Project Name: Professional Identity Platform

---

# PROJECT OVERVIEW

The Professional Identity Platform is a production-quality full-stack web application built to manage and publish a developer's professional identity.

This is NOT a portfolio website.

This is NOT a CMS.

This is NOT a SaaS product.

This platform has exactly ONE administrator and unlimited public visitors.

The administrator manages every aspect of the portfolio through a secure administration dashboard.

Public visitors only browse published information.

The application must remain maintainable, clean, modular and extensible.

---

# PROJECT OBJECTIVES

The platform should allow management of

- Profile
- Projects
- Skills
- Technologies
- Experience
- Education
- Certificates
- Resume
- Media
- Contact Messages
- SEO
- Site Settings

without modifying source code.

Everything must be editable through the dashboard.

---

# USERS

## Administrator

Exactly one administrator exists.

Responsibilities

- Login
- Manage content
- Upload files
- Publish changes
- Configure website

No registration.

No multiple users.

No role management.

No permissions system.

---

## Public Visitors

Unlimited visitors.

Visitors can

- Browse the website
- View projects
- Download resume
- Send contact messages

Visitors cannot modify anything.

---

# PROJECT PHILOSOPHY

The project should feel like a real software product.

Priorities

1. Maintainability
2. Simplicity
3. Scalability for personal growth
4. Clean architecture
5. Professional engineering
6. Excellent user experience

Avoid unnecessary enterprise complexity.

---

# TECHNOLOGY STACK

Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- React Router
- TanStack Query
- React Hook Form
- Zod
- Axios
- Framer Motion
- Lucide React

Backend

- Java 21
- Spring Boot
- Spring Security
- Spring Data JPA
- Hibernate
- JWT
- Flyway
- MapStruct
- Bean Validation
- Swagger

Database

- MySQL

Development

- Git
- GitHub
- VS Code
- Bruno
- Figma

Only free tools.

---

# ARCHITECTURE

Monorepo

apps/

admin/

backend/

portfolio/

Backend

Modular Monolith

REST API

Feature-based modules

Frontend

Feature-based architecture

API First

Responsive Design

---

# PUBLIC WEBSITE

The website contains

Home

About

Projects

Project Details

Experience

Education

Skills

Certificates

Resume

Contact

---

# ADMIN DASHBOARD

The dashboard contains

Dashboard

Login

Profile

Projects

Experience

Education

Skills

Technologies

Certificates

Media

Messages

SEO

Site Settings

---

# CORE FEATURES

JWT Authentication

Image Upload

Resume Upload

Media Library

Search

Activity Feed

Rich Text Editor

Draft → Preview → Publish

Swagger Documentation

Dark Mode

Responsive Design

---

# ENGINEERING RULES

Never hardcode portfolio content.

Everything must come from the backend.

Everything must be editable through the dashboard.

Keep modules independent.

Keep services focused.

Keep components small.

Avoid duplicate code.

Prefer composition over inheritance.

Prefer constructor injection.

Never expose JPA entities directly.

Always use DTOs.

Always validate input.

Write meaningful commit messages.

Document important architectural decisions.

---

# FRONTEND RULES

Feature-based folder structure.

Reusable UI components.

Strong typing.

Use React Hook Form.

Use Zod validation.

Use TanStack Query.

No inline styles.

No duplicated components.

Responsive first.

Accessibility matters.

---

# BACKEND RULES

Use layered architecture.

Controller

↓

Service

↓

Repository

↓

Database

Business logic belongs only inside services.

Controllers remain thin.

Repositories access data only.

Never place business logic inside controllers.

---

# DATABASE RULES

Normalized schema.

Meaningful table names.

Foreign keys.

Indexes where appropriate.

Avoid duplicate data.

No premature optimization.

---

# DOCUMENTATION RULES

Documentation is written before implementation.

Architecture changes must update documentation.

Every important decision should have an ADR.

README should stay updated.

---

# GIT CONVENTIONS

Branch naming

feature/authentication

feature/projects

feature/profile

bugfix/login

Commit format

feat:

fix:

refactor:

docs:

style:

test:

chore:

---

# AI RULES

When working on this repository

Always read PROJECT_SPEC.md first.

Never redesign the architecture.

Never introduce new technologies.

Never add dependencies without approval.

Never generate code outside the requested task.

Never create unnecessary folders.

Never create unnecessary files.

Never over engineer.

Prefer readability.

Prefer maintainability.

Follow existing conventions.

Stop immediately after completing the requested task.

---

# DEVELOPMENT WORKFLOW

Every feature follows

Requirements

↓

Design

↓

Database

↓

API

↓

Backend

↓

Frontend

↓

Testing

↓

Documentation

↓

Commit

---

# PROJECT STATUS

Current Phase

Engineering Foundation

Future phases

Repository

Backend

Portfolio

Admin Dashboard

Database

Authentication

Feature Modules

Testing

Deployment

Production

---

# SUCCESS CRITERIA

The completed project should

- Look like a production software product.
- Demonstrate professional software engineering.
- Be easy to maintain.
- Be fully dynamic.
- Require no source code edits for content updates.
- Serve as the flagship project in the developer's portfolio.
