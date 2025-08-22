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
exports.AffectationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AffectationsService = class AffectationsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getChildStructureIds(parentId) {
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
        const grandChildIds = await Promise.all(childIds.map(id => this.getChildStructureIds(id)));
        return [...childIds, ...grandChildIds.flat()];
    }
    async getStagiaires(structureId) {
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
    async getTuteurs(structureId) {
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
    async getAffectations(structureId) {
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
    async createAffectation(stagiaireId, tuteurId, structureId) {
        const childStructureIds = await this.getChildStructureIds(structureId);
        const allStructureIds = [structureId, ...childStructureIds];
        const stagiaire = await this.prisma.stagiaire.findFirst({
            where: {
                userId: stagiaireId,
                structureAffecteeId: structureId
            },
        });
        if (!stagiaire) {
            throw new common_1.NotFoundException('Stagiaire non trouvé dans votre structure');
        }
        const tuteur = await this.prisma.tuteur.findFirst({
            where: {
                userId: tuteurId,
                structureId: {
                    in: allStructureIds
                }
            },
        });
        if (!tuteur) {
            throw new common_1.NotFoundException('Tuteur non trouvé dans votre structure ou ses sous-structures');
        }
        if (stagiaire.tuteurId) {
            throw new common_1.BadRequestException('Ce stagiaire est déjà affecté à un tuteur');
        }
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
    async deleteAffectation(stagiaireId, structureId) {
        const stagiaire = await this.prisma.stagiaire.findFirst({
            where: {
                userId: stagiaireId,
                structureAffecteeId: structureId
            },
        });
        if (!stagiaire) {
            throw new common_1.NotFoundException('Stagiaire non trouvé dans votre structure');
        }
        if (!stagiaire.tuteurId) {
            throw new common_1.BadRequestException('Ce stagiaire n\'est pas affecté à un tuteur');
        }
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
    async getStagiairesByTuteur(tuteurId) {
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
};
exports.AffectationsService = AffectationsService;
exports.AffectationsService = AffectationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AffectationsService);
//# sourceMappingURL=affectations.service.js.map