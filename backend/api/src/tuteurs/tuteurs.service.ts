import { Injectable, NotFoundException, BadRequestException, Logger, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTuteurDto } from './dto/create-tuteur.dto';
import { UpdateTuteurDto } from './dto/update-tuteur.dto';
import * as bcrypt from 'bcrypt';
import { UserRole } from '@prisma/client';

@Injectable()
export class TuteursService {
  private readonly logger = new Logger(TuteursService.name);

  constructor(private prisma: PrismaService) {}

  async create(createTuteurDto: CreateTuteurDto) {
    const { email, password, nom, prenom, telephone, structureId, sousStructureId, serviceId, role } = createTuteurDto;

    // Vérifier si l'email existe déjà
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Un utilisateur avec cet email existe déjà');
    }

    // Vérifier si la structure existe
    const structure = await this.prisma.structure.findUnique({
      where: { id: structureId },
    });

    if (!structure) {
      throw new NotFoundException('Structure non trouvée');
    }

    // Déterminer la structure finale et le service
    let finalStructureId = structureId;
    let finalServiceId = serviceId;

    // Si une sous-structure est fournie et différente de la structure parente
    if (sousStructureId && sousStructureId !== structureId) {
      const sousStructure = await this.prisma.structure.findUnique({
        where: { id: sousStructureId },
      });

      if (!sousStructure) {
        throw new NotFoundException('Sous-structure non trouvée');
      }

      if (sousStructure.parentId !== structureId) {
        throw new BadRequestException('La sous-structure n\'appartient pas à la structure parente');
      }
      finalStructureId = sousStructureId;
    }

    // Si un service est fourni, vérifier qu'il appartient à la structure
    if (serviceId) {
      const service = await this.prisma.service.findUnique({
        where: { id: serviceId },
      });

      if (!service) {
        throw new NotFoundException('Service non trouvé');
      }

      if (service.structureId !== finalStructureId) {
        throw new BadRequestException('Le service n\'appartient pas à la structure');
      }
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer l'utilisateur avec son profil et le tuteur en une seule transaction
    return this.prisma.$transaction(async (prisma) => {
      // Créer l'utilisateur
      const user = await prisma.user.create({
        data: {
          email,
          passwordHash: hashedPassword,
          role: role === 'agent' ? UserRole.structure : UserRole.tuteur,
          structureId: finalStructureId,
          profile: {
            create: {
              nom,
              prenom,
              telephone,
            },
          },
        },
        include: {
          profile: true,
          structure: true,
        },
      });

      // Créer le tuteur
      const tuteur = await prisma.tuteur.create({
        data: {
          userId: user.id,
          structureId: finalStructureId,
          serviceId: finalServiceId,
        },
        include: {
          user: {
            include: {
              profile: true,
            },
          },
          structure: true,
          service: true,
        },
      });

      return tuteur;
    });
  }

  async findAll() {
    return this.prisma.tuteur.findMany({
      include: {
        user: {
          include: {
            profile: true
          }
        },
        structure: {
          include: {
            parent: true
          }
        }
      }
    });
  }

  async findOne(id: string) {
    const tuteur = await this.prisma.tuteur.findUnique({
      where: { id },
      include: {
        user: {
          include: {
            profile: true
          }
        },
        structure: true
      }
    });

    if (!tuteur) {
      throw new NotFoundException('Tuteur non trouvé');
    }

    return tuteur;
  }

