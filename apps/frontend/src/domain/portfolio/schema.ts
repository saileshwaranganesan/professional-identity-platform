/*
 * Portfolio Domain Validation Schemas
 *
 * Zod validation schema for aggregated public portfolio payloads.
 */

import { z } from 'zod'

import { achievementApiSchema } from '../achievements/schema'
import { certificationApiSchema } from '../certifications/schema'
import { educationApiSchema } from '../education/schema'
import { experienceApiSchema } from '../experience/schema'
import { profileApiSchema } from '../profile/schema'
import { projectSummarySchema } from '../projects/schema'
import { skillApiSchema } from '../skills/schema'
import { socialLinkApiSchema } from '../socialLinks/schema'

export const portfolioApiSchema = z.object({
  profile: profileApiSchema,
  projects: z.array(projectSummarySchema).default([]),
  experiences: z.array(experienceApiSchema).default([]),
  educations: z.array(educationApiSchema).default([]),
  skills: z.array(skillApiSchema).default([]),
  certifications: z.array(certificationApiSchema).default([]),
  achievements: z.array(achievementApiSchema).default([]),
  socialLinks: z.array(socialLinkApiSchema).default([]),
  completion: z.object({
    overallScore: z.number().optional(),
  }).optional(),
})
