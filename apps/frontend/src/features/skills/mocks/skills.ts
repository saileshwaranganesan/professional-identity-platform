/*
 * Mock Skills Dataset
 *
 * Provides initial realistic mock data adhering to the Skill domain model.
 */

import type { Skill } from '@/domain/skills'

export const mockSkills: Skill[] = [
  { id: 'skill-1', name: 'Java', category: 'Backend', level: 'EXPERT', displayOrder: 1 },
  { id: 'skill-2', name: 'Spring Boot', category: 'Backend', level: 'EXPERT', displayOrder: 2 },
  { id: 'skill-3', name: 'React 19', category: 'Frontend', level: 'EXPERT', displayOrder: 3 },
  { id: 'skill-4', name: 'TypeScript', category: 'Frontend', level: 'EXPERT', displayOrder: 4 },
  { id: 'skill-5', name: 'PostgreSQL', category: 'Database', level: 'ADVANCED', displayOrder: 5 },
  { id: 'skill-6', name: 'SQL', category: 'Database', level: 'ADVANCED', displayOrder: 6 },
  { id: 'skill-7', name: 'Git', category: 'DevOps & Tools', level: 'EXPERT', displayOrder: 7 },
  { id: 'skill-8', name: 'Docker', category: 'DevOps & Tools', level: 'ADVANCED', displayOrder: 8 },
  { id: 'skill-9', name: 'REST APIs', category: 'Backend', level: 'EXPERT', displayOrder: 9 },
]