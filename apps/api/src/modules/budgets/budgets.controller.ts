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
import { BudgetsService } from "./budgets.service";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { BudgetDto } from "./dto/budget-response.dto";
import { BudgetProgressItemDto } from "./dto/budget-progress.dto";
import { MessageResponseDto } from "../../common/dto/message-response.dto";

/**
 * Контроллер бюджетов.
 * Предоставляет CRUD- endpoints для управления бюджетами,
 * а также endpoint для получения прогресса по категориям.
 * Все маршруты защищены JWT-аутентификацией.
 */
@ApiTags("budgets")
@ApiBearerAuth()
@Controller("budgets")
export class BudgetsController {
  constructor(private readonly budgetsService: BudgetsService) {}

  @Get()
  @ApiOperation({ summary: "Get all budgets for the current user" })
  @ApiResponse({ status: 200, description: "Budgets retrieved successfully", type: [BudgetDto] })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  findAll(@CurrentUser("id") userId: string) {
    return this.budgetsService.findAll(userId);
  }

  @Get("progress")
  @ApiOperation({ summary: "Get budget progress (actual vs planned)" })
  @ApiResponse({ status: 200, description: "Progress retrieved successfully", type: [BudgetProgressItemDto] })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  getProgress(@CurrentUser("id") userId: string) {
    return this.budgetsService.getProgress(userId);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a budget by ID" })
  @ApiParam({ name: "id", description: "Budget ID", type: String })
  @ApiResponse({ status: 200, description: "Budget retrieved successfully", type: BudgetDto })
  @ApiResponse({ status: 404, description: "Budget not found" })
  findOne(@Param("id") id: string) {
    return this.budgetsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: "Create a new budget" })
  @ApiResponse({ status: 201, description: "Budget created successfully", type: MessageResponseDto })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  create(@CurrentUser("id") userId: string, @Body() dto: unknown) {
    return this.budgetsService.create(userId, dto);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update a budget by ID" })
  @ApiParam({ name: "id", description: "Budget ID", type: String })
  @ApiResponse({ status: 200, description: "Budget updated successfully", type: MessageResponseDto })
  @ApiResponse({ status: 404, description: "Budget not found" })
  update(@Param("id") id: string, @Body() dto: unknown) {
    return this.budgetsService.update(id, dto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete a budget by ID" })
  @ApiParam({ name: "id", description: "Budget ID", type: String })
  @ApiResponse({ status: 200, description: "Budget deleted successfully", type: BudgetDto })
  @ApiResponse({ status: 404, description: "Budget not found" })
  remove(@Param("id") id: string) {
    return this.budgetsService.remove(id);
  }
}
