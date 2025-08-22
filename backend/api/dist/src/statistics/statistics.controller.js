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
exports.StatisticsController = void 0;
const common_1 = require("@nestjs/common");
const statistics_service_1 = require("./statistics.service");
let StatisticsController = class StatisticsController {
    statisticsService;
    constructor(statisticsService) {
        this.statisticsService = statisticsService;
    }
    async getGeneralStats() {
        try {
            return await this.statisticsService.getGeneralStats();
        }
        catch (error) {
            console.error('Erreur dans le contrôleur getGeneralStats:', error);
            throw error;
        }
    }
    async getTypeStats() {
        try {
            return await this.statisticsService.getTypeStats();
        }
        catch (error) {
            console.error('Erreur dans le contrôleur getTypeStats:', error);
            throw error;
        }
    }
    async getEducationStats() {
        try {
            return await this.statisticsService.getEducationStats();
        }
        catch (error) {
            console.error('Erreur dans le contrôleur getEducationStats:', error);
            throw error;
        }
    }
    async getStructuresStats() {
        try {
            return await this.statisticsService.getStructuresStats();
        }
        catch (error) {
            console.error('Erreur dans le contrôleur getStructuresStats:', error);
            throw error;
        }
    }
    async getDemandesEvolution() {
        try {
            return await this.statisticsService.getDemandesEvolution();
        }
        catch (error) {
            console.error('Erreur dans le contrôleur getDemandesEvolution:', error);
            throw error;
        }
    }
    async getOverview() {
        try {
            const [general, types, education, tuteurs, evolution] = await Promise.all([
                this.statisticsService.getGeneralStats(),
                this.statisticsService.getTypeStats(),
                this.statisticsService.getEducationStats(),
                this.statisticsService.getStructuresStats(),
                this.statisticsService.getDemandesEvolution()
            ]);
            return {
                general,
                types,
                education,
                tuteurs,
                evolution
            };
        }
        catch (error) {
            console.error('Erreur dans le contrôleur getOverview:', error);
            throw error;
        }
    }
    async getTuteursStats(structureId) {
        try {
            return await this.statisticsService.getTuteursStats(Number(structureId));
        }
        catch (error) {
            console.error('Erreur dans le contrôleur getTuteursStats:', error);
            throw error;
        }
    }
    async getOverviewByStructure(structureId) {
        try {
            const [general, types, education, tuteurs, evolution] = await Promise.all([
                this.statisticsService.getGeneralStatsByStructure(Number(structureId)),
                this.statisticsService.getTypeStatsByStructure(Number(structureId)),
                this.statisticsService.getEducationStatsByStructure(Number(structureId)),
                this.statisticsService.getTuteursStats(Number(structureId)),
                this.statisticsService.getDemandesEvolutionByStructure(Number(structureId))
            ]);
            return {
                general,
                types,
                education,
                tuteurs,
                evolution
            };
        }
        catch (error) {
            console.error('Erreur dans le contrôleur getOverviewByStructure:', error);
            throw error;
        }
    }
    async getTuteurStats(tuteurId) {
        try {
            return await this.statisticsService.getTuteurStats(tuteurId);
        }
        catch (error) {
            console.error('Erreur dans le contrôleur getTuteurStats:', error);
            throw error;
        }
    }
    async getTuteurActivities(tuteurId) {
        try {
            return await this.statisticsService.getTuteurActivities(tuteurId);
        }
        catch (error) {
            console.error('Erreur dans le contrôleur getTuteurActivities:', error);
            throw error;
        }
    }
};
exports.StatisticsController = StatisticsController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StatisticsController.prototype, "getGeneralStats", null);
__decorate([
    (0, common_1.Get)('types'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StatisticsController.prototype, "getTypeStats", null);
__decorate([
    (0, common_1.Get)('education'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StatisticsController.prototype, "getEducationStats", null);
__decorate([
    (0, common_1.Get)('structures'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StatisticsController.prototype, "getStructuresStats", null);
__decorate([
    (0, common_1.Get)('evolution'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StatisticsController.prototype, "getDemandesEvolution", null);
__decorate([
    (0, common_1.Get)('overview'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StatisticsController.prototype, "getOverview", null);
__decorate([
    (0, common_1.Get)('tuteurs/:structureId'),
    __param(0, (0, common_1.Param)('structureId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StatisticsController.prototype, "getTuteursStats", null);
__decorate([
    (0, common_1.Get)('overview/:structureId'),
    __param(0, (0, common_1.Param)('structureId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StatisticsController.prototype, "getOverviewByStructure", null);
__decorate([
    (0, common_1.Get)('tuteur/:tuteurId'),
    __param(0, (0, common_1.Param)('tuteurId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StatisticsController.prototype, "getTuteurStats", null);
__decorate([
    (0, common_1.Get)('tuteur/:tuteurId/activities'),
    __param(0, (0, common_1.Param)('tuteurId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StatisticsController.prototype, "getTuteurActivities", null);
exports.StatisticsController = StatisticsController = __decorate([
    (0, common_1.Controller)('stage-request/statistics'),
    __metadata("design:paramtypes", [statistics_service_1.StatisticsService])
], StatisticsController);
//# sourceMappingURL=statistics.controller.js.map