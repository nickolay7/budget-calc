/**
 * Типы данных, связанные с пользователями и аутентификацией.
 * Содержит интерфейсы для профиля пользователя, DTO для создания/обновления,
 * а также типы для JWT-токенов и операций входа/восстановления пароля.
 */

/** Профиль пользователя, возвращаемый API */
export interface UserProfile {
  /** Уникальный идентификатор пользователя */
  id: string;
  /** Email пользователя */
  email: string;
  /** Имя пользователя (может быть null) */
  name: string | null;
  /** Дата создания аккаунта */
  createdAt: string;
}

/** DTO для регистрации нового пользователя */
export interface CreateUserDto {
  /** Email пользователя */
  email: string;
  /** Имя пользователя */
  name: string;
  /** Пароль (минимум 6 символов) */
  password: string;
}

/** DTO для обновления профиля пользователя */
export interface UpdateUserDto {
  /** Новый email (опционально) */
  email?: string;
  /** Новое имя (опционально) */
  name?: string;
}

/** JWT-токены доступа и обновления */
export interface AuthTokens {
  /** JWT-токен доступа (короткоживущий) */
  accessToken: string;
  /** JWT-токен обновления (долгоживущий) */
  refreshToken: string;
}

/** Ответ сервера при успешной аутентификации */
export interface AuthResponse {
  /** JWT-токен доступа */
  accessToken: string;
  /** JWT-токен обновления */
  refreshToken: string;
  /** Профиль аутентифицированного пользователя */
  user: UserProfile;
}

/** DTO для входа в систему */
export interface LoginDto {
  /** Email пользователя */
  email: string;
  /** Пароль пользователя */
  password: string;
}

/** DTO для запроса восстановления пароля */
export interface ForgotPasswordDto {
  /** Email, на который отправить ссылку для сброса пароля */
  email: string;
}

/** DTO для сброса пароля с токеном */
export interface ResetPasswordDto {
  /** Токен сброса пароля, полученный по email */
  token: string;
  /** Новый пароль */
  password: string;
}
