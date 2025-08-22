import { StatisticsService } from './statistics.service';
export declare class StatisticsController {
    private readonly statisticsService;
    constructor(statisticsService: StatisticsService);
    getGeneralStats(): Promise<{
        total: number;
        enCours: number;
        confirmes: number;
        tauxCompletion: number;
        tauxSatisfaction: number;
        trend: number;
        trendEnCours: number;
        trendCompletion: number;
        trendSatisfaction: number;
    }>;
    getTypeStats(): Promise<{
        type: string;
        count: number;
    }[]>;
    getEducationStats(): Promise<{
        niveau: string;
        count: number;
    }[]>;
    getStructuresStats(): Promise<{
        id: number;
        nom: string;
        count: number;
    }[]>;
    getDemandesEvolution(): Promise<{
        month: string;
        count: unknown;
    }[]>;
    getOverview(): Promise<{
        general: {
            total: number;
            enCours: number;
            confirmes: number;
            tauxCompletion: number;
            tauxSatisfaction: number;
            trend: number;
            trendEnCours: number;
            trendCompletion: number;
            trendSatisfaction: number;
        };
        types: {
            type: string;
            count: number;
        }[];
        education: {
            niveau: string;
            count: number;
        }[];
        tuteurs: {
            id: number;
            nom: string;
            count: number;
        }[];
        evolution: {
            month: string;
            count: unknown;
        }[];
    }>;
    getTuteursStats(structureId: string): Promise<{
        id: string;
        nom: string;
        count: number;
    }[]>;
    getOverviewByStructure(structureId: string): Promise<{
        general: {
            total: number;
            enCours: number;
            confirmes: number;
            tauxCompletion: number;
            tauxSatisfaction: number;
            trend: number;
            trendEnCours: number;
            trendCompletion: number;
            trendSatisfaction: number;
        };
        types: {
            type: string;
            count: number;
        }[];
        education: {
            niveau: string;
            count: number;
        }[];
        tuteurs: {
            id: string;
            nom: string;
            count: number;
        }[];
        evolution: {
            month: string;
            count: unknown;
        }[];
    }>;
    getTuteurStats(tuteurId: string): Promise<{
        totalStagiaires: number;
        stagiairesActifs: number;
        stagiairesTermines: number;
        evaluationsCompletes: number;
        tauxCompletion: number;
        tauxEvaluation: number;
    }>;
    getTuteurActivities(tuteurId: string): Promise<any[]>;
}
