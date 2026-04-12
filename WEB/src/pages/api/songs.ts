import type { APIRoute } from 'astro';
import { nanoid } from 'nanoid';
import { z } from 'zod';
import { supabase } from '../../lib/supabase';
import { verifyInviteCode } from '../../lib/verify-invite';
import { rateLimit } from '../../lib/rate-limit';
import { notifyWhatsApp } from '../../lib/notify';

const songSchema = z.object({
  song: z.string().min(1).max(200),
  artist: z.string().min(1).max(200),
});

export const GET: APIRoute = async () => {
  const { data, error } = await supabase
    .from('songs')
    .select('*')
    .order('submitted_at', { ascending: false });

  if (error) {
    return new Response(JSON.stringify({ error: 'Error del servidor' }), {
      status: 500, headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ songs: data }), {
    status: 200, headers: { 'Content-Type': 'application/json' },
  });
};

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const limited = rateLimit(clientAddress || 'unknown', 'songs', 10, 60 * 60 * 1000); // 10 per hour
  if (limited) return limited;

  const denied = await verifyInviteCode(request);
  if (denied) return denied;

  try {
    const body = await request.json();
    const result = songSchema.safeParse(body);

    if (!result.success) {
      return new Response(
        JSON.stringify({ error: 'Validation failed' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      );
    }

    const entry = {
      id: nanoid(),
      ...result.data,
      submitted_at: new Date().toISOString(),
    };

    const { error } = await supabase.from('songs').insert(entry);

    if (error) {
      return new Response(JSON.stringify({ error: 'Error del servidor' }), {
        status: 500, headers: { 'Content-Type': 'application/json' },
      });
    }

    notifyWhatsApp(`🎵 Nueva canción sugerida\n🎶 ${entry.song}\n🎤 ${entry.artist}`);

    return new Response(JSON.stringify({ success: true, entry }), {
      status: 201, headers: { 'Content-Type': 'application/json' },
    });
  } catch {
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
};
