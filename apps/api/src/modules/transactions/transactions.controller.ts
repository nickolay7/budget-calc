import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
} from "@nestjs/common";
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiParam, ApiQuery } from "@nestjs/swagger";
import { TransactionsService } from "./transactions.service";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { CreateTransactionDto } from "./dto/create-transaction.dto";
import { UpdateTransactionDto } from "./dto/update-transaction.dto";
import { QueryTransactionDto } from "./dto/query-transaction.dto";
import { TransactionDto, PaginatedTransactionsDto } from "./dto/transaction-response.dto";
import { TransactionStatsDto } from "./dto/transaction-stats.dto";

/**
 * Контроллер транзакций.
 * Предоставляет CRUD- endpoints для управления транзакциями,
 * а также endpoint для получения агрегированной статистики.
 * Все маршруты защищены JWT-аутентификацией.
 */
@ApiTags("transactions")
@ApiBearerAuth()
@Controller("transactions")
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  @ApiOperation({ summary: "Get all transactions with pagination and filtering" })
  @ApiQuery({ type: QueryTransactionDto })
  @ApiResponse({ status: 200, description: "Transactions retrieved successfully", type: PaginatedTransactionsDto })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  findAll(
    @CurrentUser("id") userId: string,
    @Query() query: QueryTransactionDto,
  ) {
    return this.transactionsService.findAll(userId, query);
  }

  @Get("stats")
  @ApiOperation({ summary: "Get aggregated transaction statistics" })
  @ApiQuery({ type: QueryTransactionDto })
  @ApiResponse({ status: 200, description: "Statistics retrieved successfully", type: TransactionStatsDto })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  getStats(
    @CurrentUser("id") userId: string,
    @Query() query: QueryTransactionDto,
  ) {
    return this.transactionsService.getStats(userId, query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a transaction by ID" })
  @ApiParam({ name: "id", description: "Transaction ID", type: String })
  @ApiResponse({ status: 200, description: "Transaction retrieved successfully", type: TransactionDto })
  @ApiResponse({ status: 404, description: "Transaction not found" })
  findOne(
    @Param("id") id: string,
    @CurrentUser("id") userId: string,
  ) {
    return this.transactionsService.findOne(id, userId);
  }

  @Post()
  @ApiOperation({ summary: "Create a new transaction" })
  @ApiResponse({ status: 201, description: "Transaction created successfully", type: TransactionDto })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  create(
    @CurrentUser("id") userId: string,
    @Body() dto: CreateTransactionDto,
  ) {
    return this.transactionsService.create(userId, dto);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update a transaction by ID" })
  @ApiParam({ name: "id", description: "Transaction ID", type: String })
  @ApiResponse({ status: 200, description: "Transaction updated successfully", type: TransactionDto })
  @ApiResponse({ status: 404, description: "Transaction not found" })
  update(
    @Param("id") id: string,
    @CurrentUser("id") userId: string,
    @Body() dto: UpdateTransactionDto,
  ) {
    return this.transactionsService.update(id, userId, dto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete a transaction by ID" })
  @ApiParam({ name: "id", description: "Transaction ID", type: String })
  @ApiResponse({ status: 200, description: "Transaction deleted successfully" })
  @ApiResponse({ status: 404, description: "Transaction not found" })
  remove(
    @Param("id") id: string,
    @CurrentUser("id") userId: string,
  ) {
    return this.transactionsService.remove(id, userId);
  }
}
