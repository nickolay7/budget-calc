import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { GetCategoriesQuery } from "../queries/get-categories.query";
import { PrismaService } from "../../../prisma/prisma.service";

@QueryHandler(GetCategoriesQuery)
export class GetCategoriesHandler implements IQueryHandler<GetCategoriesQuery> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetCategoriesQuery) {
    return this.prisma.category.findMany({
      where: { userId: query.userId },
      orderBy: { name: "asc" },
    });
  }
}
