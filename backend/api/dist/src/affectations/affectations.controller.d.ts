import { AffectationsService } from './affectations.service';
export declare class AffectationsController {
    private readonly affectationsService;
    constructor(affectationsService: AffectationsService);
    getStagiaires(req: any): Promise<({
        user: {
            profile: {
                id: string;
                nom: string;
                prenom: string;
                telephone: string | null;
                avatar: string | null;
                birthDate: Date | null;
                school: string | null;
                major: string | null;
                userId: string;
            } | null;
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            passwordHash: string;
            role: import(".prisma/client").$Enums.UserRole;
            isActive: boolean;
            structureId: number | null;
            notifMessages: boolean | null;
            notifEvaluation: boolean | null;
            notifRapports: boolean | null;
        };
    } & {
        id: string;
        userId: string;
        structureAffecteeId: number | null;
        serviceAffecteId: number | null;
        tuteurId: string | null;
    })[]>;
    getTuteurs(req: any): Promise<({
        structure: {
            id: number;
            nomStructure: string;
            sigle: string | null;
        } | null;
        user: {
            profile: {
                id: string;
                nom: string;
                prenom: string;
                telephone: string | null;
                avatar: string | null;
                birthDate: Date | null;
                school: string | null;
                major: string | null;
                userId: string;
            } | null;
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            passwordHash: string;
            role: import(".prisma/client").$Enums.UserRole;
            isActive: boolean;
            structureId: number | null;
            notifMessages: boolean | null;
            notifEvaluation: boolean | null;
            notifRapports: boolean | null;
        };
    } & {
        id: string;
        structureId: number | null;
        userId: string;
        serviceId: number | null;
    })[]>;
    getAffectations(req: any): Promise<({
        user: {
            profile: {
                id: string;
                nom: string;
                prenom: string;
                telephone: string | null;
                avatar: string | null;
                birthDate: Date | null;
                school: string | null;
                major: string | null;
                userId: string;
            } | null;
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            passwordHash: string;
            role: import(".prisma/client").$Enums.UserRole;
            isActive: boolean;
            structureId: number | null;
            notifMessages: boolean | null;
            notifEvaluation: boolean | null;
            notifRapports: boolean | null;
        };
        tuteur: ({
            structure: {
                id: number;
                nomStructure: string;
                sigle: string | null;
            } | null;
            user: {
                profile: {
                    id: string;
                    nom: string;
                    prenom: string;
                    telephone: string | null;
                    avatar: string | null;
                    birthDate: Date | null;
                    school: string | null;
                    major: string | null;
                    userId: string;
                } | null;
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                email: string;
                passwordHash: string;
                role: import(".prisma/client").$Enums.UserRole;
                isActive: boolean;
                structureId: number | null;
                notifMessages: boolean | null;
                notifEvaluation: boolean | null;
                notifRapports: boolean | null;
            };
        } & {
            id: string;
            structureId: number | null;
            userId: string;
            serviceId: number | null;
        }) | null;
    } & {
        id: string;
        userId: string;
        structureAffecteeId: number | null;
        serviceAffecteId: number | null;
        tuteurId: string | null;
    })[]>;
    createAffectation(body: {
        stagiaireId: string;
        tuteurId: string;
    }, req: any): Promise<{
        user: {
            profile: {
                id: string;
                nom: string;
                prenom: string;
                telephone: string | null;
                avatar: string | null;
                birthDate: Date | null;
                school: string | null;
                major: string | null;
                userId: string;
            } | null;
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            passwordHash: string;
            role: import(".prisma/client").$Enums.UserRole;
            isActive: boolean;
            structureId: number | null;
            notifMessages: boolean | null;
            notifEvaluation: boolean | null;
            notifRapports: boolean | null;
        };
        tuteur: ({
            structure: {
                id: number;
                nomStructure: string;
                sigle: string | null;
            } | null;
            user: {
                profile: {
                    id: string;
                    nom: string;
                    prenom: string;
                    telephone: string | null;
                    avatar: string | null;
                    birthDate: Date | null;
                    school: string | null;
                    major: string | null;
                    userId: string;
                } | null;
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                email: string;
                passwordHash: string;
                role: import(".prisma/client").$Enums.UserRole;
                isActive: boolean;
                structureId: number | null;
                notifMessages: boolean | null;
                notifEvaluation: boolean | null;
                notifRapports: boolean | null;
            };
        } & {
            id: string;
            structureId: number | null;
            userId: string;
            serviceId: number | null;
        }) | null;
    } & {
        id: string;
        userId: string;
        structureAffecteeId: number | null;
        serviceAffecteId: number | null;
        tuteurId: string | null;
    }>;
    deleteAffectation(stagiaireId: string, req: any): Promise<{
        user: {
            profile: {
                id: string;
                nom: string;
                prenom: string;
                telephone: string | null;
                avatar: string | null;
                birthDate: Date | null;
                school: string | null;
                major: string | null;
                userId: string;
            } | null;
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            passwordHash: string;
            role: import(".prisma/client").$Enums.UserRole;
            isActive: boolean;
            structureId: number | null;
            notifMessages: boolean | null;
            notifEvaluation: boolean | null;
            notifRapports: boolean | null;
        };
    } & {
        id: string;
        userId: string;
        structureAffecteeId: number | null;
        serviceAffecteId: number | null;
        tuteurId: string | null;
    }>;
    getStagiairesByTuteur(req: any): Promise<({
        user: {
            profile: {
                id: string;
                nom: string;
                prenom: string;
                telephone: string | null;
                avatar: string | null;
                birthDate: Date | null;
                school: string | null;
                major: string | null;
                userId: string;
            } | null;
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            passwordHash: string;
            role: import(".prisma/client").$Enums.UserRole;
            isActive: boolean;
            structureId: number | null;
            notifMessages: boolean | null;
            notifEvaluation: boolean | null;
            notifRapports: boolean | null;
        };
    } & {
        id: string;
        userId: string;
        structureAffecteeId: number | null;
        serviceAffecteId: number | null;
        tuteurId: string | null;
    })[]>;
}
