const TOKEN_KEY = 'aquapay_admin_token';

export function getAdminToken(): string | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function saveAdminToken(token: string) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(TOKEN_KEY, token);
}

export function removeAdminToken() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(TOKEN_KEY);
}

export function getAuthHeaders(): Record<string, string> {
  const token = getAdminToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function getApiPath(path: string) {
  return path.startsWith('/') ? `/api/blog${path}` : `/api/blog/${path}`;
}

export async function fetchAdmin(path: string, init: RequestInit = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeaders(),
    ...(init.headers as Record<string, string> | undefined),
  };

  return fetch(getApiPath(path), {
    ...init,
    headers,
    cache: 'no-store',
  });
}
