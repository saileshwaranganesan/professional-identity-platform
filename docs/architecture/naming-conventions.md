# Naming Conventions

| Area | Convention | Examples |
| --- | --- | --- |
| Package | Lowercase, feature/layer-oriented dot notation | `com.professionalidentity.backend.profile`, `...profile.service` |
| Class | PascalCase, singular nouns | `Profile`, `ProfileService`, `ProfileController` |
| Method | lowerCamelCase verb phrase | `createProfile`, `findPublishedProjects` |
| Variable | lowerCamelCase, descriptive noun | `profileId`, `publishedProjects` |
| Table | lowercase snake_case, singular | `user`, `profile`, `social_link` |
| Column | lowercase snake_case | `profile_id`, `created_at`, `display_order` |
| REST endpoint | plural, lowercase kebab-case resource paths | `/api/v1/projects`, `/api/v1/social-links` |
| Repository | Entity name plus `Repository` | `ProjectRepository` |
| Service | Entity/use-case name plus `Service` | `CertificationService` |
| DTO | Resource plus intent suffix | `ProfileResponse`, `CreateProjectRequest` |
| Exception | Specific cause plus `Exception` | `ResourceNotFoundException`, `InvalidProfileStateException` |
| Controller | Resource plus `Controller` | `ExperienceController` |
| Response | `ApiResponse<T>` wrapper; resource response is descriptive | `ApiResponse<ProjectResponse>`, `ApiError` |

Additional rules:

- Java booleans begin with `is`, `has`, or `can` where they describe state, for example `isPublished`.
- IDs use the `<aggregate>Id` form, for example `profileId`; do not use ambiguous `id` outside a narrow local scope.
- Repository methods describe the query intent, for example `findByProfileId`, not implementation details.
- REST paths use nouns, not verbs. Use HTTP methods to express actions; a future state transition needs an explicitly approved endpoint design.
- Database foreign-key columns match the referenced entity name plus `_id`.
- Acronyms follow normal Java casing: `Uuid` in ordinary names, but use the standard type `UUID` where applicable.
