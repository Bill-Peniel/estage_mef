import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ThemeService {
  constructor(private prisma: PrismaService) {}

  async getThemesByTuteur(tuteurId: string) {
    return this.prisma.themeTuteur.findMany({
      where: { tuteurId },
      orderBy: { id: 'desc' }
    });
  }

  async createTheme(tuteurId: string, data: { titre: string, description?: string, disponible?: boolean }) {
    return this.prisma.themeTuteur.create({
      data: {
        titre: data.titre,
        description: data.description,
        disponible: data.disponible ?? true,
        tuteurId
      }
    });
  }

  async updateTheme(tuteurId: string, id: string, data: { titre: string, description?: string, disponible?: boolean }) {
    const theme = await this.prisma.themeTuteur.findUnique({ where: { id } });
    if (!theme || theme.tuteurId !== tuteurId) throw new ForbiddenException('Accès refusé');
    return this.prisma.themeTuteur.update({
      where: { id },
      data: {
        titre: data.titre,
        description: data.description,
        disponible: data.disponible
      }
    });
  }

  async deleteTheme(tuteurId: string, id: string) {
    const theme = await this.prisma.themeTuteur.findUnique({ where: { id } });
    if (!theme || theme.tuteurId !== tuteurId) throw new ForbiddenException('Accès refusé');
    return this.prisma.themeTuteur.delete({ where: { id } });
  }

  async affecterTheme(tuteurId: string, id: string, stagiaireId: string) {
    const theme = await this.prisma.themeTuteur.findUnique({ where: { id } });
    if (!theme || theme.tuteurId !== tuteurId) throw new ForbiddenException('Accès refusé');
    if (!theme.disponible) throw new ForbiddenException('Thème déjà affecté');
    return this.prisma.themeTuteur.update({
      where: { id },
      data: {
        disponible: false
      }
    });
  }
} 