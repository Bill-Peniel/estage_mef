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
var StageRequestController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StageRequestController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const stage_request_service_1 = require("./stage-request.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const client_1 = require("@prisma/client");
const multer_1 = require("multer");
const path_1 = require("path");
const path_2 = require("path");
let StageRequestController = StageRequestController_1 = class StageRequestController {
    stageRequestService;
    logger = new common_1.Logger(StageRequestController_1.name);
    constructor(stageRequestService) {
        this.stageRequestService = stageRequestService;
    }
    async createStageRequest(req, data, files) {
        try {
            this.logger.debug('Requête de création de demande de stage reçue');
            this.logger.debug('Données reçues:', JSON.stringify(data, null, 2));
            this.logger.debug('Fichiers reçus:', JSON.stringify(files, null, 2));
            if (!req.user) {
                throw new common_1.UnauthorizedException('Utilisateur non authentifié');
            }
            const normalizeNested = (prefix) => {
                const result = {};
                Object.keys(data || {}).forEach((key) => {
                    if (key.startsWith(`${prefix}[`) && key.endsWith(']')) {
                        const nestedKey = key.slice(prefix.length + 1, -1);
                        result[nestedKey] = data[key];
                    }
                });
                if (typeof data?.[prefix] === 'string') {
                    try {
                        return { ...result, ...JSON.parse(data[prefix]) };
                    }
                    catch (_) {
                    }
                }
                else if (typeof data?.[prefix] === 'object' && data[prefix] !== null) {
                    return { ...result, ...data[prefix] };
                }
                return result;
            };
            const normalizedPersonalInfo = normalizeNested('personalInfo');
            const normalizedInternshipInfo = normalizeNested('internshipInfo');
            data = {
                ...data,
                personalInfo: normalizedPersonalInfo,
                internshipInfo: normalizedInternshipInfo,
            };
            const requestData = {
                ...data,
                documents: files
            };
            if (req.user.role === 'stagiaire') {
                requestData.stagiaireId = req.user.id;
            }
            else if (req.user.role === 'dpaf' || req.user.role === 'tuteur') {
                requestData.stagiaireId = data.stagiaireId;
            }
            else {
                throw new common_1.ForbiddenException('Vous n\'êtes pas autorisé à soumettre une demande de stage');
            }
            this.logger.debug('Données préparées pour le service:', JSON.stringify(requestData, null, 2));
            const result = await this.stageRequestService.createStageRequest(requestData);
            this.logger.debug('Demande créée avec succès:', JSON.stringify(result, null, 2));
            return {
                success: true,
                message: `Votre demande de stage a été soumise avec succès !\nVotre code de suivi est : ${result.data.code_suivi}\nConservez précieusement ce code pour suivre l'état de votre demande.`,
                data: result.data
            };
        }
        catch (error) {
            this.logger.error('Erreur lors de la création de la demande:', error);
            throw error;
        }
    }
    async getMyStageRequests(req) {
        if (!req.user) {
            throw new common_1.BadRequestException('Utilisateur non authentifié');
        }
        return this.stageRequestService.getStageRequestsByStagiaire(req.user.id);
    }
    async getStageRequestsForDPAF() {
        return this.stageRequestService.getStageRequestsForDPAF();
    }
    async getHistoriqueStagiaires() {
        return this.stageRequestService.getHistoriqueStagiaires();
    }
    async approveStageRequest(id, req) {
        try {
            if (!id) {
                throw new common_1.BadRequestException('ID de la demande manquant');
            }
            if (req.user.role !== client_1.UserRole.dpaf) {
                throw new common_1.ForbiddenException('Vous n\'avez pas les droits nécessaires pour approuver une demande');
            }
            const result = await this.stageRequestService.approveStageRequest(id);
            return result;
        }
        catch (error) {
            this.logger.error(`Erreur lors de l'approbation de la demande ${id}:`, error);
            if (error instanceof common_1.BadRequestException || error instanceof common_1.ForbiddenException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('Une erreur est survenue lors de l\'approbation de la demande');
        }
    }
    async rejectStageRequest(id, motif, req) {
        try {
            if (!motif) {
                throw new common_1.BadRequestException('Le motif du refus est requis');
            }
            if (req.user.role !== client_1.UserRole.dpaf) {
                throw new common_1.ForbiddenException('Vous n\'avez pas les droits nécessaires pour refuser une demande');
            }
            return this.stageRequestService.rejectStageRequest(id, motif);
        }
        catch (error) {
            this.logger.error(`Erreur lors du refus de la demande ${id}:`, error);
            if (error instanceof common_1.BadRequestException || error instanceof common_1.ForbiddenException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('Une erreur est survenue lors du refus de la demande');
        }
    }
    async getStatistics() {
        return this.stageRequestService.getStatistics();
    }
    async getRecentStageRequests() {
        return this.stageRequestService.getRecentStageRequests();
    }
    async checkStageRequestStatus(code_suivi, email) {
        if (!code_suivi || !email) {
            throw new common_1.BadRequestException('Le code de suivi et l\'email sont requis.');
        }
        try {
            const request = await this.stageRequestService.findStageRequestByTrackingCodeAndEmail(code_suivi, email);
            return {
                requestId: request.code_suivi,
                submissionDate: request.createdAt,
                status: request.status,
                structure: request.stagiaire?.structure?.nomStructure || 'Non renseignée',
                lastUpdate: request.updatedAt,
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message || 'Erreur lors de la recherche de la demande.');
        }
    }
    async updateDocuments(id, req, files) {
        if (!req.user) {
            throw new common_1.UnauthorizedException('Utilisateur non authentifié');
        }
        const stageRequest = await this.stageRequestService.findById(id);
        if (!stageRequest) {
            throw new common_1.BadRequestException('Demande non trouvée');
        }
        if (stageRequest.stagiaireId !== req.user.id) {
            throw new common_1.ForbiddenException('Vous ne pouvez modifier que vos propres documents');
        }
        const updated = await this.stageRequestService.updateDocuments(id, files);
        return {
            success: true,
            message: 'Documents mis à jour',
            data: updated
        };
    }
    async validateSecondCandidate(id, req) {
        try {
            if (!req.user) {
                throw new common_1.UnauthorizedException('Utilisateur non authentifié');
            }
            const result = await this.stageRequestService.validateSecondCandidate(id, {
                userId: req.user.id,
                email: req.user.email
            });
            return {
                success: true,
                message: 'Validation du second candidat effectuée avec succès',
                data: result
            };
        }
        catch (error) {
            this.logger.error('Erreur lors de la validation du second candidat:', error);
            throw error;
        }
    }
    async uploadCandidate2Photo(id, req, files) {
        if (!req.user) {
            throw new common_1.UnauthorizedException('Utilisateur non authentifié');
        }
        const updated = await this.stageRequestService.updateCandidate2Photo(id, files?.candidate2Photo?.[0]);
        return {
            success: true,
            message: 'Photo du candidat 2 mise à jour',
            data: updated
        };
    }
    async getSecondCandidateSummary(id, token, req) {
        try {
            const userEmail = req?.user?.email;
            const result = await this.stageRequestService.getSecondCandidateSummary(id, {
                token,
                userEmail,
            });
            return {
                success: true,
                data: result,
            };
        }
        catch (error) {
            this.logger.error('Erreur lors de la récupération du résumé pour le second candidat:', error);
            throw error;
        }
    }
    async refuseSecondCandidate(id, req) {
        try {
            if (!req.user) {
                throw new common_1.UnauthorizedException('Utilisateur non authentifié');
            }
            const result = await this.stageRequestService.refuseSecondCandidate(id, {
                userId: req.user.id,
                email: req.user.email
            });
            return {
                success: true,
                message: 'Refus du second candidat enregistré. La demande a été annulée.',
                data: result
            };
        }
        catch (error) {
            this.logger.error('Erreur lors du refus par le second candidat:', error);
            throw error;
        }
    }
};
exports.StageRequestController = StageRequestController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([
        { name: 'cv', maxCount: 1 },
        { name: 'coverLetter', maxCount: 1 },
        { name: 'identityCard', maxCount: 1 },
        { name: 'universityEnrollment', maxCount: 1 },
        { name: 'recommendation', maxCount: 1 },
        { name: 'otherDocuments', maxCount: 5 },
        { name: 'photo', maxCount: 1 }
    ], {
        storage: (0, multer_1.diskStorage)({
            destination: (0, path_2.join)(process.cwd(), 'uploads'),
            filename: (req, file, callback) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                const ext = (0, path_1.extname)(file.originalname);
                const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
                callback(null, filename);
            }
        })
    })),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], StageRequestController.prototype, "createStageRequest", null);
