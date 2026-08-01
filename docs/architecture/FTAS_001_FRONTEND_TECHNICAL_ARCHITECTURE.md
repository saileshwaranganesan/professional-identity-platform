# Frontend Technical Architecture Specification

**Document ID:** FTAS-001  
**Version:** 0.1 — Draft (Part I Complete)  
**Status:** In Progress  
**Classification:** Internal Engineering Specification  
**Tier:** 3 of 5 — Frontend Technical Architecture  
**Depends On:** PAUS-001 v1.1 (Frozen), FSAS-001 v1.1 (Frozen)  

---

## Revision History

| Version | Status | Date | Sections |
|---|---|---|---|
| 0.1 | Draft | 2026-08-01 | Part I: §1.1, §1.2, §1.3 — Technical Foundation |

---

## Documentation Suite

| Tier | Document | Scope |
|---|---|---|
| **1** | PAUS-001 v1.1 — Product & UX Architecture | Product vision, UX contracts, design philosophy, accessibility, performance framing, future evolution. Frozen. |
| **2** | FSAS-001 v1.1 — Frontend System Architecture | Logical topology, four-layer model, domain ownership, state classification, data flow contracts, application boundaries. Frozen. |
| **3** | **FTAS-001 — Frontend Technical Architecture** *(this document)* | Concrete technology stack, monorepo package topology, import boundary enforcement, component architecture, routing, authentication, API transport, domain modeling, state management, form architecture, error infrastructure, loading strategy, performance engineering, security, SSR decoupling. |
| **4** | FEOS-001 — Frontend Engineering Operations & Standards | Testing harness, CI/CD pipelines, static analysis configuration, git workflows, developer experience, code coverage policies. |
| **5** | ADRS-001 — Architectural Decision Records | Historical decision ledger. Rationale, alternatives considered, trade-off matrices for all significant architectural choices. |

**Authority rule:** In the event of a conflict between this document and FSAS-001 or PAUS-001, the higher-tier document governs. This document may not introduce technology choices that contradict logical architecture established in FSAS-001 or product principles established in PAUS-001.

**ADR relationship:** Technology decisions made in this document that involve non-trivial trade-offs — framework selection, build tooling, state engine, styling approach — will be logged in ADRS-001 with their full evaluation matrices. Section references to the relevant ADR are noted inline.

---

**Document Purpose**

This document translates the logical system architecture established in FSAS-001 into concrete, technology-specific engineering decisions. Where FSAS-001 defines conceptual layers, contracts, and constraints, this document names the specific technologies, libraries, and patterns that implement them.

Every decision in this document must be traceable to a requirement in FSAS-001 or PAUS-001. Decisions are not made by convention or familiarity. They are made because a specific architectural requirement demands them and because the selected technology satisfies that requirement more fully than the evaluated alternatives.

This document is the primary engineering reference for implementing the frontend. An engineer with Documents 1, 2, and 3 should be able to build the platform without requiring architectural clarification.

---

**Document Scope**

This document governs:

- The core UI framework, language, and type system.
- The build engine, bundler, and dev-server architecture.
- The monorepo workspace topology and package structure.
- Import boundary enforcement mechanisms.
- Routing and navigation implementation.
- Authentication and session management implementation.
- The API transport client and Infrastructure Layer implementation.
- Domain entity modeling, schema validation, and entity mapper patterns.
- Server state management, caching, and the query client architecture.
- Mutation mechanics, cache invalidation, and optimistic update enforcement.
- Form state management and validation engine integration.
- Error boundary infrastructure and fault tolerance patterns.
- Loading states, skeletal rendering, and progressive display.
- Client-side security: HTML sanitization, CSP, and environment variable isolation.
- Accessibility implementation: keyboard navigation hooks and ARIA abstractions.
- Code-splitting, bundle optimization, and asset pipeline.
- Core Web Vitals instrumentation.
- Environment configuration and variable typing.
- SSR decoupling patterns for the Public Application.
- Content domain expansion mechanics.

This document does not govern:

- Testing framework configuration (FEOS-001).
- CI/CD pipeline definitions (FEOS-001).
- Static analysis tooling configuration (FEOS-001).
- Git workflow and contribution conventions (FEOS-001).
- Developer environment setup scripts (FEOS-001).
- Historical trade-off rationale in depth (ADRS-001).

---

## Table of Contents

**Part I: Technical Foundation**
- 1.1 Document Metadata & System Alignment
- 1.2 Core Framework & Language Architecture
- 1.3 Module Bundler & Build Engine Architecture
- 1.4 Technology Selection Matrix *(pending)*

**Part II: Application Structure & Topology** *(pending)*  
**Part III: Presentation Layer Architecture** *(pending)*  
**Part IV: Data, State & Transport Layer** *(pending)*  
**Part V: Quality Attributes & Technical Resilience** *(pending)*  
**Part VI: Performance Engineering & Deployment Readiness** *(pending)*  
**Part VII: Future Platform Evolution** *(pending)*  

---

# Part I: Technical Foundation

---

## 1.1 Document Metadata & System Alignment

### 1.1.1 Upstream Constraint Summary

This document operates downstream of two frozen specifications. Before any implementation decision is made, the constraints those documents impose must be understood in aggregate. The following is not a restatement of PAUS-001 or FSAS-001 — it is an enumeration of the specific constraints that directly shape the technology decisions in this document.

**From PAUS-001 (Product & UX Architecture):**

- The platform has two distinct client experiences — Administration and Public — with different users, different UX contracts, and different performance expectations. *(§6)*
- The public experience is a narrative-driven, polished presentation surface whose quality is judged by professional visitors who will form opinions about the developer within seconds. *(§1, §9.3)*
- The administration experience is an efficiency-optimized workspace whose standard is transactional clarity. *(§9.2)*
- Performance is a product requirement, not an engineering optimization. Perceptible loading latency is a design failure. *(§12.1)*
- All critical user interactions must have a complete keyboard path. Mouse-exclusive interfaces are not acceptable for critical flows. *(§11.1)*
- The platform must be capable of evolving toward SSR/SSG delivery for the Public Application when SEO and performance requirements make that transition warranted. *(§13.1)*
- The content domain may expand horizontally in future versions. New entity types must be accommodable without platform-wide restructuring. *(§13.2)*

**From FSAS-001 (Frontend System Architecture):**

- The frontend system comprises two distinct applications and a Shared Foundation. Neither application may import from the other's implementation. The Shared Foundation contains the sole Infrastructure Layer. *(§4, §9.1)*
- Four architectural layers govern all code: Infrastructure, Domain, Application, Presentation. Dependency flows strictly inward. *(§5)*
- Entity mappers in the Domain Layer transform backend responses into application-specific Presentation Models. No Presentation component ever sees a raw backend response. *(§7)*
- The four-category state classification — server state, local UI state, URL state, form state — must be managed by mechanisms appropriate to each category. *(§8.2)*
- The Public Application must not depend on browser-only APIs at module-root level, in preparation for the SSR migration path. *(§11)*
- Publication state transitions must never be optimistically applied. *(§8.4)*
- The Infrastructure Layer exists exactly once, in the Shared Foundation. Applications configure it; they do not duplicate it. *(§5.1)*

These constraints are the architectural requirements this document's technology decisions are measured against. Any proposed technology that cannot satisfy them is disqualified regardless of its merits on other dimensions.

### 1.1.2 Technology Decision Criteria

Technology choices in this document are evaluated against five criteria, applied in order of precedence:

1. **Architectural fit.** Does the technology satisfy the constraints enumerated in §1.1.1 without requiring workarounds that violate them?
2. **Type system integration.** Does the technology participate naturally in a strict TypeScript environment, producing compile-time guarantees rather than requiring runtime assertions?
3. **SSR compatibility.** Does the technology operate correctly in a server-rendering context, or does it assume a browser environment in ways that would block the SSR migration path?
4. **Long-term maintainability.** Is the technology actively maintained, broadly adopted in production systems at scale, and unlikely to require replacement within the expected lifespan of the platform?
5. **Developer experience.** Does the technology support efficient implementation without introducing unnecessary ceremony or cognitive load?

Criterion 5 is weighted last by design. Developer experience is a real and legitimate concern, but it does not override architectural correctness. A technology that is ergonomically pleasant but architecturally incorrect is not a candidate.

---

## 1.2 Core Framework & Language Architecture

### 1.2.1 UI Framework: React 19

**Selected:** React 19 (current stable release at time of writing)

**The requirement this addresses:**

