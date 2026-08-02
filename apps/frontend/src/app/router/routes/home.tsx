/*
 * HomePage Component
 *
 * Public portfolio landing page (Layer 4 — Presentation Layer).
 * Consumes Application Layer query hooks (useProjects, useExperience, etc.).
 * Pure presentation — zero direct mock data imports, zero HTTP calls.
 */

import { useContact } from '@/application/contact'
import { useEducation } from '@/application/education'
import { useExperiences } from '@/application/experience'
import { useProjects } from '@/application/projects'
import { useSkills } from '@/application/skills'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Heading } from '@/components/ui/Heading'
import { Text } from '@/components/ui/Text'
import { ContactCard } from '@/features/contact'
import { EducationCard } from '@/features/education'
import { ExperienceCard } from '@/features/experience'
import { ProjectCard } from '@/features/projects'
import { SkillCard } from '@/features/skills'

import styles from './home.module.css'

export function HomePage() {
  const { data: projects = [] } = useProjects()
  const { data: experiences = [] } = useExperiences()
  const { data: skills = [] } = useSkills()
  const { data: educationList = [] } = useEducation()
  const { data: contact } = useContact()

  const featuredProjects = projects.filter((p) => p.featured)
  const categories = Array.from(
    new Set(
      skills
        .map((s) => s.category)
        .filter((c): c is string => Boolean(c)),
    ),
  )

  return (
    <div className={styles.container ?? ''}>
      {/* --- Hero Section --- */}
      <section className={styles.hero ?? ''}>
        <Heading level={1}>Senior Frontend Engineer & System Architect</Heading>
        <Text variant="body">
          Building web applications, design systems, and resilient
          frontend infrastructure with React and TypeScript.
        </Text>
        <div className={styles.ctaGroup ?? ''}>
          <Button variant="primary" size="medium">
            View Projects
          </Button>
          <Button variant="secondary" size="medium">
            Get in Touch
          </Button>
        </div>
      </section>

      {/* --- Introduction Section --- */}
      <Card variant="flat" padding="medium">
        <Heading level={2}>About My Work</Heading>
        <Text variant="body">
          Specializing in scalable architecture, strict type safety, and clean
          component design patterns for modern web applications.
        </Text>
      </Card>

      {/* --- Skills Section --- */}
      <section className={styles.section ?? ''}>
        <Heading level={2}>Technical Skills</Heading>
        <div className={styles.grid ?? ''}>
          {categories.map((category) => (
            <SkillCard
              key={category}
              category={category}
              skills={skills.filter((s) => s.category === category)}
            />
          ))}
        </div>
      </section>

      {/* --- Featured Projects Section --- */}
      <section className={styles.section ?? ''}>
        <Heading level={2}>Featured Projects</Heading>
        <div className={styles.grid ?? ''}>
          {featuredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>

      {/* --- Experience Preview Section --- */}
      <section className={styles.section ?? ''}>
        <Heading level={2}>Experience Preview</Heading>
        <div className={styles.stack ?? ''}>
          {experiences.map((exp) => (
            <ExperienceCard key={exp.id} experience={exp} />
          ))}
        </div>
      </section>

      {/* --- Education Section --- */}
      <section className={styles.section ?? ''}>
        <Heading level={2}>Education</Heading>
        <div className={styles.stack ?? ''}>
          {educationList.map((edu) => (
            <EducationCard key={edu.id} education={edu} />
          ))}
        </div>
      </section>

      {/* --- Contact Section --- */}
      <section className={styles.section ?? ''}>
        <Heading level={2}>Contact</Heading>
        {contact && <ContactCard contact={contact} />}
      </section>
    </div>
  )
}
