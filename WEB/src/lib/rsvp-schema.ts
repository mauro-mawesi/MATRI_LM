import { z } from 'zod';

export const rsvpSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  phone: z.string().min(8, 'Phone number too short').max(20).regex(
    /^\+\d{8,15}$/,
    'Must be a valid phone number with country code (e.g. +573001234567)'
  ),
  attending: z.boolean(),
  guests: z.number().int().min(0).max(10).default(0),
  dietary: z.string().max(500).optional().default(''),
  message: z.string().max(1000).optional().default(''),
});

export type RsvpData = z.infer<typeof rsvpSchema>;

export interface RsvpEntry extends RsvpData {
  id: string;
  submitted_at: string;
}
