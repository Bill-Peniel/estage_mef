import { EvaluationService } from './evaluation.service';
export declare class EvaluationController {
    private readonly evaluationService;
    constructor(evaluationService: EvaluationService);
    createEvaluation(req: any, body: any): Promise<{
        id: string;
        createdAt: Date;
        tuteurId: string;
        stagiaireId: string;
        criteres: import("@prisma/client/runtime/library").JsonValue;
        commentaire: string | null;
    }>;
    getEvaluation(stagiaireId: string): Promise<{
        id: string;
        createdAt: Date;
        tuteurId: string;
        stagiaireId: string;
        criteres: import("@prisma/client/runtime/library").JsonValue;
        commentaire: string | null;
    }>;
}
