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
var TuteursService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TuteursService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = require("bcrypt");
const client_1 = require("@prisma/client");
let TuteursService = TuteursService_1 = class TuteursService {
    prisma;
    logger = new common_1.Logger(TuteursService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createTuteurDto) {
        const { email, password, nom, prenom, telephone, structureId, sousStructureId, serviceId, role } = createTuteurDto;
        const existingUser = await this.prisma.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            throw new common_1.ConflictException('Un utilisateur avec cet email existe déjà');
        }
        const structure = await this.prisma.structure.findUnique({
            where: { id: structureId },
        });
        if (!structure) {
            throw new common_1.NotFoundException('Structure non trouvée');
        }
        let finalStructureId = structureId;
        let finalServiceId = serviceId;
        if (sousStructureId && sousStructureId !== structureId) {
            const sousStructure = await this.prisma.structure.findUnique({
                where: { id: sousStructureId },
            });
            if (!sousStructure) {
                throw new common_1.NotFoundException('Sous-structure non trouvée');
            }
            if (sousStructure.parentId !== structureId) {
                throw new common_1.BadRequestException('La sous-structure n\'appartient pas à la structure parente');
            }
            finalStructureId = sousStructureId;
        }
        if (serviceId) {
            const service = await this.prisma.service.findUnique({
                where: { id: serviceId },
            });
            if (!service) {
                throw new common_1.NotFoundException('Service non trouvé');
            }
            if (service.structureId !== finalStructureId) {
                throw new common_1.BadRequestException('Le service n\'appartient pas à la structure');
            }
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        return this.prisma.$transaction(async (prisma) => {
            const user = await prisma.user.create({
                data: {
                    email,
                    passwordHash: hashedPassword,
                    role: role === 'agent' ? client_1.UserRole.structure : client_1.UserRole.tuteur,
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
    async findOne(id) {
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
            throw new common_1.NotFoundException('Tuteur non trouvé');
        }
        return tuteur;
    }
    async getAssignedInterns(userId) {
        try {
            this.logger.debug(`Recherche du tuteur pour l'utilisateur ${userId}`);
            const tuteur = await this.prisma.tuteur.findFirst({
                where: {
                    user: {
                        id: userId
                    }
                }
            });
            if (!tuteur) {
                this.logger.warn(`Aucun tuteur trouvé pour l'utilisateur ${userId}`);
                throw new common_1.NotFoundException('Tuteur non trouvé');
            }
            this.logger.debug(`Tuteur trouvé avec l'ID ${tuteur.userId}`);
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
                const currentStage = stagiaire.stages[0];
                const currentDemande = stagiaire.user.demandesStage[0];
                let status = 'nouveau';
                if (currentStage) {
                    const today = new Date();
                    const dateDebut = new Date(currentStage.dateDebut);
                    const dateFin = currentStage.dateFin ? new Date(currentStage.dateFin) : null;
                    if (dateFin && today > dateFin) {
                        status = 'finit';
                    }
                    else if (today >= dateDebut) {
                        status = 'en cours';
                    }
                }
                return {
                    id: stagiaire.id,
                    userId: stagiaire.user.id,
                    name: `${stagiaire.user.profile?.prenom || ''} ${stagiaire.user.profile?.nom || ''}`.trim(),
                    email: stagiaire.user.email,
                    telephone: stagiaire.user.profile?.telephone || 'Non renseigné',
                    department: currentDemande?.departement || 'Non spécifié',
                    status: status,
                    startDate: currentStage?.dateDebut,
                    endDate: currentStage?.dateFin
                };
            });
        }
        catch (error) {
            this.logger.error(`Erreur lors de la récupération des stagiaires: ${error.message}`, error.stack);
            throw error;
        }
    }
    async update(id, updateTuteurDto) {
        const { email, password, nom, prenom, telephone, structureId } = updateTuteurDto;
        const tuteur = await this.prisma.tuteur.findUnique({
            where: { id },
            include: {
                user: true
            }
        });
        if (!tuteur) {
            throw new common_1.NotFoundException('Tuteur non trouvé');
        }
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
    async remove(id) {
        const tuteur = await this.prisma.tuteur.findUnique({
            where: { id },
            include: {
                user: true
            }
        });
        if (!tuteur) {
            throw new common_1.NotFoundException('Tuteur non trouvé');
        }
        return this.prisma.tuteur.delete({
            where: { id }
        });
    }
    async getMyStructure(userId) {
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
            throw new common_1.NotFoundException('Structure non trouvée pour ce tuteur');
        }
        return tuteur.structure;
    }
};
exports.TuteursService = TuteursService;
exports.TuteursService = TuteursService = TuteursService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TuteursService);
//# sourceMappingURL=tuteurs.service.js.map