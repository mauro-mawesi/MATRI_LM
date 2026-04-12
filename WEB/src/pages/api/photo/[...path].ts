import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';

const ALLOWED_BUCKETS = ['gallery', 'guestbook-photos'];

export const GET: APIRoute = async ({ params }) => {
  const fullPath = params.path;
  if (!fullPath) {
    return new Response('Not found', { status: 404 });
  }

  // Parse bucket/filename from path (e.g., "gallery/1.jpeg")
  const segments = fullPath.split('/');
  if (segments.length < 2) {
    return new Response('Not found', { status: 404 });
  }

  const bucket = segments[0];
  const filename = segments.slice(1).join('/');

  // Validate bucket name
  if (!ALLOWED_BUCKETS.includes(bucket)) {
    return new Response('Not found', { status: 404 });
  }

  // Validate filename (no path traversal)
  if (filename.includes('..') || !filename.match(/^[\w\-.]+$/)) {
    return new Response('Not found', { status: 404 });
  }

  const { data, error } = await supabase.storage
    .from(bucket)
    .download(filename);

  if (error || !data) {
    return new Response('Not found', { status: 404 });
  }

  const ext = filename.split('.').pop()?.toLowerCase() || '';
  const contentTypes: Record<string, string> = {
    jpg: 'image/jpeg', jpeg: 'image/jpeg',
    png: 'image/png', webp: 'image/webp', gif: 'image/gif',
  };

  return new Response(data, {
    status: 200,
    headers: {
      'Content-Type': contentTypes[ext] || 'application/octet-stream',
      'Cache-Control': 'public, max-age=86400, immutable',
    },
  });
};
