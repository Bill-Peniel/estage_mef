import { PrismaService } from '../prisma/prisma.service';
export declare class AffectationsService {
    private prisma;
    constructor(prisma: PrismaService);
    private getChildStructureIds;
    getStagiaires(structureId: number): Promise<({
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
    getTuteurs(structureId: number): Promise<({
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
    getAffectations(structureId: number): Promise<({
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
    createAffectation(stagiaireId: string, tuteurId: string, structureId: number): Promise<{
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
    deleteAffectation(stagiaireId: string, structureId: number): Promise<{
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
    getStagiairesByTuteur(tuteurId: string): Promise<({
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
