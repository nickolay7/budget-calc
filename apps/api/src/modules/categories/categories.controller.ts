import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
} from "@nestjs/common";
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiParam } from "@nestjs/swagger";
import { QueryBus, CommandBus } from "@nestjs/cqrs";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { GetCategoriesQuery } from "./queries/get-categories.query";
import { GetCategoryByIdQuery } from "./queries/get-category-by-id.query";
import { CreateCategoryCommand } from "./commands/create-category.command";
import { UpdateCategoryCommand } from "./commands/update-category.command";
import { DeleteCategoryCommand } from "./commands/delete-category.command";
import { CategoryDto, CategoryWithTransactionsDto } from "./dto/category-response.dto";

/**
 * Контроллер категорий.
 * Предоставляет CRUD- endpoints для управления категориями.
 * Все маршруты защищены JWT-аутентификацией, используют CQRS.
 */
@ApiTags("categories")
@ApiBearerAuth()
@Controller("categories")
export class CategoriesController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Get()
  @ApiOperation({ summary: "Get all categories for the current user" })
  @ApiResponse({ status: 200, description: "Categories retrieved successfully", type: [CategoryDto] })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  findAll(@CurrentUser("id") userId: string) {
    return this.queryBus.execute(new GetCategoriesQuery(userId));
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a category by ID with recent transactions" })
  @ApiParam({ name: "id", description: "Category ID", type: String })
  @ApiResponse({ status: 200, description: "Category retrieved successfully", type: CategoryWithTransactionsDto })
  @ApiResponse({ status: 404, description: "Category not found" })
  findOne(@Param("id") id: string, @CurrentUser("id") userId: string) {
    return this.queryBus.execute(new GetCategoryByIdQuery(id, userId));
  }

  @Post()
  @ApiOperation({ summary: "Create a new category" })
  @ApiResponse({ status: 201, description: "Category created successfully", type: CategoryDto })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 409, description: "Category with this name already exists" })
  create(@CurrentUser("id") userId: string, @Body() dto: CreateCategoryDto) {
    return this.commandBus.execute(
      new CreateCategoryCommand(userId, dto.name, dto.icon, dto.color),
    );
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update a category by ID" })
  @ApiParam({ name: "id", description: "Category ID", type: String })
  @ApiResponse({ status: 200, description: "Category updated successfully", type: CategoryDto })
  @ApiResponse({ status: 404, description: "Category not found" })
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
  @ApiOperation({ summary: "Delete a category by ID" })
  @ApiParam({ name: "id", description: "Category ID", type: String })
  @ApiResponse({ status: 200, description: "Category deleted successfully" })
  @ApiResponse({ status: 404, description: "Category not found" })
  remove(@Param("id") id: string, @CurrentUser("id") userId: string) {
    return this.commandBus.execute(new DeleteCategoryCommand(id, userId));
  }
}
