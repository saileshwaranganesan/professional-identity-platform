/*
 * Mock Messages Dataset
 *
 * Provides realistic initial mock contact message submissions for administration preview.
 */

import type { Message } from '@/domain/messages'

export const mockMessages: Message[] = [
  {
    id: 'msg-1',
    senderName: 'Sarah Jenkins',
    senderEmail: 'sarah.j@techrecruiting.io',
    subject: 'Senior Frontend Engineer Position Inquiry',
    content: 'Hi! We were very impressed by your open source portfolio and software engineering background. We are looking for a Senior Architect to lead our React design system team. Would you be open to a quick introductory call next week?',
    status: 'UNREAD',
    createdAt: '2026-08-01T14:32:00Z',
  },
  {
    id: 'msg-2',
    senderName: 'Alex Rivera',
    senderEmail: 'arivera@cloudscale.net',
    subject: 'Consulting Project — Platform Architecture',
    content: 'Hello, I saw your identity platform showcase. We need technical guidance on setting up TanStack Router and layered architecture in a enterprise monorepo. Let me know if you take on technical consulting projects.',
    status: 'READ',
    createdAt: '2026-07-28T09:15:00Z',
  },
]