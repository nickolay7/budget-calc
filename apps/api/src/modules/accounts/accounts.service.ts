import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class AccountsService {
  constructor(private prisma: PrismaService) {}

  findAll(userId: string) {
    return this.prisma.account.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }

  findOne(id: string) {
    return this.prisma.account.findUnique({ where: { id } });
  }

  create(_userId: string, _dto: unknown) {
    // TODO: implement
    return { message: "created" };
  }

  update(_id: string, _dto: unknown) {
    // TODO: implement
    return { message: "updated" };
  }

  remove(id: string) {
    return this.prisma.account.delete({ where: { id } });
  }
}
