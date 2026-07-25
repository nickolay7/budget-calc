import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class BudgetsService {
  constructor(private prisma: PrismaService) {}

  findAll(userId: string) {
    return this.prisma.budget.findMany({
      where: { userId },
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });
  }

  findOne(id: string) {
    return this.prisma.budget.findUnique({
      where: { id },
      include: { category: true },
    });
  }

  getProgress(_userId: string) {
    // TODO: implement — spent vs budget
    return { message: "progress" };
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
    return this.prisma.budget.delete({ where: { id } });
  }
}
