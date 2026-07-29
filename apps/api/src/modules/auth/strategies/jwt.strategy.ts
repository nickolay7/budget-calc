import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../../../prisma/prisma.service";

/**
 * Стратегия Passport для аутентификации по JWT (Bearer-токен).
 * Извлекает токен из заголовка Authorization, проверяет подпись
 * и возвращает объект пользователя в request.user.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  /**
   * @param config - ConfigService для получения JWT_SECRET
   * @param prisma - PrismaService для поиска пользователя
   */
  constructor(
    config: ConfigService,
    private prisma: PrismaService,
  ) {
    const jwtSecret = config.get<string>("JWT_SECRET");
    if (!jwtSecret) {
      throw new Error("JWT_SECRET is not configured");
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtSecret,
    });
  }

  /**
   * Валидирует JWT- payload и возвращает данные пользователя.
   *
   * @param payload - Расшифрованный payload JWT с полем sub (id пользователя)
   * @returns Объект с id, email и name пользователя
   * @throws UnauthorizedException если пользователь не найден
   */
  async validate(payload: { sub: string }) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    return { id: user.id, email: user.email, name: user.name };
  }
}
