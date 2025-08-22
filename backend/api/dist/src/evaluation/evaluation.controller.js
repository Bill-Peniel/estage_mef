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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EvaluationController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const evaluation_service_1 = require("./evaluation.service");
let EvaluationController = class EvaluationController {
    evaluationService;
    constructor(evaluationService) {
        this.evaluationService = evaluationService;
    }
    async createEvaluation(req, body) {
        const tuteurId = req.user.id;
        const { stagiaireId, criteres, commentaire } = body;
        if (!stagiaireId || typeof stagiaireId !== 'string') {
            throw new common_1.BadRequestException('stagiaireId requis et doit être une chaîne de caractères');
        }
        return this.evaluationService.createEvaluation(tuteurId, stagiaireId, criteres, commentaire);
    }
    async getEvaluation(stagiaireId) {
        return this.evaluationService.getEvaluationForStagiaire(stagiaireId);
    }
};
exports.EvaluationController = EvaluationController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], EvaluationController.prototype, "createEvaluation", null);
__decorate([
    (0, common_1.Get)(':stagiaireId'),
    __param(0, (0, common_1.Param)('stagiaireId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EvaluationController.prototype, "getEvaluation", null);
exports.EvaluationController = EvaluationController = __decorate([
    (0, common_1.Controller)('evaluations'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [evaluation_service_1.EvaluationService])
], EvaluationController);
//# sourceMappingURL=evaluation.controller.js.map