import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { GetUserByIdQuery } from "../queries/get-user-by-id.query";
import { PrismaService } from "../../../prisma/prisma.service";

@QueryHandler(GetUserByIdQuery)
export class GetUserByIdHandler implements IQueryHandler<GetUserByIdQuery> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetUserByIdQuery) {
    return this.prisma.user.findUnique({
      where: { id: query.id },
      select: { id: true, email: true, name: true, createdAt: true },
    });
  }
}
