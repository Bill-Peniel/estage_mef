import { PrismaService } from '../prisma/prisma.service';
export declare class StagiairesService {
    private prisma;
    constructor(prisma: PrismaService);
    findSansAffectation(): Promise<({
        user: {
            demandesStage: {
                dateDebut: Date;
                departement: string;
                universite: string;
                code_suivi: string | null;
            }[];
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
    findOne(id: string): Promise<{
        structure: {
            id: number;
            nomStructure: string;
            sigle: string | null;
            type: string | null;
            isDeleted: boolean;
            createdAt: Date;
            updatedAt: Date;
            parentId: number | null;
        } | null;
        user: {
            demandesStage: {
                id: string;
                type: string;
                createdAt: Date;
                updatedAt: Date;
                dateDebut: Date;
                status: string;
                departement: string;
                dateFin: Date;
                motivation: string;
                competences: string;
                experience: string;
                universite: string;
                domaineEtude: string;
                anneeEtude: string;
                code_suivi: string | null;
            }[];
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
    findOneByUserId(userId: string): Promise<{
        structure: {
            id: number;
            nomStructure: string;
            sigle: string | null;
            type: string | null;
            isDeleted: boolean;
            createdAt: Date;
            updatedAt: Date;
            parentId: number | null;
        } | null;
        user: {
            demandesStage: {
                id: string;
                type: string;
                createdAt: Date;
                updatedAt: Date;
                stagiaireId: string;
                dateDebut: Date;
                status: string;
                departement: string;
                dateFin: Date;
                motivation: string;
                competences: string;
                experience: string;
                universite: string;
                domaineEtude: string;
                anneeEtude: string;
                code_suivi: string | null;
                photo: string | null;
                candidate2Email: string | null;
                candidate2Photo: string | null;
                requiresSecondCandidateValidation: boolean;
                secondCandidateValidated: boolean;
                secondCandidateUserId: string | null;
                secondCandidateValidationToken: string | null;
                secondCandidateValidationExpiresAt: Date | null;
                cv: string | null;
                lettreMotivation: string | null;
                carteIdentite: string | null;
                inscriptionUniversitaire: string | null;
                recommandation: string | null;
                autresDocuments: import("@prisma/client/runtime/library").JsonValue | null;
            }[];
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
}
