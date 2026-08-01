/*
 * Skill Model Interface
 *
 * Defines the Presentation Model for technical skill entries (FSAS-001 §7.1).
 */

export interface Skill {
  id: string
  name: string
  category: 'Frontend' | 'Backend' | 'Database' | 'DevOps & Tools'
  proficiency?: 'Expert' | 'Advanced' | 'Proficient'
  featured?: boolean
}
