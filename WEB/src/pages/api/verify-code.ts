import type { APIRoute } from 'astro';
import { supabase } from '../../lib/supabase';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { code } = await request.json();

    if (!code || typeof code !== 'string') {
      return new Response(
        JSON.stringify({ valid: false }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      );
    }

    const { data, error } = await supabase
      .from('app_config')
      .select('value')
      .eq('key', 'invite_code')
      .single();

    if (error || !data) {
      return new Response(
        JSON.stringify({ valid: false }),
        { status: 500, headers: { 'Content-Type': 'application/json' } },
      );
    }

    const valid = code.trim().toUpperCase() === data.value.trim().toUpperCase();

    return new Response(
      JSON.stringify({ valid }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    );
  } catch {
    return new Response(
      JSON.stringify({ valid: false }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
};
