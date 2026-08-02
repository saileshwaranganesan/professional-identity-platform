/*
 * ContactCard Component
 *
 * Feature component for rendering contact information and visitor submission form (Layer 4 — Presentation Layer).
 * Composes existing UI primitives (Card, Heading, Text, Button, ContactForm).
 */

import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Heading } from '@/components/ui/Heading'
import { Text } from '@/components/ui/Text'

import type { ContactInfo } from '../../types/contact'
import { ContactForm } from '../ContactForm/ContactForm'

import styles from './ContactCard.module.css'

export interface ContactCardProps {
  contact: ContactInfo
  className?: string
}

export function ContactCard({ contact, className }: ContactCardProps) {
  return (
    <Card variant="elevated" padding="medium" className={className}>
      <div className={styles.card ?? ''}>
        <Heading level={3}>Get in Touch</Heading>

        <div className={styles.details ?? ''}>
          <div className={styles.item ?? ''}>
            <Text as="span" variant="body" className={styles.label ?? ''}>
              Email:
            </Text>
            <Text as="span" variant="body">
              {contact.email}
            </Text>
          </div>

          {contact.phone && (
            <div className={styles.item ?? ''}>
              <Text as="span" variant="body" className={styles.label ?? ''}>
                Phone:
              </Text>
              <Text as="span" variant="body">
                {contact.phone}
              </Text>
            </div>
          )}

          <div className={styles.item ?? ''}>
            <Text as="span" variant="body" className={styles.label ?? ''}>
              Location:
            </Text>
            <Text as="span" variant="body">
              {contact.location}
            </Text>
          </div>
        </div>

        <div className={styles.actions ?? ''}>
          {contact.linkedInUrl && (
            <a
              href={contact.linkedInUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="primary" size="medium">
                LinkedIn Profile
              </Button>
            </a>
          )}
          {contact.githubUrl && (
            <a
              href={contact.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="secondary" size="medium">
                GitHub Profile
              </Button>
            </a>
          )}
        </div>

        <ContactForm />
      </div>
    </Card>
  )
}