import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
} from "@nestjs/common";
import { QueryBus, CommandBus } from "@nestjs/cqrs";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { GetCategoriesQuery } from "./queries/get-categories.query";
import { GetCategoryByIdQuery } from "./queries/get-category-by-id.query";
import { CreateCategoryCommand } from "./commands/create-category.command";
import { UpdateCategoryCommand } from "./commands/update-category.command";
import { DeleteCategoryCommand } from "./commands/delete-category.command";

@Controller("categories")
export class CategoriesController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Get()
  findAll(@CurrentUser("id") userId: string) {
    return this.queryBus.execute(new GetCategoriesQuery(userId));
  }

  @Get(":id")
  findOne(@Param("id") id: string, @CurrentUser("id") userId: string) {
    return this.queryBus.execute(new GetCategoryByIdQuery(id, userId));
  }

  @Post()
  create(@CurrentUser("id") userId: string, @Body() dto: CreateCategoryDto) {
    return this.commandBus.execute(
      new CreateCategoryCommand(userId, dto.name, dto.icon, dto.color),
    );
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @CurrentUser("id") userId: string,
    @Body() dto: UpdateCategoryDto,
  ) {
    return this.commandBus.execute(
      new UpdateCategoryCommand(id, userId, dto.name, dto.icon, dto.color),
    );
  }

  @Delete(":id")
  remove(@Param("id") id: string, @CurrentUser("id") userId: string) {
    return this.commandBus.execute(new DeleteCategoryCommand(id, userId));
  }
}
