# Database Design

## Philosophy

The backend uses a normalized relational model with Profile as the ownership boundary for professional content. The schema favors clarity, referential integrity, and evolvability over denormalized read optimization. Query performance is measured before optimization is introduced.

## Normalization

Each entity represents one business concept. Repeatable content—experience, education, projects, skills, certifications, achievements, and social links—lives in its own table and references Profile through a foreign key. This avoids repeated groups and prevents changes to one content type from affecting another.

## Primary keys and UUIDs

Every domain table uses an application-generated UUID primary key, as defined by ADR-001. Foreign-key column types must match the UUID primary-key representation. The exact physical representation is selected once in the persistence implementation and applied consistently through migrations; it is not an API concern.

## Foreign keys and cascade rules

`profile.user_id` enforces the one-to-one User relationship. Each profile-owned table carries a non-null `profile_id` foreign key. Child records cannot outlive their Profile.

Profile-to-child persistence may cascade creation and removal within the aggregate, but database cascade deletion must be used deliberately and documented at implementation time. Deleting the administrator or Profile is exceptional and requires an explicit service-level operation; it must never be an incidental result of editing content.

## Indexes

Primary keys and foreign keys are indexed. Additional indexes are introduced for demonstrated query paths, such as public filtering, stable ordering, or uniqueness constraints. Composite indexes must follow actual predicates and sort order, not speculative usage. UUID indexes receive particular scrutiny because of their storage cost.

## Fetch strategy

Associations are lazy by default (ADR-003). Services select the exact graph required for a use case using purposeful repository queries or projections/DTO mapping. Controllers never trigger lazy loading during serialization.

## Auditing

All domain tables will inherit common audit metadata through BaseEntity in Phase 3.2, including creation and last-modification timestamps. Audit fields are infrastructure metadata, not substitutes for content publication history or user activity logging.

## Future migration strategy

Schema evolution is migration-driven once the approved migration tool is introduced. Every change must be forward-only, reviewed with its related domain/API change, and safe for existing data. Migrations must add constraints only after data compatibility is addressed; destructive changes require an explicit preservation or retirement plan. No SQL is defined in this design phase.
