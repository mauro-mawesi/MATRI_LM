import type { APIRoute } from 'astro';
import { nanoid } from 'nanoid';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { z } from 'zod';

const DATA_DIR = join(process.cwd(), 'data');
const DATA_FILE = join(DATA_DIR, 'songs.json');

const songSchema = z.object({
  song: z.string().min(1).max(200),
  artist: z.string().min(1).max(200),
});

interface SongEntry {
  id: string;
  song: string;
  artist: string;
  submittedAt: string;
}

async function readSongs(): Promise<SongEntry[]> {
  try {
    const data = await readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeSongs(entries: SongEntry[]): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(DATA_FILE, JSON.stringify(entries, null, 2), 'utf-8');
}

export const GET: APIRoute = async () => {
  const songs = await readSongs();
  return new Response(JSON.stringify({ songs }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const result = songSchema.safeParse(body);

    if (!result.success) {
      return new Response(
        JSON.stringify({ error: 'Validation failed' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      );
    }

    const entry: SongEntry = {
      ...result.data,
      id: nanoid(),
      submittedAt: new Date().toISOString(),
    };

    const songs = await readSongs();
    songs.unshift(entry);
    await writeSongs(songs);

    return new Response(JSON.stringify({ success: true, entry }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch {
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
};
