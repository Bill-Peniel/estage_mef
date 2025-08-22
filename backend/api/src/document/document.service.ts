import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DocumentService {
  constructor(private prisma: PrismaService) {}

  async findAllByUser(userId: string) {
    return this.prisma.document.findMany({ where: { userId } });
  }

  async create(userId: string, type: string, name: string, path: string) {
    return this.prisma.document.create({
      data: { userId, type, name, path }
    });
  }

  async remove(id: string, userId: string) {
    return this.prisma.document.delete({ where: { id, userId } });
  }
} 