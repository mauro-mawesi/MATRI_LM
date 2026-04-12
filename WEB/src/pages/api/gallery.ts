import type { APIRoute } from 'astro';
import { supabase } from '../../lib/supabase';

export const GET: APIRoute = async () => {
  const { data, error } = await supabase.storage
    .from('gallery')
    .list('', { limit: 50, sortBy: { column: 'created_at', order: 'asc' } });

  if (error) {
    return new Response(JSON.stringify({ error: 'Error del servidor' }), {
      status: 500, headers: { 'Content-Type': 'application/json' },
    });
  }

  const photos = (data || [])
    .filter((f) => !f.name.startsWith('.') && f.metadata)
    .map((f) => ({
      id: f.id,
      name: f.name,
      src: `/api/photo/gallery/${f.name}`,
    }));

  return new Response(JSON.stringify({ photos }), {
    status: 200, headers: { 'Content-Type': 'application/json' },
  });
};
