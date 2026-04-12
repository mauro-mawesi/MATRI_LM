import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';
import { verifyInviteCode } from '../../../lib/verify-invite';

export const POST: APIRoute = async ({ request }) => {
  const denied = await verifyInviteCode(request);
  if (denied) return denied;

  try {
    const { id } = await request.json();

    if (!id || typeof id !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Invalid request' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      );
    }

    // Atomic increment via Postgres function
    const { data, error } = await supabase.rpc('increment_likes', { message_id: id });

    if (error || data === -1) {
      return new Response(
        JSON.stringify({ error: 'Message not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } },
      );
    }

    return new Response(
      JSON.stringify({ likes: data }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    );
  } catch {
    return new Response(
      JSON.stringify({ error: 'Server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
};
