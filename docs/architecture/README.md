# Architecture Documentation

## Purpose

This directory records the decisions and domain design that govern implementation of the Professional Identity Platform. It is the implementation reference for the backend domain model and must be updated when an approved architectural decision changes.

## Architecture philosophy

The platform is a modular monolith with a layered REST backend. It is intentionally simple: one administrator manages professional identity content and public visitors consume published content. Modules remain cohesive, dependencies flow from controller to service to repository, and domain persistence is never a public API contract.

Documentation precedes implementation because it establishes ownership, boundaries, lifecycle, and trade-offs before code makes them expensive to change. It allows schema, API, and UI work to proceed from a shared model instead of rediscovering requirements independently.

## Engineering principles

| Principle | Application |
| --- | --- |
| Single source of truth | `PROJECT_SPEC.md` defines product constraints; these documents define the approved Phase 3.1 model. |
| Clear boundaries | Controllers handle HTTP, services own business rules, repositories handle persistence, and DTOs define API contracts. |
| Composition over coupling | Profile-owned content is modeled as focused records rather than a large mutable aggregate. |
| Explicit contracts | Relationships, ownership, naming, and error boundaries are documented before implementation. |
| Evolution without churn | Versioned APIs, UUIDs, auditing, and normalized data support future changes without premature infrastructure. |

## Goals

Maintainability comes from small cohesive types, consistent naming, documented decisions, and no persistence leakage. Scalability means the model can grow with professional content and public read traffic while retaining a straightforward relational design. Clean architecture means implementation dependencies remain inward: web concerns do not define domain or database behavior.

## Documents

| Document | Scope |
| --- | --- |
| [Domain model](phase-03-domain-model.md) | Entity purpose, ownership, and relationships. |
| [ER diagram](er-diagram.md) | Canonical cardinalities for the Phase 3.1 model. |
| [Architecture decisions](architecture-decisions.md) | ADRs governing implementation. |
| [Naming conventions](naming-conventions.md) | Backend and database naming rules. |
| [Database design](database-design.md) | Relational persistence principles. |
| [Implementation roadmap](implementation-roadmap.md) | Ordered next implementation phases. |
