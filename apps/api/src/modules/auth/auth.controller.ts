import { Controller, Post, Body } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { Public } from "../../common/decorators/public.decorator";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { ForgotPasswordDto } from "./dto/forgot-password.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { AuthResponseDto } from "./dto/auth-response.dto";
import { MessageResponseDto } from "../../common/dto/message-response.dto";

/**
 * Контроллер аутентификации.
 * Все маршруты публичные (не требуют JWT-токена).
 * Предоставляет endpoints для регистрации, входа, обновления токена,
 * и сброса пароля.
 */
@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post("register")
  @ApiOperation({ summary: "Register a new user" })
  @ApiResponse({ status: 201, description: "User successfully registered", type: AuthResponseDto })
  @ApiResponse({ status: 409, description: "User with this email already exists" })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Public()
  @Post("login")
  @ApiOperation({ summary: "Log in with email and password" })
  @ApiResponse({ status: 201, description: "User successfully logged in", type: AuthResponseDto })
  @ApiResponse({ status: 401, description: "Invalid credentials" })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Public()
  @Post("refresh")
  @ApiOperation({ summary: "Refresh access token" })
  @ApiResponse({ status: 201, description: "Tokens refreshed successfully", type: AuthResponseDto })
  @ApiResponse({ status: 401, description: "Invalid or expired refresh token" })
  refresh(@Body("refreshToken") refreshToken: string) {
    return this.authService.refresh(refreshToken);
  }

  @Public()
  @Post("forgot-password")
  @ApiOperation({ summary: "Request a password reset link" })
  @ApiResponse({ status: 201, description: "Reset link sent (if email exists)", type: MessageResponseDto })
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto);
  }

  @Public()
  @Post("reset-password")
  @ApiOperation({ summary: "Reset password using a reset token" })
  @ApiResponse({ status: 201, description: "Password reset successfully", type: MessageResponseDto })
  @ApiResponse({ status: 400, description: "Invalid or expired reset token" })
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }
}
