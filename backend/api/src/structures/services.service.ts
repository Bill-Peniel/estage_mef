import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateServiceDto } from './dto/create-service.dto';

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

      // Vérifier que la structure est de type technique
      if (user.structure.type !== 'technique') {
        throw new ForbiddenException('Seules les structures techniques peuvent créer des services');
      }

      const service = await this.prisma.service.create({
        data: {
          nomService: createServiceDto.nomService,
          description: createServiceDto.description,
          structureId: createServiceDto.structureId
        }
      });

      return service;
    } catch (error) {
      throw error;
    }
  }

  async findAllByStructure(structureId: number) {
    try {
      const services = await this.prisma.service.findMany({
        where: {
          structureId,
          isDeleted: false
        },
        include: {
          tuteurs: {
            include: {
              user: {
                include: {
                  profile: true
                }
              }
            }
          },
          stagiaires: {
            include: {
              user: {
                include: {
                  profile: true
                }
              }
            }
          }
        }
      });

      return services;
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: number) {
    try {
      const service = await this.prisma.service.findUnique({
        where: { id },
        include: {
          structure: true,
          tuteurs: {
            include: {
              user: {
                include: {
                  profile: true
                }
              }
            }
          },
          stagiaires: {
            include: {
              user: {
                include: {
                  profile: true
                }
              }
            }
          }
        }
      });

      if (!service) {
        throw new NotFoundException(`Service avec l'ID ${id} non trouvé`);
      }

      return service;
    } catch (error) {
      throw error;
    }
  }

  async update(id: number, updateServiceDto: Partial<CreateServiceDto>, userId: string) {
    try {
      // Vérifier que l'utilisateur appartient à la structure du service
      const service = await this.prisma.service.findUnique({
        where: { id },
        include: { structure: true }
      });

      if (!service) {
        throw new NotFoundException(`Service avec l'ID ${id} non trouvé`);
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
        data: updateServiceDto
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
        throw new NotFoundException(`Service avec l'ID ${id} non trouvé`);
      }

      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        include: { structure: true }
      });

      if (!user?.structure || user.structure.id !== service.structureId) {
        throw new ForbiddenException('Vous ne pouvez supprimer que les services de votre structure');
      }

      // Soft delete
      const deletedService = await this.prisma.service.update({
        where: { id },
        data: { isDeleted: true }
      });

      return deletedService;
    } catch (error) {
      throw error;
    }
  }
}

