import { Controller, Get, Patch, Body } from "@nestjs/common";
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { QueryBus, CommandBus } from "@nestjs/cqrs";
import { GetUserByIdQuery } from "./queries/get-user-by-id.query";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserProfileDto } from "./dto/user-profile.dto";

/**
 * Контроллер пользователей.
 * Предоставляет endpoints для получения и обновления профиля текущего пользователя.
 * Все маршруты защищены JWT-аутентификацией.
 */
@ApiTags("users")
@ApiBearerAuth()
@Controller("users")
export class UsersController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Get("me")
  @ApiOperation({ summary: "Get the current user's profile" })
  @ApiResponse({ status: 200, description: "Profile retrieved successfully", type: UserProfileDto })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  getProfile(@CurrentUser("id") userId: string) {
    return this.queryBus.execute(new GetUserByIdQuery(userId));
  }

  @Patch("me")
  @ApiOperation({ summary: "Update the current user's profile" })
  @ApiResponse({ status: 200, description: "Profile updated successfully", type: UserProfileDto })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  updateProfile(
    @CurrentUser("id") userId: string,
    @Body() _dto: UpdateUserDto,
  ) {
    // TODO: implement update via CQRS command
    return this.queryBus.execute(new GetUserByIdQuery(userId));
  }
}
