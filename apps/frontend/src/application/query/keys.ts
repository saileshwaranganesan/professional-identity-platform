/*
 * Query Key Factory
 *
 * Provides centralized strongly-typed query keys to eliminate hardcoded strings (FSAS-001 §5.3).
 */

export const queryKeys = {
  auth: {
    me: ['auth', 'me'] as const,
  },
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
  messages: {
    all: ['messages'] as const,
    detail: (id: string) => ['messages', id] as const,
  },
  profile: {
    me: ['profile', 'me'] as const,
  },
  certifications: {
    all: ['certifications'] as const,
    detail: (id: string) => ['certifications', id] as const,
  },
  achievements: {
    all: ['achievements'] as const,
    detail: (id: string) => ['achievements', id] as const,
  },
  socialLinks: {
    all: ['socialLinks'] as const,
    detail: (id: string) => ['socialLinks', id] as const,
  },
  portfolio: {
    byUsername: (username: string) => ['portfolio', username] as const,
  },
}