import { PrismaService } from '../prisma/prisma.service';
export declare class StatisticsService {
    private prisma;
    constructor(prisma: PrismaService);
    getStructuresStats(): Promise<{
        id: number;
        nom: string;
        count: number;
    }[]>;
    getDemandesEvolution(): Promise<{
        month: string;
        count: unknown;
    }[]>;
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
    getTuteursStats(structureId: number): Promise<{
        id: string;
        nom: string;
        count: number;
    }[]>;
    getGeneralStatsByStructure(structureId: number): Promise<{
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
    getTypeStatsByStructure(structureId: number): Promise<{
        type: string;
        count: number;
    }[]>;
    getEducationStatsByStructure(structureId: number): Promise<{
        niveau: string;
        count: number;
    }[]>;
    getDemandesEvolutionByStructure(structureId: number): Promise<{
        month: string;
        count: unknown;
    }[]>;
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
