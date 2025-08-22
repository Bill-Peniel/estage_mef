import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AffectationsService {
  constructor(private prisma: PrismaService) {}

  private async getChildStructureIds(parentId: number): Promise<number[]> {
    const childStructures = await this.prisma.structure.findMany({
      where: {
        parentId: parentId,
        isDeleted: false
      },
      select: {
        id: true
      }
    });

    const childIds = childStructures.map(s => s.id);
    const grandChildIds = await Promise.all(
      childIds.map(id => this.getChildStructureIds(id))
    );

    return [...childIds, ...grandChildIds.flat()];
  }

  async getStagiaires(structureId: number) {
    return this.prisma.stagiaire.findMany({
      where: {
        structureAffecteeId: structureId
      },
      include: {
        user: {
          include: {
            profile: true,
          },
        },
      },
    });
  }

  async getTuteurs(structureId: number) {
    // Récupérer les IDs des sous-structures
    const childStructureIds = await this.getChildStructureIds(structureId);
    const allStructureIds = [structureId, ...childStructureIds];

    return this.prisma.tuteur.findMany({
      where: {
        structureId: {
          in: allStructureIds
        }
      },
      include: {
        user: {
          include: {
            profile: true,
          },
        },
        structure: {
          select: {
            id: true,
            nomStructure: true,
            sigle: true
          }
        }
      },
    });
  }

  async getAffectations(structureId: number) {
    // Récupérer les IDs des sous-structures
    const childStructureIds = await this.getChildStructureIds(structureId);
    const allStructureIds = [structureId, ...childStructureIds];

    return this.prisma.stagiaire.findMany({
      where: {
        structureAffecteeId: {
          in: allStructureIds
        },
        tuteurId: {
          not: null,
        },
      },
      include: {
        user: {
          include: {
            profile: true,
          },
        },
        tuteur: {
          include: {
            user: {
              include: {
                profile: true,
              },
            },
            structure: {
              select: {
                id: true,
                nomStructure: true,
                sigle: true
              }
            }
          },
        },
      },
    });
  }

  async createAffectation(stagiaireId: string, tuteurId: string, structureId: number) {
    // Récupérer les IDs des sous-structures
    const childStructureIds = await this.getChildStructureIds(structureId);
    const allStructureIds = [structureId, ...childStructureIds];

    // Vérifier si le stagiaire existe et appartient à la structure
    const stagiaire = await this.prisma.stagiaire.findFirst({
      where: { 
        userId: stagiaireId,
        structureAffecteeId: structureId
      },
    });

    if (!stagiaire) {
      throw new NotFoundException('Stagiaire non trouvé dans votre structure');
    }

    // Vérifier si le tuteur existe et appartient à la structure ou ses sous-structures
    const tuteur = await this.prisma.tuteur.findFirst({
      where: { 
        userId: tuteurId,
        structureId: {
          in: allStructureIds
        }
      },
    });

    if (!tuteur) {
      throw new NotFoundException('Tuteur non trouvé dans votre structure ou ses sous-structures');
    }

    // Vérifier si le stagiaire n'est pas déjà affecté
    if (stagiaire.tuteurId) {
      throw new BadRequestException('Ce stagiaire est déjà affecté à un tuteur');
    }

    // Créer l'affectation
    return this.prisma.stagiaire.update({
      where: { userId: stagiaireId },
      data: {
        tuteurId: tuteurId,
      },
      include: {
        user: {
          include: {
            profile: true,
          },
        },
        tuteur: {
          include: {
            user: {
              include: {
                profile: true,
              },
            },
            structure: {
              select: {
                id: true,
                nomStructure: true,
                sigle: true
              }
            }
          },
        },
      },
    });
  }

  async deleteAffectation(stagiaireId: string, structureId: number) {
    // Vérifier si le stagiaire existe, est affecté et appartient à la structure
    const stagiaire = await this.prisma.stagiaire.findFirst({
      where: { 
        userId: stagiaireId,
        structureAffecteeId: structureId
      },
    });

    if (!stagiaire) {
      throw new NotFoundException('Stagiaire non trouvé dans votre structure');
    }

    if (!stagiaire.tuteurId) {
      throw new BadRequestException('Ce stagiaire n\'est pas affecté à un tuteur');
    }

    // Supprimer l'affectation
    return this.prisma.stagiaire.update({
      where: { userId: stagiaireId },
      data: {
        tuteurId: null,
      },
      include: {
        user: {
          include: {
            profile: true,
          },
        },
      },
    });
  }

  async getStagiairesByTuteur(tuteurId: string) {
    const stagiaires = await this.prisma.stagiaire.findMany({
      where: {
        tuteurId: tuteurId
      },
      include: {
        user: {
          include: {
            profile: true
          }
        }
      }
    });

    return stagiaires;
  }
} 