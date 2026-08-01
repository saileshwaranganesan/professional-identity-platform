# Architecture Decisions

## ADR-001: UUID as primary key

**Status:** Accepted

**Context:** Public resources and future distributed workflows should not reveal sequential database identifiers.

**Decision:** Generate UUID primary keys in the application for all domain entities.

**Consequences:** Entity identity is stable before persistence and API identifiers are opaque.

**Advantages:** Safer external exposure, easier data import/export, and no dependency on a central numeric sequence.

**Trade-offs:** UUIDs are larger than numeric keys and require deliberate index design.

## ADR-002: Separate User from Profile

**Status:** Accepted

**Context:** Account/authentication data and public professional content evolve for different reasons.

**Decision:** Model User as the administrative account and Profile as its one-to-one public identity.

**Consequences:** Authentication changes do not reshape portfolio content; all display content has Profile as its parent.

**Advantages:** Clear security boundary and cohesive ownership.

**Trade-offs:** Reading a complete identity may require loading two related records.

## ADR-003: Lazy loading by default

**Status:** Accepted

**Context:** Profile collections can grow and implicit loading creates unnecessary queries and memory use.

**Decision:** Configure entity associations for lazy loading unless a use case explicitly requires another strategy.

**Consequences:** Services must fetch required data intentionally within transactional boundaries.

**Advantages:** Predictable data access and lower accidental query cost.

**Trade-offs:** Care is required to avoid lazy-initialization errors and N+1 queries.

## ADR-004: DTO pattern

**Status:** Accepted

**Context:** HTTP contracts must evolve independently from persistence and must be validated at the boundary.

**Decision:** Use request and response DTOs for all API endpoints.

**Consequences:** Mapping is an explicit application concern.

**Advantages:** Stable APIs, focused validation, and no persistence leakage.

**Trade-offs:** Additional mapping types and tests are required.

## ADR-005: Repository only accessed through Services

**Status:** Accepted

**Context:** Business invariants and transaction rules require one application boundary.

**Decision:** Controllers and other delivery layers access repositories only through services.

**Consequences:** Services own orchestration, validation, and transaction boundaries.

**Advantages:** Thin controllers and consistent business behavior.

**Trade-offs:** Small read operations still require a service method.

## ADR-006: Use BaseEntity for auditing

**Status:** Accepted

**Context:** Content changes need a consistent audit trail without repeating infrastructure fields.

**Decision:** Introduce a mapped BaseEntity in Phase 3.2 for shared UUID identity and audit timestamps.

**Consequences:** Domain entities inherit common persistence metadata; business fields remain local.

**Advantages:** Consistency and reduced duplication.

**Trade-offs:** Inheritance must remain limited to infrastructure concerns.

## ADR-007: REST API versioning (`/api/v1`)

**Status:** Accepted

**Context:** Public/admin clients need a stable route contract as APIs evolve.

**Decision:** Prefix REST endpoints with `/api/v1`, using the existing application constant.

**Consequences:** Breaking changes require a future version rather than silent contract changes.

**Advantages:** Explicit compatibility boundary.

**Trade-offs:** Version routing and documentation must be maintained.

## ADR-008: Do not expose JPA entities directly

**Status:** Accepted

**Context:** JPA entities contain persistence behavior, association graphs, and internal fields that are unsuitable API contracts.

**Decision:** Return only response DTOs/API response wrappers from controllers.

**Consequences:** Serialization is controlled by API models, not ORM mappings.

**Advantages:** Prevents accidental data exposure and lazy-loading serialization issues.

**Trade-offs:** Requires explicit DTO mapping.
