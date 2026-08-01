# Frontend System Architecture Specification

**Document ID:** FSAS-001  
**Version:** 1.1 — Approved  
**Status:** Frozen  
**Classification:** Internal Engineering Specification  
**Tier:** 2 of 4 — Frontend System Architecture  
**Depends On:** PAUS-001 v1.1 (Product & UX Architecture Specification)  

---

## Revision History

| Version | Status | Date | Summary of Changes |
|---|---|---|---|
| 1.0 | Approved | 2026-07-31 | Initial version. Full system architecture covering topology, layers, ownership, data flow, boundaries, and trade-offs. |
| 1.1 | Frozen | 2026-07-31 | Controlled architectural revision. Resolved Infrastructure Layer location ambiguity. Added Server State Read Lifecycle (§8.5). Added Error Propagation Contract (§8.6). Constrained Optimistic Update eligibility (§8.4). Added Documentation Suite. Named entity transformation mechanism. Added defensive transformation policy. Assigned validation ownership. Completed state category ownership. Added Public Application degradation strategy. Defined backend contract on first use. Corrected Document 3 ID. Added ADR forward reference. Editorial improvements throughout. |

---

## Documentation Suite

This document is the second of four in the Professional Identity Platform engineering documentation suite. It depends on Document 1 and is a direct dependency of Document 3.

| Tier | Document | Scope | Audience |
|---|---|---|---|
| **1** | **Product & UX Architecture** (PAUS-001) | Product vision, dual-experience model, user personas, content domain, UX philosophy, design philosophy, accessibility, performance, and future evolution. Implementation-agnostic. | All engineers, architects, designers, and stakeholders. |
| **2** | **Frontend System Architecture** *(this document)* (FSAS-001) | Logical system topology, architectural layers, domain ownership, presentation model philosophy, data flow contracts, application boundary model, and scalability strategy. Technology-agnostic. | Lead architects, principal engineers, senior frontend engineers. |
| **3** | **Frontend Technical Implementation Specification** (TIS-001) | Concrete technology stack, monorepo structure, component architecture, state management implementation, API client configuration, design token system, and developer tooling. | Senior and lead frontend engineers executing implementation. |
| **4** | **Architectural Decision Records** (ADRS-001) | A living ledger of major architectural decisions, alternatives considered, trade-offs evaluated, and the reasoning behind each choice. | All engineers and technical reviewers across the project lifecycle. |

**Dependency rule:** Document 3 (TIS-001) must not contradict architecture established in this document or principles established in PAUS-001. In the event of conflict, the higher-tier document takes precedence.

**ADR relationship:** Significant architectural choices made in this document — the four-layer model, the dual-application separation, the Presentation Model philosophy, the feature-based organizational principle — are candidates for detailed decision records in ADRS-001 (Document 4).

---

**Document Purpose**

This document translates the product philosophy established in PAUS-001 into a logical frontend system architecture. Where PAUS-001 answers *what* the platform is and *why* it exists in its current form, this document answers *how* the frontend is organized as a system — the conceptual structure, the responsibility model, the data flow contracts, and the architectural boundaries that govern the relationship between the platform's two client applications.

This document does not describe implementation. It does not name technologies, frameworks, libraries, build tools, or file system structures. Those decisions belong to TIS-001 (Document 3). This document is concerned exclusively with the logical architecture of the system: the layers that compose it, the contracts between them, the ownership of responsibilities, and the principles that govern how they interact.

---

**Document Scope**

This document governs:

- The logical topology of the frontend system and its three primary components.
- The conceptual architectural layers, their responsibilities, and their dependency relationships.
- The domain ownership model — which part of the system is responsible for which concerns.
- The presentation model philosophy, transformation responsibility, and defensive transformation policy.
- The data flow model: unidirectional flow, state classification, read and write lifecycles, and error propagation.
- The boundary model between the Admin and Public applications.
- The scalability strategy and its structural basis.
- The architectural constraints that protect system integrity.
- The major architectural trade-offs and the reasoning behind the choices made.

This document does not govern:

- Which technologies, frameworks, or libraries implement any of the above.
- Physical folder or file organization.
- Component implementation or styling.
- Deployment infrastructure or hosting.
- Testing strategy or tooling.
- Developer workflow or CI/CD configuration.

Those concerns are addressed in TIS-001 (Document 3: Frontend Technical Implementation Specification).

---

## Table of Contents

