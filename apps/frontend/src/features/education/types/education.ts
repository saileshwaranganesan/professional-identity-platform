/*
 * Education Model Interface
 *
 * Defines the Presentation Model for education entries (FSAS-001 §7.1).
 */

export interface Education {
  id: string
  degree: string
  institution: string
  location?: string
  duration: string
  cgpa?: string
  coursework?: string[]
  achievements?: string[]
}
