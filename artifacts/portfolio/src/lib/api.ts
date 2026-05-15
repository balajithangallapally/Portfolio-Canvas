const API_BASE = "/api";

export function getAuthToken(): string | null {
  return localStorage.getItem("admin_token");
}

export function setAuthToken(token: string): void {
  localStorage.setItem("admin_token", token);
}

export function clearAuthToken(): void {
  localStorage.removeItem("admin_token");
}

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> | undefined ?? {}),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

  if (res.status === 204) return undefined as T;

  const data = await res.json().catch(() => ({ error: res.statusText }));
  if (!res.ok) throw new Error(data.error ?? "API request failed");
  return data as T;
}