FSAS-001 §5.4 defines the Presentation Layer as the visual surface that receives Presentation Models from the Application Layer and renders them. The Presentation Layer must be independently testable, replaceable, and — critically — portable to a different rendering environment when the SSR migration path is executed. FSAS-001 §11 requires that Public Application modules not depend on browser-only APIs at import time. PAUS-001 §13.1 requires that the SSR migration be achievable without a product rewrite.

These requirements, taken together, demand a component model that is rendering-environment-agnostic at its core. The selected framework must be capable of executing in both a browser context and a server runtime context, not as an afterthought or via an adapter layer, but as a first-class capability of the framework itself.

**Why React 19:**

React's component model is fundamentally environment-agnostic. A React component is a pure function from props to a description of the desired UI — not from props to DOM manipulation. This design is what makes React renderable in server contexts via its server rendering APIs, and it is also what makes the Presentation Layer's portability constraint (FSAS-001 §11, §5.4) achievable without framework-level workarounds.

React 19 specifically is selected over React 18 for three concrete reasons:

First, React 19 introduces a stable, documented Actions API for handling asynchronous operations — mutations in particular — with native optimistic update support, error handling, and pending state management. This maps directly to the mutation lifecycle defined in FSAS-001 §8.4 (Intent → Optimistic update → Request dispatch → Confirmation/Rollback). The Actions API allows the mutation lifecycle to be expressed in the framework's native idiom rather than exclusively through third-party orchestration.

Second, React 19's improved error reporting infrastructure provides richer error boundaries with better recovery ergonomics, directly supporting the error propagation contract established in FSAS-001 §8.6. Error boundaries in React 19 can recover programmatically — a capability the Administration Application's fault tolerance infrastructure (FTAS-001 §5.1) depends on.

Third, React 19 stabilizes the `use()` hook, which enables async resource consumption within the component tree in a way that is compatible with server-side rendering without requiring the component to know which environment it is running in. This is directly relevant to the Public Application's SSR portability requirement.

**Alternatives evaluated:**

*Vue 3:* A genuinely mature, well-designed framework with an excellent Composition API. Vue 3 was evaluated seriously. The deciding factor against it is TypeScript integration depth. While Vue 3's TypeScript support has improved substantially, template type inference and complex generic prop types remain weaker than React's TSX approach. The entity mapper pattern (FSAS-001 §7.2) requires compile-time type safety at the transformation boundary — the guarantee that a `ProjectAdminViewModel` cannot leak into the Public Application's Presentation Layer. TSX provides this guarantee through the type system at zero runtime cost. Vue's SFC template compiler requires separate tooling to approach equivalent guarantees. For a platform where the entity mapper is a load-bearing architectural seam, compile-time correctness at that boundary is not optional.

*Svelte 5:* Svelte produces smaller runtime bundles than React by compiling components to direct DOM operations rather than maintaining a virtual DOM. Its performance profile for the Public Application would be excellent. The reason Svelte cannot be selected is architectural: Svelte's SSR story is inseparable from SvelteKit, its meta-framework. Migrating the Public Application to SSR with Svelte means adopting SvelteKit, not adopting a rendering delivery mechanism — it means adopting an opinionated full-stack framework with its own routing model, data loading conventions, and file system structure. This violates the SSR migration constraint in PAUS-001 §13.1, which requires that the SSR migration be a change to delivery mechanism, not a product rewrite. React's SSR capabilities are native to the library; adopting them does not require changing frameworks.

*Solid.js:* Solid's fine-grained reactivity system is architecturally interesting — it eliminates the virtual DOM entirely and updates the DOM directly based on reactive signals, achieving excellent runtime performance. The reason Solid is not selected is maintainability criterion 4. Solid's ecosystem, while growing, is significantly smaller than React's. The entity mapper, form engine, server state management, and accessibility primitive patterns that this architecture depends on all have battle-tested, production-validated solutions in the React ecosystem. Implementing equivalent solutions in Solid would require either adopting less mature libraries or building custom implementations — both of which increase long-term maintenance burden in ways that are not justified by the performance gains Solid would provide over React 19 in this application context.

*Qwik:* Qwik's resumability model is a fundamentally different architectural approach to SSR — components serialize their state to HTML and resume execution on the client without a hydration step. For a high-traffic public portfolio, this is architecturally attractive. The reason Qwik is not selected is the same as Svelte's SSR coupling problem, but more severe: Qwik's resumability model requires that components be authored in a Qwik-specific idiom from the beginning. It is not an adoption decision; it is a paradigm change. The Public Application would need to be authored differently at a component level from the outset, and the Administration Application cannot benefit from the same model at all. This creates an asymmetric development model that violates the shared-pattern discipline established in FSAS-001 §10.

**Consequences of this decision:**

React 19 requires a JavaScript runtime wherever it renders. For the current CSR delivery model, this is the browser. For the future SSR delivery model, this is a Node.js-compatible server runtime. The SSR migration path therefore introduces a server runtime dependency that does not currently exist. This is a known and accepted consequence, documented in PAUS-001 §13.1.

React's virtual DOM reconciliation introduces some runtime overhead compared to fine-grained reactive frameworks. For the Public Application, where rendering performance is architecturally significant, this overhead is acceptable given React 19's concurrent rendering capabilities and the bundle optimization strategy defined in §6.1. If profiling during implementation reveals that React's reconciliation overhead is a measurable contributor to Core Web Vitals degradation, this decision is a candidate for re-evaluation through the formal ADR process.

*See also: ADRS-001, ADR-001 — Framework Selection.*

---

### 1.2.2 Language: TypeScript 5.x in Strict Mode

**Selected:** TypeScript 5.x, `strict: true`, with additional compiler flags as specified below.

**The requirement this addresses:**

The entity mapper pattern (FSAS-001 §7.2) is the most architecturally critical seam in the frontend system. It is the mechanism through which raw backend responses become application-specific Presentation Models. The defensive transformation policy (FSAS-001 §7.2) requires that entity mappers produce either a safe, null-managed Presentation Model or a structured error — they must never propagate backend inconsistency upward.

Without a type system enforcing this contract at compile time, defensive transformation becomes a runtime discipline — verified only when a production defect surfaces a null propagation. With TypeScript in strict mode, the contract is enforced at every compilation: an entity mapper function that produces a potentially null field in a Presentation Model type that declares that field non-nullable will fail to compile. The compiler enforces the defensive transformation policy.

Beyond the entity mapper, the four-layer dependency model (FSAS-001 §5) and the independence invariant (FSAS-001 §9.1) both benefit from TypeScript's module system. Cross-application imports that violate the independence invariant are catchable at compile time when the type system surfaces module resolution failures. The import boundary enforcement tooling (FTAS-001 §2.2) operates on TypeScript's module graph.

**Compiler configuration:**

