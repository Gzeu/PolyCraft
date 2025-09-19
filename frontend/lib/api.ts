const base = (process.env.NEXT_PUBLIC_API_URL || "").trim().replace(/\/$/, "");

export async function apiFetch(path: string, init: RequestInit = {}) {
  const headers = new Headers(init.headers || {});
  headers.set("Content-Type", "application/json");
  // On Vercel, use relative routes (/api/...), fallback to NEXT_PUBLIC_API_URL if set
  const url = base ? `${base}${path}` : path;
  return fetch(url, { ...init, headers });
}
