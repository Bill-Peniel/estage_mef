import { Injectable, ConflictException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStructureDto } from './dto/create-structure.dto';
import { UpdateStructureDto } from './dto/update-structure.dto';
import { AssignStagiaireDto } from './dto/assign-stagiaire.dto';
import { Prisma } from '@prisma/client';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class StructuresService {
  constructor(
    private prisma: PrismaService,
    private notificationService: NotificationService
  ) {}

  async create(createStructureDto: CreateStructureDto) {
    try {
      const { nomStructure, sigle, type, parentId } = createStructureDto;

      // Vérifier si la structure parent existe si parentId est fourni
      if (parentId) {
        const parentStructure = await this.prisma.structure.findUnique({
          where: { id: parentId }
        });

        if (!parentStructure) {
          throw new NotFoundException(`Structure parent avec l'ID ${parentId} non trouvée`);
        }

        // Si c'est une sous-structure, elle doit être de type 'technique'
        if (parentStructure.type === 'directionnelle') {
          createStructureDto.type = 'technique';
        }
      }

      // Créer la structure avec le type
      const structure = await this.prisma.structure.create({
        data: {
          nomStructure,
          sigle: sigle || null,
          type: createStructureDto.type,
          parentId
        }
      });

      return structure;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('Une structure avec ce nom ou ce sigle existe déjà');
        }
      }
      throw error;
    }
  }

  async findAll() {
    try {
      console.log('Récupération de toutes les structures...');
      const structures = await this.prisma.structure.findMany({
        include: {
          parent: true,
          children: true,
          tuteurs: {
            include: {
              user: {
                include: {
                  profile: true,
                },
              },
            },
          },
          stagiaires: {
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
                },
              },
            },
          },
        },
      });
      console.log('Structures trouvées:', structures);
      return structures;
    } catch (error) {
      console.error('Erreur lors de la récupération des structures:', error);
      throw error;
    }
  }

  async findSousStructures() {
    try {
      console.log('Récupération des sous-structures...');
      const structures = await this.prisma.structure.findMany({
        where: {
          parentId: {
            not: null
          }
        },
        include: {
          parent: true,
          children: true,
          tuteurs: {
            include: {
              user: {
                include: {
                  profile: true,
                },
              },
            },
          },
          stagiaires: {
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
                },
              },
            },
          },
        },
      });
      console.log('Sous-structures trouvées:', structures);
      return structures;
    } catch (error) {
      console.error('Erreur lors de la récupération des sous-structures:', error);
      throw error;
    }
  }

  async findOne(id: number) {
    const structure = await this.prisma.structure.findUnique({
      where: { id },
      include: {
        parent: true,
        children: true,
        tuteurs: {
          include: {
            user: {
              include: {
                profile: true,
              },
            },
          },
        },
        stagiaires: {
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
              },
            },
          },
        },
      },
    });

    if (!structure) {
      throw new NotFoundException('Structure non trouvée');
    }

    return structure;
  }

  async update(id: number, updateStructureDto: UpdateStructureDto) {
    const { nomStructure, sigle, parentId } = updateStructureDto;

    // Vérifier si la structure existe
    const structure = await this.prisma.structure.findUnique({
      where: { id },
    });

    if (!structure) {
      throw new NotFoundException('Structure non trouvée');
    }

    // Vérifier si la structure parente existe si parentId est fourni
    if (parentId) {
      const parentStructure = await this.prisma.structure.findUnique({
        where: { id: parentId },
      });

      if (!parentStructure) {
        throw new NotFoundException('Structure parente non trouvée');
      }

      // Vérifier qu'on ne crée pas une boucle dans la hiérarchie
      if (parentId === id) {
        throw new Error('Une structure ne peut pas être sa propre sous-structure');
      }

      // Vérifier que la structure parente n'est pas une sous-structure de la structure actuelle
      const isChild = await this.isChildStructure(parentId, id);
      if (isChild) {
        throw new Error('Une structure ne peut pas être la sous-structure de sa propre sous-structure');
      }
    }

    return this.prisma.structure.update({
      where: { id },
      data: {
        nomStructure,
        sigle,
        parentId,
      },
      include: {
        parent: true,
        children: true,
        tuteurs: {
          include: {
            user: {
              include: {
                profile: true,
              },
            },
          },
        },
        stagiaires: {
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
              },
            },
          },
        },
      },
    });
  }

  async remove(id: number) {
    const structure = await this.prisma.structure.findUnique({
      where: { id },
      include: {
        children: true,
        tuteurs: true,
        stagiaires: true,
      },
    });

    if (!structure) {
      throw new NotFoundException('Structure non trouvée');
    }

    // Vérifier si la structure a des sous-structures
    if (structure.children.length > 0) {
      throw new Error('Impossible de supprimer une structure qui a des sous-structures');
    }

    // Vérifier si la structure a des tuteurs
    if (structure.tuteurs.length > 0) {
      throw new Error('Impossible de supprimer une structure qui a des tuteurs');
    }

    // Vérifier si la structure a des stagiaires
    if (structure.stagiaires.length > 0) {
      throw new Error('Impossible de supprimer une structure qui a des stagiaires');
    }

    return this.prisma.structure.delete({
      where: { id },
    });
  }

  private async isChildStructure(parentId: number, childId: number): Promise<boolean> {
    const parent = await this.prisma.structure.findUnique({
      where: { id: parentId },
      include: {
        children: true,
      },
    });

    if (!parent) {
      return false;
    }

    if (parent.children.some(child => child.id === childId)) {
      return true;
    }

    for (const child of parent.children) {
      if (await this.isChildStructure(child.id, childId)) {
        return true;
      }
    }

    return false;
  }

  async assignStagiaire(assignStagiaireDto: AssignStagiaireDto) {
    const { stagiaireId, structureId, tuteurId } = assignStagiaireDto;

    // Vérifier si l'utilisateur existe
    const user = await this.prisma.user.findUnique({
      where: { id: stagiaireId },
      include: { profile: true }
    });

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    // Vérifier si la structure existe
    const structure = await this.prisma.structure.findUnique({
      where: { id: structureId }
    });

    if (!structure) {
      throw new NotFoundException('Structure non trouvée');
    }

    // Vérifier si le tuteur existe si fourni
    if (tuteurId) {
      const tuteur = await this.prisma.tuteur.findUnique({
        where: { userId: tuteurId }
      });

      if (!tuteur) {
        throw new NotFoundException('Tuteur non trouvé');
      }

      // Vérifier si le tuteur appartient à la structure
      if (tuteur.structureId !== structureId) {
        throw new ConflictException('Le tuteur n\'appartient pas à la structure spécifiée');
      }
    }

    // Vérifier si le stagiaire existe déjà
    let stagiaire = await this.prisma.stagiaire.findUnique({
      where: { userId: stagiaireId }
    });

    // Si le stagiaire n'existe pas, le créer
    if (!stagiaire) {
      stagiaire = await this.prisma.stagiaire.create({
        data: {
          userId: stagiaireId,
          structureAffecteeId: structureId,
          tuteurId: tuteurId || null
        }
      });
    } else {
      // Sinon, mettre à jour l'affectation
      stagiaire = await this.prisma.stagiaire.update({
        where: { userId: stagiaireId },
        data: {
          structureAffecteeId: structureId,
          tuteurId: tuteurId || null
        }
      });
    }

    // Créer une notification pour informer le responsable de la structure
    try {
      if (user?.profile) {
        const stagiaireName = `${user.profile.prenom} ${user.profile.nom}`;
        const structureName = structure.nomStructure;
        
        await this.notificationService.createNotification({
          type: 'AFFECTATION',
          title: 'Nouveau stagiaire affecté',
          message: `Le stagiaire ${stagiaireName} a été affecté à votre structure ${structureName}.`,
          role: 'structure'
        });

        // Si un tuteur a été assigné, créer une notification pour le tuteur
        if (tuteurId) {
          const tuteur = await this.prisma.tuteur.findUnique({
            where: { userId: tuteurId },
            include: {
              user: {
                include: {
                  profile: true
                }
              }
            }
          });

          if (tuteur?.user?.profile) {
            await this.notificationService.createNotification({
              type: 'AFFECTATION',
              title: 'Nouveau stagiaire assigné',
              message: `Un nouveau stagiaire ${stagiaireName} vous a été assigné dans la structure ${structureName}.`,
              userId: tuteurId
            });
          }
        }
      }
    } catch (notificationError) {
      console.error('Erreur lors de la création de la notification:', notificationError);
      // Ne pas bloquer le processus si la notification échoue
    }

    // Retourner le stagiaire avec toutes ses relations
    return this.prisma.stagiaire.findUnique({
      where: { userId: stagiaireId },
      include: {
        user: {
          include: {
            profile: true
          }
        },
        structure: true,
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
    });
  }

  async findSousStructuresByParentId(parentId: number) {
    try {
      console.log('Récupération des sous-structures pour la structure parente:', parentId);
      const structures = await this.prisma.structure.findMany({
        where: {
          parentId: parentId,
        },
        include: {
          parent: true,
          children: true,
          tuteurs: {
            include: {
              user: {
                include: {
                  profile: true,
                },
              },
            },
          },
          stagiaires: {
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
                },
              },
            },
          },
        },
      });
      console.log('Sous-structures trouvées:', structures);
      return structures;
    } catch (error) {
      console.error('Erreur lors de la récupération des sous-structures:', error);
      throw error;
    }
  }

  async getStagiairesByStructure(structureId: string) {
    // Convertir l'ID en nombre
    const structureIdNumber = parseInt(structureId, 10);
    
    // Vérifier si la structure existe
    const structure = await this.prisma.structure.findUnique({
      where: { id: structureIdNumber },
    });

    if (!structure) {
      throw new NotFoundException('Structure non trouvée');
    }

    // Récupérer tous les stagiaires affectés à cette structure
    const stagiaires = await this.prisma.stagiaire.findMany({
      where: {
        structureAffecteeId: structureIdNumber,
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
          },
        },
      },
    });

    return stagiaires;
  }

  async getStagiairesStats() {
    // Récupérer toutes les structures principales (sans parent)
    const structures = await this.prisma.structure.findMany({
      where: {
        parentId: null,
        isDeleted: false
      },
      select: {
        id: true,
        nomStructure: true,
        _count: {
          select: {
            stagiaires: true
          }
        }
      }
    });

    // Formater les données pour le graphique
    return structures.map(structure => ({
      id: structure.id,
      nom: structure.nomStructure,
      count: structure._count.stagiaires
    }));
  }

  async getStructureUsers(structureId: number) {
    const structure = await this.prisma.structure.findUnique({
      where: { id: structureId },
      include: {
        users: {
          include: {
            profile: true,
            tuteur: true,
            stagiaire: true,
          },
        },
      },
    });

    if (!structure) {
      throw new NotFoundException('Structure non trouvée');
    }

    return structure.users;
  }

  async findUserStructure(userId: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        include: {
          structure: true
        }
      });
      
      return user?.structure || null;
    } catch (error) {
      // this.logger.error('Erreur lors de la récupération de la structure utilisateur:', error); // Assuming logger is available
      throw error;
    }
  }

  async findTuteurStructure(userId: string) {
    return this.prisma.tuteur.findFirst({
      where: {
        user: {
          id: userId
        }
      },
      select: {
        structureId: true
      }
    });
  }
} 