The following TypeScript compiler flags are required across all packages in the monorepo:

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "bundler",
    "module": "ESNext",
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx",
    "isolatedModules": true,
    "verbatimModuleSyntax": true
  }
}
```

The rationale for each non-`strict` flag requires explanation:

**`noUncheckedIndexedAccess: true`:** Array indexing in TypeScript by default returns `T`, not `T | undefined`. This is a documented type system inaccuracy — array access can produce `undefined` if the index is out of bounds, but the type system does not reflect this without this flag. For entity mappers that index into backend response arrays, this flag forces explicit handling of the `undefined` case, which is exactly what the defensive transformation policy requires.

**`exactOptionalPropertyTypes: true`:** Without this flag, TypeScript treats `{ field?: string }` and `{ field?: string | undefined }` as interchangeable — assigning `undefined` to an optional property is permitted even when the interface says the property is absent, not undefined. With this flag, absence and `undefined` are distinct. This matters for Presentation Model types: a field declared as absent (`field?: string`) cannot be satisfied by `undefined`. This precision is important for entity mappers that construct Presentation Models from backend data where absent and undefined have different semantic meanings.

**`verbatimModuleSyntax: true`:** Type-only imports must be declared with `import type`. This forces engineers to be explicit about whether an import has a runtime cost, which is directly relevant to the SSR decoupling requirement (FSAS-001 §11). A type-only import from a browser-specific module does not create a runtime dependency — but only if `import type` is used. Without this flag, type imports silently become runtime imports under some module bundling configurations, creating browser-dependency coupling that would block server rendering.

**`moduleResolution: "bundler"`:** This flag uses Vite's module resolution algorithm rather than Node's, which correctly handles the path aliasing and workspace package resolution configured in the monorepo.

**`isolatedModules: true`:** Each file is compiled independently, which is required for Vite's TypeScript transformation (Vite uses esbuild for TypeScript, which operates on a per-file basis). This flag surfaces patterns that work in `tsc` compilation but fail under per-file transformation.

**Alternatives evaluated:**

*Plain JavaScript:* Not evaluated as a serious alternative. The entity mapper pattern, the Presentation Model type system, and the defensive transformation contract are fundamentally typed constructs. Implementing them in JavaScript produces code that is correct by convention rather than by enforcement. At a platform scale where multiple engineers may work on entity mappers for different content entity types, convention-based correctness does not hold. A new entity mapper that forgets to handle a backend null field will compile, run, and fail in production rather than at the developer's workstation.

*TypeScript without strict mode:* Partial strict mode configurations were considered — enabling only `strictNullChecks` while omitting other strict flags. This approach was rejected because the additional flags (`noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`) are specifically required by the entity mapper's defensive transformation contract. A partial configuration would satisfy some of the compiler's enforcement responsibilities but not others. The cost of enabling full strict mode on a greenfield project is near-zero; the discipline of partial strictness is higher because engineers must remember which specific checks are active.

**Consequences of this decision:**

Strict TypeScript requires more careful initial typing of domain entities and Presentation Model interfaces. The first implementation of each entity mapper will require explicit handling of every possible null or undefined field in the backend response. This is not overhead — it is the cost of the defensive transformation policy. The alternative is discovering these cases in production.

`verbatimModuleSyntax` will require periodic attention during code review to ensure that imports from browser-specific modules in the Public Application are type-only where intended. Static analysis configuration (FEOS-001) will include a lint rule to assist with this enforcement.

---

### 1.2.3 JSX Runtime & React Configuration

**Selected:** Automatic JSX runtime (`"jsx": "react-jsx"`)

React 17 introduced the automatic JSX runtime, which eliminates the need for `import React from 'react'` at the top of every JSX file. The automatic runtime injects the JSX transform at compilation. This is selected over the classic runtime for two reasons.

First, it reduces file-level boilerplate in a codebase where the majority of files contain JSX. Second, and more architecturally relevant, it makes the React dependency implicit at the file level — which means that a future migration to a different JSX-compatible runtime (such as the Preact signals runtime, or a hypothetical server-component-compatible runtime) can be executed by changing the JSX runtime configuration without modifying individual source files.

This is a minor decision with a long-term consequence: the Presentation Layer components are not explicitly coupled to the `react` package at the import level. They produce JSX, which is transformed by whatever runtime is configured.

---

## 1.3 Module Bundler & Build Engine Architecture

### 1.3.1 Development Build Server: Vite 6.x

**Selected:** Vite 6.x as the primary build engine and development server.

**The requirement this addresses:**

PAUS-001 §12.1 establishes that performance is a product requirement. This applies not only to the delivered application but to the development workflow. An engineering team that spends significant time waiting for the build server to reflect code changes is less productive and less likely to iterate rapidly on implementation quality. While this is a developer experience concern, developer experience is a legitimate criterion (listed fifth in the technology decision framework, §1.1.2) when architectural criteria are satisfied.

More substantively, the bundle optimization strategy (FTAS-001 §6.1) requires fine-grained control over production code splitting and chunk boundaries. Not all bundlers provide equivalent chunk control. The selected build engine must support explicit chunk splitting configurations that satisfy the bundle budget requirements.

Additionally, FSAS-001 §11 requires that the Public Application's modules remain environment-agnostic. The build engine must support module-level analysis that can detect or enforce this constraint — specifically, the ability to configure SSR-compatible builds for the Public Application when the migration is executed.

**Why Vite 6.x:**

Vite's architecture combines two tools: esbuild for development-time TypeScript and JSX transformation, and Rollup for production bundling. This combination is the specific reason Vite is selected over alternatives.

In development, esbuild performs TypeScript and JSX transformation at near-native speed — measured in tens of milliseconds for individual module transformations. Vite's development server serves modules using native ES Module imports in the browser, meaning that only the modules actually requested are transformed. A change to a single component file causes only that module and its direct importers to be re-evaluated — not the entire application bundle. This architecture produces HMR (Hot Module Replacement) update times that remain fast even as the codebase grows, because the HMR boundary is the changed module, not the application bundle.

This matters specifically for the Administration Application, which will have the most feature complexity and the largest number of form components and state management hooks. In a webpack-based development server, HMR latency tends to grow with application size. Vite's ESM-native approach eliminates this growth characteristic.

In production, Vite uses Rollup as the bundler. Rollup's chunk splitting API — specifically `manualChunks` — provides the precise control over chunk boundaries required by the bundle budget enforcement strategy (FTAS-001 §6.1). Rollup produces clean, tree-shakeable output because it was designed for library bundling before application bundling, which means it applies dead code elimination more aggressively than bundlers designed primarily for application output.

Vite 6.x specifically introduces improved Environment API support, which allows a single Vite configuration to manage multiple rendering environments — browser (for both CSR Admin and Public) and server (for future SSR Public). This directly supports the SSR migration path: when the Public Application migrates to SSR, the Vite configuration gains a server environment target. No build tool changes are required.

**Alternatives evaluated:**

*webpack 5:* webpack 5 is the most widely deployed bundler in the industry and has a mature, well-documented API. It was the dominant choice before Vite became stable, and its federated modules system is unmatched for micro-frontend architectures. For this platform, webpack 5 is not selected for two reasons.

First, webpack's JavaScript-based HMR and rebuild pipeline produces measurably higher rebuild latency than Vite's esbuild-powered approach, particularly for TypeScript-heavy codebases. Given that the Administration Application will have significant TypeScript complexity in its entity mapper and form engine layers, this latency difference is a real developer experience cost.

Second, webpack's chunk splitting configuration — while powerful — is more complex to reason about than Rollup's `manualChunks`. The bundle budget enforcement strategy (FTAS-001 §6.1) requires explicit, auditable chunk boundaries. Rollup's chunk output is more predictable and easier to audit because Rollup was designed for precise output control.

*Turbopack:* Turbopack is Vercel's Rust-based bundler, designed as a Next.js successor to webpack. It offers HMR performance comparable to Vite. The reason Turbopack is not selected is stability and independence. As of the time of writing, Turbopack's standalone API (outside Next.js) is not stable. It is architecturally designed to be the Next.js bundler, and adopting it outside that context introduces coupling to the Next.js ecosystem that could constrain future build tooling decisions. If the Public Application migrates to Next.js as part of the SSR evolution (PAUS-001 §13.1), Turbopack may become available as part of that migration. It is not appropriate as a standalone build tool for the current CSR architecture.

*Parcel:* Parcel's zero-configuration philosophy is ergonomically appealing and is correctly matched to projects where configuration overhead is high relative to output requirements. For this platform, the bundle budget enforcement strategy (FTAS-001 §6.1) requires explicit chunk boundary control that Parcel's zero-configuration model does not provide by design. Parcel optimizes for simplicity; this platform requires control.

*Rsbuild (Rspack):* Rsbuild is a Rust-based webpack-compatible bundler from ByteDance. Its webpack API compatibility means it can replace webpack with minimal configuration changes and substantially faster build times. It is a promising option for projects already invested in webpack configuration. For a greenfield project, starting with Rsbuild's webpack-compatible API rather than Rollup's cleaner chunk model would inherit webpack's complexity without webpack's ecosystem maturity. This decision should be revisited when Rsbuild's API stability and plugin ecosystem matures.

**Vite configuration approach:**

Each application in the monorepo (`apps/admin`, `apps/public`) has its own `vite.config.ts`. A shared base configuration in the root provides common settings — plugin setup, alias resolution, path mapping — that both applications extend. This avoids duplicating build configuration while allowing per-application customization (e.g., the Public Application's build configuration will include SSR preparation flags that the Administration Application does not require).

The production build for both applications targets `ES2022` module output, consistent with the TypeScript compiler target. Modern ES module syntax is assumed for the delivery environment; no IE11 or legacy browser support is provided, consistent with the "evergreen browsers" support boundary defined in PAUS-001 §12.3.

**Consequences of this decision:**

Vite's ESM-native development server requires that all source modules be valid ES modules. CommonJS modules from the `node_modules` dependency graph are pre-bundled by esbuild at startup (Vite's "dependency pre-bundling" step). This pre-bundling adds a one-time startup cost that is negligible in practice but visible on first launch. Subsequent launches use the pre-bundled cache.

The Rollup production bundler and the esbuild development transformer are not identical tools. It is possible — though rare with well-maintained dependencies — for a build to succeed in development and fail in production due to Rollup's stricter tree-shaking behavior. This class of defect is caught by the CI pipeline's production build validation step (FEOS-001).

---

### 1.3.2 Monorepo Task Orchestration: Turborepo

**Selected:** Turborepo as the monorepo task runner and build cache manager.

**The requirement this addresses:**

The dual-application topology (FSAS-001 §4) requires a monorepo containing at least two application packages and at least two shared packages. As the codebase grows — particularly as new content entity feature modules are added per FSAS-001 §10.3 — the number of packages increases. Building, type-checking, and linting all packages on every change is prohibitively slow without a task graph that understands inter-package dependencies and caches unchanged outputs.

**Why Turborepo:**

Turborepo operates on a task graph model. It understands that building `apps/admin` depends on building `packages/shared-foundation`, and it orders tasks accordingly. More importantly, Turborepo caches task outputs — build artifacts, type-check results — keyed by the content hash of the inputs. If `packages/shared-foundation` has not changed, its build output is restored from cache rather than rebuilt, even if `apps/admin` has changed. This means that CI pipelines and local builds only pay for the work that the changes require.

Turborepo's remote caching capability extends this to the team level: a build artifact computed on a developer's machine or in CI is cached in a shared remote cache, meaning a subsequent build by a different developer or a different CI run that has the same inputs will restore from cache rather than recompute. For a monorepo where the Shared Foundation is built as a prerequisite for both applications, this eliminates the most common source of redundant CI computation.

Turborepo is selected over Nx specifically for its pipeline-first design philosophy. Turborepo requires less configuration to get a functioning build pipeline and does not impose a project graph abstraction layer that must be learned alongside the application architecture. The `turbo.json` pipeline configuration is minimal and readable. Nx provides more capabilities — code generation, module federation, custom executors — but those capabilities introduce configuration overhead that is not warranted by the current scope.

**Pipeline definition:**

The Turborepo pipeline defines the following task execution order:

1. `typecheck` — TypeScript compilation check across all packages. Depends on `build` of upstream packages.
2. `build` — Production bundle generation. Depends on `build` of all dependencies.
3. `lint` — ESLint execution. Independent; runs against source files directly.
4. `dev` — Development server startup. Depends on `build` of shared packages in watch mode.

Caching is enabled for `typecheck`, `build`, and `lint`. The `dev` task is excluded from caching — it is a long-running process, not a discrete output.

**Consequences of this decision:**

Turborepo's remote caching requires a configured cache provider. The open-source cache endpoint is `vercel.com`, which may not be acceptable depending on infrastructure constraints. Turborepo's remote cache API is open and can be self-hosted. FEOS-001 documents the cache provider configuration decision.

Turborepo does not enforce package boundaries or module imports — it manages task execution order, not code organization. Import boundary enforcement is handled by separate static analysis tooling (FTAS-001 §2.2), not by Turborepo.

---

### 1.3.3 TypeScript Build Process: Project References

**Selected:** TypeScript Project References for incremental, declaration-emitting builds across the monorepo.

TypeScript Project References allow a TypeScript project to declare dependencies on other TypeScript projects within the same monorepo. When `apps/admin` declares a project reference to `packages/shared-foundation`, TypeScript can type-check `apps/admin` against the compiled declarations of `packages/shared-foundation` without re-type-checking the shared-foundation source. Combined with `incremental: true`, TypeScript saves state between compilations and re-checks only files that have changed.

This is distinct from Vite's development-time transformation. Vite uses esbuild for development-time TypeScript transformation and does not perform type checking — it simply strips types. The production type safety guarantee comes from `tsc` (TypeScript compiler) running as a separate type-check step, either locally (`turbo run typecheck`) or in CI.

The build chain is therefore:

- **Development:** Vite + esbuild (fast, type-stripping transformation) + `tsc --watch --noEmit` (separate background type check)
- **CI:** Turborepo orchestrates `tsc --noEmit` across all packages (full type check), then Vite production build per application

This separation — runtime transformation from type validation — is the standard pattern for Vite-based monorepos and is a direct consequence of esbuild's per-file compilation model.

---

## 1.4 Technology Selection Matrix

This section is the consolidated technology decision register for the entire frontend system. Its purpose is to serve as a single reference point: later sections cite decisions made here rather than re-arguing them. Every technology in this register was selected because it satisfies a specific architectural requirement established in PAUS-001 or FSAS-001. Technologies with no traceable architectural requirement are not in the register because they are not in the codebase.

Detailed rationale for §1.2 and §1.3 selections (React 19, TypeScript, Vite, Turborepo) is not repeated here; this section provides abbreviated reference entries for those decisions and full entries for all remaining decisions.

Technologies are organized into three tiers by their role in the system:

- **Foundational:** Core runtime choices. Changing them would require a partial or full rewrite of the affected application. Selected once, replaced rarely if ever.
- **Supporting:** Libraries implementing specific architectural contracts defined in FSAS-001. Can be replaced by a library that satisfies the same contract without application-level changes, provided the replacement satisfies all the same architectural requirements.
- **Optional tools:** Libraries with a bounded scope that can be added or replaced without architectural consequence.

---

### Summary Reference Table

| # | Role | Selected | Tier | Primary FSAS-001 / PAUS-001 Requirement |
|---|---|---|---|---|
| 1 | UI Framework | React 19 | Foundational | FSAS-001 §5.4, §11; PAUS-001 §13.1 |
| 2 | Language & Type System | TypeScript 5.x strict | Foundational | FSAS-001 §7.2 (entity mapper correctness) |
| 3 | Build Engine & Dev Server | Vite 6.x | Foundational | PAUS-001 §12.1; FSAS-001 §11 (SSR path) |
| 4 | Monorepo Task Orchestration | Turborepo | Foundational | FSAS-001 §4 (dual-application topology) |
| 5 | Package Manager | pnpm | Foundational | FSAS-001 §4 (workspace isolation) |
| 6 | CSS Engine & Token System | CSS Modules + CSS Custom Properties | Foundational | FSAS-001 §4.3; PAUS-001 §10 |
| 7 | Client-Side Router | TanStack Router v1 | Supporting | FSAS-001 §8.2 (URL state ownership) |
| 8 | Server State Engine | TanStack Query v5 | Supporting | FSAS-001 §8.2, §8.3, §8.4, §8.5 |
| 9 | HTTP Transport Client | Axios v1.x | Supporting | FSAS-001 §5.1 (Infrastructure Layer) |
| 10 | Schema Validation Engine | Zod v3 | Supporting | FSAS-001 §7.2 (defensive transformation) |
| 11 | Form State Engine | React Hook Form v7 | Supporting | FSAS-001 §8.2 (form state); §6.4 (validation) |
| 12 | Headless UI Primitives | Radix UI | Supporting | PAUS-001 §11; FSAS-001 §5.4 |
| 13 | HTML Sanitization | DOMPurify | Optional | PAUS-001 §6.1 (XSS protection) |
| 14 | Web Vitals Instrumentation | web-vitals | Optional | PAUS-001 §12.2 (measurable performance) |
| 15 | Date & Duration Formatting | date-fns v3 | Optional | FSAS-001 §7.4 (computed presentation properties) |
| 16 | Animation & Motion | CSS Transitions + View Transitions API | Optional | PAUS-001 §10.2 (micro-animation) |

---

### Foundational Tier

---

**F-1. UI Framework — React 19**
*(Full rationale: §1.2.1)*

- **Architectural requirement:** FSAS-001 §5.4 (environment-agnostic Presentation Layer); FSAS-001 §11 (SSR portability constraint); PAUS-001 §13.1 (SSR migration path must not require a product rewrite).
- **Why selected over alternatives:** The only major framework where SSR is native to the library, not the meta-framework. Svelte requires SvelteKit for SSR; Qwik requires component-level authoring changes. React's server rendering APIs are additive — they are adopted as a delivery mechanism change, not an application architecture change.
- **Key trade-off:** Virtual DOM reconciliation introduces runtime overhead absent in fine-grained reactive frameworks (Solid, Svelte). Accepted because React 19's concurrent rendering capabilities offset this for the Administration Application's interaction patterns, and because the Public Application's bundle budget (§6.1) is managed through code splitting rather than framework selection.
- **Long-term implication:** The SSR migration path leads to React's server rendering model (RSC or streaming SSR). This means the frontend's future server runtime is a Node.js-compatible environment. Infrastructure capacity planning for SSR must account for this.
- **Revisit conditions:** If React's server rendering model is abandoned or superseded by a paradigm that requires framework migration; if a future performance audit of the Public Application identifies virtual DOM reconciliation as a measurable contributor to Core Web Vitals degradation that cannot be resolved through other means.

---

**F-2. Language & Type System — TypeScript 5.x (strict)**
*(Full rationale: §1.2.2)*

- **Architectural requirement:** FSAS-001 §7.2 (entity mapper defensive transformation must be enforced at compile time, not discovered at runtime); FSAS-001 §9.1 (import boundary violations detectable through the type system).
- **Why selected:** The entity mapper pattern is a typed transformation contract. TypeScript enforces it. JavaScript cannot.
- **Key trade-off:** Initial authoring cost for domain entity interfaces and Presentation Model types is higher than equivalent JavaScript. This cost is paid once per entity type; the benefit — compile-time correctness — is paid on every subsequent change.
- **Long-term implication:** As TypeScript's type system evolves, some of the manual defensive transformation patterns (null-coalescing in entity mappers) may become expressible more concisely. The document should be revisited against each major TypeScript release for simplification opportunities.
- **Revisit conditions:** TypeScript is not a candidate for replacement on a planning horizon that is architecturally relevant to this platform.

---

**F-3. Build Engine & Dev Server — Vite 6.x**
*(Full rationale: §1.3.1)*

- **Architectural requirement:** PAUS-001 §12.1 (performance is a product requirement; build tooling must not be a bottleneck); FSAS-001 §11 (SSR path requires the build engine to support server rendering targets).
- **Why selected:** ESM-native dev server eliminates HMR latency growth as codebase scales. Rollup production bundler provides auditable chunk control required by bundle budget enforcement (§6.1). Vite 6's Environment API supports SSR build targets without build tooling replacement.
- **Key trade-off:** Dev server (esbuild) and production bundler (Rollup) are distinct tools. Dev/prod parity must be verified by CI production build validation.
- **Revisit conditions:** If Turbopack stabilizes as a standalone tool with equivalent Rollup-level chunk control; if the platform migrates to Next.js and Next.js's bundler is architecturally preferable for that delivery model.

---

**F-4. Monorepo Task Orchestration — Turborepo**
*(Full rationale: §1.3.2)*

- **Architectural requirement:** FSAS-001 §4 (dual-application topology produces multiple packages that must be built in dependency order with shared caching).
- **Revisit conditions:** If the monorepo's package count grows to a scale where Turborepo's pipeline model is insufficient and Nx's project graph capabilities become necessary; if the remote cache provider constraint becomes unacceptable and a self-hosted alternative is not viable.

---

**F-5. Package Manager — pnpm**

- **Purpose:** Dependency installation, workspace link resolution, and script execution for the monorepo.
- **Selected:** pnpm (current stable)
- **Architectural requirement:** FSAS-001 §4 (workspace-based package isolation). The monorepo structure requires a package manager with native workspace support, strict dependency isolation between packages, and efficient disk usage given that multiple packages share dependencies.
- **Alternatives evaluated:**
  - *npm workspaces:* Native workspace support since npm v7. Adequate for the workspace linking requirement. Rejected for two reasons: npm installs are slower than pnpm due to non-content-addressable storage, and npm's hoisting behavior is more permissive — packages can accidentally resolve transitive dependencies that are not declared in their own `package.json`. This permissive resolution can silently mask missing explicit dependencies, which surface only when the package is published or isolated.
  - *Yarn Berry (v4):* Yarn Berry's Plug'n'Play (PnP) mode eliminates the `node_modules` directory entirely. PnP is architecturally interesting for strict dependency isolation. The reason it is not selected: PnP requires patching some tools to be PnP-aware, and not all tools in the ecosystem are PnP-compatible without explicit configuration. Given that this platform's build pipeline spans Vite, TypeScript project references, and Turborepo, the compatibility surface is wide enough that PnP mode would introduce ongoing maintenance overhead that is not justified by its benefits.
- **Why pnpm wins:** pnpm's content-addressable storage means that a dependency used across multiple packages in the monorepo is stored on disk once and linked. This is particularly valuable in a monorepo where `packages/shared-foundation` dependencies are inherited by both applications. pnpm's strict hoisting policy means that a package can only import dependencies declared in its own `package.json` — phantom dependencies are disallowed. This enforces the explicit dependency declaration discipline required by the package boundary model (FSAS-001 §9.1). pnpm workspaces integrate directly with Turborepo's pipeline model.
- **Key trade-off:** pnpm's strict hoisting occasionally surfaces phantom dependency issues in third-party packages that were authored assuming npm's permissive hoisting. These surface during installation and are resolved by explicit dependency declarations — not a blocking concern, but an occasional maintenance task.
- **Long-term implication:** pnpm's ecosystem integration continues to improve. The strict hoisting model has become the industry standard expectation for well-structured packages.
- **Revisit conditions:** If a dependency critical to the platform proves incompatible with pnpm's strict hoisting in a way that cannot be resolved through configuration; if pnpm's maintenance trajectory changes substantially.

---

**F-6. CSS Engine & Token System — CSS Modules + CSS Custom Properties**

- **Purpose:** Visual styling of all components across both applications; implementation of the design token system defined in FSAS-001 §4.3; support for two distinct application themes (Admin efficiency theme and Public narrative theme) from a single shared token foundation.
- **Selected:** CSS Modules for component-scoped styles; CSS Custom Properties (`var(--token-name)`) for the design token system and dynamic theme switching.
- **Architectural requirement:** FSAS-001 §4.3 (Shared Foundation contains base design tokens; each application expresses its own semantic token layer on top of them); PAUS-001 §10 (two distinct visual identities from a shared foundation); PAUS-001 §13.1 (SSR migration path requires that styling produce no hydration inconsistencies).
- **Alternatives evaluated:**
  - *Tailwind CSS v4:* Utility-first CSS. Rapid to apply, consistent spacing and sizing through design token classes. The reason Tailwind is not selected is architectural: Tailwind's utility classes couple the visual specification to the HTML markup. The semantic gap between a design decision ("this component uses the primary interactive color") and its Tailwind representation (`text-blue-600 hover:text-blue-800`) must be maintained manually and re-applied every time the design decision changes. CSS Custom Properties invert this: the design decision is encoded once in a token (`--color-interactive-primary`), and the token is referenced in the component's CSS. When the design decision changes, the token value changes — the component's CSS does not. For a platform with two distinct semantic color themes (Admin and Public), this inversion is not a preference; it is the architecturally correct mechanism.
  - *CSS-in-JS (Emotion, styled-components):* Runtime CSS generation provides dynamic styling capabilities that CSS Custom Properties also provide, but with JavaScript execution cost in the critical rendering path. For the Public Application, where Core Web Vitals and perceived performance are product requirements (PAUS-001 §12.1), any styling approach that adds JavaScript execution to the first render is architecturally disqualified. Additionally, CSS-in-JS libraries introduce SSR hydration complexity: serialized styles must be injected into the document on the server and reconciled with the client runtime. CSS Custom Properties have no hydration step — they are standard CSS with no client runtime requirement.
  - *Vanilla CSS (without Modules):* Global CSS without scoping is appropriate for reset rules and token definitions. It is not appropriate for component styles, where global scope introduces specificity conflicts as the component library grows. CSS Modules provide file-level scoping with zero runtime cost — class names are transformed to unique identifiers at build time.
  - *CSS-in-JS with zero-runtime extraction (Panda CSS, Vanilla Extract):* Zero-runtime CSS-in-JS libraries generate static CSS at build time, eliminating the runtime JavaScript cost. They are a middle path between Tailwind and traditional CSS. The reason they are not selected is tooling overhead: zero-runtime CSS-in-JS requires a build plugin and a runtime adapter that must be integrated with Vite and the TypeScript project configuration. Given that CSS Modules + CSS Custom Properties provide equivalent output with native Vite support and no additional build tooling, the zero-runtime CSS-in-JS approach adds complexity without adding capability for this platform's requirements.
- **Why the selected approach wins:** CSS Modules provide component-level scoping with zero runtime cost and native Vite support. CSS Custom Properties provide dynamic theming — the Admin and Public applications apply their respective semantic token layers by writing different token values to the same custom property names, switched via a `data-theme` attribute on the root element. The combination requires no additional tooling, produces zero JavaScript overhead for styling, is fully SSR-compatible (custom properties are standard CSS; they do not require JavaScript to hydrate), and naturally expresses the two-tier token model (primitive tokens in the Shared Foundation, semantic tokens per application) established in FSAS-001 §4.3.
- **Key trade-off:** CSS Modules class composition (`composes`) has limitations compared to CSS-in-JS's dynamic style composition. Complex conditional styling requires explicit CSS classes per variant rather than template literals. This cost is manageable for a component library of this platform's scope and is offset by the elimination of styling-related JavaScript runtime cost.
- **Long-term implication:** The CSS `@scope` proposal, when it achieves universal browser support, may eliminate the need for CSS Modules by providing native component-level scoping. At that point, the build tooling overhead of CSS Modules can be removed. This is a simplification opportunity, not a breaking change — the token system and custom properties remain unchanged.
- **Revisit conditions:** If CSS `@scope` achieves the support level required by the platform's browser target, CSS Modules can be replaced with native scoping. This is a tooling change, not an architectural change.

---

### Supporting Tier

---

**S-7. Client-Side Router — TanStack Router v1**

- **Purpose:** Route definition, navigation state management, URL parameter typing, code-split boundary management, and navigation guard implementation for both applications.
- **Selected:** TanStack Router v1 (current stable)
- **Architectural requirement:** FSAS-001 §8.2 establishes that URL/navigation state is a distinct state category whose source of truth is the browser URL. The router owns this category. FSAS-001 §8.2 further specifies that application state deriving from the URL must treat the URL as canonical — implying that search parameters and route parameters must be typed and their values must be directly usable as application state without runtime parsing.
- **Alternatives evaluated:**
  - *React Router v7:* The longest-standing React router. v7 moves toward the Remix data loading model (loaders, actions). The type safety of route params and search params requires additional wrapping with React Router v7 — typed routes are opt-in and require explicit configuration. The Remix-influenced API is opinionated in ways that constrain the Application Layer's data fetching ownership model defined in FSAS-001 §5.3.
  - *Wouter:* A minimalist router with a small bundle size. Insufficient for this platform's requirements: no built-in typed search params, no built-in code splitting integration, no navigation guards.
- **Why TanStack Router wins:** TanStack Router is the only React router that provides first-class TypeScript inference for route parameters and search parameters without additional wrapping. A route defined in TanStack Router carries full type information about its parameters, and a component consuming that route receives fully typed access to its URL state. This directly implements FSAS-001 §8.2's requirement that URL state be canonical and directly usable — search parameters are not strings that the Application Layer must parse and validate; they are typed values that the router manages. TanStack Router's search parameter serialization is configurable — complex state shapes (arrays, objects, enums) can be encoded in the URL and recovered with full type safety. This is essential for the Administration Application's filter and pagination state, which FSAS-001 §8.2 specifies must be encoded in the URL.
- **Key trade-off:** TanStack Router is younger than React Router and has a smaller community. API stability across major versions is less established. The decision to adopt it is based on its unique type-safety capability, not its maturity.
- **Long-term implication:** TanStack Router and TanStack Query share the same organizational backing and design philosophy. They integrate — TanStack Router's loaders can be coordinated with TanStack Query's prefetching. This integration simplifies the read lifecycle (FSAS-001 §8.5) by allowing route transitions to trigger server state prefetch before the destination component mounts.
- **Revisit conditions:** If React Router v7 introduces equivalent first-class TypeScript search parameter inference that eliminates the type safety gap; if the platform migrates to Next.js (which has its own router); if TanStack Router introduces breaking API changes that require significant migration cost.

---

**S-8. Server State Engine — TanStack Query v5**

- **Purpose:** Client-side server state management: caching, background refresh, stale-while-revalidate semantics, mutation dispatch, optimistic update management, and cache invalidation.
- **Selected:** TanStack Query v5 (formerly React Query v5)
- **Architectural requirement:** FSAS-001 §8.2 (server state is a distinct category managed by the Application Layer); FSAS-001 §8.3 (asymmetric caching posture between Admin and Public); FSAS-001 §8.4 (mutation lifecycle with optimistic update constraints); FSAS-001 §8.5 (server state read lifecycle: intent, cache evaluation, retrieval, transformation, distribution, freshness maintenance, background refresh, failure recovery).
- **Alternatives evaluated:**
  - *Redux Toolkit (RTK Query):* A capable server state solution with strong TypeScript support. RTK Query normalizes server state into a central Redux store, which provides a predictable query against cached data by entity ID. The reason RTK Query is not selected is that its normalized store model contradicts FSAS-001 §12.4's explicit rejection of a shared global state store. RTK Query's store is per-application — it is not shared between Admin and Public — so the state independence invariant is not violated. However, the normalized store model introduces a coupling between the cache structure and the data model that is not required by FSAS-001's server state definition. TanStack Query's cache model is simpler: cache entries keyed by query keys, not normalized entity IDs. This simpler model is sufficient for this platform and introduces less cognitive overhead.
  - *SWR:* A focused, minimal library for data fetching with a stale-while-revalidate semantics. SWR handles the read lifecycle well. Its mutation support is significantly less capable than TanStack Query's — specifically, SWR's optimistic update primitives are more limited, and its cache invalidation API is less expressive. Given that FSAS-001 §8.4 requires the mutation lifecycle to be implemented with explicit optimistic update control and explicit cache invalidation, SWR's mutation capabilities are insufficient.
  - *Jotai async atoms / Zustand with async:* Client-side state management libraries extended with async data fetching. These libraries handle local UI state and derived async state elegantly. They are not designed for the server state category's specific concerns: cache lifetime management, background refresh scheduling, and stale-while-revalidate semantics. Using them for server state requires re-implementing the read lifecycle (FSAS-001 §8.5) from scratch.
- **Why TanStack Query v5 wins:** TanStack Query v5 implements the server state read lifecycle (FSAS-001 §8.5) as its core product. Every stage of the lifecycle — cache evaluation, retrieval, distribution, background refresh, failure recovery — maps to a first-class feature of the library. The `staleTime` and `gcTime` configuration parameters implement the asymmetric caching posture between Admin and Public (FSAS-001 §8.3): the Admin `QueryClient` is configured with short `staleTime` values for mutable content; the Public `QueryClient` is configured with long `staleTime` values for published content. The mutation API's `onMutate`, `onError`, and `onSettled` callbacks implement the optimistic update lifecycle and rollback mechanism (FSAS-001 §8.4). The `invalidateQueries` API implements post-mutation cache invalidation. Each of these is a direct implementation of an architectural requirement, not a library feature adopted because it is convenient.
- **Key trade-off:** TanStack Query manages server state in a client-side cache that is scoped to the `QueryClient` instance. When the Public Application migrates to SSR, the server-side data fetching will likely bypass the client-side cache and use server-native data loading. The client-side cache will be used for client-navigations after the initial page load. TanStack Query v5 supports this hybrid model via its dehydration/hydration API, but it requires deliberate configuration at the SSR migration stage.
- **Long-term implication:** React's `cache()` API and Server Components model may, over time, subsume some of TanStack Query's responsibilities — specifically, the initial server state fetch on page load. The Application Layer's data fetching orchestration will need to be re-evaluated at the SSR migration to determine which responsibilities remain with TanStack Query and which move to the server rendering infrastructure.
- **Revisit conditions:** At the SSR migration, the division of responsibilities between TanStack Query and server-side data loading must be explicitly decided. TanStack Query may become responsible only for client-navigation cache management, with initial page data supplied by server-side fetching. This is a configuration change, not a replacement.

---

**S-9. HTTP Transport Client — Axios v1.x**

- **Purpose:** Implementation of the Infrastructure Layer's single HTTP transport mechanism (FSAS-001 §5.1): constructing and dispatching requests, injecting authentication credentials, normalizing transport-level responses, and classifying communication failures into the normalized error taxonomy (FSAS-001 §8.6).
- **Selected:** Axios v1.x
- **Architectural requirement:** FSAS-001 §5.1 (the Infrastructure Layer handles all communication with the backend API, injects authentication credentials, and normalizes errors); FSAS-001 §8.6 (the Infrastructure Layer classifies failures into a normalized error taxonomy before passing them upward).
- **Alternatives evaluated:**
  - *Native Fetch API with a custom wrapper:* The Fetch API is the browser standard and has no bundle cost. A custom wrapper can implement interceptors, automatic JSON parsing, and error normalization. The reason a custom wrapper is not selected over Axios is development cost and maintenance burden: implementing a production-quality interceptor system — with request queuing during token refresh, retry logic with backoff, and request cancellation on component unmount — is a non-trivial engineering effort. Axios provides this infrastructure as a maintained, tested library. The bundle size cost of Axios (approximately 14KB gzipped) is acceptable relative to the development cost of building an equivalent from scratch.
  - *ky:* A modern, lightweight Fetch wrapper (~3KB) with an interceptor-like API using Fetch's own hooks. A valid alternative with lower bundle cost. Ky is not selected primarily because its interceptor model is less expressive than Axios's for the token refresh queue scenario: when an authenticated request receives a 401, the Infrastructure Layer must suspend in-flight requests, perform a token refresh, and then replay the suspended requests. Axios's interceptor queue model handles this pattern naturally. Implementing the same pattern with ky requires more custom code.
  - *ofetch (Nuxt's fetch wrapper):* A universal fetch wrapper designed to work in browser and server environments. Architecturally interesting for the SSR migration path. Not selected because it is less established in the React ecosystem and its API is optimized for Nuxt/Vue patterns.
- **Why Axios wins:** Axios's interceptor API provides the two Infrastructure Layer capabilities that require the most coordination: request credential injection (a request interceptor adds the Bearer token to authenticated requests) and the 401 refresh retry queue (a response interceptor intercepts 401 responses, queues the failed request, executes the token refresh, and replays queued requests with the new token). Both patterns are well-documented and widely implemented with Axios. The `AbortController` integration provides request cancellation when components unmount, preventing state updates on unmounted components. Axios automatically parses JSON responses and provides typed response generics, reducing boilerplate in Infrastructure Layer adapter functions.
- **Key trade-off:** Axios uses XMLHttpRequest internally in browser environments and has its own HTTP adapter for Node.js. If the platform migrates to server-side rendering, the Axios configuration for server-side requests (no browser cookie context, different base URL) must be maintained separately from the browser-context configuration. The Infrastructure Layer's SSR-compatible configuration strategy is defined in FTAS-001 §7.1.
- **Long-term implication:** The Fetch API's capabilities continue to expand. A future browser specification may standardize interceptor-level APIs that eliminate Axios's advantage in this area. At that point, migration to a fetch-based approach becomes lower-cost. This is a future simplification opportunity, not a current concern.
- **Revisit conditions:** At the SSR migration stage, the Infrastructure Layer's HTTP transport must be evaluated for server-compatibility. If the chosen SSR framework provides a server-compatible fetch API that replaces the need for Axios in the server context, the Infrastructure Layer may use different transports per environment.

---

**S-10. Schema Validation Engine — Zod v3**

- **Purpose:** Runtime schema validation of backend responses; TypeScript type inference from schema definitions; entity mapper defensive transformation implementation; environment variable schema validation; form validation schema definitions shared with React Hook Form.
- **Selected:** Zod v3 (current stable)
- **Architectural requirement:** FSAS-001 §7.2 (entity mapper defensive transformation: the entity mapper must produce either a safe Presentation Model or a structured error — not propagate backend inconsistency upward). Runtime validation of the backend response is the mechanism that implements this guarantee.
- **Alternatives evaluated:**
  - *Yup:* An established schema validation library. Weaker TypeScript inference than Zod — Yup schema types must be explicitly declared in TypeScript rather than being inferred from the schema definition. For a platform where the entity mapper's output type is derived from the Presentation Model interface, having the schema and the TypeScript type be separate declarations introduces drift risk — the schema can diverge from the TypeScript type without a compile error.
  - *Valibot:* A newer validation library with a smaller bundle size than Zod (Valibot's tree-shakeable design achieves significantly smaller bundle footprint for simple schemas). Valibot is architecturally sound for this use case. It is not selected over Zod at this time because its ecosystem integration depth — specifically, the `@hookform/resolvers/valibot` package and the broader React ecosystem's familiarity with its API — is less established than Zod's. The bundle size difference, while real, is not a deciding factor for a library used in Infrastructure and Domain Layers that are not in the critical rendering path.
  - *io-ts:* A functional validation library built on TypeScript's type system. io-ts is architecturally elegant — codecs compose purely and validation is entirely type-safe. It is not selected because its API requires familiarity with functional programming concepts (functors, monads) that are not universally shared on frontend teams. The cognitive overhead of io-ts is not justified when Zod provides equivalent guarantees with a more accessible API.
- **Why Zod wins:** Zod's schema definitions are the source of truth for TypeScript types. `z.infer<typeof ProjectSchema>` produces the TypeScript type that matches the schema. This single-source model eliminates the drift risk between runtime validation and compile-time types. For the entity mapper, this means the mapper's input type (the validated backend response) is automatically correct by construction — if the schema changes, the TypeScript type changes, and the mapper function fails to compile if it no longer handles the new shape. This is the compile-time enforcement of the defensive transformation policy.
- **Key trade-off:** Zod's bundle size is approximately 12KB gzipped for the full library. This is acceptable in Infrastructure and Domain Layer modules that are not in the initial render bundle. If Zod is accidentally pulled into the critical rendering path — for example, by importing it in a component that is in the initial bundle — the bundle budget (§6.1) may be affected. Import discipline is enforced by the module boundary rules (§2.2).
- **Long-term implication:** Valibot's adoption trajectory is strong. If Valibot achieves equivalent ecosystem integration depth and the bundle size difference becomes a meaningful factor (for example, if a future requirement places schema validation in the critical path), Zod should be re-evaluated against Valibot at that point.
- **Revisit conditions:** If Valibot achieves equivalent `@hookform/resolvers` integration and ecosystem maturity; if TypeScript introduces native schema inference capabilities that reduce the need for a runtime schema library.

---

**S-11. Form State Engine — React Hook Form v7**

- **Purpose:** Form state management in the Administration Application: field registration, value tracking, validation trigger orchestration, submission handling, and dirty state tracking for unsaved changes protection.
- **Selected:** React Hook Form v7 (RHF)
- **Architectural requirement:** FSAS-001 §8.2 (form state is a distinct category: created when a form is initialized, updated as the user inputs, validated before submission, released after completion); FSAS-001 §6.4 (form-level validation is a Presentation and Application Layer concern; Domain Layer validation is the gate before mutation dispatch).
- **Alternatives evaluated:**
  - *Formik:* The historically dominant React form library. The reason Formik is not selected is performance: Formik re-renders the entire form tree on every keystroke by default. The Administration Application's content editing forms — which will include rich text fields, media pickers, and dynamic field arrays for items like project technologies — may contain tens of fields. Formik's re-render behavior at that scale produces perceptible input latency, which violates the Administration Application's Efficiency Contract (PAUS-001 §9.2).
  - *TanStack Form:* The TanStack organization's form library, designed with the same type-first philosophy as TanStack Query and TanStack Router. TanStack Form is architecturally well-matched to this platform. It is not selected at this time because it is newer and its ecosystem integration — particularly with Zod resolvers and documentation for complex multi-step form patterns — is less established than RHF's. This decision should be revisited when TanStack Form's ecosystem matures.
- **Why React Hook Form wins:** RHF uses an uncontrolled input model — form values are tracked by the DOM's native value references rather than by React state. This means that typing in a form field does not trigger a React re-render for the entire form tree; only the field's own validation state changes cause selective re-renders. For the Administration Application's complex content editing forms, this model produces significantly better input performance than controlled forms. RHF's integration with Zod via `@hookform/resolvers/zod` directly implements the two-layer validation model established in FSAS-001 §6.4: the Zod schema enforces domain-level correctness (field format, required fields, content constraints), and RHF manages the timing and presentation of validation feedback. The `formState.isDirty` property directly implements the unsaved changes detection required for navigation blocking on unsaved edits.
- **Key trade-off:** RHF's uncontrolled model occasionally requires explicit value retrieval via `watch()` when one field's value must influence another field's validation. This is a common pattern in the Administration Application's forms (e.g., an end-date field that cannot precede a start-date field). The `watch()` API re-renders on value change for the watched fields, which is a controlled performance trade-off.
- **Revisit conditions:** If TanStack Form achieves equivalent ecosystem maturity and provides a meaningfully better TypeScript experience; if a future form requirement cannot be expressed within RHF's uncontrolled model.

---

**S-12. Headless UI Primitives — Radix UI**

- **Purpose:** ARIA-compliant, unstyled, accessible UI primitive components for complex interaction patterns: dialogs, dropdowns, tooltips, select menus, navigation menus, switches, and scroll areas.
- **Selected:** Radix UI (current stable)
- **Architectural requirement:** PAUS-001 §11.1 (all critical user flows must be keyboard-operable; accessibility is a design requirement, not an afterthought); FSAS-001 §5.4 (Presentation Layer must be independently styleable without functional change).
- **Alternatives evaluated:**
  - *Headless UI (Tailwind Labs):* An accessible headless component library. It is not selected because it is developed alongside Tailwind CSS and its API design reflects that relationship. It does not impose Tailwind, but its documentation, examples, and community resources assume Tailwind. Given that this platform uses CSS Modules, adopting Headless UI would be working against its design intent.
  - *ARIA Kit (Ariakit):* A comprehensive, composable headless component library with excellent accessibility. A strong alternative to Radix UI. Not selected over Radix primarily because Radix's API is somewhat simpler for the component patterns this platform requires, and its documentation is more comprehensive for the specific primitives needed.
  - *Floating UI:* A low-level positioning library for floating elements (tooltips, dropdowns). Floating UI is a dependency of Radix UI internally. Using it directly would require building the full accessible interaction model — focus trapping, keyboard navigation, screen reader announcements — from primitives. This is a significant implementation investment that Radix UI eliminates.
  - *Native browser elements (`<dialog>`, `<details>`, `<select>`):* Native HTML elements are progressing. The `<dialog>` element is now well-supported and accessible. The reason native elements are not used exclusively: `<select>` remains impossible to style consistently across platforms; custom dropdown menus with search and multi-select require custom implementations; the `popover` API is still maturing. Radix UI is adopted as the foundation; as native elements mature, specific Radix primitives can be replaced with native equivalents incrementally.
- **Why Radix UI wins:** Radix UI's components are fully accessible out of the box — ARIA attributes, keyboard navigation, focus management, and screen reader support are implemented by the library and cannot be accidentally omitted. The styling model is explicitly unstyled: Radix renders DOM elements with ARIA attributes and behavioral logic, and the visual presentation is applied entirely through CSS. This maps directly to the CSS Modules + CSS Custom Properties styling engine (F-6) — Radix primitives are styled using the same `.module.css` files as any other component. The accessibility compliance requirement (PAUS-001 §11.1) is satisfied by construction, not by vigilance.
- **Key trade-off:** Adopting Radix UI introduces a dependency on a specific set of component APIs. If a Radix component's API changes in a major version, the affected UI components must be updated. This cost is bounded — Radix's API surface for each primitive is small.
- **Long-term implication:** As native browser elements mature, specific Radix primitives will become replaceable. This is an ongoing opportunity to reduce dependency surface without capability regression.
- **Revisit conditions:** When native `<dialog>`, `<select>`, and popover APIs achieve sufficient accessibility and cross-browser consistency for all patterns currently covered by Radix. This is a gradual replacement, not a wholesale decision.

---

### Optional Tools Tier

---

**O-13. HTML Sanitization — DOMPurify**

- **Purpose:** Sanitization of any HTML content originating from the backend before it is rendered via `innerHTML` or equivalent mechanisms in the Public Application's rich text display.
- **Selected:** DOMPurify (current stable)
- **Architectural requirement:** PAUS-001 §6.1 (XSS protection); FSAS-001 §11 (professional content originates from the backend — the entity mapper produces content that is rendered, and any rich text fields must be sanitized before DOM insertion).
- **Why selected:** DOMPurify is the industry-standard DOM sanitization library with an extensive security audit history. It removes malicious scripts while preserving safe HTML formatting. It operates on DOM APIs and is environment-specific — it requires a browser or JSDOM context, which is acceptable since sanitization occurs at render time in the Presentation Layer.
- **Key trade-off:** DOMPurify is a browser-only library. For the SSR migration, server-side sanitization must be performed using a Node.js-compatible sanitizer. This is a known consequence of the SSR migration and is addressed in §7.1.
- **Revisit conditions:** If the Sanitizer API achieves universal browser support, DOMPurify can be replaced with the native implementation.

---

**O-14. Web Vitals Instrumentation — web-vitals**

- **Purpose:** In-browser measurement of Core Web Vitals (LCP, INP, CLS) and reporting to a telemetry endpoint for real-user monitoring.
- **Selected:** web-vitals (Google Chrome team, current stable)
- **Architectural requirement:** PAUS-001 §12.2 (performance targets must be measurable; improvement must be demonstrable).
- **Why selected:** `web-vitals` is the reference implementation for Web Vitals measurement, maintained by the Chrome team. It uses `PerformanceObserver` APIs to measure real render and interaction timing in production. The library is small (~2KB) and tree-shakeable. No alternative provides more authoritative measurements.
- **Revisit conditions:** If the browser's `PerformanceObserver` API stabilizes to the point where the abstraction library is no longer necessary.

---

**O-15. Date & Duration Formatting — date-fns v3**

- **Purpose:** Formatting raw date strings and timestamps from the backend into human-readable display values within entity mappers.
- **Selected:** date-fns v3
- **Architectural requirement:** FSAS-001 §7.4 (computed properties in Presentation Models: experience entry start/end dates become a formatted duration string in the entity mapper).
- **Why selected:** date-fns is fully tree-shakeable — only the formatting functions used are included in the bundle. It is immutable and timezone-aware. Its API is functional and composes naturally within entity mapper functions.
- **Key trade-off:** The Temporal API (TC39 Stage 3) will, when it achieves browser support, provide equivalent native date formatting capabilities. date-fns may be replaceable at that point.
- **Revisit conditions:** When the Temporal API achieves the browser support level required by this platform's target environment.

---

**O-16. Animation & Motion — CSS Transitions + View Transitions API**

- **Purpose:** Component-level micro-animations (hover states, panel entrances, state transitions) and page-level transition animations on the Public Application.
- **Selected:** CSS Transitions and CSS Animations (component level); View Transitions API (page level, progressively enhanced).
- **Architectural requirement:** PAUS-001 §10.2 (micro-animations for interactive elements; visual transitions between states); PAUS-001 §12.1 (animation must not contribute to layout instability or Interaction to Next Paint degradation).
- **Why no JavaScript animation library is selected:** JavaScript animation libraries (Framer Motion, GSAP, Motion One) execute animation logic in the JavaScript thread. If the JavaScript thread is busy — which it can be during React rendering or Application Layer state updates — JS-thread animations will stutter. CSS Transitions and Animations execute on the browser's compositor thread and are immune to JavaScript thread congestion. For a platform where Interaction to Next Paint is a product requirement (PAUS-001 §12.2), compositor-thread animation is the correct default.
- **Key trade-off:** CSS animation has limitations for gesture-driven animations (swipe interactions, drag-to-dismiss) that require JavaScript-coordinated physics. If such interactions are introduced in future iterations, a JavaScript animation library should be evaluated at that time.
- **Revisit conditions:** If a design requirement emerges for gesture-driven, physics-based, or sequence-orchestrated animations that CSS cannot express; evaluate Framer Motion or Motion One at that point as a targeted addition for the specific components requiring it.

---

### 1.4.1 Technology Governance

Every technology in the stack exists because it satisfies a specific architectural requirement defined in PAUS-001 or FSAS-001. This is not an incidental relationship — it is the governing policy for all future technology additions.

**The governing rule is:**

> A technology may be introduced into the frontend codebase only if it satisfies an architectural requirement that is already documented, cannot be satisfied by a technology already in the stack, and is the best-fit solution among the available options evaluated against the criteria in §1.1.2.

This rule has three practical consequences:

**No adoption by popularity.** A library being widely used in the industry is evidence of its quality, not a justification for adoption. A widely used library that does not satisfy a documented architectural requirement is not a candidate.

**No adoption by convenience.** A library that reduces boilerplate in a specific feature module is a candidate only if the boilerplate reduction serves an architectural goal (developer experience is criterion 5, not criterion 1). The test is whether the boilerplate being eliminated represents a real architectural concern or merely local repetition that should be abstracted within the existing stack.

**No adoption by preference.** An individual engineer's familiarity with a library is not an architectural requirement. The technology decision framework in §1.1.2 applies to all additions, regardless of the proposer's experience with the library.

**The exception process:** If a genuine architectural requirement emerges that the current stack cannot satisfy, the requirement must be documented — either as an addition to FSAS-001 (if it is a logical architectural concern) or as an addition to this document (if it is a technical implementation concern) — before a new technology is evaluated. The technology evaluation then proceeds against the documented requirement using the criteria in §1.1.2. The decision is recorded in ADRS-001.

This process is not bureaucratic overhead. It is the mechanism that prevents the codebase from accumulating dependencies that add complexity without adding capability.

---

*— End of Part I: Technical Foundation (Sections 1.1 — 1.4) —*

*Part I is now complete. Section 1.4 serves as the consolidated technology decision register for the entire frontend system. Subsequent sections reference this register rather than re-arguing technology decisions. Part II (Application Structure & Topology) will follow upon approval.*
