/*
 * Portfolio Domain Types
 *
 * Strongly typed interface for the aggregated public portfolio.
 */

import type { Achievement } from '../achievements'
import type { Certification } from '../certifications'
import type { Education } from '../education'
import type { Experience } from '../experience'
import type { Profile } from '../profile'
import type { ProjectSummary } from '../projects'
import type { Skill } from '../skills'
import type { SocialLink } from '../socialLinks'

export interface PortfolioData {
  profile: Profile
  projects: ProjectSummary[]
  experiences: Experience[]
  educations: Education[]
  skills: Skill[]
  certifications: Certification[]
  achievements: Achievement[]
  socialLinks: SocialLink[]
  completionScore?: number | undefined
}
