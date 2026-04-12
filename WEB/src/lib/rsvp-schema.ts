import { z } from 'zod';

export const rsvpSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  attending: z.boolean(),
  guests: z.number().int().min(0).max(10).default(0),
  dietary: z.string().max(500).optional().default(''),
  message: z.string().max(1000).optional().default(''),
});

export type RsvpData = z.infer<typeof rsvpSchema>;

export interface RsvpEntry extends RsvpData {
  id: string;
  submittedAt: string;
}
