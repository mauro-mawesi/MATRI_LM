const CODE_KEY = 'wedding-invite-code';
const NAME_KEY = 'wedding-guest-name';

/**
 * Wraps fetch to include invite code and guest name headers.
 * Use this for all POST requests that require invite code verification.
 */
export function authedFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const code = localStorage.getItem(CODE_KEY) || '';
  const name = localStorage.getItem(NAME_KEY) || '';
  const headers = new Headers(options.headers);
  headers.set('X-Invite-Code', code);
  headers.set('X-Guest-Name', name);

  return fetch(url, { ...options, headers });
}

/** Returns the stored guest name from localStorage */
export function getGuestName(): string {
  return localStorage.getItem(NAME_KEY) || '';
}
