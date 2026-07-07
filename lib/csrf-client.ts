let csrfToken: string | null = null;
let fetchPromise: Promise<string | null> | null = null;

export async function getCsrfToken(): Promise<string | null> {
  if (csrfToken) return csrfToken;
  if (fetchPromise) return fetchPromise;

  fetchPromise = (async () => {
    try {
      const res = await fetch('/api/csrf');
      if (!res.ok) return null;
      const data = await res.json();
      csrfToken = data.token || null;
      return csrfToken;
    } catch {
      return null;
    }
  })();

  const result = await fetchPromise;
  fetchPromise = null;
  return result;
}

export async function fetchWithCsrf(url: string, options: RequestInit = {}): Promise<Response> {
  const token = await getCsrfToken();
  if (!token) return fetch(url, options);

  const headers = new Headers(options.headers || {});
  headers.set('x-csrf-token', token);

  return fetch(url, { ...options, headers });
}

export function resetCsrfToken() {
  csrfToken = null;
}
