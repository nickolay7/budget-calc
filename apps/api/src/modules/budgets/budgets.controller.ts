import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
} from "@nestjs/common";
import { BudgetsService } from "./budgets.service";
import { CurrentUser } from "../../common/decorators/current-user.decorator";

@Controller("budgets")
export class BudgetsController {
  constructor(private readonly budgetsService: BudgetsService) {}

  @Get()
  findAll(@CurrentUser("id") userId: string) {
    return this.budgetsService.findAll(userId);
  }

  @Get("progress")
  getProgress(@CurrentUser("id") userId: string) {
    return this.budgetsService.getProgress(userId);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.budgetsService.findOne(id);
  }

  @Post()
  create(@CurrentUser("id") userId: string, @Body() dto: unknown) {
    return this.budgetsService.create(userId, dto);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: unknown) {
    return this.budgetsService.update(id, dto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.budgetsService.remove(id);
  }
}
