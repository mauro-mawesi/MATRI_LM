import { z } from 'zod';

export const messageSchema = z.object({
  name: z.string().min(2, 'Nombre muy corto').max(100),
  message: z.string().min(5, 'Mensaje muy corto').max(2000),
  visibility: z.enum(['public', 'private']),
});

export type MessageData = z.infer<typeof messageSchema>;

export interface MessageEntry extends MessageData {
  id: string;
  photos: string[];
  submittedAt: string;
}
