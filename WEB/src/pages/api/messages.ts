import type { APIRoute } from 'astro';
import { nanoid } from 'nanoid';
import { messageSchema } from '../../lib/message-schema';
import { supabase } from '../../lib/supabase';
import { verifyInviteCode } from '../../lib/verify-invite';
import { rateLimit } from '../../lib/rate-limit';

const MAX_PHOTOS = 3;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MIME_TO_EXT: Record<string, string[]> = {
  'image/jpeg': ['jpg', 'jpeg'],
  'image/png': ['png'],
  'image/webp': ['webp'],
  'image/gif': ['gif'],
};

export const GET: APIRoute = async () => {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('visibility', 'public')
    .order('submitted_at', { ascending: false });

  if (error) {
    return new Response(JSON.stringify({ error: 'Error del servidor' }), {
      status: 500, headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(
    JSON.stringify({ messages: data, total: data.length }),
    { status: 200, headers: { 'Content-Type': 'application/json' } },
  );
};

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const limited = rateLimit(clientAddress || 'unknown', 'messages', 5, 60 * 60 * 1000); // 5 per hour
  if (limited) return limited;

  const denied = await verifyInviteCode(request);
  if (denied) return denied;

  try {
    const formData = await request.formData();

    const name = formData.get('name') as string | null;
    const message = formData.get('message') as string | null;
    const visibility = formData.get('visibility') as string | null;

    const result = messageSchema.safeParse({ name, message, visibility });
    if (!result.success) {
      return new Response(
        JSON.stringify({ error: 'Validation failed', details: result.error.flatten().fieldErrors }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      );
    }

    // Upload photos to Supabase Storage
    const photoFiles = formData.getAll('photos') as File[];
    const savedPhotos: string[] = [];

    for (const file of photoFiles.slice(0, MAX_PHOTOS)) {
      if (!(file instanceof File) || file.size === 0) continue;

      if (!ALLOWED_TYPES.includes(file.type)) {
        return new Response(
          JSON.stringify({ error: 'Tipo de archivo no permitido' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } },
        );
      }

      if (file.size > MAX_FILE_SIZE) {
        return new Response(
          JSON.stringify({ error: 'Archivo demasiado grande (máx 5MB)' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } },
        );
      }

      // Validate extension matches MIME type
      const ext = file.name.split('.').pop()?.toLowerCase() || '';
      const allowedExts = MIME_TO_EXT[file.type] || [];
      const safeExt = allowedExts.includes(ext) ? ext : allowedExts[0] || 'jpg';
      const filename = `${nanoid()}.${safeExt}`;

      const { error: uploadError } = await supabase.storage
        .from('guestbook-photos')
        .upload(filename, file, { contentType: file.type });

      if (uploadError) {
        return new Response(
          JSON.stringify({ error: `Error subiendo foto: ${uploadError.message}` }),
          { status: 500, headers: { 'Content-Type': 'application/json' } },
        );
      }

      savedPhotos.push(filename);
    }

    const entry = {
      id: nanoid(),
      ...result.data,
      photos: savedPhotos,
      submitted_at: new Date().toISOString(),
    };

    const { error: insertError } = await supabase.from('messages').insert(entry);

    if (insertError) {
      return new Response(
        JSON.stringify({ error: insertError.message }),
        { status: 500, headers: { 'Content-Type': 'application/json' } },
      );
    }

    return new Response(
      JSON.stringify({ entry }),
      { status: 201, headers: { 'Content-Type': 'application/json' } },
    );
  } catch {
    return new Response(
      JSON.stringify({ error: 'Error del servidor' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
};
