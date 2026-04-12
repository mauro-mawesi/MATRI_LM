import type { APIRoute } from 'astro';
import { supabase } from '../../lib/supabase';

const MAX_FAILED_ATTEMPTS = 5;
const WINDOW_MINUTES = 15;

export const POST: APIRoute = async ({ request, clientAddress }) => {
  try {
    const { code, name } = await request.json();
    const ip = clientAddress || request.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = request.headers.get('user-agent') || '';

    if (!code || typeof code !== 'string') {
      return new Response(
        JSON.stringify({ valid: false, error: 'Código requerido' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      );
    }

    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return new Response(
        JSON.stringify({ valid: false, error: 'Nombre requerido' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      );
    }

    // Rate limiting: check failed attempts from this IP in the last N minutes
    const windowStart = new Date(Date.now() - WINDOW_MINUTES * 60 * 1000).toISOString();
    const { count } = await supabase
      .from('access_log')
      .select('*', { count: 'exact', head: true })
      .eq('ip', ip)
      .eq('success', false)
      .gte('created_at', windowStart);

    if ((count ?? 0) >= MAX_FAILED_ATTEMPTS) {
      // Log the blocked attempt too
      await supabase.from('access_log').insert({
        ip,
        name: name.trim(),
        code_entered: '***BLOCKED***',
        success: false,
        user_agent: userAgent,
      });

      return new Response(
        JSON.stringify({ valid: false, error: 'Demasiados intentos. Espera 15 minutos.' }),
        { status: 429, headers: { 'Content-Type': 'application/json' } },
      );
    }

    // Validate code
    const { data, error } = await supabase
      .from('app_config')
      .select('value')
      .eq('key', 'invite_code')
      .single();

    if (error || !data) {
      return new Response(
        JSON.stringify({ valid: false, error: 'Error del servidor' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } },
      );
    }

    const valid = code.trim().toUpperCase() === data.value.trim().toUpperCase();

    // Log the attempt
    await supabase.from('access_log').insert({
      ip,
      name: name.trim(),
      code_entered: valid ? '***VALID***' : code.trim(),
      success: valid,
      user_agent: userAgent,
    });

    if (!valid) {
      return new Response(
        JSON.stringify({ valid: false, error: 'Código incorrecto' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      );
    }

    return new Response(
      JSON.stringify({ valid: true }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    );
  } catch {
    return new Response(
      JSON.stringify({ valid: false, error: 'Error del servidor' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
};
