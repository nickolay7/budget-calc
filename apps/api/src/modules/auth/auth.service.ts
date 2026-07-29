import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import * as bcrypt from "bcryptjs";
import * as crypto from "crypto";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateUserCommand } from "../users/commands/create-user.command";
import { GetUserByEmailQuery } from "../users/queries/get-user-by-email.query";
import { GetUserByIdQuery } from "../users/queries/get-user-by-id.query";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { ForgotPasswordDto } from "./dto/forgot-password.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";

/**
 * Сервис аутентификации.
 * Содержит бизнес-логику регистрации, входа, обновления токенов и сброса пароля.
 * Использует CQRS для взаимодействия с модулем пользователей.
 */
@Injectable()
export class AuthService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Регистрирует нового пользователя.
   * Проверяет уникальность email, хеширует пароль и создаёт пользователя через CQRS.
   *
   * @param dto - Данные для регистрации (email, name, password)
   * @returns Объект с accessToken, refreshToken и данными пользователя
   * @throws ConflictException если email уже занят
   */
  async register(dto: RegisterDto) {
    const existing = await this.queryBus.execute(
      new GetUserByEmailQuery(dto.email),
    );
    if (existing) {
      throw new ConflictException("Email already in use");
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = await this.commandBus.execute(
      new CreateUserCommand(dto.email, dto.name, passwordHash),
    );

    return this.generateTokens(user);
  }

  /**
   * Выполняет вход пользователя по email и паролю.
   * Проверяет существование пользователя и корректность пароля.
   *
   * @param dto - Учётные данные (email, password)
   * @returns Объект с accessToken, refreshToken и данными пользователя
   * @throws UnauthorizedException если email не найден или пароль неверен
   */
  async login(dto: LoginDto) {
    const user = await this.queryBus.execute(
      new GetUserByEmailQuery(dto.email),
    );

    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid credentials");
    }

    return this.generateTokens(user);
  }

  /**
   * Обновляет пару токенов по refresh-токену.
   * Верифицирует токен, находит пользователя и генерирует новую пару.
   *
   * @param token - Refresh-токен
   * @returns Объект с новыми accessToken, refreshToken и данными пользователя
   * @throws UnauthorizedException если токен невалиден или пользователь не найден
   */
  async refresh(token: string) {
    try {
      const payload = this.jwtService.verify<{ sub: string }>(token, {
        secret: this.config.get<string>("JWT_SECRET"),
      });

      const user = await this.queryBus.execute(
        new GetUserByIdQuery(payload.sub),
      );

      if (!user) {
        throw new UnauthorizedException("User not found");
      }

      return this.generateTokens(user);
    } catch {
      throw new UnauthorizedException("Invalid refresh token");
    }
  }

  /**
   * Обрабатывает запрос на сброс пароля.
   * Генерирует токен сброса, сохраняет его в БД с часовым сроком действия.
   * В production отправляет email, в dev-режиме выводит токен в консоль.
   * Всегда возвращает одинаковый ответ для защиты от перечисления email.
   *
   * @param dto - Email пользователя
   * @returns Сообщение об отправке ссылки для сброса
   */
  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.queryBus.execute(
      new GetUserByEmailQuery(dto.email),
    );

    // Always return success to avoid email enumeration
    if (!user) {
      return { message: "If that email exists, a reset link has been sent." };
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await this.prisma.user.update({
      where: { email: dto.email },
      data: {
        passwordResetToken: resetToken,
        passwordResetExpires: expiresAt,
      },
    });

    // In production, send email here
    console.log(`[DEV] Password reset token for ${dto.email}: ${resetToken}`);

    return { message: "If that email exists, a reset link has been sent." };
  }

  /**
   * Выполняет сброс пароля по токену.
   * Проверяет валидность и срок действия токена, хеширует новый пароль и обновляет пользователя.
   *
   * @param dto - Токен сброса и новый пароль
   * @returns Сообщение об успешном сбросе пароля
   * @throws BadRequestException если токен невалиден или истёк
   */
  async resetPassword(dto: ResetPasswordDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        passwordResetToken: dto.token,
        passwordResetExpires: { gt: new Date() },
      },
    });

    if (!user) {
      throw new BadRequestException("Invalid or expired reset token");
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: passwordHash,
        passwordResetToken: null,
        passwordResetExpires: null,
      },
    });

    return { message: "Password has been reset successfully." };
  }

  /**
   * Генерирует пару JWT-токенов (access + refresh) для аутентифицированного пользователя.
   *
   * @param user - Объект пользователя с полями id, email, name
   * @returns Объект с accessToken, refreshToken и данными пользователя
   */
  private generateTokens(user: {
    id: string;
    email: string;
    name?: string | null;
  }) {
    const payload = { sub: user.id, email: user.email };

    const accessToken = this.jwtService.sign(payload);

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.config.get<string>("JWT_REFRESH_EXPIRATION") ?? "7d",
    } as any);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name ?? null,
      },
    };
  }
}
