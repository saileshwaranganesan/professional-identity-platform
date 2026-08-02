/*
 * Mock Education Dataset
 *
 * Provides initial realistic mock data adhering to the Education domain model.
 */

import type { Education } from '@/domain/education'

export const mockEducation: Education[] = [
  {
    id: 'edu-1',
    degree: 'Bachelor of Science in Computer Science',
    institution: 'State Technological University',
    fieldOfStudy: 'Computer Science & Engineering',
    startDate: '2019-09-01',
    endDate: '2023-05-31',
    grade: '3.9 / 4.0',
    description: 'Graduated Magna Cum Laude. Dean’s Honor List all semesters.',
    currentlyStudying: false,
  },
]