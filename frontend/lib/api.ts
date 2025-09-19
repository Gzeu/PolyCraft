// API client for PolyCraft frontend
// Uses relative routes (/api/*) for Vercel serverless functions
// Fallback to NEXT_PUBLIC_API_URL if external backend is configured

const base = (process.env.NEXT_PUBLIC_API_URL || "").trim().replace(/\/$/, "");

export async function apiFetch(path: string, init: RequestInit = {}) {
  const headers = new Headers(init.headers || {});
  headers.set("Content-Type", "application/json");
  
  // On Vercel, use relative routes (/api/...)
  // If NEXT_PUBLIC_API_URL is set, use external backend
  const url = base ? `${base}${path}` : path;
  
  try {
    const response = await fetch(url, { ...init, headers });
    return response;
  } catch (error) {
    console.error('API fetch error:', error);
    throw error;
  }
}

// Helper function to check API health
export async function checkHealth() {
  try {
    const response = await apiFetch('/api/health');
    if (response.ok) {
      return await response.json();
    }
    throw new Error(`Health check failed: ${response.status}`);
  } catch (error) {
    console.error('Health check failed:', error);
    throw error;
  }
}
