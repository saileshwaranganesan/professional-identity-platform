import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

import { PublicPortfolioView } from './PublicPortfolioView'

const mockUsePublicPortfolio = vi.fn()

vi.mock('@/application/portfolio', () => ({
  usePublicPortfolio: (username: string) => mockUsePublicPortfolio(username),
}))

vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
}))

vi.mock('@/features/contact/components/ContactForm/ContactForm', () => ({
  ContactForm: () => <div data-testid="contact-form">Contact Form Component</div>,
}))

describe('PublicPortfolioView Empty-State Behavior', () => {
  const baseProfile = {
    username: 'admin',
    firstName: 'Jane',
    lastName: 'Doe',
    headline: 'Senior Full Stack Engineer',
    bio: 'Building web apps',
    location: 'San Francisco, CA',
    website: 'https://example.com',
    profileImagePath: null,
  }

  it('Case 1: renders Onboarding section when ALL content collections are empty', () => {
    mockUsePublicPortfolio.mockReturnValue({
      data: {
        profile: baseProfile,
        projects: [],
        experiences: [],
        skills: [],
        certifications: [],
        achievements: [],
        educations: [],
        socialLinks: [],
      },
      isLoading: false,
      isError: false,
    })

    render(<PublicPortfolioView username="admin" />)

    // Hero section & Contact section present
    expect(screen.getByText('Jane Doe')).toBeInTheDocument()
    expect(screen.getByTestId('contact-form')).toBeInTheDocument()

    // Single Onboarding section present
    expect(screen.getByText('Portfolio Coming Soon')).toBeInTheDocument()
    expect(
      screen.getByText(/This professional portfolio is currently being prepared/i)
    ).toBeInTheDocument()

    // Omit all individual empty section headers & placeholder cards
    expect(screen.queryByText('Featured Projects')).not.toBeInTheDocument()
    expect(screen.queryByText('Work Experience')).not.toBeInTheDocument()
    expect(screen.queryByText('Technical Skills')).not.toBeInTheDocument()
    expect(screen.queryByText('Certifications & Credentials')).not.toBeInTheDocument()
    expect(screen.queryByText('Honors & Achievements')).not.toBeInTheDocument()
    expect(screen.queryByText('Education')).not.toBeInTheDocument()
    expect(screen.queryByText('No featured projects published yet.')).not.toBeInTheDocument()
    expect(screen.queryByText('No work experience entries listed yet.')).not.toBeInTheDocument()
    expect(screen.queryByText('No technical skills listed yet.')).not.toBeInTheDocument()
  })

  it('Case 2: renders ONLY non-empty sections when portfolio is partially filled', () => {
    mockUsePublicPortfolio.mockReturnValue({
      data: {
        profile: baseProfile,
        projects: [
          {
            id: 'p1',
            title: 'Awesome Project',
            slug: 'awesome-project',
            published: true,
            featured: true,
            status: 'Completed',
          },
        ],
        experiences: [],
        skills: [
          {
            id: 's1',
            name: 'React',
            category: 'Frontend',
            level: 'Expert',
          },
        ],
        certifications: [],
        achievements: [],
        educations: [],
        socialLinks: [],
      },
      isLoading: false,
      isError: false,
    })

    render(<PublicPortfolioView username="admin" />)

    // Onboarding section should NOT be present
    expect(screen.queryByText('Portfolio Coming Soon')).not.toBeInTheDocument()

    // Rendered sections with data
    expect(screen.getByText('Featured Projects')).toBeInTheDocument()
    expect(screen.getByText('Awesome Project ↗')).toBeInTheDocument()
    expect(screen.getByText('Technical Skills')).toBeInTheDocument()
    expect(screen.getByText('React')).toBeInTheDocument()

    // Empty sections should be completely omitted (no headers, no placeholder cards)
    expect(screen.queryByText('Work Experience')).not.toBeInTheDocument()
    expect(screen.queryByText('Certifications & Credentials')).not.toBeInTheDocument()
    expect(screen.queryByText('Honors & Achievements')).not.toBeInTheDocument()
    expect(screen.queryByText('Education')).not.toBeInTheDocument()
    expect(screen.queryByText('No work experience entries listed yet.')).not.toBeInTheDocument()
  })

  it('Case 3: renders all sections when portfolio is fully populated', () => {
    mockUsePublicPortfolio.mockReturnValue({
      data: {
        profile: baseProfile,
        projects: [
          {
            id: 'p1',
            title: 'Project Alpha',
            slug: 'project-alpha',
            published: true,
            featured: true,
          },
        ],
        experiences: [
          {
            id: 'e1',
            company: 'Tech Corp',
            position: 'Software Engineer',
            startDate: '2022',
            currentlyWorking: true,
          },
        ],
        skills: [
          {
            id: 's1',
            name: 'TypeScript',
            category: 'Languages',
            level: 'Advanced',
          },
        ],
        certifications: [
          {
            id: 'c1',
            name: 'AWS Certified',
            issuingOrganization: 'Amazon',
            issueDate: '2023',
            doesNotExpire: true,
          },
        ],
        achievements: [
          {
            id: 'a1',
            title: 'Best Innovator',
            achievementDate: '2024',
          },
        ],
        educations: [
          {
            id: 'ed1',
            degree: 'BS',
            fieldOfStudy: 'Computer Science',
            institution: 'University',
            startDate: '2018',
            endDate: '2022',
          },
        ],
        socialLinks: [],
      },
      isLoading: false,
      isError: false,
    })

    render(<PublicPortfolioView username="admin" />)

    expect(screen.getByText('Featured Projects')).toBeInTheDocument()
    expect(screen.getByText('Work Experience')).toBeInTheDocument()
    expect(screen.getByText('Technical Skills')).toBeInTheDocument()
    expect(screen.getByText('Certifications & Credentials')).toBeInTheDocument()
    expect(screen.getByText('Honors & Achievements')).toBeInTheDocument()
    expect(screen.getByText('Education')).toBeInTheDocument()
  })
})
