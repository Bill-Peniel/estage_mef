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
exports.AffectationsController = void 0;
const common_1 = require("@nestjs/common");
const affectations_service_1 = require("./affectations.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const client_1 = require("@prisma/client");
let AffectationsController = class AffectationsController {
    affectationsService;
    constructor(affectationsService) {
        this.affectationsService = affectationsService;
    }
    async getStagiaires(req) {
        const structureId = req.user.structureId;
        return this.affectationsService.getStagiaires(structureId);
    }
    async getTuteurs(req) {
        const structureId = req.user.structureId;
        return this.affectationsService.getTuteurs(structureId);
    }
    async getAffectations(req) {
        const structureId = req.user.structureId;
        return this.affectationsService.getAffectations(structureId);
    }
    async createAffectation(body, req) {
        const structureId = req.user.structureId;
        return this.affectationsService.createAffectation(body.stagiaireId, body.tuteurId, structureId);
    }
    async deleteAffectation(stagiaireId, req) {
        const structureId = req.user.structureId;
        return this.affectationsService.deleteAffectation(stagiaireId, structureId);
    }
    async getStagiairesByTuteur(req) {
        const tuteurId = req.user.userId;
        return this.affectationsService.getStagiairesByTuteur(tuteurId);
    }
};
exports.AffectationsController = AffectationsController;
__decorate([
    (0, common_1.Get)('stagiaires'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.admin, client_1.UserRole.structure),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AffectationsController.prototype, "getStagiaires", null);
__decorate([
    (0, common_1.Get)('tuteurs'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.admin, client_1.UserRole.structure),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AffectationsController.prototype, "getTuteurs", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(client_1.UserRole.admin, client_1.UserRole.structure),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AffectationsController.prototype, "getAffectations", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(client_1.UserRole.admin, client_1.UserRole.structure),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AffectationsController.prototype, "createAffectation", null);
__decorate([
    (0, common_1.Delete)(':stagiaireId'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.admin, client_1.UserRole.structure),
    __param(0, (0, common_1.Param)('stagiaireId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AffectationsController.prototype, "deleteAffectation", null);
__decorate([
    (0, common_1.Get)('tuteur/stagiaires'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AffectationsController.prototype, "getStagiairesByTuteur", null);
exports.AffectationsController = AffectationsController = __decorate([
    (0, common_1.Controller)('affectations'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [affectations_service_1.AffectationsService])
], AffectationsController);
//# sourceMappingURL=affectations.controller.js.map