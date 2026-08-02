/*
 * Mock Projects Dataset
 *
 * Provides initial realistic mock data adhering to the Project presentation model.
 * Will be replaced by Application Layer TanStack Query hooks once API integration is added.
 */

import type { Project } from '@/domain/projects'

export const mockProjects: Project[] = [
  {
    id: 'proj-1',
    title: 'Professional Identity Platform',
    slug: 'professional-identity-platform',
    headline: 'Full-Stack Portfolio System',
    shortDescription: 'Dual-experience web platform built with React 19, Spring Boot, and PostgreSQL.',
    description:
      'Dual-experience web platform built with React 19, TypeScript strict mode, CSS Custom Properties, and TanStack Router.',
    technologies: ['React 19', 'TypeScript', 'Vite', 'TanStack Router'],
    githubUrl: 'https://github.com/example/identity-platform',
    featured: true,
    published: true,
    status: 'COMPLETED',
  },
  {
    id: 'proj-2',
    title: 'Zero-Runtime Design Tokens Engine',
    slug: 'design-tokens-engine',
    headline: 'Semantic CSS Custom Property Layer',
    shortDescription: 'Centralized CSS Custom Property design system architecture supporting semantic theme layers.',
    description:
      'Centralized CSS Custom Property design system architecture supporting semantic theme layers without JavaScript runtime cost.',
    technologies: ['CSS Modules', 'CSS Custom Properties', 'Design Tokens'],
    githubUrl: 'https://github.com/example/design-tokens-engine',
    featured: true,
    published: true,
    status: 'COMPLETED',
  },
  {
    id: 'proj-3',
    title: 'Typed Form Infrastructure',
    slug: 'typed-form-infrastructure',
    headline: 'Accessible Form Primitives',
    shortDescription: 'Uncontrolled form field primitives with accessibility bindings.',
    description:
      'Uncontrolled form field primitives with accessibility bindings and compile-time schema validation integration.',
    technologies: ['TypeScript', 'Accessibility', 'Form Architecture'],
    githubUrl: 'https://github.com/example/typed-forms',
    featured: false,
    published: true,
    status: 'COMPLETED',
  },
]