__decorate([
    (0, common_1.Get)('mes-demandes'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.stagiaire),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StageRequestController.prototype, "getMyStageRequests", null);
__decorate([
    (0, common_1.Get)('dpaf'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.dpaf),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StageRequestController.prototype, "getStageRequestsForDPAF", null);
__decorate([
    (0, common_1.Get)('historique'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.dpaf),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StageRequestController.prototype, "getHistoriqueStagiaires", null);
__decorate([
    (0, common_1.Post)(':id/approve'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.dpaf),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], StageRequestController.prototype, "approveStageRequest", null);
__decorate([
    (0, common_1.Post)(':id/reject'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.dpaf),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('motif')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], StageRequestController.prototype, "rejectStageRequest", null);
__decorate([
    (0, common_1.Get)('statistics'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.dpaf),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StageRequestController.prototype, "getStatistics", null);
__decorate([
    (0, common_1.Get)('recent'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.dpaf),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StageRequestController.prototype, "getRecentStageRequests", null);
__decorate([
    (0, common_1.Post)('status'),
    __param(0, (0, common_1.Body)('code_suivi')),
    __param(1, (0, common_1.Body)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], StageRequestController.prototype, "checkStageRequestStatus", null);
__decorate([
    (0, common_1.Patch)(':id/documents'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([
        { name: 'cv', maxCount: 1 },
        { name: 'coverLetter', maxCount: 1 },
        { name: 'identityCard', maxCount: 1 },
        { name: 'universityEnrollment', maxCount: 1 },
        { name: 'recommendation', maxCount: 1 },
        { name: 'otherDocuments', maxCount: 5 }
    ], {
        storage: (0, multer_1.diskStorage)({
            destination: (0, path_2.join)(process.cwd(), 'uploads'),
            filename: (req, file, callback) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                const ext = (0, path_1.extname)(file.originalname);
                const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
                callback(null, filename);
            }
        })
    })),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], StageRequestController.prototype, "updateDocuments", null);
__decorate([
    (0, common_1.Post)(':id/validate-second'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], StageRequestController.prototype, "validateSecondCandidate", null);
__decorate([
    (0, common_1.Patch)(':id/candidate2-photo'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([
        { name: 'candidate2Photo', maxCount: 1 },
    ], {
        storage: (0, multer_1.diskStorage)({
            destination: (0, path_2.join)(process.cwd(), 'uploads'),
            filename: (req, file, callback) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                const ext = (0, path_1.extname)(file.originalname);
                const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
                callback(null, filename);
            }
        })
    })),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], StageRequestController.prototype, "uploadCandidate2Photo", null);
__decorate([
    (0, common_1.Get)(':id/summary'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('token')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], StageRequestController.prototype, "getSecondCandidateSummary", null);
__decorate([
    (0, common_1.Post)(':id/refuse-second'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], StageRequestController.prototype, "refuseSecondCandidate", null);
exports.StageRequestController = StageRequestController = StageRequestController_1 = __decorate([
    (0, common_1.Controller)('stage-request'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [stage_request_service_1.StageRequestService])
], StageRequestController);
//# sourceMappingURL=stage-request.controller.js.map