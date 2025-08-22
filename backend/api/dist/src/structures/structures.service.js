"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StructuresService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
const notification_service_1 = require("../notification/notification.service");
let StructuresService = class StructuresService {
    prisma;
    notificationService;
    constructor(prisma, notificationService) {
        this.prisma = prisma;
        this.notificationService = notificationService;
    }
    async create(createStructureDto) {
        try {
            const { nomStructure, sigle, type, parentId } = createStructureDto;
            if (parentId) {
                const parentStructure = await this.prisma.structure.findUnique({
                    where: { id: parentId }
                });
                if (!parentStructure) {
                    throw new common_1.NotFoundException(`Structure parent avec l'ID ${parentId} non trouvée`);
                }
                if (parentStructure.type === 'directionnelle') {
                    createStructureDto.type = 'technique';
                }
            }
            const structure = await this.prisma.structure.create({
                data: {
                    nomStructure,
                    sigle: sigle || null,
                    type: createStructureDto.type,
                    parentId
                }
            });
            return structure;
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new common_1.ConflictException('Une structure avec ce nom ou ce sigle existe déjà');
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
        }
        catch (error) {
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
        }
        catch (error) {
            console.error('Erreur lors de la récupération des sous-structures:', error);
            throw error;
        }
    }
    async findOne(id) {
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
            throw new common_1.NotFoundException('Structure non trouvée');
        }
        return structure;
    }
    async update(id, updateStructureDto) {
        const { nomStructure, sigle, parentId } = updateStructureDto;
        const structure = await this.prisma.structure.findUnique({
            where: { id },
        });
        if (!structure) {
            throw new common_1.NotFoundException('Structure non trouvée');
        }
        if (parentId) {
            const parentStructure = await this.prisma.structure.findUnique({
                where: { id: parentId },
            });
            if (!parentStructure) {
                throw new common_1.NotFoundException('Structure parente non trouvée');
            }
            if (parentId === id) {
                throw new Error('Une structure ne peut pas être sa propre sous-structure');
            }
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
    async remove(id) {
        const structure = await this.prisma.structure.findUnique({
            where: { id },
            include: {
                children: true,
                tuteurs: true,
                stagiaires: true,
            },
        });
        if (!structure) {
            throw new common_1.NotFoundException('Structure non trouvée');
        }
        if (structure.children.length > 0) {
            throw new Error('Impossible de supprimer une structure qui a des sous-structures');
        }
        if (structure.tuteurs.length > 0) {
            throw new Error('Impossible de supprimer une structure qui a des tuteurs');
        }
        if (structure.stagiaires.length > 0) {
            throw new Error('Impossible de supprimer une structure qui a des stagiaires');
        }
        return this.prisma.structure.delete({
            where: { id },
        });
    }
    async isChildStructure(parentId, childId) {
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
    async assignStagiaire(assignStagiaireDto) {
        const { stagiaireId, structureId, tuteurId } = assignStagiaireDto;
        const user = await this.prisma.user.findUnique({
            where: { id: stagiaireId },
            include: { profile: true }
        });
        if (!user) {
            throw new common_1.NotFoundException('Utilisateur non trouvé');
        }
        const structure = await this.prisma.structure.findUnique({
            where: { id: structureId }
        });
        if (!structure) {
            throw new common_1.NotFoundException('Structure non trouvée');
        }
        if (tuteurId) {
            const tuteur = await this.prisma.tuteur.findUnique({
                where: { userId: tuteurId }
            });
            if (!tuteur) {
                throw new common_1.NotFoundException('Tuteur non trouvé');
            }
            if (tuteur.structureId !== structureId) {
                throw new common_1.ConflictException('Le tuteur n\'appartient pas à la structure spécifiée');
            }
        }
        let stagiaire = await this.prisma.stagiaire.findUnique({
            where: { userId: stagiaireId }
        });
        if (!stagiaire) {
            stagiaire = await this.prisma.stagiaire.create({
                data: {
                    userId: stagiaireId,
                    structureAffecteeId: structureId,
                    tuteurId: tuteurId || null
                }
            });
        }
        else {
            stagiaire = await this.prisma.stagiaire.update({
                where: { userId: stagiaireId },
                data: {
                    structureAffecteeId: structureId,
                    tuteurId: tuteurId || null
                }
            });
        }
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
        }
        catch (notificationError) {
            console.error('Erreur lors de la création de la notification:', notificationError);
        }
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
    async findSousStructuresByParentId(parentId) {
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
        }
        catch (error) {
            console.error('Erreur lors de la récupération des sous-structures:', error);
            throw error;
        }
    }
    async getStagiairesByStructure(structureId) {
        const structureIdNumber = parseInt(structureId, 10);
        const structure = await this.prisma.structure.findUnique({
            where: { id: structureIdNumber },
        });
        if (!structure) {
            throw new common_1.NotFoundException('Structure non trouvée');
        }
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
        return structures.map(structure => ({
            id: structure.id,
            nom: structure.nomStructure,
            count: structure._count.stagiaires
        }));
    }
    async getStructureUsers(structureId) {
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
            throw new common_1.NotFoundException('Structure non trouvée');
        }
        return structure.users;
    }
    async findUserStructure(userId) {
        try {
            const user = await this.prisma.user.findUnique({
                where: { id: userId },
                include: {
                    structure: true
                }
            });
            return user?.structure || null;
        }
        catch (error) {
            throw error;
        }
    }
    async findTuteurStructure(userId) {
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
};
exports.StructuresService = StructuresService;
exports.StructuresService = StructuresService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notification_service_1.NotificationService])
], StructuresService);
//# sourceMappingURL=structures.service.js.map