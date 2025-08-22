import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StatutDemande } from '@prisma/client';

@Injectable()
export class StagiairesService {
  constructor(private prisma: PrismaService) {}

  async findSansAffectation() {
    const stagiaires = await this.prisma.stagiaire.findMany({
      where: {
        structureAffecteeId: null,
        demandesStages: {
          some: {
            statut: StatutDemande.confirme
          }
        }
      },
      include: {
        user: {
          include: {
            profile: true,
            demandesStage: {
              where: {
                status: 'VALIDEE'
              },
              select: {
                code_suivi: true,
                universite: true,
                departement: true,
                dateDebut: true
              }
            }
          }
        }
      }
    });

    console.log(`Nombre de stagiaires trouvés: ${stagiaires.length}`);
    return stagiaires;
  }

  async findOne(id: string) {
    const stagiaire = await this.prisma.stagiaire.findUnique({
      where: { id },
      include: {
        user: {
          include: {
            profile: true,
            demandesStage: {
              select: {
                id: true,
                code_suivi: true,
                universite: true,
                departement: true,
                dateDebut: true,
                dateFin: true,
                type: true,
                status: true,
                motivation: true,
                competences: true,
                experience: true,
                anneeEtude: true,
                domaineEtude: true,
                createdAt: true,
                updatedAt: true
              }
            }
          },
        },
        tuteur: {
          include: {
            user: {
              include: {
                profile: true,
              },
            },
          },
        },
        structure: true,
      },
    });

    if (!stagiaire) {
      throw new NotFoundException('Stagiaire non trouvé');
    }

    return stagiaire;
  }

  async findOneByUserId(userId: string) {
    const stagiaire = await this.prisma.stagiaire.findFirst({
      where: { userId },
      include: {
        user: {
          include: {
            profile: true,
            demandesStage: true
          }
        },
        tuteur: {
          include: {
            user: {
              include: {
                profile: true
              }
            }
          }
        },
        structure: true
      }
    });
    if (!stagiaire) {
      throw new NotFoundException('Stagiaire non trouvé');
    }
    return stagiaire;
  }
} 