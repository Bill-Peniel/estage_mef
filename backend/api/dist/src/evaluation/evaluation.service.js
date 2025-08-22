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
exports.EvaluationService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let EvaluationService = class EvaluationService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createEvaluation(tuteurId, stagiaireId, criteres, commentaire) {
        const stagiaire = await this.prisma.stagiaire.findFirst({
            where: { userId: stagiaireId, tuteurId },
        });
        if (!stagiaire) {
            throw new common_1.ForbiddenException('Ce stagiaire ne vous est pas affecté');
        }
        return this.prisma.evaluation.create({
            data: {
                tuteurId,
                stagiaireId,
                criteres,
                commentaire,
            },
        });
    }
    async getEvaluationForStagiaire(stagiaireId) {
        const evaluation = await this.prisma.evaluation.findFirst({
            where: { stagiaireId },
        });
        if (!evaluation) {
            throw new common_1.NotFoundException('Aucune évaluation trouvée pour ce stagiaire');
        }
        return evaluation;
    }
};
exports.EvaluationService = EvaluationService;
exports.EvaluationService = EvaluationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EvaluationService);
//# sourceMappingURL=evaluation.service.js.map