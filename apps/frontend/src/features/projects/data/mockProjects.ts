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
    technologies: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
    githubUrl: 'https://github.com/example/portfolio',
    featured: true,
    published: true,
    status: 'COMPLETED',
    highlights: [],
    blocks: [],
    role: 'Lead Developer',
    duration: '6 Months',
    teamSize: 1,
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
    highlights: [],
    blocks: [],
    role: 'UI Engineer',
    duration: '3 Months',
    teamSize: 2,
  },
  {
    id: 'proj-3',
    title: 'Typed Form Infrastructure',
    slug: 'typed-form-infrastructure',
    headline: 'Accessible Form Primitives',
    shortDescription: 'Uncontrolled form field primitives with accessibility bindings.',
    description:
      'Uncontrolled form field primitives with accessibility bindings and compile-time schema validation integration.',
    technologies: ['Next.js', 'Stripe', 'Tailwind CSS', 'Supabase'],
    githubUrl: 'https://github.com/example/ecommerce',
    featured: false,
    published: true,
    status: 'COMPLETED',
    highlights: [],
    blocks: [],
    role: 'Frontend Architect',
    duration: '4 Months',
    teamSize: 3,
  },
]
