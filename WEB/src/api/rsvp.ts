import type { APIRoute } from 'astro';
import { rsvpSchema, type RsvpEntry } from '../lib/rsvp-schema';
import { nanoid } from 'nanoid';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';

const DATA_DIR = join(process.cwd(), 'data');
const DATA_FILE = join(DATA_DIR, 'rsvps.json');

async function readRsvps(): Promise<RsvpEntry[]> {
  try {
    const data = await readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeRsvps(entries: RsvpEntry[]): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(DATA_FILE, JSON.stringify(entries, null, 2), 'utf-8');
}

export const GET: APIRoute = async () => {
  const rsvps = await readRsvps();
  return new Response(JSON.stringify({ rsvps, total: rsvps.length }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const result = rsvpSchema.safeParse(body);

    if (!result.success) {
      return new Response(
        JSON.stringify({ error: 'Validation failed', details: result.error.flatten() }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      );
    }

    const entry: RsvpEntry = {
      ...result.data,
      id: nanoid(),
      submittedAt: new Date().toISOString(),
    };

    const rsvps = await readRsvps();
    rsvps.push(entry);
    await writeRsvps(rsvps);

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
