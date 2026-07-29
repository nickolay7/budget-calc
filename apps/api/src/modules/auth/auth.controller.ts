import { Controller, Post, Body } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Public } from "../../common/decorators/public.decorator";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { ForgotPasswordDto } from "./dto/forgot-password.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";

/**
 * Контроллер аутентификации.
 * Все маршруты публичные (не требуют JWT-токена).
 * Предоставляет endpoints для регистрации, входа, обновления токена,
 * и сброса пароля.
 */
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Регистрация нового пользователя.
   *
   * @param dto - Данные для регистрации (email, name, password)
   * @returns Объект с accessToken, refreshToken и данными пользователя
   */
  @Public()
  @Post("register")
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  /**
   * Вход в систему по email и паролю.
   *
   * @param dto - Учётные данные (email, password)
   * @returns Объект с accessToken, refreshToken и данными пользователя
   */
  @Public()
  @Post("login")
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  /**
   * Обновление access-токена с помощью refresh-токена.
   *
   * @param refreshToken - Refresh-токен из тела запроса
   * @returns Объект с новыми accessToken, refreshToken и данными пользователя
   */
  @Public()
  @Post("refresh")
  refresh(@Body("refreshToken") refreshToken: string) {
    return this.authService.refresh(refreshToken);
  }

  /**
   * Запрос на сброс пароля. Отправляет токен сброса на email (в dev-режиме выводит в консоль).
   *
   * @param dto - Email пользователя
   * @returns Сообщение об отправке ссылки для сброса
   */
  @Public()
  @Post("forgot-password")
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto);
  }

  /**
   * Сброс пароля с использованием токена.
   *
   * @param dto - Токен сброса и новый пароль
   * @returns Сообщение об успешном сбросе пароля
   */
  @Public()
  @Post("reset-password")
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }
}
