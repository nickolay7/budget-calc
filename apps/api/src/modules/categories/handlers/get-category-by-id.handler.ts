import { NotFoundException } from "@nestjs/common";
import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { GetCategoryByIdQuery } from "../queries/get-category-by-id.query";
import { PrismaService } from "../../../prisma/prisma.service";

@QueryHandler(GetCategoryByIdQuery)
export class GetCategoryByIdHandler implements IQueryHandler<GetCategoryByIdQuery> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetCategoryByIdQuery) {
    const category = await this.prisma.category.findFirst({
      where: { id: query.id, userId: query.userId },
      include: { transactions: { take: 10, orderBy: { date: "desc" } } },
    });

    if (!category) {
      throw new NotFoundException("Category not found");
    }

    return category;
  }
}
