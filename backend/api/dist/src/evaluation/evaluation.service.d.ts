import { PrismaService } from '../prisma/prisma.service';
export declare class EvaluationService {
    private prisma;
    constructor(prisma: PrismaService);
    createEvaluation(tuteurId: string, stagiaireId: string, criteres: any, commentaire: string): Promise<{
        id: string;
        createdAt: Date;
        tuteurId: string;
        stagiaireId: string;
        criteres: import("@prisma/client/runtime/library").JsonValue;
        commentaire: string | null;
    }>;
    getEvaluationForStagiaire(stagiaireId: string): Promise<{
        id: string;
        createdAt: Date;
        tuteurId: string;
        stagiaireId: string;
        criteres: import("@prisma/client/runtime/library").JsonValue;
        commentaire: string | null;
    }>;
}
