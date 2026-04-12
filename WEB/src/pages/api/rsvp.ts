import type { APIRoute } from 'astro';
import { rsvpSchema } from '../../lib/rsvp-schema';
import { nanoid } from 'nanoid';
import { supabase } from '../../lib/supabase';
import { verifyInviteCode } from '../../lib/verify-invite';
import { rateLimit } from '../../lib/rate-limit';

export const GET: APIRoute = async () => {
  const { data, error } = await supabase
    .from('rsvps')
    .select('*')
    .order('submitted_at', { ascending: false });

  if (error) {
    return new Response(JSON.stringify({ error: 'Error del servidor' }), {
      status: 500, headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ rsvps: data, total: data.length }), {
    status: 200, headers: { 'Content-Type': 'application/json' },
  });
};

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const limited = rateLimit(clientAddress || 'unknown', 'rsvp', 3, 60 * 60 * 1000); // 3 per hour
  if (limited) return limited;

  const denied = await verifyInviteCode(request);
  if (denied) return denied;

  try {
    const body = await request.json();
    const result = rsvpSchema.safeParse(body);

    if (!result.success) {
      return new Response(
        JSON.stringify({ error: 'Validation failed', details: result.error.flatten() }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      );
    }

    const entry = {
      id: nanoid(),
      ...result.data,
      submitted_at: new Date().toISOString(),
    };

    const { error } = await supabase.from('rsvps').insert(entry);

    if (error) {
      return new Response(JSON.stringify({ error: 'Error del servidor' }), {
        status: 500, headers: { 'Content-Type': 'application/json' },
      });
    }

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
