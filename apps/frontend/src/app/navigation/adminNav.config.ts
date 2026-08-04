/*
 * Admin Navigation Configuration
 *
 * Centralized configuration model for top-level admin navigation targets.
 * Located in Layer 2 (App Layer) to decouple feature routes from UI primitives.
 */

export interface AdminNavItem {
  id: string
  label: string
  path: string
  iconName: 'dashboard' | 'projects' | 'experience' | 'skills' | 'education' | 'certifications' | 'achievements' | 'social-links' | 'messages' | 'settings'
  badge?: string
}

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/admin',
    iconName: 'dashboard',
  },
  {
    id: 'projects',
    label: 'Projects',
    path: '/admin/projects',
    iconName: 'projects',
  },
  {
    id: 'experience',
    label: 'Experience',
    path: '/admin/experience',
    iconName: 'experience',
  },
  {
    id: 'skills',
    label: 'Skills',
    path: '/admin/skills',
    iconName: 'skills',
  },
  {
    id: 'education',
    label: 'Education',
    path: '/admin/education',
    iconName: 'education',
  },
  {
    id: 'certifications',
    label: 'Certifications',
    path: '/admin/certifications',
    iconName: 'certifications',
  },
  {
    id: 'achievements',
    label: 'Achievements',
    path: '/admin/achievements',
    iconName: 'achievements',
  },
  {
    id: 'social-links',
    label: 'Social Links',
    path: '/admin/social-links',
    iconName: 'social-links',
  },
  {
    id: 'messages',
    label: 'Messages',
    path: '/admin/messages',
    iconName: 'messages',
  },
  {
    id: 'settings',
    label: 'Settings',
    path: '/admin/settings',
    iconName: 'settings',
  },
]