  async getAssignedInterns(userId: string) {
    try {
      this.logger.debug(`Recherche du tuteur pour l'utilisateur ${userId}`);
      // Trouver d'abord le tuteur associé à l'utilisateur
      const tuteur = await this.prisma.tuteur.findFirst({
        where: {
          user: {
            id: userId
          }
        }
      });

      if (!tuteur) {
        this.logger.warn(`Aucun tuteur trouvé pour l'utilisateur ${userId}`);
        throw new NotFoundException('Tuteur non trouvé');
      }

      this.logger.debug(`Tuteur trouvé avec l'ID ${tuteur.userId}`);

      // Récupérer les stagiaires affectés à ce tuteur
      const stagiaires = await this.prisma.stagiaire.findMany({
        where: {
          tuteurId: tuteur.userId
        },
        include: {
          user: {
            include: {
              profile: true,
              demandesStage: {
                orderBy: {
                  dateDebut: 'desc'
                },
                take: 1
              }
            }
          },
          stages: {
            orderBy: {
              dateDebut: 'desc'
            },
            take: 1
          }
        }
      });

      this.logger.debug(`Nombre de stagiaires trouvés: ${stagiaires.length}`);

      return stagiaires.map(stagiaire => {
        const currentStage = stagiaire.stages[0]; // Prendre le stage le plus récent
        const currentDemande = stagiaire.user.demandesStage[0]; // Prendre la demande la plus récente
        
        // Mapper le statut selon les valeurs spécifiées
        let status = 'nouveau';
        if (currentStage) {
          const today = new Date();
          const dateDebut = new Date(currentStage.dateDebut);
          const dateFin = currentStage.dateFin ? new Date(currentStage.dateFin) : null;

          if (dateFin && today > dateFin) {
            status = 'finit';
          } else if (today >= dateDebut) {
            status = 'en cours';
          }
        }

        return {
          id: stagiaire.id,
          userId: stagiaire.user.id, // <-- Correction ici
          name: `${stagiaire.user.profile?.prenom || ''} ${stagiaire.user.profile?.nom || ''}`.trim(),
          email: stagiaire.user.email,
          telephone: stagiaire.user.profile?.telephone || 'Non renseigné',
          department: currentDemande?.departement || 'Non spécifié',
          status: status,
          startDate: currentStage?.dateDebut,
          endDate: currentStage?.dateFin
        };
      });
    } catch (error) {
      this.logger.error(`Erreur lors de la récupération des stagiaires: ${error.message}`, error.stack);
      throw error;
    }
  }

  async update(id: string, updateTuteurDto: UpdateTuteurDto) {
    const { email, password, nom, prenom, telephone, structureId } = updateTuteurDto;

    const tuteur = await this.prisma.tuteur.findUnique({
      where: { id },
      include: {
        user: true
      }
    });

    if (!tuteur) {
      throw new NotFoundException('Tuteur non trouvé');
    }

    // Mettre à jour l'utilisateur et son profil
    await this.prisma.user.update({
      where: { id: tuteur.userId },
      data: {
        email,
        ...(password && { passwordHash: await bcrypt.hash(password, 10) }),
        profile: {
          update: {
            nom,
            prenom,
            telephone
          }
        }
      }
    });

    // Mettre à jour le tuteur
    return this.prisma.tuteur.update({
      where: { id },
      data: {
        structureId
      },
      include: {
        user: {
          include: {
            profile: true
          }
        },
        structure: true
      }
    });
  }

  async remove(id: string) {
    const tuteur = await this.prisma.tuteur.findUnique({
      where: { id },
      include: {
        user: true
      }
    });

    if (!tuteur) {
      throw new NotFoundException('Tuteur non trouvé');
    }

    // Supprimer le tuteur (cela supprimera aussi l'utilisateur et son profil grâce à onDelete: Cascade)
    return this.prisma.tuteur.delete({
      where: { id }
    });
  }

  async getMyStructure(userId: string) {
    const tuteur = await this.prisma.tuteur.findFirst({
      where: {
        user: {
          id: userId
        }
      },
      include: {
        structure: {
          include: {
            parent: true,
            children: true,
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
                },
                tuteur: {
                  include: {
                    user: {
                      include: {
                        profile: true
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!tuteur || !tuteur.structure) {
      throw new NotFoundException('Structure non trouvée pour ce tuteur');
    }

    return tuteur.structure;
  }
} 