1. [Executive Overview](#1-executive-overview)
2. [Relationship to Document 1](#2-relationship-to-document-1)
3. [System Scope](#3-system-scope)
4. [Logical Frontend Topology](#4-logical-frontend-topology)
5. [Architectural Layers](#5-architectural-layers)
6. [Domain Ownership](#6-domain-ownership)
7. [Presentation Models](#7-presentation-models)
8. [Data Flow Philosophy](#8-data-flow-philosophy)
9. [Application Boundaries](#9-application-boundaries)
10. [Scalability Strategy](#10-scalability-strategy)
11. [Architectural Constraints](#11-architectural-constraints)
12. [Trade-offs](#12-trade-offs)
13. [Conclusion](#13-conclusion)

---

## 1. Executive Overview

The frontend of the Professional Identity Platform is not a single application. It is a system composed of two distinct client applications — the Administration Experience and the Public Experience — that share a common foundation without sharing implementation. Each application has a different user, a different purpose, a different UX contract, and a different set of operational requirements. They are united by the backend contract — the stable REST API through which both communicate with the backend — and by the design system primitives that give them a shared visual identity.

The architecture of this system is built on a single structural conviction: **the boundaries between concerns are more valuable than the brevity that comes from collapsing them.** Every major architectural decision in this document — the separation of applications, the layering of responsibilities, the definition of presentation models, the classification of state — exists because a clearly bounded system is cheaper to maintain, safer to change, and easier to reason about than one where responsibilities are diffuse.

The backend that this frontend consumes is stable and frozen. It was designed and built independently, and the frontend must treat its contract as fixed. This is not a constraint to be worked around — it is an architectural fact that shapes every layer of the frontend system. The backend defines the shape of its responses. The frontend defines the shape of the presentations it builds from those responses. The transformation between them is one of the most consequential architectural seams in the system, and it is owned entirely by the frontend.

---

## 2. Relationship to Document 1

PAUS-001 established the constitutional principles of this platform. This document does not revisit them. It builds upon them.

The key derivations from Document 1 that shape this architecture are as follows:

**From the dual-experience product architecture (§6):** The architectural commitment to two separate products sharing a thin common foundation is translated here into the Logical Frontend Topology. The conceptual boundary drawn in Document 1 between the Administration and Public experiences becomes a structural boundary in this document — one that governs ownership, imports, state management, and deployment.

**From the governing trade-off principle (§6.4):** The "share contracts, not implementations" rule is formalized here into a concrete ownership and boundary model. This document defines what constitutes a contract in the system, what constitutes an implementation, and where each category lives.

**From the content lifecycle and structured data model (§8):** The three-state publication lifecycle (Draft → Published → Archived) and the structured data principle create specific requirements for the frontend's domain model. Because content is entered as structured data through the administration workspace, the Domain Layer can expect consistent field shapes from the backend and may treat structural inconsistency as exceptional rather than routine. The frontend must represent and enforce publication states in its own domain layer — the backend's encoding of them is not assumed to match the frontend's presentation needs.

**From the UX philosophy (§9):** The asymmetric design requirements of the two experiences — the Efficiency Contract for Administration, the Narrative Contract for the Public — produce asymmetric technical requirements as well. The Administration Application has different data freshness requirements, different error handling posture, and a fundamentally different caching strategy than the Public Application. These differences are architectural, not merely aesthetic.

**From the future evolution principles (§13):** The SSR migration path and the portability invariant constrain how the Public Application is structured internally. The architecture must ensure the Public Application does not make assumptions about the rendering environment. This shapes the layer model of the Public Application and produces specific constraints documented in §11.

**From the graceful degradation requirement (§12.3):** The Public Application's behavior when content is unavailable — network failures, empty content categories, backend unavailability — is a product requirement that translates into an architectural posture: serve what is available, render designed empty states for what is not, and never expose infrastructure failures to visitors. This posture is formalized in §9.5.

This document inherits all constraints and principles from PAUS-001. Where a tension arises between this document and Document 1, Document 1 takes precedence.

---

## 3. System Scope

The frontend system, as defined in this document, encompasses everything that executes on the client — in the user's browser — or that is statically generated and served to the browser. It does not encompass the backend API, the database, the server runtime, or the deployment infrastructure.

The frontend system has three primary constituents:

**The Administration Application.** A private, authenticated client application through which the administrator manages the platform's content. This application is session-managed, mutation-heavy, and optimized for transactional efficiency.

**The Public Application.** An open, unauthenticated client application through which public visitors experience the developer's professional identity. This application is read-only, presentation-focused, and optimized for visual quality and perceived performance.

**The Shared Foundation.** A thin common layer that both applications depend on. The Shared Foundation contains only what is genuinely required by both experiences — the API communication infrastructure, the domain entity definitions, the authentication session management primitives, and the base design system tokens. It does not contain UI components, application-level state management, or routing.

The scope of this document is the entire frontend system as defined above. Anything not in the browser — the backend API, the database, the CDN, the CI/CD pipeline — is outside this document's scope, though the contracts they establish with the frontend are within it.

---

## 4. Logical Frontend Topology

The frontend system is organized into three logical components arranged in a dependency hierarchy. Understanding the hierarchy is essential to understanding every architectural constraint that follows.

```
┌─────────────────────────────────────────────────────────┐
│                  ADMINISTRATION APPLICATION              │
│   (Authenticated · Mutable · Transactional · Private)    │
│                                                         │
│   Application Layer · Domain Layer · Presentation Layer │
└─────────────────────────────────────────────────────────┘
                             │
                             │ depends on
                             ▼
┌─────────────────────────────────────────────────────────┐
│                     SHARED FOUNDATION                    │
│                                                         │
│   Infrastructure Layer · Domain Entity Definitions      │
│   Authentication Infrastructure · Design Tokens         │
└─────────────────────────────────────────────────────────┘
                             ▲
                             │ depends on
                             │
┌─────────────────────────────────────────────────────────┐
│                    PUBLIC APPLICATION                    │
│   (Unauthenticated · Read-Only · Narrative · Open)       │
│                                                         │
│   Application Layer · Domain Layer · Presentation Layer │
└─────────────────────────────────────────────────────────┘
```

The dependency direction is critical: both applications depend on the Shared Foundation, and the two applications have no dependency on each other. This is the structural guarantee of the portability invariant established in PAUS-001 §13.3.

The diagram also makes explicit which layers reside where. The Infrastructure Layer exists exactly once — in the Shared Foundation. It is not duplicated within either application. Both applications configure and use the Shared Foundation's Infrastructure Layer; they do not possess infrastructure layers of their own. Each application contains an Application Layer, a Domain Layer specific to its concerns, and a Presentation Layer. The Shared Foundation contains the Infrastructure Layer, the canonical domain entity definitions, the authentication primitives, and the design tokens. It does not have an Application Layer or a Presentation Layer.

### 4.1 The Administration Application

The Administration Application is the operational heart of the platform. Its responsibility is to translate the administrator's intent — create a project, update a skill, publish a certification — into mutations on the backend, and to reflect the resulting state of the content domain clearly and accurately.

This application is the only part of the system that writes professional content to the backend. Its relationship with the backend is bidirectional: it reads the current state of content and it submits changes. This bidirectional relationship has consequences for how the application manages its internal state. Data that may change as a result of a mutation cannot be held in long-lived cache without explicit invalidation. The application must always reflect truth, not approximation.

The Administration Application is entirely inaccessible to unauthenticated users. Authentication is a gateway, not a filter. A user who is not authenticated must not receive any content, routing, or UI from this application.

### 4.2 The Public Application

The Public Application is the presentation surface of the platform. Its responsibility is to render the content published through the Administration Application as a coherent, polished, narrative-driven experience for professional visitors.

This application is entirely read-only with respect to professional content. The only data it submits to the backend is contact form submissions — inbound messages from visitors. Every other interaction with the backend is a read.

The Public Application's relationship with the backend differs fundamentally from the Administration Application's. It does not need to reflect live mutations. It needs to present the published state of content accurately and performantly. Published content changes only when the administrator explicitly publishes or archives — events that are rare relative to the frequency of page visits. This makes aggressive caching not merely acceptable but architecturally correct for the Public Application.

The Public Application is the component most subject to future architectural evolution. As documented in PAUS-001 §13.1, this application may need to migrate from client-side rendering to a server-rendered or statically generated delivery model. The entire internal architecture of this application must accommodate that migration without a rewrite of its UI.

### 4.3 The Shared Foundation

The Shared Foundation is not an application. It is the common layer that both applications depend on. Its scope is intentionally narrow. A concern belongs in the Shared Foundation only if it is required by both applications without modification and only if it represents a contract rather than an implementation.

The Shared Foundation contains four categories of concern:

**Infrastructure Layer.** The sole Infrastructure Layer in the system. It handles all communication with the backend API, all session persistence, and any other concerns that cross the boundary between the client and an external system. Both applications access the backend exclusively through this layer. See §5.1 for the full description of its responsibilities.

**Domain Entity Definitions.** The canonical type definitions for the content entities managed by the platform: Profile, Project, Experience, Education, Skills, Technologies, Certifications, Resume, Media, Contact Messages, and Site Configuration. These definitions describe the common shape of each entity as received from the backend and understood by the frontend domain — before either application applies its presentation-specific transformation. They are the shared vocabulary of the system, not a pass-through for raw backend DTOs.

**Authentication Infrastructure.** The primitives for managing the administrator's session: token acquisition, token storage policy, token lifecycle (validity, expiry, renewal), and session termination. The Administration Application owns the authentication user experience — the login interface, the session expiry prompt, and the explicit logout flow — but it uses the Shared Foundation's primitives to do so. The Public Application does not use authentication but depends on the same Shared Foundation, so authentication infrastructure is designed to be present but inactive in the public context.

**Design System Foundation.** The lowest-level design tokens: color scales, typographic scales, spacing units, and elevation levels. These tokens are the raw material from which both applications build their respective visual presentations. Their presence in the Shared Foundation ensures a shared visual identity without constraining the distinct design expressions each experience requires.

---

## 5. Architectural Layers

Concerns within the frontend system are organized into four conceptual layers. These layers are defined by their responsibilities and by the direction of their dependencies.

As established in the topology diagram, the four layers are not uniformly distributed across all three system components. The Infrastructure Layer exists once, in the Shared Foundation. The Domain Layer exists in both the Shared Foundation (as canonical entity definitions) and within each application (as application-specific transformation and validation logic). The Application Layer and the Presentation Layer exist exclusively within each application. The Shared Foundation has neither an Application Layer nor a Presentation Layer.

The dependency rule is strict and applies throughout: **outer layers depend on inner layers; inner layers do not depend on outer layers.**

```
                 ADMINISTRATION          PUBLIC
                  APPLICATION          APPLICATION
                 ┌───────────┐        ┌───────────┐
  Outer ──────►  │  Presenta-│        │  Presenta-│
                 │tion Layer │        │tion Layer │
                 └─────┬─────┘        └─────┬─────┘
                       │ depends on         │ depends on
                       ▼                    ▼
                 ┌───────────┐        ┌───────────┐
                 │ Application│        │ Application│
                 │   Layer   │        │   Layer   │
                 └─────┬─────┘        └─────┬─────┘
                       │ depends on         │ depends on
                       ▼                    ▼
                 ┌───────────┐        ┌───────────┐
                 │  Domain   │        │  Domain   │
                 │   Layer   │        │   Layer   │
                 └─────┬─────┘        └─────┬─────┘
                       │ depends on         │ depends on
                       ▼                    ▼
                 ┌──────────────────────────────────┐
                 │         SHARED FOUNDATION        │
                 │  Infrastructure Layer             │
                 │  Domain Entity Definitions        │
  Inner ──────►  │  Authentication Infrastructure   │
                 │  Design System Foundation         │
                 └──────────────────────────────────┘
                                │
                                │ communicates with
                                ▼
                          Backend API
```

### 5.1 Infrastructure Layer (Shared Foundation)

The Infrastructure Layer is the system's single interface with the external world. It resides in the Shared Foundation and is the only layer authorized to communicate with the backend API. Neither application constructs backend requests directly — they communicate through the Infrastructure Layer, which enforces the backend contract uniformly.

The Infrastructure Layer's responsibilities are strictly transport and session concerns:

- Constructing and dispatching requests to the backend API.
- Injecting authentication credentials into requests that require them.
- Receiving backend responses and performing initial response parsing.
- Classifying all communication failures into a normalized error taxonomy (see §8.6 for the full error propagation contract).
- Managing session persistence — reading and writing authentication tokens according to the token storage policy defined in the authentication infrastructure.

The Infrastructure Layer does not know what the data it retrieves will be used for. It does not contain business rules, domain semantics, or presentation decisions. It is a transport mechanism with a typed interface. The meaning of a backend response is assigned by the Domain Layer, not here.

The way each application configures its use of the Infrastructure Layer differs. The Administration Application activates authentication credential injection. The Public Application does not. This configuration difference does not create application-specific Infrastructure Layers — it is a behavioral configuration of the single shared layer.

### 5.2 Domain Layer

The Domain Layer exists in two forms: the canonical entity definitions in the Shared Foundation, and the application-specific Domain Layers within each application. These two forms serve different purposes and must not be confused.

**The Shared Foundation's domain entity definitions** describe what each content entity looks like as received from the backend and understood by the frontend domain. They are the starting vocabulary — the agreed-upon shape of a Project, an Experience entry, a Certification — before any application-specific concern is applied.

**Each application's Domain Layer** performs the transformation from those canonical definitions (or directly from Infrastructure Layer responses) into Presentation Models appropriate for that application's rendering needs. This is where the entity mapper — the named transformation function that converts a canonical entity definition into a specific Presentation Model — operates. The entity mapper is an architectural artifact, not an implementation detail. Document 3 will name and implement it concretely; this document establishes that it must exist and that it lives here.

The Domain Layer's full responsibilities include:

- Receiving normalized responses from the Infrastructure Layer.
- Applying the entity mapper to produce application-specific Presentation Models.
- Computing derived properties (formatted dates, resolved references, calculated display values).
- Resolving entity relationships where the backend returns references rather than embedded objects.
- Enforcing publication lifecycle semantics — translating backend-encoded status values into the named domain concepts (Draft, Published, Archived) defined in PAUS-001 §8.3.
- Performing content mutation validation for the Administration Application (see §6.4 for validation ownership).
- Applying defensive transformation: when the backend returns an incomplete, null, or structurally inconsistent response, the Domain Layer must produce either a safe, null-managed Presentation Model or a structured error — it must not propagate raw backend inconsistency to the Application Layer.

The Domain Layer does not contain UI logic. It does not reference layouts, components, or visual presentation. It does not know about routing or navigation state.

### 5.3 Application Layer

The Application Layer orchestrates interactions between the Presentation Layer above it and the Domain and Infrastructure Layers below it. Its responsibilities are coordination and state management.

The Application Layer decides what data to fetch, when to fetch it, when to invalidate it, how to classify and handle errors, and how to distribute information to the Presentation Layer. It is the owner and manager of all four categories of frontend state defined in §8.2.

In the Administration Application, the Application Layer carries significant weight. It manages both the read path (server state lifecycle, §8.5) and the write path (mutation lifecycle, §8.4). It is responsible for ensuring the administration workspace always reflects accurate, current content state — a requirement that demands an aggressive invalidation posture after mutations.

In the Public Application, the Application Layer's role is comparatively lighter. Its read path is dominant; its write path is limited to contact form submission. Its caching posture is permissive relative to the Administration Application. However, it bears full responsibility for the Public Application's degradation strategy: ensuring that content failures, empty states, and network unavailability are handled gracefully and never exposed as infrastructure errors to visitors (see §9.5).

### 5.4 Presentation Layer

The Presentation Layer is the visual surface of each application. It consists of the UI units — components, layouts, and interaction handlers — that the user directly encounters.

The Presentation Layer receives data from the Application Layer in the form of Presentation Models or error states. It does not fetch data. It does not transform domain models. It does not contain business rules or validation logic. A Presentation component that needs data receives it; a Presentation component that needs to trigger a mutation communicates that intent upward to the Application Layer, which executes it.

This discipline is not preference — it is the mechanism that makes the Presentation Layer independently testable, straightforwardly replaceable, and portable to a different rendering environment. A Presentation component free of Infrastructure and Domain concerns can be rendered in any environment that supports the design system, including a server rendering context.

The Presentation Layer is the layer that differs most substantially between the two applications. The two applications share design system tokens but not components. An administration content editing form and a public project card serve different users with different purposes and must not be shared between experiences.

The Presentation Layer's responsibility for errors is strictly rendering: it receives an error state from the Application Layer — one that has already been interpreted, classified, and prepared for display — and renders it appropriately. It does not inspect raw error objects. It does not make handling decisions.

---

## 6. Domain Ownership

Domain ownership defines which part of the system is responsible for which concerns. Ambiguous ownership is one of the most common causes of architectural erosion — when no one clearly owns a concern, it is implemented inconsistently across multiple places until the inconsistency becomes structural.

### 6.1 Administration Application Ownership

The Administration Application owns all concerns related to content management and publication:

- The content creation, editing, and deletion workflows for all entity types.
- The publication lifecycle UI: the actions and confirmation flows that move content between Draft, Published, and Archived states.
- The media library management — browsing, uploading, selecting, and associating media with content entities.
- The contact messages inbox — the presentation and management of inbound visitor messages.
- The site configuration interface — managing SEO metadata, site identity, and feature visibility settings.
- The authentication user experience — the login interface, session expiry handling, and explicit logout.
- The dashboard — the administrative entry point that reflects the current state of the content domain and guides the administrator toward relevant actions.

The Administration Application does not own the presentation of content to public visitors. It may provide a preview capability — a read-only view of the public experience — but that preview must be a genuine navigation to the Public Application, not an internal simulation. The Administration Application must not import from or depend on the Public Application's implementation to provide it.

### 6.2 Public Application Ownership

The Public Application owns all concerns related to the presentation of published content to professional visitors:

- The navigation and routing of the public experience.
- The rendering of all published content entities: Profile, Projects, Experience, Education, Skills, Technologies, Certifications, and Resume.
- The progressive disclosure model for project content — how projects are presented at summary level and in detail.
- The contact form — the interface through which visitors submit contact messages, and the submission flow.
- All SEO metadata rendering, structured data output, and document head management for public pages.
- All loading states, empty states, and error states visible to public visitors.
- The graceful degradation posture of the public experience (see §9.5).

The Public Application does not own any write operations except contact form submission. It does not own the authentication user experience. It does not display content that has not been explicitly published.

### 6.3 Shared Foundation Ownership

The Shared Foundation owns the contracts and primitives that both applications require:

- The Infrastructure Layer — the sole mechanism for backend communication.
- The canonical domain entity definitions — the authoritative description of the common shape of each content entity as received from the backend.
- The authentication token lifecycle primitives — storage policy, validity checking, and session termination mechanics.
- The base design token definitions — color scales, typographic scales, spacing, elevation.

The Shared Foundation does not own UI components, routing, application-level state management, or validation rules. These are application-level concerns that belong to the application that requires them.

### 6.4 Validation Ownership

Content mutation validation — the rules that determine whether a content entity is in a state suitable for submission to the backend — belongs exclusively to the Administration Application's Domain Layer. This placement follows from a single architectural fact: only the Administration Application writes content. The Public Application has no write path for professional content and therefore has no mutation validation responsibility.

Validation rules must not be placed in the Shared Foundation. Doing so would imply that the Public Application has a stake in content mutation rules, which it does not. Validation rules belong with the mutations they validate.

Form-level validation — providing immediate feedback to the administrator as they fill out a form — is a Presentation Layer and Application Layer concern, operating on form state before it becomes a Domain Layer concern. Domain Layer validation is the gate that a completed form must pass before a mutation request is dispatched to the Infrastructure Layer.

### 6.5 Ownership Boundary Enforcement

Ownership boundaries are not maintained by convention — they must be enforced by explicit, verifiable rules. The primary enforcement mechanism is the import graph: a module in the Administration Application must not import from a module in the Public Application, and vice versa. Both may import from the Shared Foundation. The Shared Foundation must not import from either application.

Type-only imports are not exempt from this rule. If the Administration Application needs a type definition that the Public Application also uses, the canonical definition belongs in the Shared Foundation — not in either application.

The correction mechanism for over-broad Shared Foundation abstractions is explicit: if something in the Shared Foundation is needed by only one application, it should be moved to that application's Domain Layer during the next architectural review. The Shared Foundation must not accumulate single-application concerns through inertia.

These rules must be verifiable through automated tooling. The specific verification mechanism belongs to TIS-001 (Document 3). The requirement that such a mechanism exist belongs here.

---

## 7. Presentation Models

### 7.1 Why Presentation Models Exist

The backend API contract is designed to serve persistence and retrieval efficiently. It returns data in shapes appropriate for a normalized relational data store — entities identified by opaque keys, related entities referenced rather than embedded, timestamps in machine formats, status values as database-friendly encodings. This is the right design for a backend.

It is the wrong design for a UI.

A Presentation Layer that consumes backend responses directly becomes coupled to the backend's encoding decisions. If the backend changes a field name, the UI breaks. If the backend adjusts a status encoding, every component that inspects status must be updated. If the backend returns a new null case, every component that renders the affected field becomes a potential rendering failure. The UI's correctness becomes entangled with the backend's schema evolution, even though the two evolve for entirely different reasons.

Presentation Models solve this by introducing an explicit transformation step — the entity mapper — between the raw backend response and the data that Presentation Layer components consume. The Presentation Model is shaped for rendering, not for persistence. It uses stable, semantically meaningful field names; resolved entity references; computed display properties; and domain-appropriate representations of data. Changes to the backend's encoding are absorbed by the entity mapper in the Domain Layer, not propagated throughout the Presentation Layer.

### 7.2 The Entity Mapper

The entity mapper is the named transformation mechanism in the Domain Layer that converts a canonical entity definition (as received from the backend via the Infrastructure Layer) into an application-specific Presentation Model. The entity mapper is an architectural artifact — it is a defined responsibility with a defined location, not an ad hoc transformation scattered across components.

Every content entity type has an entity mapper within each application's Domain Layer. The Administration Application's entity mappers produce Presentation Models suited for content management workflows. The Public Application's entity mappers produce Presentation Models suited for narrative presentation. They are separate implementations, even when they operate on the same underlying entity type.

The entity mapper is also the owner of defensive transformation. When the Infrastructure Layer returns a response that is structurally incomplete — a missing required field, an unexpected null, a reference that cannot be resolved — the entity mapper must handle the deficiency explicitly. It must produce either a safe Presentation Model with appropriate null handling applied, or a structured error that the Application Layer can route through the error propagation contract (§8.6). The entity mapper must never pass a partially initialized or null-unsafe Presentation Model to the Application Layer.

### 7.3 Transformation Responsibility

The transformation from backend response to Presentation Model belongs exclusively in the Domain Layer. This placement is deliberate.

The Application Layer receives Presentation Models from the Domain Layer, not raw backend responses. It distributes these models to the Presentation Layer. No Presentation component ever sees a raw backend response or a raw backend error object. The transformation contract is absolute: clean, application-appropriate data flows upward from the Domain Layer; raw backend concerns stay in the Domain and Infrastructure Layers.

### 7.4 Presentation Models vs. Persistence Models

A Presentation Model is defined by what the UI needs, not by what the backend returns. This distinction produces concrete structural differences:

**Resolved references.** The backend returns a list of media IDs associated with a project. The Presentation Model contains the resolved media objects, ready to render. The resolution happened in the Domain Layer.

**Computed properties.** The backend returns a raw start date and end date for a work experience entry. The Presentation Model contains a formatted duration string and a human-readable date range, computed in the entity mapper.

**Publication state as a named concept.** The backend encodes content state as a value in its own schema. The Presentation Model expresses this as a domain concept — Draft, Published, or Archived — consistent with the lifecycle semantics defined in PAUS-001 §8.3.

**Denormalization where appropriate.** The backend normalizes data to eliminate persistence-level redundancy. The Presentation Model denormalizes where doing so simplifies rendering, embedding commonly co-displayed relationships directly rather than requiring component-level joins.

**Absence of irrelevant fields.** The Presentation Model contains only what the UI needs. Backend fields with no rendering relevance are not propagated. This reduces the cognitive load for engineers working in the Presentation Layer and prevents accidental rendering of data not intended for display.

### 7.5 Separate Presentation Models for Separate Experiences

The Administration Application and the Public Application require different Presentation Models for the same underlying content entity. This is expected and correct.

The Administration Application's Project Presentation Model includes full content, all media references, the publication state with its administrative controls, audit timestamps, and draft-only fields. The Public Application's Project Presentation Model includes only published-appropriate content, primary media, formatted descriptions, and information relevant to professional presentation.

These are not the same model with fields filtered. They are distinct models serving distinct purposes, produced by separate entity mappers in separate Domain Layers, derived from the same canonical entity definition.

---

## 8. Data Flow Philosophy

### 8.1 The Principle of Unidirectional Flow

Data in this system flows in one direction: from the backend, through the Infrastructure Layer, through the Domain Layer's entity mapper, through the Application Layer's state management, into the Presentation Layer for rendering. User interactions that trigger mutations flow in the opposite direction: from the Presentation Layer's intent signals, through the Application Layer's mutation orchestration, through the Infrastructure Layer's request mechanism, to the backend.

The reason for maintaining this unidirectional flow is predictability. When data can flow in multiple directions between layers, the source of truth for any given piece of information becomes ambiguous. In a unidirectional system, the trace is always the same: find the component, find what model it received, find where that model was produced, find where the backend response was transformed. Every defect has a single path of causation.

### 8.2 State Classification and Ownership

Not all state in a client application has the same nature, lifecycle, or management requirements. This architecture classifies frontend state into four distinct categories, each with its own management posture and explicit ownership.

**Server State** is data that originates on the backend and is temporarily cached on the client. Its source of truth is external — the backend. It can become stale. It must be refreshed or invalidated when mutations occur. Server state is owned and managed by the Application Layer. Neither the Presentation Layer nor the Domain Layer holds server state; they receive it for use and rendering but do not own it.

**Local UI State** is state that exists purely within the client and has no backend representation — whether a modal is open, which tab is selected, whether an accordion is expanded. Local UI state is owned by the component that creates it. It lives within that component and is released when the component is unmounted. It has no persistence requirement and no synchronization requirement.

**Navigation and URL State** is state encoded in the browser's URL — the current route, query parameters, and route-level parameters. URL state is owned by the routing infrastructure. It is the authoritative source of truth for navigation state. Both applications must treat the URL as canonical for navigation concerns and must not hold parallel copies in other state stores. Application state that must be synchronized with the URL derives from the URL, not the reverse.

**Form State** is the transient state of in-progress user input — the values entered into a form before submission. Form state is owned by the Application Layer (specifically, by the form orchestration within the Administration Application). It is created when a form is initialized, updated as the user inputs, validated before submission, and released after successful submission or cancellation. Form state must never be conflated with server state — the server has not seen the contents of an unsaved form.

The four-category classification is an architectural constraint, not a suggestion. State that belongs to one category must not be managed by mechanisms appropriate to another. Server state must not be stored in local UI state containers. Form state must not be cached alongside server state. URL state must not be duplicated into a separate client store. The discipline of classification is what makes the Application Layer legible.

### 8.3 Server State and Data Freshness

The Administration Application and the Public Application have structurally different data freshness requirements, and this difference is reflected in their Application Layer architectures.

The Administration Application requires high data freshness. The administrator must always see the current state of their content domain. The Administration Application's caching posture defaults to aggressive invalidation following mutations, with conservative cache lifetimes for mutable content.

The Public Application has a fundamentally different relationship with freshness. Published content changes only on explicit publication events — events that are rare relative to the frequency of page visits. The Public Application can therefore cache content aggressively. This aggressive caching is not a performance optimization applied after the fact; it is the architecturally correct posture given the nature of the data.

### 8.4 The Mutation Lifecycle and Optimistic Update Constraints

In the Administration Application, mutations — creates, updates, deletes, and publication state changes — follow a defined lifecycle that the Application Layer owns:

1. **Intent capture.** The user performs an action in the Presentation Layer that signals intent to modify the domain. The Presentation Layer communicates this intent upward to the Application Layer, which takes ownership of the mutation.
2. **Optimistic update** *(where permitted — see constraints below)*. The Application Layer may immediately update the local representation of the affected state to reflect the expected result of the mutation, providing instant feedback.
3. **Request dispatch.** The Application Layer instructs the Infrastructure Layer to submit the mutation to the backend.
4. **Confirmation or rollback.** On success, the Application Layer invalidates the relevant server state and confirms the resulting backend state. On failure, any optimistic update is rolled back, and the error is passed through the error propagation contract (§8.6) to the Presentation Layer for display.

**Optimistic update eligibility criteria.** Optimistic updates are appropriate when all three of the following conditions are met:

- The mutation's effect is confined to the acting user's session. The expected result is not visible to any other party before backend confirmation.
- Failure rollback restores the pre-mutation state without visible inconsistency for the acting user.
- The mutation is sufficiently frequent and latency-sensitive that the feedback cost of awaiting confirmation is perceptible and detrimental to the user experience.

**Optimistic update prohibition.** Optimistic updates are explicitly prohibited for the following mutation categories:

- **Publication state transitions** (Draft → Published, Published → Archived, Archived → Published). These mutations have a direct, observable effect on the public experience. A publication state transition that is optimistically applied and subsequently rolled back creates a window during which the system's displayed state is inconsistent with its actual backend state. Because the Public Application caches published content, there is a risk — however brief — that a visitor could encounter that inconsistency during the rollback window. The architectural cost of this potential public-facing inconsistency outweighs the UX benefit of instant feedback in the administration workspace. Publication actions must display a loading state and await backend confirmation before updating the UI.
- **Irreversible operations** (permanent deletion, if supported in future versions). A rollback of an optimistically-deleted entity requires restoring it, which the backend cannot guarantee.
- **Mutations that create entities immediately referenced by others** (e.g., media uploads that are then associated with content). The reference chain must be established on the backend before the client treats the entity as available.

Step 4 of the mutation lifecycle establishes that server state is confirmed with the backend after a mutation, ensuring that the server state cache reflects post-mutation truth. The specific mechanism for obtaining that confirmation — whether through a re-fetch of the affected resource or through the mutation response itself — belongs to TIS-001 (Document 3).

### 8.5 The Server State Read Lifecycle

The read path — acquiring server state and distributing it to the Presentation Layer — follows a defined lifecycle that the Application Layer owns. Like the mutation lifecycle, this is a sequence of conceptual stages, not implementation steps.

1. **Intent.** The Application Layer determines that a piece of server state is needed. This is triggered by a navigation event, an initial mount, or a user action that requires data not currently held in the server state cache. The Application Layer is the sole decision-maker for when retrieval is necessary.

2. **Cache evaluation.** Before dispatching a retrieval request, the Application Layer evaluates whether a valid, non-stale cache entry for the required data already exists. If a valid entry is present, the Application Layer distributes the cached Presentation Model to the requesting Presentation Layer consumer immediately, without a network request. Freshness criteria differ between the two applications: the Administration Application applies conservative staleness thresholds; the Public Application applies permissive ones.

3. **Retrieval.** If no valid cache entry exists, the Application Layer instructs the Infrastructure Layer to fetch the required data from the backend. During retrieval, the Application Layer provides the Presentation Layer with a loading signal — not a void — allowing loading states to be rendered while data is in transit.

4. **Transformation.** On receiving the backend response, the Application Layer passes it to the Domain Layer's entity mapper. The entity mapper produces a Presentation Model and applies defensive transformation (see §7.2). A transformation error is handled through the error propagation contract (§8.6) rather than silently discarded.

5. **Distribution.** The Application Layer stores the resulting Presentation Model in the server state cache and distributes it to the Presentation Layer. The loading signal is withdrawn. The Presentation Layer renders the model.

6. **Freshness maintenance.** The Application Layer maintains awareness of each cached entry's freshness window. For the Administration Application, entries approach staleness quickly for mutable content, requiring proactive invalidation following any mutation that could affect them. For the Public Application, entries remain valid until a publication event occurs or an explicit revalidation is triggered by navigation.

7. **Background refresh.** When a cache entry has been served but is approaching or has passed its freshness threshold, the Application Layer may initiate a background retrieval to refresh the cache without blocking the Presentation Layer. The Presentation Layer continues rendering the last known valid model while the background retrieval completes. On success, the refreshed Presentation Model replaces the stale one. On failure, the last known valid model is retained and the error is surfaced according to §8.6.

8. **Failure recovery.** If retrieval fails at any stage, the Application Layer must not destroy existing cached state. It must preserve the last known valid Presentation Model (if one exists) and surface the failure through the error propagation contract. The Presentation Layer is given an error state to render alongside, or in place of, the last known data — depending on the severity of the failure and the freshness of the cached state. The Presentation Layer never sees a void — either it receives a Presentation Model, a loading signal, or a handled error state.

### 8.6 Error Propagation Contract

Errors in this system — whether from network failures, backend-reported validation failures, authentication expiries, or structural inconsistencies in backend responses — flow through the layers in a defined direction with defined responsibilities at each level. This contract governs that flow.

**Infrastructure Layer responsibility: Classification.**  
The Infrastructure Layer is the first point of contact with backend communication failures. Its responsibility is to classify every failure into a normalized error taxonomy before passing it upward. The normalized error surface includes at minimum: an error category (network failure, authentication failure, authorization failure, validation failure, server error, resource not found) and an error recoverability classification (recoverable — the request may be retried; session-ending — the administrator's session must be re-established; permanent — the request cannot succeed without a change in state). The Infrastructure Layer must not pass raw HTTP status codes or raw network error objects to the Domain Layer. It produces normalized error objects with semantic meaning. It does not make decisions about how errors are handled or displayed — that is not its responsibility.

**Domain Layer responsibility: Semantic enrichment.**  
The Domain Layer receives normalized Infrastructure errors and may enrich them with domain context. A validation error from a Project mutation is not merely a "validation error" — it is a "Project content validation error," enriched with enough context for the Application Layer to make a handling decision. The entity mapper's defensive transformation failures also produce structured errors at this layer. The Domain Layer passes enriched errors upward. It does not decide whether to retry, surface to the user, or fall back — that is not its responsibility.

**Application Layer responsibility: Handling decisions.**  
The Application Layer is the decision-maker for error handling. On receiving an enriched error from the Domain Layer, it determines the appropriate response:

- **Recoverable errors** may trigger a retry policy, subject to limits defined by the Application Layer's own retry strategy.
- **Authentication failures** trigger the authentication recovery flow — redirecting the administrator to the login interface or presenting a session renewal prompt.
- **Validation failures** are transformed into form-displayable error states and distributed to the relevant form's Presentation Layer.
- **Resource not found errors** are converted into empty or unavailable states that the Presentation Layer can render cleanly.
- **Permanent server errors** are converted into error states with appropriate recovery actions (reload, navigate away) for the Presentation Layer to render.

The Application Layer never passes a raw error object to the Presentation Layer. It passes an error state — a prepared, display-ready description of what failed and what the user can do about it. The Application Layer also decides whether to preserve the last known cached state alongside an error (for recoverable failures) or to replace it with an error state (for permanent failures).

**Presentation Layer responsibility: Rendering.**  
The Presentation Layer renders error states provided by the Application Layer. It does not inspect error categories, make retry decisions, or know anything about the Infrastructure Layer. It receives either a Presentation Model, a loading signal, or a prepared error state — and renders whichever it receives according to the design system's error presentation patterns.

**Cross-experience error behavior.** In the Administration Application, errors should be specific and actionable — the administrator can act on detailed failure information. In the Public Application, errors must be graceful and opaque — a visitor must never see a technical failure message, a status code, or a trace of the underlying infrastructure. This asymmetric error presentation posture is established in PAUS-001 §7.3 and is enforced at the Application Layer: the same Infrastructure error may produce a detailed error state in the Administration Application and a generic "unavailable" state in the Public Application.

---

## 9. Application Boundaries

### 9.1 The Independence Invariant

PAUS-001 §13.3 established the portability invariant: the Administration and Public experiences must remain independently deployable. The architectural mechanism that enforces this at the system level is the independence invariant: **neither application may import from the other application's implementation.**

This rule admits no exceptions without a formal architectural decision documenting the justification and a plan for the exception's eventual removal. An import from one application into the other creates a runtime coupling that makes independent deployment impossible without first breaking the coupling.

The independence invariant does not prohibit visual similarity or shared architectural patterns. It prohibits sharing the implementation of those patterns through a cross-application import path.

### 9.2 Shared Foundation as the Only Cross-Experience Dependency

The Shared Foundation is the only legitimate source of cross-experience dependencies. Type definitions, domain entity shapes, API infrastructure, authentication primitives, and design tokens flow from the Shared Foundation to both applications. They do not flow directly between applications.

If shared logic is discovered during implementation — a transformation function, a validation rule, a display utility — the correct resolution is to promote it to the Shared Foundation under the governance criteria established in §6.3 and §6.5, not to create a cross-application import. If the logic in question does not meet the Shared Foundation's governance criteria (required by both applications, representing a contract rather than an implementation), it belongs in the application that needs it, duplicated in the other application if necessary, rather than imported across the boundary.

### 9.3 State Independence

The two applications must not share runtime state. The Administration Application's server state cache, local UI state, and form state are entirely invisible to the Public Application, and vice versa. There is no global state store accessible to both applications.

This has a practical consequence for preview capability. If the administrator wants to preview the public experience, the preview must be delivered as genuine navigation to the Public Application — not as a shared-state view within the administration workspace. The preview is the Public Application running in its own context, consuming published content from the backend in the same way any visitor would.

### 9.4 Independent Failure Modes

Application boundary independence extends to failure handling. A runtime error in the Administration Application must not affect the Public Application. The two applications have independent error boundaries at the application level.

This independence is a consequence of the boundary model, not a separately implemented feature. When the two applications share no runtime state and have no import dependencies on each other, they fail independently by construction. Maintaining the boundary model is what preserves this property over time.

### 9.5 Public Application Degradation Strategy

The Public Application's role in graceful degradation — established as a product requirement in PAUS-001 §12.3 — translates into a concrete architectural posture that the Application Layer owns:

**Serve what is available.** If the backend returns partial content — some sections successfully fetched, others failed — the Public Application renders the sections it has and presents designed empty or unavailable states for those it could not retrieve. It does not withhold successfully loaded content because adjacent content failed.

**Present designed empty states, not voids.** A content section that exists in the platform but has no published content must be handled with an intentional, designed absence — a state that preserves the page's visual structure without pretending the content exists. An unhandled empty state is as unacceptable as an unhandled error state.

**Never expose infrastructure to visitors.** The Public Application must never surface a raw error, an HTTP status code, a network failure message, or any artifact of its infrastructure to a visitor. All failure cases in the Public Application produce designed states — either graceful empty states or graceful unavailability messages — that are visually and tonally consistent with the public experience's professional presentation standard.

**Preserve layout stability.** Loading states must never produce layout instability. As content arrives progressively, the layout must remain stable. A page that shifts as content loads is a design failure, not a loading state.

---

## 10. Scalability Strategy

### 10.1 Feature-Based Organizational Principle

The architecture of each application is organized around features, not around architectural layers. This is a structural decision with significant consequences for how the system grows.

In a layer-based organization, all presentation units live together, all application orchestration lives together, all domain transformations live together. This arrangement works at small scale and becomes a liability as the feature set grows. Each new content entity type adds to every layer simultaneously. Understanding a single feature requires visiting multiple distant locations. The cost of change grows proportionally with the size of each layer.

In a feature-based organization, all concerns for a given feature — its presentation units, its Application Layer orchestration, its Domain Layer transformations — are co-located in a feature module. Adding a new content entity type means adding a new module, not extending every existing layer. Understanding a feature is bounded to its module.

A concrete way to see this for the platform's specific features: each content entity type (Projects, Experience, Education, Skills, Certifications) becomes a feature module within each application. The module contains the Application Layer orchestration for that entity's workflows, the entity mapper for that entity's Presentation Model, and the Presentation Layer components that render it. Cross-cutting concerns — design tokens, the Infrastructure Layer, canonical entity definitions — remain in the Shared Foundation.

The tension between feature-based and layer-based organization is resolved by the Shared Foundation. Genuinely cross-feature concerns live there and are available to all feature modules without creating cross-module dependencies.

### 10.2 Module Isolation

Each feature module is designed to be as self-contained as possible. Its dependencies on other feature modules within the same application are minimized and made explicit. A feature module may freely depend on the Shared Foundation. It should depend on other feature modules only when there is a genuine domain relationship that makes isolation impractical — and even then, only through well-defined interfaces, not through informal imports.

Module isolation provides two benefits: features are independently understandable, and features are independently changeable. A modification to the Projects feature does not require changes to the Skills feature. A developer unfamiliar with Skills can work on Projects without needing to understand the Skills module.

Module isolation does not require complete independence. Projects and Experience have temporal overlap in a developer's career that may occasionally require cross-module coordination at the Application Layer. The principle is not "zero cross-module dependencies" — it is "minimize and make explicit the dependencies that exist."

### 10.3 Horizontal Scaling of the Content Domain

PAUS-001 §13.2 established that the content domain may expand in future versions. The feature-based organizational principle accommodates this directly: a new content entity is a new feature module, added to both applications following established patterns, without restructuring existing modules.

This scalability is achievable only if the existing modules are well-isolated and the patterns are well-established. The architecture's scalability strategy is therefore not primarily structural — it is a discipline. The structural mechanism enables the discipline; the discipline produces the scalability.

---

## 11. Architectural Constraints

The following constraints are explicit architectural decisions that preserve the integrity of the system over time. They are constraints, not suggestions. Violations require a formal architectural review, a documented justification, and a remediation plan with a timeline. Violations without remediation plans are unresolved architectural debt, not accepted exceptions.

**The Infrastructure Layer exists once, in the Shared Foundation.** Applications configure and use it. They do not duplicate it. A module within an application that bypasses the Shared Foundation's Infrastructure Layer to communicate directly with the backend has violated this constraint.

**The Infrastructure Layer must not contain business logic or presentation decisions.** Infrastructure concerns are transport concerns. A module that begins making decisions about how to display an error, or which endpoint to call based on a business rule, has violated its layer contract. Business rules belong in the Domain Layer. Display decisions belong in the Presentation Layer.

**The Presentation Layer must not perform data transformations.** A Presentation component that receives a backend response and parses, formats, or enriches it has absorbed Domain Layer responsibility. All transformations happen in the entity mapper in the Domain Layer before data reaches the Presentation Layer.

**The Presentation Layer must not manage server state.** A Presentation component that directly instructs the Infrastructure Layer to fetch data has bypassed the Application Layer. Fetching is Application Layer work. Rendering is Presentation Layer work.

**Professional content must not originate in the client.** Every piece of professional content visible in the public experience — names, descriptions, dates, project details, skills — must originate from the backend. This constraint applies to professional profile content; UI-level copy (navigation labels, error messages, empty-state text) is not subject to it.

**The Administration and Public Applications must not import from each other.** This is the structural enforcement of the independence invariant. No exception is permitted without a formal architectural decision and a remediation plan. Type-only imports are not exempt — canonical types belong in the Shared Foundation.

**The Shared Foundation must not import from either application.** A Shared Foundation module that imports from either application creates a circular dependency that destroys the independence model.

**Publication state transitions must not be optimistically applied.** As defined in §8.4, mutations that change public-visible content state must await backend confirmation before updating the UI. This is a non-negotiable constraint derived from the requirement to prevent public-facing state inconsistency.

**All critical user flows must have a complete keyboard path.** As established in PAUS-001 §11.1, no critical interaction may be mouse-exclusive. Interactive elements that participate in critical flows must be keyboard-operable by design.

**The Public Application must not depend on browser-only APIs at the module-root level.** In preparation for the SSR migration path described in PAUS-001 §13.1, all browser-specific API usage in the Public Application must be contained within execution-time guards or abstracted behind environment-agnostic interfaces. A module that unconditionally accesses browser globals at import time is incompatible with server rendering.

---

## 12. Trade-offs

Every architectural choice in this document implies the rejection of at least one alternative. Documenting the rejected alternatives and the reasoning behind their rejection prevents the same alternatives from being proposed repeatedly, provides the information needed to re-evaluate decisions if circumstances change, and helps engineers understand why the architecture is the way it is.

### 12.1 Two Logical Applications vs. One Application with Route Separation

**Rejected alternative:** Build a single client application with routing that separates the administration and public sections under different URL paths.

**Reasoning for rejection:** A single application would be simpler to set up and would eliminate the governance overhead of the Shared Foundation. The problem is that the two experiences have different requirements at every layer — different authentication postures, different caching strategies, different error handling models, different performance targets, and different rendering portability requirements. A single application cannot coherently satisfy these opposing requirements without introducing internal complexity that defeats the purpose of consolidation.

More fundamentally, the product architecture established in PAUS-001 §6.1 is explicit: these are two separate products that share a backend contract. The architecture of the system must reflect this reality. A single application with route separation would be a structural misrepresentation of the product's true nature — and structural misrepresentations accumulate into architectural debt as the product evolves.

### 12.2 Feature-Based vs. Layer-Based Application Structure

**Rejected alternative:** Organize each application by architectural layer — all domain models together, all application orchestration together, all presentation components together.

**Reasoning for rejection:** Layer-based organization has a single significant failure mode: it does not scale. As content entity types grow, each layer grows proportionally. The cognitive cost of understanding a single feature increases as the layer containing it grows. The cost of modifying a feature increases as the change surface expands across multiple locations.

Feature-based organization scales correctly for a content domain that is expected to expand. The cost is one-time: establishing the patterns and maintaining them. The benefit is ongoing: bounded cost of change as the domain grows. See PAUS-001 §13.2 for the content domain expansion expectation that makes this trade-off particularly important.

### 12.3 Presentation Models vs. Direct Backend Model Consumption

**Rejected alternative:** Consume backend response DTOs directly in the Presentation Layer, transforming data inline within components as needed.

**Reasoning for rejection:** Direct consumption is simpler in the short term, and for a system with a co-designed backend, it can remain manageable. For this platform, the backend is frozen. The frontend does not control the shape of its responses. Any backend schema change must be absorbed somewhere in the frontend — the only question is where. Direct consumption distributes that absorption across every component that reads the affected field. The entity mapper concentrates it in a single location per entity type per application. The architectural cost of the entity mapper is the one-time investment of defining it. The architectural benefit is the elimination of schema-propagation debt every time the backend changes.

### 12.4 Application-Local State vs. Shared Global State Store

**Rejected alternative:** Maintain a single global state store accessible to both applications.

**Reasoning for rejection:** A global state store visible to both applications violates the independence invariant and the portability invariant from PAUS-001 §13.3. Even without shared import dependencies, a shared runtime state store creates a coupling that makes independent deployment impossible — forking the store or establishing cross-application synchronization reintroduces all the coupling that the independent deployment model was designed to eliminate.

### 12.5 Client-Side Rendering vs. Immediate SSR/SSG for the Public Application

**Rejected alternative:** Build the Public Application as server-rendered or statically generated from the outset.

**Reasoning for rejection:** The SEO and performance benefits of server-side rendering are real and documented. They are not significant enough at the platform's current scale and audience model to justify the additional infrastructure complexity. The platform's public audience is primarily reached through direct links rather than search engine discovery — the SEO benefit of SSR is a future concern, not a present one.

Critically, the architecture preserves the SSR migration path. The constraints on the Public Application — no browser-only API dependencies at module roots, environment-agnostic Presentation Layer, decoupled data fetching — ensure that when the migration becomes warranted, it is a change to the delivery mechanism, not a rewrite of the product. The current client-side rendering delivery is a provisional choice with a defined exit.

---

## 13. Conclusion

This document has established the logical architecture of the Professional Identity Platform's frontend system. The architecture is defined by four convictions that should be apparent throughout:

**Boundaries are more valuable than brevity.** The separation between applications, the dependency hierarchy between layers, the explicit domain ownership model — each introduces overhead relative to a less structured approach. That overhead is the cost of building a system that can be understood, changed, and extended by engineers who did not write it, on timelines that extend well beyond the initial implementation.

**The backend contract is a fixed input.** The backend is frozen. An entire architectural mechanism — the entity mapper in the Domain Layer — exists specifically to absorb the gap between what the backend returns and what the UI needs. This is the correct architectural response to a stable, independently evolved backend contract.

**The Public Application's future must not be closed by its present.** The client-side rendering choice is correct for now. Every constraint on the Public Application in this document — no browser-only API dependencies at module roots, environment-agnostic Presentation Layer, decoupled data fetching — exists to keep the SSR migration path open when the time comes.

**State is not a single thing.** The four-category classification — server state, local UI state, URL state, form state — is the foundation of a predictable, debuggable Application Layer. When state categories are confused or conflated, the system becomes unpredictable in proportion to the scale of the confusion. The discipline of classification is the precondition for the discipline of management.

The architecture described here is not the simplest possible architecture for a platform of this scope. It is the simplest architecture that remains correct as the platform evolves. The premium over maximum simplicity is paid once, in careful design. The alternative — a simpler architecture that accumulates structural debt as it grows — is not actually simpler. It merely defers its cost until the cost is larger.

Document 3 — TIS-001 (Frontend Technical Implementation Specification) — will express this logical architecture in concrete technical decisions: the specific technologies that implement each layer, the physical organization of the codebase, the tooling that enforces the constraints established in §11, and the patterns that implement the principles established here. Every decision made in TIS-001 must be traceable to a principle established in this document or in PAUS-001. Significant decisions that require detailed rationale will be recorded in ADRS-001 (Document 4).

---

## Document Status

| Section | Status |
|---|---|
| 1. Executive Overview | Complete |
| 2. Relationship to Document 1 | Complete |
| 3. System Scope | Complete |
| 4. Logical Frontend Topology | Complete |
| 5. Architectural Layers | Complete |
| 6. Domain Ownership | Complete |
| 7. Presentation Models | Complete |
| 8. Data Flow Philosophy | Complete |
| 9. Application Boundaries | Complete |
| 10. Scalability Strategy | Complete |
| 11. Architectural Constraints | Complete |
| 12. Trade-offs | Complete |
| 13. Conclusion | Complete |

---

**Document End**

*FSAS-001 — Frontend System Architecture Specification — Version 1.1*  
*Status: Frozen. This document is the permanent Tier 2 architectural bridge between PAUS-001 (Product & UX Architecture) and TIS-001 (Frontend Technical Implementation Specification). It must not be modified without a formal architecture review. All implementation decisions in TIS-001 must be traceable to principles established here or in PAUS-001.*
