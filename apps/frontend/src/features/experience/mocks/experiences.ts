/*
 * Mock Experience Dataset
 *
 * Provides initial realistic mock data adhering to the Experience presentation model.
 * Will be replaced by Application Layer TanStack Query hooks once API integration is added.
 */

import type { Experience } from '../types/experience'

export const mockExperiences: Experience[] = [
  {
    id: 'exp-1',
    role: 'Staff Frontend Engineer',
    company: 'Tech Identity Solutions',
    location: 'Remote',
    startDate: '2023 - Present',
    description:
      'Leading client application architecture, design token foundations, and strict TypeScript engineering standards across monorepo packages.',
    technologies: ['React 19', 'TypeScript', 'TanStack Router', 'CSS Modules'],
  },
  {
    id: 'exp-2',
    role: 'Senior Frontend Engineer',
    company: 'Enterprise Systems Inc.',
    location: 'San Francisco, CA',
    startDate: '2021',
    endDate: '2023',
    description:
      'Architected reusable component libraries, automated CI/CD static analysis pipelines, and optimized Core Web Vitals for high-traffic customer portals.',
    technologies: ['React', 'TypeScript', 'Vite', 'Design Systems'],
  },
]
