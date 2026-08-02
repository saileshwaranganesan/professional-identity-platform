/*
 * Mock Experience Dataset
 *
 * Provides realistic mock data conforming to the domain Experience model (FSAS-001 §5.2).
 * Used for development/storybook until TanStack Query hooks fetch real backend data.
 */

import type { Experience } from '@/domain/experience'

export const mockExperiences: Experience[] = [
  {
    id: 'exp-1',
    company: 'Tech Identity Solutions',
    position: 'Staff Frontend Engineer',
    employmentType: 'FULL_TIME',
    employmentStatus: 'CURRENT',
    location: 'Remote',
    startDate: '2023-01-01',
    currentlyWorking: true,
    description:
      'Leading client application architecture, design token foundations, and strict TypeScript engineering standards across monorepo packages.',
    technologies: ['React 19', 'TypeScript', 'TanStack Router', 'CSS Modules'],
    displayOrder: 0,
  },
  {
    id: 'exp-2',
    company: 'Enterprise Systems Inc.',
    position: 'Senior Frontend Engineer',
    employmentType: 'FULL_TIME',
    employmentStatus: 'PREVIOUS',
    location: 'San Francisco, CA',
    startDate: '2021-06-01',
    endDate: '2022-12-31',
    currentlyWorking: false,
    description:
      'Architected reusable component libraries, automated CI/CD static analysis pipelines, and optimized Core Web Vitals for high-traffic customer portals.',
    technologies: ['React', 'TypeScript', 'Vite', 'Design Systems'],
    displayOrder: 1,
  },
]
