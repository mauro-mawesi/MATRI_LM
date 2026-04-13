import { z } from 'zod';

const stripHtml = (val: string) => val.replace(/<[^>]*>/g, '');

export const messageSchema = z.object({
  name: z.string().min(2, 'Nombre muy corto').max(100).transform(stripHtml),
  message: z.string().min(5, 'Mensaje muy corto').max(2000).transform(stripHtml),
  visibility: z.enum(['public', 'private']),
});

export type MessageData = z.infer<typeof messageSchema>;

export interface MessageEntry extends MessageData {
  id: string;
  photos: string[];
  likes: number;
  submitted_at: string;
}
