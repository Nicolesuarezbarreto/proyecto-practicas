const BASE_URL = import.meta.env.VITE_API_BASE_URL;

function buildHeaders(custom = {}) {
  const headers = { 'Content-Type': 'application/json', ...custom };
  const token = localStorage.getItem('authToken');
  if (token) headers.Authorization = token;
  return headers;
}

export async function request(path, { method = 'GET', body, headers } = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: buildHeaders(headers),
    body: body ? JSON.stringify(body) : undefined,
  });

  const isJson = res.headers.get('content-type')?.includes('application/json');
  const data = isJson ? await res.json() : null;

  if (!res.ok) {
    const message = data?.message || `HTTP ${res.status} ${res.statusText}`;
    throw new Error(message);
  }
  return data;
}

export const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: 'POST', body }),
  put: (path, body) => request(path, { method: 'PUT', body }),
  del: (path) => request(path, { method: 'DELETE' }),
};
