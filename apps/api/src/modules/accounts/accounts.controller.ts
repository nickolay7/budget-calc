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
import { AccountsService } from "./accounts.service";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { AccountDto } from "./dto/account-response.dto";
import { CreateAccountDto } from "./dto/create-account.dto";
import { UpdateAccountDto } from "./dto/update-account.dto";

/**
 * Контроллер счетов.
 * Предоставляет CRUD- endpoints для управления финансовыми счетами.
 * Все маршруты защищены JWT-аутентификацией.
 */
@ApiTags("accounts")
@ApiBearerAuth()
@Controller("accounts")
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Get()
  @ApiOperation({ summary: "Get all accounts for the current user" })
  @ApiResponse({ status: 200, description: "Accounts retrieved successfully", type: [AccountDto] })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  findAll(@CurrentUser("id") userId: string) {
    return this.accountsService.findAll(userId);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get an account by ID" })
  @ApiParam({ name: "id", description: "Account ID", type: String })
  @ApiResponse({ status: 200, description: "Account retrieved successfully", type: AccountDto })
  @ApiResponse({ status: 404, description: "Account not found" })
  findOne(@Param("id") id: string, @CurrentUser("id") userId: string) {
    return this.accountsService.findOne(id, userId);
  }

  @Post()
  @ApiOperation({ summary: "Create a new account" })
  @ApiResponse({ status: 201, description: "Account created successfully", type: AccountDto })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  create(@CurrentUser("id") userId: string, @Body() dto: CreateAccountDto) {
    return this.accountsService.create(userId, dto);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update an account by ID" })
  @ApiParam({ name: "id", description: "Account ID", type: String })
  @ApiResponse({ status: 200, description: "Account updated successfully", type: AccountDto })
  @ApiResponse({ status: 404, description: "Account not found" })
  update(
    @Param("id") id: string,
    @CurrentUser("id") userId: string,
    @Body() dto: UpdateAccountDto,
  ) {
    return this.accountsService.update(id, userId, dto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete an account by ID" })
  @ApiParam({ name: "id", description: "Account ID", type: String })
  @ApiResponse({ status: 200, description: "Account deleted successfully", type: AccountDto })
  @ApiResponse({ status: 404, description: "Account not found" })
  remove(@Param("id") id: string, @CurrentUser("id") userId: string) {
    return this.accountsService.remove(id, userId);
  }
}
