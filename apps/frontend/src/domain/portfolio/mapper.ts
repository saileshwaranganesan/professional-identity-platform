/*
 * Portfolio Domain Mapper
 *
 * Maps raw backend PortfolioResponse to typed PortfolioData.
 */

import { mapAchievement } from '../achievements'
import { mapCertification } from '../certifications'
import { mapEducation } from '../education'
import { mapExperience } from '../experience'
import { mapProfile } from '../profile'
import { mapProjectSummary } from '../projects'
import { mapSkill } from '../skills'
import { mapSocialLink } from '../socialLinks'
import { portfolioApiSchema } from './schema'
import type { PortfolioData } from './types'

export function mapPortfolioData(data: unknown): PortfolioData {
  const parsed = portfolioApiSchema.parse(data)
  return {
    profile: mapProfile(parsed.profile),
    projects: parsed.projects.map(mapProjectSummary),
    experiences: parsed.experiences.map(mapExperience),
    educations: parsed.educations.map(mapEducation),
    skills: parsed.skills.map(mapSkill),
    certifications: parsed.certifications.map(mapCertification),
    achievements: parsed.achievements.map(mapAchievement),
    socialLinks: parsed.socialLinks.map(mapSocialLink),
    completionScore: parsed.completion?.overallScore,
  }
}
