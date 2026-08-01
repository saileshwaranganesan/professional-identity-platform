/*
 * Project Model Interface
 *
 * Defines the Presentation Model for project items (FSAS-001 §7.1).
 */

export interface Project {
  id: string
  title: string
  description: string
  technologies: string[]
  githubUrl?: string
  liveUrl?: string
  featured?: boolean
}
