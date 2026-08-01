# Implementation Roadmap

Implementation proceeds in dependency order. Each phase is complete only when its acceptance criteria are met and its documentation remains accurate.

## Phase 3.2 — BaseEntity

| Item | Detail |
| --- | --- |
| Objective | Establish shared persistence identity and auditing infrastructure. |
| Deliverables | Audited mapped base type with UUID identity; persistence auditing configuration if required by the existing stack. |
| Dependencies | Phase 3.1 ADR-001 and ADR-006. |
| Acceptance criteria | Concrete entities can inherit consistent UUID and audit behavior without duplicating fields. |

## Phase 3.3 — User

| Item | Detail |
| --- | --- |
| Objective | Model the single administrator account. |
| Deliverables | User entity, constraints, repository, service boundary, DTOs, and tests appropriate to the approved phase scope. |
| Dependencies | Phase 3.2. |
| Acceptance criteria | One administrator account can be persisted with a stable UUID and auditing fields; no role system or registration flow is introduced. |

## Phase 3.4 — Profile

| Item | Detail |
| --- | --- |
| Objective | Model the one-to-one professional identity owned by User. |
| Deliverables | Profile entity, User relationship mapping, repository/service/DTO contracts, and tests. |
| Dependencies | Phases 3.2–3.3; ADR-002. |
| Acceptance criteria | A Profile has exactly one User owner and its API contract does not expose persistence entities. |

## Phase 3.5 — Experience

| Item | Detail |
| --- | --- |
| Objective | Add profile-owned professional history. |
| Deliverables | Experience entity, Profile relationship, repository/service/DTOs, validation, and tests. |
| Dependencies | Phase 3.4. |
| Acceptance criteria | Experience records cannot exist without Profile ownership and are retrieved through service methods. |

## Phase 3.6 — Education

| Item | Detail |
| --- | --- |
| Objective | Add profile-owned education history. |
| Deliverables | Education entity, mapping, repository/service/DTOs, validation, and tests. |
| Dependencies | Phase 3.4. |
| Acceptance criteria | Education is independently manageable and tied to exactly one Profile. |

## Phase 3.7 — Projects

| Item | Detail |
| --- | --- |
| Objective | Add portfolio project records. |
| Deliverables | Project entity, mapping, repository/service/DTOs, validation, and tests. |
| Dependencies | Phase 3.4. |
| Acceptance criteria | Projects are profile-owned, API-safe, and support approved public presentation requirements. |

## Phase 3.8 — Skills

| Item | Detail |
| --- | --- |
| Objective | Add profile-presented capabilities. |
| Deliverables | Skill entity, mapping, repository/service/DTOs, validation, and tests. |
| Dependencies | Phase 3.4. |
| Acceptance criteria | Skills are profile-scoped; no Technology entity or many-to-many model is added without a later design decision. |

## Phase 3.9 — Certifications

| Item | Detail |
| --- | --- |
| Objective | Add externally issued credentials. |
| Deliverables | Certification entity, mapping, repository/service/DTOs, validation, and tests. |
| Dependencies | Phase 3.4. |
| Acceptance criteria | Certifications are profile-owned and their validation reflects approved credential fields. |

## Phase 3.10 — Achievements

| Item | Detail |
| --- | --- |
| Objective | Add professional recognition records. |
| Deliverables | Achievement entity, mapping, repository/service/DTOs, validation, and tests. |
| Dependencies | Phase 3.4. |
| Acceptance criteria | Achievements remain a focused profile-owned concept and are not folded into unrelated records. |

## Phase 3.11 — Social Links

| Item | Detail |
| --- | --- |
| Objective | Add extensible external profile links. |
| Deliverables | SocialLink entity, mapping, repository/service/DTOs, URL validation, and tests. |
| Dependencies | Phase 3.4. |
| Acceptance criteria | Links belong to one Profile and validation prevents malformed external URLs. |

## Phase 3.12 — Repositories

| Item | Detail |
| --- | --- |
| Objective | Consolidate persistence access patterns for the approved domain. |
| Deliverables | Focused repository interfaces and query methods needed by approved use cases. |
| Dependencies | Phases 3.3–3.11. |
| Acceptance criteria | Repositories contain persistence queries only and are accessed only by services. |

## Phase 3.13 — Services

| Item | Detail |
| --- | --- |
| Objective | Implement domain orchestration and transactional use cases. |
| Deliverables | Service interfaces/implementations, DTO mapping, validation, exception handling, and service tests. |
| Dependencies | Phase 3.12; ADR-004, ADR-005, and ADR-008. |
| Acceptance criteria | Controllers remain thin, entities are not exposed, and business rules execute inside services. |

## Phase 3.14 — Authentication

| Item | Detail |
| --- | --- |
| Objective | Secure the single administrator account and protected management operations. |
| Deliverables | Approved authentication design, credential handling, security configuration, login contract, and security tests. |
| Dependencies | User model and service boundaries; a separately approved authentication specification. |
| Acceptance criteria | Only the administrator can modify content; public read access remains explicit; no registration, roles, or permission system is introduced. |
