/*
 * Query Key Factory
 *
 * Provides centralized strongly-typed query keys to eliminate hardcoded strings (FSAS-001 §5.3).
 */

export const queryKeys = {
  projects: {
    all: ['projects'] as const,
    featured: ['projects', 'featured'] as const,
    detail: (id: string) => ['projects', id] as const,
  },
  experience: {
    all: ['experience'] as const,
  },
  skills: {
    all: ['skills'] as const,
  },
  education: {
    all: ['education'] as const,
  },
  contact: {
    all: ['contact'] as const,
  },
}
