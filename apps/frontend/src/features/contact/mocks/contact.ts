/*
 * Mock Contact Dataset
 *
 * Provides initial realistic mock data adhering to the ContactInfo presentation model.
 * Will be replaced by Application Layer TanStack Query hooks once API integration is added.
 */

import type { ContactInfo } from '../types/contact'

export const mockContact: ContactInfo = {
  email: 'saileshwaranganesan@example.com',
  location: 'San Francisco, CA (Open to Remote)',
  linkedInUrl: 'https://linkedin.com/in/saileshwaranganesan',
  githubUrl: 'https://github.com/saileshwaranganesan',
}
