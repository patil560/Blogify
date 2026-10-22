const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:8000/api").replace(/\/$/, "");
let csrfToken = null;

async function getCsrf() {
  const res = await fetch(`${API_URL}/auth/csrf`, { credentials: "include" });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Could not initialize security token");
  csrfToken = data.csrfToken;
  return csrfToken;
}

export async function api(path, options = {}) {
  const method = (options.method || "GET").toUpperCase();
  if (!["GET", "HEAD", "OPTIONS"].includes(method) && !csrfToken) await getCsrf();
  const headers = new Headers(options.headers || {});
  if (!(options.body instanceof FormData) && options.body !== undefined) headers.set("Content-Type", "application/json");
  if (!["GET", "HEAD", "OPTIONS"].includes(method)) headers.set("X-CSRF-Token", csrfToken);
  let res = await fetch(`${API_URL}${path}`, { ...options, method, headers, credentials: "include" });
  if (res.status === 403 && method !== "GET") {
    csrfToken = null;
    await getCsrf();
    headers.set("X-CSRF-Token", csrfToken);
    res = await fetch(`${API_URL}${path}`, { ...options, method, headers, credentials: "include" });
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
}
export { getCsrf };
