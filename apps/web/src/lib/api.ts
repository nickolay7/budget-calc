export function apiClient() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

  async function request<T>(
    path: string,
    options?: RequestInit,
  ): Promise<T> {
    const res = await fetch(`${baseUrl}${path}`, {
      headers: { "Content-Type": "application/json", ...options?.headers },
      ...options,
    });

    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }

    return res.json();
  }

  return {
    get: <T,>(path: string) => request<T>(path),
    post: <T,>(path: string, body: unknown) =>
      request<T>(path, { method: "POST", body: JSON.stringify(body) }),
    patch: <T,>(path: string, body: unknown) =>
      request<T>(path, { method: "PATCH", body: JSON.stringify(body) }),
    delete: <T,>(path: string) => request<T>(path, { method: "DELETE" }),
  };
}
