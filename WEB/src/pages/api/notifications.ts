import type { APIRoute } from 'astro';
import { supabase } from '../../lib/supabase';

export const GET: APIRoute = async () => {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) {
    return new Response(JSON.stringify({ error: 'Error del servidor' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const notifications = (data ?? []).map((entry) => ({
    id: entry.id,
    title: entry.title ?? '',
    message: entry.message ?? '',
    variant: entry.variant ?? 'info',
    ctaLabel: entry.cta_label ?? '',
    ctaHref: entry.cta_href ?? '',
    createdAt: entry.created_at ?? null,
  }));

  return new Response(JSON.stringify({ notifications }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
