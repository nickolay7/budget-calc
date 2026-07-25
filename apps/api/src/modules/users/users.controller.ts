import { Controller, Get, Patch, Body } from "@nestjs/common";
import { QueryBus, CommandBus } from "@nestjs/cqrs";
import { GetUserByIdQuery } from "./queries/get-user-by-id.query";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { UpdateUserDto } from "./dto/update-user.dto";

@Controller("users")
export class UsersController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Get("me")
  getProfile(@CurrentUser("id") userId: string) {
    return this.queryBus.execute(new GetUserByIdQuery(userId));
  }

  @Patch("me")
  updateProfile(
    @CurrentUser("id") userId: string,
    @Body() _dto: UpdateUserDto,
  ) {
    // TODO: implement update via CQRS command
    return this.queryBus.execute(new GetUserByIdQuery(userId));
  }
}
