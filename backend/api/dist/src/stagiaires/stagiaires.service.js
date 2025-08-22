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
exports.StagiairesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let StagiairesService = class StagiairesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findSansAffectation() {
        const stagiaires = await this.prisma.stagiaire.findMany({
            where: {
                structureAffecteeId: null,
                demandesStages: {
                    some: {
                        statut: client_1.StatutDemande.confirme
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
    async findOne(id) {
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
            throw new common_1.NotFoundException('Stagiaire non trouvé');
        }
        return stagiaire;
    }
    async findOneByUserId(userId) {
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
            throw new common_1.NotFoundException('Stagiaire non trouvé');
        }
        return stagiaire;
    }
};
exports.StagiairesService = StagiairesService;
exports.StagiairesService = StagiairesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], StagiairesService);
//# sourceMappingURL=stagiaires.service.js.map