/**
 * Утилита для выполнения HTTP-запросов с JWT-аутентификацией.
 */

/**
 * Выполняет HTTP-запрос с Bearer-токеном авторизации.
 *
 * @param url - URL для запроса
 * @param token - JWT-токен для заголовка Authorization
 * @param options - Дополнительные опции RequestInit
 * @returns Ответ, распарсенный как JSON указанного типа T
 * @throws Ошибка, если статус ответа не OK
 */
export async function fetchWithAuth<T>(
  url: string,
  token: string,
  options?: RequestInit,
): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: {
      ...options?.headers,
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`);
  }

  return res.json();
}
