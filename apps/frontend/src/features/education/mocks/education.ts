/*
 * Mock Education Dataset
 *
 * Provides initial realistic mock data adhering to the Education presentation model.
 * Will be replaced by Application Layer TanStack Query hooks once API integration is added.
 */

import type { Education } from '../types/education'

export const mockEducation: Education[] = [
  {
    id: 'edu-1',
    degree: 'Bachelor of Science in Computer Science',
    institution: 'State Technological University',
    location: 'San Francisco, CA',
    duration: '2019 — 2023',
    cgpa: '3.9 / 4.0',
    coursework: [
      'Data Structures & Algorithms',
      'Distributed Systems',
      'Software Architecture',
      'Web Engineering',
    ],
    achievements: [
      'Graduated Magna Cum Laude',
      'Dean’s Honor List (All Semesters)',
    ],
  },
]
