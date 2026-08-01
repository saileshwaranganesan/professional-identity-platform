/*
 * ContactInfo Model Interface
 *
 * Defines the Presentation Model for portfolio contact information (FSAS-001 §7.1).
 */

export interface ContactInfo {
  email: string
  phone?: string
  location: string
  linkedInUrl?: string
  githubUrl?: string
}
