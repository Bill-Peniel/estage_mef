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
exports.ServicesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ServicesService = class ServicesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createServiceDto, userId) {
        try {
            const user = await this.prisma.user.findUnique({
                where: { id: userId },
                include: { structure: true }
            });
            if (!user?.structure || user.structure.id !== createServiceDto.structureId) {
                throw new common_1.ForbiddenException('Vous ne pouvez créer des services que dans votre propre structure');
            }
            if (user.structure.type !== 'technique') {
                throw new common_1.ForbiddenException('Seules les structures techniques peuvent créer des services');
            }
            const service = await this.prisma.service.create({
                data: {
                    nomService: createServiceDto.nomService,
                    description: createServiceDto.description,
                    structureId: createServiceDto.structureId
                }
            });
            return service;
        }
        catch (error) {
            throw error;
        }
    }
    async findAllByStructure(structureId) {
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
        }
        catch (error) {
            throw error;
        }
    }
    async findOne(id) {
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
                throw new common_1.NotFoundException(`Service avec l'ID ${id} non trouvé`);
            }
            return service;
        }
        catch (error) {
            throw error;
        }
    }
    async update(id, updateServiceDto, userId) {
        try {
            const service = await this.prisma.service.findUnique({
                where: { id },
                include: { structure: true }
            });
            if (!service) {
                throw new common_1.NotFoundException(`Service avec l'ID ${id} non trouvé`);
            }
            const user = await this.prisma.user.findUnique({
                where: { id: userId },
                include: { structure: true }
            });
            if (!user?.structure || user.structure.id !== service.structureId) {
                throw new common_1.ForbiddenException('Vous ne pouvez modifier que les services de votre structure');
            }
            const updatedService = await this.prisma.service.update({
                where: { id },
                data: updateServiceDto
            });
            return updatedService;
        }
        catch (error) {
            throw error;
        }
    }
    async remove(id, userId) {
        try {
            const service = await this.prisma.service.findUnique({
                where: { id },
                include: { structure: true }
            });
            if (!service) {
                throw new common_1.NotFoundException(`Service avec l'ID ${id} non trouvé`);
            }
            const user = await this.prisma.user.findUnique({
                where: { id: userId },
                include: { structure: true }
            });
            if (!user?.structure || user.structure.id !== service.structureId) {
                throw new common_1.ForbiddenException('Vous ne pouvez supprimer que les services de votre structure');
            }
            const deletedService = await this.prisma.service.update({
                where: { id },
                data: { isDeleted: true }
            });
            return deletedService;
        }
        catch (error) {
            throw error;
        }
    }
};
exports.ServicesService = ServicesService;
exports.ServicesService = ServicesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ServicesService);
//# sourceMappingURL=services.service.js.map