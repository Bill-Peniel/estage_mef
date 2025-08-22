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
exports.StatisticsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let StatisticsService = class StatisticsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getStructuresStats() {
        try {
            console.log('Début getStructuresStats');
            const structures = await this.prisma.structure.findMany({
                where: {
                    parentId: null,
                    isDeleted: false
                },
                select: {
                    id: true,
                    nomStructure: true,
                    _count: {
                        select: {
                            stagiaires: true
                        }
                    }
                },
                orderBy: {
                    nomStructure: 'asc'
                }
            });
            console.log('Structures trouvées:', structures);
            if (!structures || structures.length === 0) {
                console.log('Aucune structure trouvée');
                return [];
            }
            const formattedData = structures.map(structure => ({
                id: structure.id,
                nom: structure.nomStructure,
                count: structure._count.stagiaires
            }));
            console.log('Données formatées:', formattedData);
            return formattedData;
        }
        catch (error) {
            console.error('Erreur détaillée dans getStructuresStats:', error);
            throw new common_1.InternalServerErrorException('Erreur lors de la récupération des statistiques des structures');
        }
    }
    async getDemandesEvolution() {
        try {
            console.log('Début getDemandesEvolution');
            const sixMonthsAgo = new Date();
            sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
            console.log('Date de début:', sixMonthsAgo);
            const months = Array.from({ length: 6 }, (_, i) => {
                const date = new Date();
                date.setMonth(date.getMonth() - i);
                return date.toISOString().slice(0, 7);
            }).reverse();
            console.log('Mois à analyser:', months);
            const demandes = await this.prisma.stageRequest.groupBy({
                by: ['createdAt'],
                where: {
                    createdAt: {
                        gte: sixMonthsAgo
                    }
                },
                _count: {
                    _all: true
                }
            });
            console.log('Demandes trouvées:', demandes);
            const evolutionData = months.reduce((acc, month) => {
                acc[month] = 0;
                return acc;
            }, {});
            demandes.forEach(demande => {
                const month = new Date(demande.createdAt).toISOString().slice(0, 7);
                if (evolutionData[month] !== undefined) {
                    evolutionData[month] += demande._count._all;
                }
            });
            const result = Object.entries(evolutionData)
                .map(([month, count]) => ({
                month,
                count
            }));
            console.log('Données d\'évolution formatées:', result);
            return result;
        }
        catch (error) {
            console.error('Erreur détaillée dans getDemandesEvolution:', error);
            throw new common_1.InternalServerErrorException('Erreur lors de la récupération de l\'évolution des demandes');
        }
    }
    async getGeneralStats() {
        try {
            console.log('Début getGeneralStats');
            const total = await this.prisma.stageRequest.count();
            const enCours = await this.prisma.stageRequest.count({
                where: {
                    status: 'EN_ATTENTE'
                }
            });
            const confirmes = await this.prisma.stageRequest.count({
                where: {
                    status: 'VALIDEE'
                }
            });
            const lastMonth = new Date();
            lastMonth.setMonth(lastMonth.getMonth() - 1);
            const totalLastMonth = await this.prisma.stageRequest.count({
                where: {
                    createdAt: { lt: lastMonth }
                }
            });
            const trend = totalLastMonth > 0
                ? Math.round(((total - totalLastMonth) / totalLastMonth) * 100)
                : 0;
            return {
                total,
                enCours,
                confirmes,
                tauxCompletion: total > 0 ? Math.round((confirmes / total) * 100) : 0,
                tauxSatisfaction: 4.5,
                trend,
                trendEnCours: 0,
                trendCompletion: 0,
                trendSatisfaction: 0
            };
        }
        catch (error) {
            console.error('Erreur détaillée dans getGeneralStats:', error);
            throw new common_1.InternalServerErrorException('Erreur lors de la récupération des statistiques générales');
        }
    }
    async getTypeStats() {
        try {
            console.log('Début getTypeStats');
            const types = await this.prisma.stageRequest.groupBy({
                by: ['type'],
                _count: true
            });
            return types.map(type => ({
                type: type.type,
                count: type._count
            }));
        }
        catch (error) {
            console.error('Erreur détaillée dans getTypeStats:', error);
            throw new common_1.InternalServerErrorException('Erreur lors de la récupération des statistiques par type');
        }
    }
    async getEducationStats() {
        try {
            console.log('Début getEducationStats');
            const niveaux = await this.prisma.stageRequest.groupBy({
                by: ['anneeEtude'],
                _count: true
            });
            return niveaux.map(niveau => ({
                niveau: niveau.anneeEtude,
                count: niveau._count
            }));
        }
        catch (error) {
            console.error('Erreur détaillée dans getEducationStats:', error);
            throw new common_1.InternalServerErrorException('Erreur lors de la récupération des statistiques par niveau');
        }
    }
    async getTuteursStats(structureId) {
        try {
            const tuteurs = await this.prisma.tuteur.findMany({
                where: {
                    structureId: structureId
                },
                select: {
                    id: true,
                    user: {
                        select: {
                            profile: {
                                select: {
                                    nom: true,
                                    prenom: true
                                }
                            }
                        }
                    },
                    stagiaires: true
                }
            });
            return tuteurs.map(tuteur => ({
                id: tuteur.id,
                nom: tuteur.user?.profile ? `${tuteur.user.profile.prenom} ${tuteur.user.profile.nom}` : 'N/A',
                count: tuteur.stagiaires.length
            }));
        }
        catch (error) {
            console.error('Erreur dans getTuteursStats:', error);
            throw new common_1.InternalServerErrorException('Erreur lors de la récupération des stats tuteurs');
        }
    }
    async getGeneralStatsByStructure(structureId) {
        try {
            const total = await this.prisma.stageRequest.count({
                where: {
                    stagiaire: {
                        stagiaire: {
                            structureAffecteeId: structureId
                        }
                    }
                }
            });
            const enCours = await this.prisma.stageRequest.count({
                where: {
                    status: 'EN_ATTENTE',
                    stagiaire: {
                        stagiaire: {
                            structureAffecteeId: structureId
                        }
                    }
                }
            });
            const confirmes = await this.prisma.stageRequest.count({
                where: {
                    status: 'VALIDEE',
                    stagiaire: {
                        stagiaire: {
                            structureAffecteeId: structureId
                        }
                    }
                }
            });
            const lastMonth = new Date();
            lastMonth.setMonth(lastMonth.getMonth() - 1);
            const totalLastMonth = await this.prisma.stageRequest.count({
                where: {
                    createdAt: { lt: lastMonth },
                    stagiaire: {
                        stagiaire: {
                            structureAffecteeId: structureId
                        }
                    }
                }
            });
            const trend = totalLastMonth > 0 ? Math.round(((total - totalLastMonth) / totalLastMonth) * 100) : 0;
            return {
                total,
                enCours,
                confirmes,
                tauxCompletion: total > 0 ? Math.round((confirmes / total) * 100) : 0,
                tauxSatisfaction: 4.5,
                trend,
                trendEnCours: 0,
                trendCompletion: 0,
                trendSatisfaction: 0
            };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Erreur lors de la récupération des statistiques générales de la structure');
        }
    }
    async getTypeStatsByStructure(structureId) {
        try {
            const types = await this.prisma.stageRequest.groupBy({
                by: ['type'],
                where: {
                    stagiaire: {
                        stagiaire: {
                            structureAffecteeId: structureId
                        }
                    }
                },
                _count: true
            });
            return types.map(type => ({ type: type.type, count: type._count }));
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Erreur lors de la récupération des statistiques par type de la structure');
        }
    }
    async getEducationStatsByStructure(structureId) {
        try {
            const niveaux = await this.prisma.stageRequest.groupBy({
                by: ['anneeEtude'],
                where: {
                    stagiaire: {
                        stagiaire: {
                            structureAffecteeId: structureId
                        }
                    }
                },
                _count: true
            });
            return niveaux.map(niveau => ({ niveau: niveau.anneeEtude, count: niveau._count }));
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Erreur lors de la récupération des statistiques par niveau de la structure');
        }
    }
    async getDemandesEvolutionByStructure(structureId) {
        try {
            const sixMonthsAgo = new Date();
            sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
            const months = Array.from({ length: 6 }, (_, i) => {
                const date = new Date();
                date.setMonth(date.getMonth() - i);
                return date.toISOString().slice(0, 7);
            }).reverse();
            const demandes = await this.prisma.stageRequest.groupBy({
                by: ['createdAt'],
                where: {
                    createdAt: { gte: sixMonthsAgo },
                    stagiaire: {
                        stagiaire: {
                            structureAffecteeId: structureId
                        }
                    }
                },
                _count: { _all: true }
            });
            const evolutionData = months.reduce((acc, month) => { acc[month] = 0; return acc; }, {});
            demandes.forEach(demande => {
                const month = new Date(demande.createdAt).toISOString().slice(0, 7);
                if (evolutionData[month] !== undefined) {
                    evolutionData[month] += demande._count._all;
                }
            });
            return Object.entries(evolutionData).map(([month, count]) => ({ month, count }));
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Erreur lors de la récupération de l\'évolution des demandes de la structure');
        }
    }
    async getTuteurStats(tuteurId) {
        try {
            const stagiaires = await this.prisma.stagiaire.findMany({
                where: {
                    tuteurId: tuteurId
                },
                include: {
                    user: {
                        include: {
                            profile: true
                        }
                    },
                    stages: true
                }
            });
            const evaluations = await this.prisma.evaluation.findMany({
                where: {
                    tuteurId: tuteurId
                }
            });
            const totalStagiaires = stagiaires.length;
            const stagiairesActifs = stagiaires.filter(s => s.stages.some(stage => stage.statut === 'en_cours')).length;
            const stagiairesTermines = stagiaires.filter(s => s.stages.some(stage => stage.statut === 'termine')).length;
            const evaluationsCompletes = evaluations.length;
            return {
                totalStagiaires,
                stagiairesActifs,
                stagiairesTermines,
                evaluationsCompletes,
                tauxCompletion: totalStagiaires > 0 ? Math.round((stagiairesTermines / totalStagiaires) * 100) : 0,
                tauxEvaluation: totalStagiaires > 0 ? Math.round((evaluationsCompletes / totalStagiaires) * 100) : 0
            };
        }
        catch (error) {
            console.error('Erreur dans getTuteurStats:', error);
            throw new common_1.InternalServerErrorException('Erreur lors de la récupération des stats tuteur');
        }
    }
    async getTuteurActivities(tuteurId) {
        try {
            const activities = [];
            const recentAffectations = await this.prisma.stagiaire.findMany({
                where: {
                    tuteurId: tuteurId
                },
                include: {
                    user: {
                        include: {
                            profile: true
                        }
                    }
                },
                orderBy: {
                    user: {
                        createdAt: 'desc'
                    }
                },
                take: 5
            });
            recentAffectations.forEach(stagiaire => {
                if (stagiaire.user?.profile) {
                    activities.push({
                        type: 'new_intern',
                        title: 'Nouveau stagiaire assigné',
                        description: `${stagiaire.user.profile.prenom} ${stagiaire.user.profile.nom}`,
                        date: stagiaire.user.createdAt,
                        icon: 'fas fa-user-plus',
                        color: 'bg-blue-100 text-blue-600'
                    });
                }
            });
            const recentEvaluations = await this.prisma.evaluation.findMany({
                where: {
                    tuteurId: tuteurId
                },
                include: {
                    stagiaire: {
                        include: {
                            profile: true
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                },
                take: 5
            });
            recentEvaluations.forEach(evaluation => {
                if (evaluation.stagiaire?.profile) {
                    activities.push({
                        type: 'evaluation',
                        title: 'Évaluation complétée',
                        description: `${evaluation.stagiaire.profile.prenom} ${evaluation.stagiaire.profile.nom}`,
                        date: evaluation.createdAt,
                        icon: 'fas fa-check',
                        color: 'bg-green-100 text-green-600'
                    });
                }
            });
            return activities
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .slice(0, 5);
        }
        catch (error) {
            console.error('Erreur dans getTuteurActivities:', error);
            throw new common_1.InternalServerErrorException('Erreur lors de la récupération des activités tuteur');
        }
    }
};
exports.StatisticsService = StatisticsService;
exports.StatisticsService = StatisticsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], StatisticsService);
//# sourceMappingURL=statistics.service.js.map