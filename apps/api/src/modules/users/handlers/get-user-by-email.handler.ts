import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { GetUserByEmailQuery } from "../queries/get-user-by-email.query";
import { PrismaService } from "../../../prisma/prisma.service";

@QueryHandler(GetUserByEmailQuery)
export class GetUserByEmailHandler
  implements IQueryHandler<GetUserByEmailQuery>
{
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetUserByEmailQuery) {
    return this.prisma.user.findUnique({ where: { email: query.email } });
  }
}
