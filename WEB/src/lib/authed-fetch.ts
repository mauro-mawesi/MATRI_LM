const STORAGE_KEY = 'wedding-invite-code';

/**
 * Wraps fetch to include the X-Invite-Code header from localStorage.
 * Use this for all POST requests that require invite code verification.
 */
export function authedFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const code = localStorage.getItem(STORAGE_KEY) || '';
  const headers = new Headers(options.headers);
  headers.set('X-Invite-Code', code);

  return fetch(url, { ...options, headers });
}
