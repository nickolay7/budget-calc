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
import { TransactionsService } from "./transactions.service";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { CreateTransactionDto } from "./dto/create-transaction.dto";
import { UpdateTransactionDto } from "./dto/update-transaction.dto";
import { QueryTransactionDto } from "./dto/query-transaction.dto";

@Controller("transactions")
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  findAll(
    @CurrentUser("id") userId: string,
    @Query() query: QueryTransactionDto,
  ) {
    return this.transactionsService.findAll(userId, query);
  }

  @Get("stats")
  getStats(
    @CurrentUser("id") userId: string,
    @Query() query: QueryTransactionDto,
  ) {
    return this.transactionsService.getStats(userId, query);
  }

  @Get(":id")
  findOne(
    @Param("id") id: string,
    @CurrentUser("id") userId: string,
  ) {
    return this.transactionsService.findOne(id, userId);
  }

  @Post()
  create(
    @CurrentUser("id") userId: string,
    @Body() dto: CreateTransactionDto,
  ) {
    return this.transactionsService.create(userId, dto);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @CurrentUser("id") userId: string,
    @Body() dto: UpdateTransactionDto,
  ) {
    return this.transactionsService.update(id, userId, dto);
  }

  @Delete(":id")
  remove(
    @Param("id") id: string,
    @CurrentUser("id") userId: string,
  ) {
    return this.transactionsService.remove(id, userId);
  }
}
