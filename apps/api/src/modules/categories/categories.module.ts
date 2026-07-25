import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { CategoriesController } from "./categories.controller";
import { GetCategoriesHandler } from "./handlers/get-categories.handler";
import { GetCategoryByIdHandler } from "./handlers/get-category-by-id.handler";
import { CreateCategoryHandler } from "./handlers/create-category.handler";
import { UpdateCategoryHandler } from "./handlers/update-category.handler";
import { DeleteCategoryHandler } from "./handlers/delete-category.handler";

@Module({
  imports: [CqrsModule],
  controllers: [CategoriesController],
  providers: [
    GetCategoriesHandler,
    GetCategoryByIdHandler,
    CreateCategoryHandler,
    UpdateCategoryHandler,
    DeleteCategoryHandler,
  ],
})
export class CategoriesModule {}
