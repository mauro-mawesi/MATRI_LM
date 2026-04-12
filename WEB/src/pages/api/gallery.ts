import type { APIRoute } from 'astro';
import { supabase } from '../../lib/supabase';

const SUPABASE_URL = import.meta.env.PUBLIC_SUPABASE_URL || 'http://172.28.18.200:8001';

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
      src: `${SUPABASE_URL}/storage/v1/object/public/gallery/${f.name}`,
    }));

  return new Response(JSON.stringify({ photos }), {
    status: 200, headers: { 'Content-Type': 'application/json' },
  });
};
