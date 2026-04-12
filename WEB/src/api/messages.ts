import type { APIRoute } from 'astro';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { nanoid } from 'nanoid';
import { messageSchema, type MessageEntry } from '../lib/message-schema';

const DATA_DIR = path.join(process.cwd(), 'data');
const UPLOADS_DIR = path.join(DATA_DIR, 'uploads');
const MESSAGES_FILE = path.join(DATA_DIR, 'messages.json');

const MAX_PHOTOS = 3;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

async function readMessages(): Promise<MessageEntry[]> {
  try {
    const data = await readFile(MESSAGES_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeMessages(messages: MessageEntry[]): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(MESSAGES_FILE, JSON.stringify(messages, null, 2));
}

export const GET: APIRoute = async () => {
  const all = await readMessages();
  const publicMessages = all.filter((m) => m.visibility === 'public');
  return new Response(
    JSON.stringify({ messages: publicMessages, total: publicMessages.length }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();

    const name = formData.get('name') as string | null;
    const message = formData.get('message') as string | null;
    const visibility = formData.get('visibility') as string | null;

    const result = messageSchema.safeParse({ name, message, visibility });
    if (!result.success) {
      return new Response(
        JSON.stringify({ error: 'Validation failed', details: result.error.flatten().fieldErrors }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Handle photo uploads
    await mkdir(UPLOADS_DIR, { recursive: true });
    const photoFiles = formData.getAll('photos') as File[];
    const savedPhotos: string[] = [];

    for (const file of photoFiles.slice(0, MAX_PHOTOS)) {
      if (!(file instanceof File) || file.size === 0) continue;

      if (!ALLOWED_TYPES.includes(file.type)) {
        return new Response(
          JSON.stringify({ error: `Tipo de archivo no permitido: ${file.type}` }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      if (file.size > MAX_FILE_SIZE) {
        return new Response(
          JSON.stringify({ error: 'Archivo demasiado grande (máx 5MB)' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const filename = `${nanoid()}.${ext}`;
      const buffer = Buffer.from(await file.arrayBuffer());
      await writeFile(path.join(UPLOADS_DIR, filename), buffer);
      savedPhotos.push(filename);
    }

    const entry: MessageEntry = {
      id: nanoid(),
      ...result.data,
      photos: savedPhotos,
      submittedAt: new Date().toISOString(),
    };

    const messages = await readMessages();
    messages.unshift(entry);
    await writeMessages(messages);

    return new Response(
      JSON.stringify({ entry }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: 'Error del servidor' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
