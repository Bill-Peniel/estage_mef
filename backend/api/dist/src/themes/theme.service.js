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
exports.ThemeService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ThemeService = class ThemeService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getThemesByTuteur(tuteurId) {
        return this.prisma.themeTuteur.findMany({
            where: { tuteurId },
            orderBy: { id: 'desc' }
        });
    }
    async createTheme(tuteurId, data) {
        return this.prisma.themeTuteur.create({
            data: {
                titre: data.titre,
                description: data.description,
                disponible: data.disponible ?? true,
                tuteurId
            }
        });
    }
    async updateTheme(tuteurId, id, data) {
        const theme = await this.prisma.themeTuteur.findUnique({ where: { id } });
        if (!theme || theme.tuteurId !== tuteurId)
            throw new common_1.ForbiddenException('Accès refusé');
        return this.prisma.themeTuteur.update({
            where: { id },
            data: {
                titre: data.titre,
                description: data.description,
                disponible: data.disponible
            }
        });
    }
    async deleteTheme(tuteurId, id) {
        const theme = await this.prisma.themeTuteur.findUnique({ where: { id } });
        if (!theme || theme.tuteurId !== tuteurId)
            throw new common_1.ForbiddenException('Accès refusé');
        return this.prisma.themeTuteur.delete({ where: { id } });
    }
    async affecterTheme(tuteurId, id, stagiaireId) {
        const theme = await this.prisma.themeTuteur.findUnique({ where: { id } });
        if (!theme || theme.tuteurId !== tuteurId)
            throw new common_1.ForbiddenException('Accès refusé');
        if (!theme.disponible)
            throw new common_1.ForbiddenException('Thème déjà affecté');
        return this.prisma.themeTuteur.update({
            where: { id },
            data: {
                disponible: false
            }
        });
    }
};
exports.ThemeService = ThemeService;
exports.ThemeService = ThemeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ThemeService);
//# sourceMappingURL=theme.service.js.map