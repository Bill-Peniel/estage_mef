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
var TuteursController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TuteursController = void 0;
const common_1 = require("@nestjs/common");
const tuteurs_service_1 = require("./tuteurs.service");
const create_tuteur_dto_1 = require("./dto/create-tuteur.dto");
const update_tuteur_dto_1 = require("./dto/update-tuteur.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const client_1 = require("@prisma/client");
let TuteursController = TuteursController_1 = class TuteursController {
    tuteursService;
    logger = new common_1.Logger(TuteursController_1.name);
    constructor(tuteursService) {
        this.tuteursService = tuteursService;
    }
    async create(createTuteurDto) {
        try {
            this.logger.debug('Tentative de création d\'un tuteur');
            const tuteur = await this.tuteursService.create(createTuteurDto);
            this.logger.debug('Tuteur créé avec succès');
            return tuteur;
        }
        catch (error) {
            this.logger.error(`Erreur lors de la création du tuteur: ${error.message}`, error.stack);
            throw error;
        }
    }
    findAll() {
        return this.tuteursService.findAll();
    }
    async getAssignedInterns(req) {
        try {
            this.logger.debug('Récupération des stagiaires affectés');
            const interns = await this.tuteursService.getAssignedInterns(req.user.id);
            this.logger.debug(`${interns.length} stagiaires trouvés`);
            return { data: interns };
        }
        catch (error) {
            this.logger.error(`Erreur lors de la récupération des stagiaires: ${error.message}`, error.stack);
            throw error;
        }
    }
    getMyStructure(req) {
        return this.tuteursService.getMyStructure(req.user.id);
    }
    findOne(id) {
        return this.tuteursService.findOne(id);
    }
    update(id, updateTuteurDto) {
        return this.tuteursService.update(id, updateTuteurDto);
    }
    remove(id) {
        return this.tuteursService.remove(id);
    }
};
exports.TuteursController = TuteursController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(client_1.UserRole.admin, client_1.UserRole.structure),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_tuteur_dto_1.CreateTuteurDto]),
    __metadata("design:returntype", Promise)
], TuteursController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(client_1.UserRole.admin, client_1.UserRole.structure, client_1.UserRole.tuteur),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TuteursController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('assigned-interns'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.tuteur),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TuteursController.prototype, "getAssignedInterns", null);
__decorate([
    (0, common_1.Get)('my-structure'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.tuteur),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TuteursController.prototype, "getMyStructure", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.admin, client_1.UserRole.structure, client_1.UserRole.tuteur),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TuteursController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.admin, client_1.UserRole.structure),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_tuteur_dto_1.UpdateTuteurDto]),
    __metadata("design:returntype", void 0)
], TuteursController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.admin, client_1.UserRole.structure),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TuteursController.prototype, "remove", null);
exports.TuteursController = TuteursController = TuteursController_1 = __decorate([
    (0, common_1.Controller)('tuteurs'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [tuteurs_service_1.TuteursService])
], TuteursController);
//# sourceMappingURL=tuteurs.controller.js.map