/*
 * PublicPortfolioView Component
 *
 * Fully dynamic presentation component rendering a professional portfolio.
 * Connected to Layer 3 portfolio hooks. Consumes backend API payload.
 */

import { Link } from '@tanstack/react-router'

import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Heading } from '@/components/ui/Heading'
import { Text } from '@/components/ui/Text'

import { MetaSeo } from '@/components/ui/MetaSeo/MetaSeo'
import { ContactForm } from '@/features/contact/components/ContactForm/ContactForm'
import { SocialPlatformIcon } from '@/features/socialLinks/components/SocialPlatformIcon/SocialPlatformIcon'
import { usePublicPortfolio } from '@/application/portfolio'

import styles from '@/app/router/routes/home.module.css'

export interface PublicPortfolioViewProps {
  username?: string
}

export function PublicPortfolioView({ username = 'admin' }: PublicPortfolioViewProps) {
  const { data: portfolio, isLoading, isError, error, refetch } = usePublicPortfolio(username)

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div style={{ padding: '3rem 1.5rem', textAlign: 'center', color: '#38bdf8', fontSize: '1.125rem' }}>
          Loading professional portfolio...
        </div>
      </div>
    )
  }

  if (isError || !portfolio) {
    return (
      <div className={styles.container}>
        <Card variant="flat" padding="medium">
          <div style={{ color: '#fca5a5', padding: '1rem', textAlign: 'center' }}>
            <p style={{ fontWeight: 600, fontSize: '1.125rem', marginBottom: '0.5rem' }}>
              Failed to load portfolio for user "{username}".
            </p>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '1rem' }}>
              {error instanceof Error ? error.message : 'Please check your connection and try again.'}
            </p>
            <Button variant="primary" size="medium" onClick={() => void refetch()}>
              Retry Loading
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  const {
    profile,
    projects = [],
    experiences = [],
    educations = [],
    skills = [],
    certifications = [],
    achievements = [],
    socialLinks = [],
  } = portfolio

  const fullName = [profile.firstName, profile.lastName].filter(Boolean).join(' ') || profile.username
  const featuredProjects = projects.filter((p) => p.featured || p.published)
  const categories = Array.from(new Set(skills.map((s) => s.category).filter((c): c is string => Boolean(c))))

  const hasProjects = featuredProjects.length > 0
  const hasExperiences = experiences.length > 0
  const hasSkills = skills.length > 0
  const hasCertifications = certifications.length > 0
  const hasAchievements = achievements.length > 0
  const hasEducation = educations.length > 0

  const isPortfolioEmpty =
    !hasProjects &&
    !hasExperiences &&
    !hasSkills &&
    !hasCertifications &&
    !hasAchievements &&
    !hasEducation

  return (
    <div className={styles.container}>
      <MetaSeo
        title={`${fullName} — Professional Portfolio`}
        description={profile.headline || profile.bio || `Professional portfolio and engineering showcase of ${fullName}.`}
        canonicalUrl={window.location.href}
        ogImage={profile.profileImagePath || undefined}
        personData={{
          name: fullName,
          headline: profile.headline || undefined,
          url: profile.website || window.location.href,
          image: profile.profileImagePath || undefined,
          sameAs: socialLinks.map((s) => s.url),
        }}
      />

      {/* --- Hero Section --- */}
      <section className={styles.hero}>
        <div className={styles.avatarHeader}>
          {profile.profileImagePath ? (
            <img src={profile.profileImagePath} alt={fullName} className={styles.avatar} loading="lazy" />
          ) : (
            <div className={styles.avatarFallback}>{fullName.charAt(0).toUpperCase()}</div>
          )}
          <div className={styles.heroInfo}>
            <Heading level={1}>{fullName}</Heading>
            {profile.headline && (
              <p style={{ fontSize: '1.25rem', color: '#38bdf8', fontWeight: 500 }}>
                {profile.headline}
              </p>
            )}
            {profile.location && (
              <div className={styles.locationBadge}>
                <span>📍 {profile.location}</span>
              </div>
            )}
          </div>
        </div>

        {profile.bio && (
          <p style={{ fontSize: '1rem', color: '#94a3b8', lineHeight: '1.7', marginTop: '0.5rem' }}>
            {profile.bio}
          </p>
        )}

        <div className={styles.ctaGroup}>
          <a href="#contact">
            <Button variant="primary" size="medium">
              Get in Touch
            </Button>
          </a>
          {profile.website && (
            <a href={profile.website} target="_blank" rel="noopener noreferrer">
              <Button variant="secondary" size="medium">
                Personal Website ↗
              </Button>
            </a>
          )}
        </div>

        {/* Social Links Icons */}
        {socialLinks.length > 0 && (
          <div className={styles.socialRow}>
            {socialLinks.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialIconLink}
                title={link.platform}
                aria-label={link.platform}
              >
                <SocialPlatformIcon platform={link.platform} size={20} />
              </a>
            ))}
          </div>
        )}
      </section>

      {isPortfolioEmpty ? (
        /* --- Case 1: Completely Empty Portfolio Onboarding --- */
        <section className={styles.section}>
          <Card variant="flat" padding="medium" className={styles.onboardingCard}>
            <Heading level={2}>Portfolio Coming Soon</Heading>
            <Text variant="muted" style={{ maxWidth: '600px', lineHeight: '1.6' }}>
              This professional portfolio is currently being prepared. Check back soon for projects, experience, technical skills, certifications, achievements, and more.
            </Text>
          </Card>
        </section>
      ) : (
        <>
          {/* --- Featured Projects Section --- */}
          {hasProjects && (
            <section className={styles.section} id="projects">
              <Heading level={2}>Featured Projects</Heading>
              <div className={styles.grid}>
                {featuredProjects.map((project) => (
                  <div key={project.id} className={styles.timelineCard}>
                    <div className={styles.timelineHeader}>
                      <Link to="/projects/$slug" params={{ slug: project.slug }}>
                        <span className={styles.timelineTitle} style={{ color: '#38bdf8', cursor: 'pointer' }}>
                          {project.title} ↗
                        </span>
                      </Link>
                      <span className={styles.timelineDate}>{project.status}</span>
                    </div>

                    {project.headline && <div className={styles.timelineSubtitle}>{project.headline}</div>}
                    {project.shortDescription && (
                      <p className={styles.timelineDescription}>{project.shortDescription}</p>
                    )}

                    {project.technologies && project.technologies.length > 0 && (
                      <div className={styles.badgeGroup}>
                        {project.technologies.map((tech) => (
                          <span key={tech} className={styles.badge}>
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '0.75rem', fontSize: '0.875rem' }}>
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: '#38bdf8', fontWeight: 500 }}
                        >
                          Live Demo ↗
                        </a>
                      )}
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: '#94a3b8' }}
                        >
                          GitHub Repo ↗
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* --- Work Experience Timeline --- */}
          {hasExperiences && (
            <section className={styles.section} id="experience">
              <Heading level={2}>Work Experience</Heading>
              <div className={styles.stack}>
                {experiences.map((exp) => (
                  <div key={exp.id} className={styles.timelineCard}>
                    <div className={styles.timelineHeader}>
                      <div>
                        <div className={styles.timelineTitle}>{exp.position}</div>
                        <div className={styles.timelineSubtitle}>{exp.company}</div>
                      </div>
                      <div className={styles.timelineDate}>
                        {exp.startDate} — {exp.currentlyWorking ? 'Present' : exp.endDate}
                      </div>
                    </div>

                    {exp.description && <p className={styles.timelineDescription}>{exp.description}</p>}

                    {exp.technologies && exp.technologies.length > 0 && (
                      <div className={styles.badgeGroup}>
                        {exp.technologies.map((tech) => (
                          <span key={tech} className={styles.badge}>
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* --- Technical Skills Section --- */}
          {hasSkills && (
            <section className={styles.section} id="skills">
              <Heading level={2}>Technical Skills</Heading>
              <div className={styles.grid}>
                {categories.map((category) => {
                  const catSkills = skills.filter((s) => s.category === category)
                  return (
                    <Card key={category} variant="flat" padding="medium">
                      <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#f8fafc', marginBottom: '0.75rem' }}>
                        {category}
                      </h3>
                      <div className={styles.skillChipGroup}>
                        {catSkills.map((s) => (
                          <div key={s.id} className={styles.skillChip}>
                            <span>{s.name}</span>
                            <span className={styles.skillLevel}>({s.level})</span>
                          </div>
                        ))}
                      </div>
                    </Card>
                  )
                })}
              </div>
            </section>
          )}

          {/* --- Certifications Section --- */}
          {hasCertifications && (
            <section className={styles.section} id="certifications">
              <Heading level={2}>Certifications & Credentials</Heading>
              <div className={styles.grid}>
                {certifications.map((cert) => (
                  <div key={cert.id} className={styles.timelineCard}>
                    <div className={styles.timelineHeader}>
                      <div className={styles.timelineTitle}>{cert.name}</div>
                      <span className={styles.timelineDate}>{cert.issuingOrganization}</span>
                    </div>
                    <div style={{ fontSize: '0.8125rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                      Issued: {cert.issueDate} • {cert.doesNotExpire ? 'No Expiration' : `Expires: ${cert.expiryDate ?? ''}`}
                    </div>
                    {cert.credentialUrl && (
                      <a
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: '#38bdf8', fontSize: '0.875rem', marginTop: '0.5rem', display: 'inline-block' }}
                      >
                        Verify Credential ↗
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* --- Honors & Achievements Section --- */}
          {hasAchievements && (
            <section className={styles.section} id="achievements">
              <Heading level={2}>Honors & Achievements</Heading>
              <div className={styles.stack}>
                {achievements.map((item) => (
                  <div key={item.id} className={styles.timelineCard}>
                    <div className={styles.timelineHeader}>
                      <div className={styles.timelineTitle}>{item.title}</div>
                      {item.achievementDate && <span className={styles.timelineDate}>{item.achievementDate}</span>}
                    </div>
                    {item.organization && <div className={styles.timelineSubtitle}>{item.organization}</div>}
                    {item.description && <p className={styles.timelineDescription}>{item.description}</p>}
                    {item.achievementUrl && (
                      <a
                        href={item.achievementUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: '#38bdf8', fontSize: '0.875rem', marginTop: '0.375rem', display: 'inline-block' }}
                      >
                        View Award Link ↗
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* --- Education Section --- */}
          {hasEducation && (
            <section className={styles.section} id="education">
              <Heading level={2}>Education</Heading>
              <div className={styles.stack}>
                {educations.map((edu) => (
                  <div key={edu.id} className={styles.timelineCard}>
                    <div className={styles.timelineHeader}>
                      <div>
                        <div className={styles.timelineTitle}>{edu.degree} in {edu.fieldOfStudy}</div>
                        <div className={styles.timelineSubtitle}>{edu.institution}</div>
                      </div>
                      <div className={styles.timelineDate}>
                        {edu.startDate} — {edu.currentlyStudying ? 'Present' : edu.endDate}
                      </div>
                    </div>
                    {edu.grade && (
                      <div style={{ fontSize: '0.8125rem', color: '#4ade80', marginTop: '0.25rem' }}>
                        Grade / GPA: {edu.grade}
                      </div>
                    )}
                    {edu.description && <p className={styles.timelineDescription}>{edu.description}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      )}

      {/* --- Contact Section --- */}
      <section className={styles.section} id="contact">
        <Heading level={2}>Get in Touch</Heading>
        <Card variant="flat" padding="medium">
          <ContactForm />
        </Card>
      </section>
    </div>
  )
}

