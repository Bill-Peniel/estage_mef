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
exports.StructuresController = void 0;
const common_1 = require("@nestjs/common");
const structures_service_1 = require("./structures.service");
const create_structure_dto_1 = require("./dto/create-structure.dto");
const update_structure_dto_1 = require("./dto/update-structure.dto");
const assign_stagiaire_dto_1 = require("./dto/assign-stagiaire.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const client_1 = require("@prisma/client");
let StructuresController = class StructuresController {
    structuresService;
    constructor(structuresService) {
        this.structuresService = structuresService;
    }
    async create(createStructureDto, req) {
        if (req.user.role === client_1.UserRole.admin) {
            if (!createStructureDto.type) {
                throw new common_1.BadRequestException('Le type de structure est requis');
            }
            return this.structuresService.create(createStructureDto);
        }
        if (req.user.role === client_1.UserRole.structure) {
            const userStructure = await this.structuresService.findUserStructure(req.user.id);
            if (!userStructure) {
                throw new common_1.ForbiddenException('Vous n\'êtes pas associé à une structure');
            }
            if (userStructure.type === 'directionnelle') {
                createStructureDto.parentId = userStructure.id;
                createStructureDto.type = 'technique';
                return this.structuresService.create(createStructureDto);
            }
            throw new common_1.ForbiddenException('Les structures techniques ne peuvent pas créer de sous-structures');
        }
        if (req.user.role === client_1.UserRole.tuteur) {
            throw new common_1.ForbiddenException('Les tuteurs ne peuvent pas créer de structures');
        }
        throw new common_1.ForbiddenException('Rôle non autorisé');
    }
    findAll() {
        return this.structuresService.findAll();
    }
    findSousStructures(req) {
        if (req.user.role === client_1.UserRole.structure) {
            return this.structuresService.findSousStructuresByParentId(req.user.structureId);
        }
        return this.structuresService.findSousStructures();
    }
    findOne(id) {
        return this.structuresService.findOne(parseInt(id));
    }
    async update(id, updateStructureDto, req) {
        if (req.user.role === client_1.UserRole.structure) {
            const structure = await this.structuresService.findOne(parseInt(id));
            if (structure.parentId !== req.user.structureId) {
                throw new common_1.ForbiddenException('Vous n\'êtes pas autorisé à modifier cette sous-structure');
            }
        }
        return this.structuresService.update(parseInt(id), updateStructureDto);
    }
    async remove(id, req) {
        if (req.user.role === client_1.UserRole.structure) {
            const structure = await this.structuresService.findOne(parseInt(id));
            if (structure.parentId !== req.user.structureId) {
                throw new common_1.ForbiddenException('Vous n\'êtes pas autorisé à supprimer cette sous-structure');
            }
        }
        return this.structuresService.remove(parseInt(id));
    }
    assignStagiaire(assignStagiaireDto) {
        return this.structuresService.assignStagiaire(assignStagiaireDto);
    }
    async getStagiairesByStructure(id) {
        return this.structuresService.getStagiairesByStructure(id);
    }
    async getStagiairesStats() {
        return this.structuresService.getStagiairesStats();
    }
    async getStructureUsers(id, req) {
        if (req.user.role === client_1.UserRole.structure && req.user.structureId !== parseInt(id)) {
            throw new common_1.ForbiddenException('Vous n\'êtes pas autorisé à voir les utilisateurs de cette structure');
        }
        return this.structuresService.getStructureUsers(parseInt(id));
    }
};
exports.StructuresController = StructuresController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(client_1.UserRole.admin, client_1.UserRole.structure, client_1.UserRole.tuteur),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_structure_dto_1.CreateStructureDto, Object]),
    __metadata("design:returntype", Promise)
], StructuresController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], StructuresController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('sous-structures'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], StructuresController.prototype, "findSousStructures", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StructuresController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.admin, client_1.UserRole.structure),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_structure_dto_1.UpdateStructureDto, Object]),
    __metadata("design:returntype", Promise)
], StructuresController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.admin, client_1.UserRole.structure),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], StructuresController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)('assign-stagiaire'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.dpaf),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [assign_stagiaire_dto_1.AssignStagiaireDto]),
    __metadata("design:returntype", void 0)
], StructuresController.prototype, "assignStagiaire", null);
__decorate([
    (0, common_1.Get)(':id/stagiaires'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.structure),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StructuresController.prototype, "getStagiairesByStructure", null);
__decorate([
    (0, common_1.Get)('stats/stagiaires'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.dpaf),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StructuresController.prototype, "getStagiairesStats", null);
__decorate([
    (0, common_1.Get)(':id/users'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.admin, client_1.UserRole.structure),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], StructuresController.prototype, "getStructureUsers", null);
exports.StructuresController = StructuresController = __decorate([
    (0, common_1.Controller)('structures'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [structures_service_1.StructuresService])
], StructuresController);
//# sourceMappingURL=structures.controller.js.map