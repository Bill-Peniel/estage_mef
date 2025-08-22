import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@Injectable()
export class ServicesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createServiceDto: CreateServiceDto, userId: string) {
    try {
      // Vérifier que l'utilisateur appartient à la structure
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        include: { structure: true }
      });

      if (!user?.structure || user.structure.id !== createServiceDto.structureId) {
        throw new ForbiddenException('Vous ne pouvez créer des services que dans votre propre structure');
      }

      if (user.structure.type !== 'technique') {
        throw new ForbiddenException('Seules les structures techniques peuvent créer des services');
      }

      const service = await this.prisma.service.create({
        data: {
          nomService: createServiceDto.nomService,
          description: createServiceDto.description,
          structureId: createServiceDto.structureId
        },
        include: {
          structure: true,
          tuteurs: true,
          stagiaires: true
        }
      });

      return service;
    } catch (error) {
      throw error;
    }
  }

  async findAllByStructure(structureId: number) {
    try {
      return await this.prisma.service.findMany({
        where: { structureId, isDeleted: false },
        include: {
          structure: true,
          tuteurs: true,
          stagiaires: true
        }
      });
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: number) {
    try {
      const service = await this.prisma.service.findFirst({
        where: { id, isDeleted: false },
        include: {
          structure: true,
          tuteurs: true,
          stagiaires: true
        }
      });

      if (!service) {
        throw new NotFoundException('Service non trouvé');
      }

      return service;
    } catch (error) {
      throw error;
    }
  }

  async update(id: number, updateServiceDto: UpdateServiceDto, userId: string) {
    try {
      // Vérifier que l'utilisateur appartient à la structure du service
      const service = await this.prisma.service.findUnique({
        where: { id },
        include: { structure: true }
      });

      if (!service) {
        throw new NotFoundException('Service non trouvé');
      }

      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        include: { structure: true }
      });

      if (!user?.structure || user.structure.id !== service.structureId) {
        throw new ForbiddenException('Vous ne pouvez modifier que les services de votre structure');
      }

      const updatedService = await this.prisma.service.update({
        where: { id },
        data: updateServiceDto,
        include: {
          structure: true,
          tuteurs: true,
          stagiaires: true
        }
      });

      return updatedService;
    } catch (error) {
      throw error;
    }
  }

  async remove(id: number, userId: string) {
    try {
      // Vérifier que l'utilisateur appartient à la structure du service
      const service = await this.prisma.service.findUnique({
        where: { id },
        include: { structure: true }
      });

      if (!service) {
        throw new NotFoundException('Service non trouvé');
      }

      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        include: { structure: true }
      });

      if (!user?.structure || user.structure.id !== service.structureId) {
        throw new ForbiddenException('Vous ne pouvez supprimer que les services de votre structure');
      }

      // Soft delete
      await this.prisma.service.update({
        where: { id },
        data: { isDeleted: true }
      });

      return { message: 'Service supprimé avec succès' };
    } catch (error) {
      throw error;
    }
  }
}





