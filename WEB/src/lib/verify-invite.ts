import { supabase } from './supabase';

const UNAUTHORIZED = new Response(
  JSON.stringify({ error: 'Código de invitación inválido' }),
  { status: 403, headers: { 'Content-Type': 'application/json' } },
);

/**
 * Validates the invite code from the X-Invite-Code header.
 * Returns null if valid, or a 403 Response if invalid.
 */
export async function verifyInviteCode(request: Request): Promise<Response | null> {
  const code = request.headers.get('X-Invite-Code');

  if (!code) return UNAUTHORIZED;

  const { data, error } = await supabase
    .from('app_config')
    .select('value')
    .eq('key', 'invite_code')
    .single();

  if (error || !data) return UNAUTHORIZED;

  if (code.trim().toUpperCase() !== data.value.trim().toUpperCase()) {
    return UNAUTHORIZED;
  }

  return null; // Valid
}
