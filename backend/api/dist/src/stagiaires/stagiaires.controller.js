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
exports.StagiairesController = void 0;
const common_1 = require("@nestjs/common");
const stagiaires_service_1 = require("./stagiaires.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const client_1 = require("@prisma/client");
let StagiairesController = class StagiairesController {
    stagiairesService;
    constructor(stagiairesService) {
        this.stagiairesService = stagiairesService;
    }
    findSansAffectation() {
        return this.stagiairesService.findSansAffectation();
    }
    async getMyStagiaire(req) {
        return this.stagiairesService.findOneByUserId(req.user.id);
    }
    async getStagiaireDetails(id) {
        return this.stagiairesService.findOne(id);
    }
};
exports.StagiairesController = StagiairesController;
__decorate([
    (0, common_1.Get)('sans-affectation'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.dpaf),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], StagiairesController.prototype, "findSansAffectation", null);
__decorate([
    (0, common_1.Get)('me'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.stagiaire),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StagiairesController.prototype, "getMyStagiaire", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.structure),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StagiairesController.prototype, "getStagiaireDetails", null);
exports.StagiairesController = StagiairesController = __decorate([
    (0, common_1.Controller)('stagiaires'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [stagiaires_service_1.StagiairesService])
], StagiairesController);
//# sourceMappingURL=stagiaires.controller.js.map