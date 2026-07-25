import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
} from "@nestjs/common";
import { AccountsService } from "./accounts.service";
import { CurrentUser } from "../../common/decorators/current-user.decorator";

@Controller("accounts")
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Get()
  findAll(@CurrentUser("id") userId: string) {
    return this.accountsService.findAll(userId);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.accountsService.findOne(id);
  }

  @Post()
  create(@CurrentUser("id") userId: string, @Body() dto: unknown) {
    return this.accountsService.create(userId, dto);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: unknown) {
    return this.accountsService.update(id, dto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.accountsService.remove(id);
  }
}
