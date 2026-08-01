/*
 * Mock Skills Dataset
 *
 * Provides initial realistic mock data adhering to the Skill presentation model.
 * Will be replaced by Application Layer TanStack Query hooks once API integration is added.
 */

import type { Skill } from '../types/skill'

export const mockSkills: Skill[] = [
  { id: 'skill-1', name: 'Java', category: 'Backend', proficiency: 'Expert', featured: true },
  { id: 'skill-2', name: 'Spring Boot', category: 'Backend', proficiency: 'Expert', featured: true },
  { id: 'skill-3', name: 'React 19', category: 'Frontend', proficiency: 'Expert', featured: true },
  { id: 'skill-4', name: 'TypeScript', category: 'Frontend', proficiency: 'Expert', featured: true },
  { id: 'skill-5', name: 'PostgreSQL', category: 'Database', proficiency: 'Advanced', featured: true },
  { id: 'skill-6', name: 'SQL', category: 'Database', proficiency: 'Advanced', featured: true },
  { id: 'skill-7', name: 'Git', category: 'DevOps & Tools', proficiency: 'Expert', featured: true },
  { id: 'skill-8', name: 'Docker', category: 'DevOps & Tools', proficiency: 'Advanced', featured: true },
  { id: 'skill-9', name: 'REST APIs', category: 'Backend', proficiency: 'Expert', featured: true },
]
