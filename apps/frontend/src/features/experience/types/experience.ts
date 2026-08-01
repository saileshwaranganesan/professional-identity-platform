/*
 * Experience Model Interface
 *
 * Defines the Presentation Model for professional experience entries (FSAS-001 §7.1).
 */

export interface Experience {
  id: string
  role: string
  company: string
  location?: string
  startDate: string
  endDate?: string
  description: string
  technologies?: string[]
}
