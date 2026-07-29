/**
 * Фабрика простого API-клиента на основе fetch.
 *
 * Возвращает объект с методами get, post, patch, delete для
 * выполнения HTTP-запросов к backend-серверу.
 * Базовый URL берётся из NEXT_PUBLIC_API_URL или localhost:3001.
 *
 * @returns Объект с методами HTTP-запросов.
 */
export function apiClient() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

  /**
   * Выполняет HTTP-запрос.
   *
   * @param path - Путь запроса (добавляется к baseUrl).
   * @param options - Дополнительные опции запроса (метод, тело, заголовки).
   * @returns Ответ, преобразованный в JSON.
   */
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
    /**
     * GET-запрос.
     *
     * @param path - Путь запроса.
     * @returns Ответ заданного типа.
     */
    get: <T,>(path: string) => request<T>(path),
    /**
     * POST-запрос.
     *
     * @param path - Путь запроса.
     * @param body - Тело запроса.
     * @returns Ответ заданного типа.
     */
    post: <T,>(path: string, body: unknown) =>
      request<T>(path, { method: "POST", body: JSON.stringify(body) }),
    /**
     * PATCH-запрос.
     *
     * @param path - Путь запроса.
     * @param body - Тело запроса.
     * @returns Ответ заданного типа.
     */
    patch: <T,>(path: string, body: unknown) =>
      request<T>(path, { method: "PATCH", body: JSON.stringify(body) }),
    /**
     * DELETE-запрос.
     *
     * @param path - Путь запроса.
     * @returns Ответ заданного типа.
     */
    delete: <T,>(path: string) => request<T>(path, { method: "DELETE" }),
  };
}
