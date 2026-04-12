import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { id } = await request.json();

    if (!id || typeof id !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Message ID is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      );
    }

    // Increment likes atomically via RPC or raw update
    const { data: current, error: fetchError } = await supabase
      .from('messages')
      .select('likes')
      .eq('id', id)
      .single();

    if (fetchError || !current) {
      return new Response(
        JSON.stringify({ error: 'Message not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } },
      );
    }

    const { error: updateError } = await supabase
      .from('messages')
      .update({ likes: current.likes + 1 })
      .eq('id', id);

    if (updateError) {
      return new Response(
        JSON.stringify({ error: updateError.message }),
        { status: 500, headers: { 'Content-Type': 'application/json' } },
      );
    }

    return new Response(
      JSON.stringify({ likes: current.likes + 1 }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    );
  } catch {
    return new Response(
      JSON.stringify({ error: 'Server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
};
