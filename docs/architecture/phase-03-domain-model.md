# Phase 3.1: Domain Model

## Overview

The Professional Identity Platform has one administrative account and one professional identity. That identity is represented by a `Profile`; the career and public-presence records beneath it are profile-owned content. This phase defines the persistence model only. It does not define API payloads, Java types, or business workflows.

The model deliberately excludes later concerns such as media, resume, messages, SEO, settings, and technologies. Those require their own approved documentation before they are added.

## Business goals

- Give the administrator a single, coherent source for professional identity content.
- Represent career history and credentials as independently managed, ordered records.
- Support public presentation without making database entities the API contract.
- Preserve clear ownership so content cannot be orphaned or accidentally shared between identities.

## Core entities

| Entity | Purpose | Parent relationship |
| --- | --- | --- |
| User | Administrative account and ownership root. | Has exactly one Profile. |
| Profile | Public professional identity and aggregate owner of portfolio content. | Belongs to one User. |
| Experience | A professional role or employment record. | Belongs to one Profile. |
| Education | An educational qualification or study record. | Belongs to one Profile. |
| Project | A portfolio project presented by the profile. | Belongs to one Profile. |
| Skill | A capability the profile presents. | Belongs to one Profile. |
| Certification | A professional certification or credential. | Belongs to one Profile. |
| Achievement | A notable award, recognition, or milestone. | Belongs to one Profile. |
| SocialLink | An external professional or social presence. | Belongs to one Profile. |

### User

**Purpose and responsibility.** `User` represents the sole administrator account. It establishes authentication ownership in a later phase and is the root that owns the professional identity.

**Why it exists.** Account concerns must not be mixed with public presentation content. Separating them protects future authentication changes from changing the profile model.

**Relationship.** One User has one Profile. A Profile cannot exist without its owning User. The product constraint permits exactly one persisted administrator, enforced by application behavior in the authentication phase rather than by expanding this model into roles or multi-tenancy.

### Profile

**Purpose and responsibility.** `Profile` holds the administrator's public professional identity and is the ownership boundary for career, credentials, skills, projects, and links.

**Why it exists.** It separates account identity from publishable professional content and gives all visible content one consistent parent.

**Relationships.** A Profile belongs to one User and owns zero or more records in every content collection below. Child records are never shared across profiles.

### Experience

**Purpose and responsibility.** `Experience` represents one professional engagement, role, or employment period and carries the information needed to present career progression.

**Why it exists.** Employment history is repeatable, ordered content and should not be embedded in Profile.

**Relationship.** Many Experience records belong to one Profile. Each record has one and only one Profile owner.

### Education

**Purpose and responsibility.** `Education` represents one academic program, qualification, or relevant course of study.

**Why it exists.** Education entries have their own institution, period, and presentation lifecycle, independent of employment records.

**Relationship.** Many Education records belong to one Profile. Each record has one Profile owner.

### Project

**Purpose and responsibility.** `Project` represents one portfolio project, including the information required to identify and describe it publicly.

**Why it exists.** Projects are repeatable professional artifacts with their own visibility and ordering concerns; they are not attributes of Profile.

**Relationship.** Many Project records belong to one Profile. Each record has one Profile owner.

### Skill

**Purpose and responsibility.** `Skill` represents a capability the professional chooses to present, optionally with a level or ordering policy defined in its implementation phase.

**Why it exists.** Skills change independently and are a collection, not a fixed set of Profile fields.

**Relationship.** Many Skill records belong to one Profile. Each record has one Profile owner. This phase does not introduce a Technology entity or a many-to-many association.

### Certification

**Purpose and responsibility.** `Certification` represents an externally issued professional credential.

**Why it exists.** Credentials have an issuer, validity, and evidence concerns distinct from education and achievements.

**Relationship.** Many Certification records belong to one Profile. Each record has one Profile owner.

### Achievement

**Purpose and responsibility.** `Achievement` represents a recognition, award, competition result, or other significant milestone.

**Why it exists.** Achievements enrich the identity independently of roles, projects, and certifications.

**Relationship.** Many Achievement records belong to one Profile. Each record has one Profile owner.

### SocialLink

**Purpose and responsibility.** `SocialLink` represents one external link used to establish the profile's professional presence.

**Why it exists.** External presences are extensible and independently managed; a fixed set of URL columns would make future links require schema changes.

**Relationship.** Many SocialLink records belong to one Profile. Each record has one Profile owner. A uniqueness rule for platform/provider per profile will be evaluated when its fields and validation rules are specified.

## Relationship and lifecycle rules

- `User` → `Profile` is mandatory one-to-one; `Profile` is the public content owner.
- Every listed content entity is mandatory-many-to-one to `Profile`; the corresponding Profile collection is zero-to-many.
- A child has no independent owner, cross-profile sharing, or direct public identity.
- Profile-owned children follow the Profile lifecycle. Cascading removal is appropriate only when deleting the Profile is an approved administrative operation; ordinary child deletion targets the child explicitly.
- Collection display order is a presentation concern modeled with an explicit sort field only where the relevant phase requires it; no implicit database row order is relied on.
