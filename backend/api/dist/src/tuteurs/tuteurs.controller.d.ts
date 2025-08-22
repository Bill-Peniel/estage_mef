import { TuteursService } from './tuteurs.service';
import { CreateTuteurDto } from './dto/create-tuteur.dto';
import { UpdateTuteurDto } from './dto/update-tuteur.dto';
export declare class TuteursController {
    private readonly tuteursService;
    private readonly logger;
    constructor(tuteursService: TuteursService);
    create(createTuteurDto: CreateTuteurDto): Promise<{
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
        service: {
            id: number;
            isDeleted: boolean;
            createdAt: Date;
            updatedAt: Date;
            structureId: number;
            nomService: string;
            description: string | null;
        } | null;
    } & {
        id: string;
        structureId: number | null;
        userId: string;
        serviceId: number | null;
    }>;
    findAll(): Promise<({
        structure: ({
            parent: {
                id: number;
                nomStructure: string;
                sigle: string | null;
                type: string | null;
                isDeleted: boolean;
                createdAt: Date;
                updatedAt: Date;
                parentId: number | null;
            } | null;
        } & {
            id: number;
            nomStructure: string;
            sigle: string | null;
            type: string | null;
            isDeleted: boolean;
            createdAt: Date;
            updatedAt: Date;
            parentId: number | null;
        }) | null;
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
    getAssignedInterns(req: any): Promise<{
        data: {
            id: string;
            userId: string;
            name: string;
            email: string;
            telephone: string;
            department: string;
            status: string;
            startDate: Date;
            endDate: Date;
        }[];
    }>;
    getMyStructure(req: any): Promise<{
        stagiaires: ({
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
        })[];
        parent: {
            id: number;
            nomStructure: string;
            sigle: string | null;
            type: string | null;
            isDeleted: boolean;
            createdAt: Date;
            updatedAt: Date;
            parentId: number | null;
        } | null;
        children: {
            id: number;
            nomStructure: string;
            sigle: string | null;
            type: string | null;
            isDeleted: boolean;
            createdAt: Date;
            updatedAt: Date;
            parentId: number | null;
        }[];
        tuteurs: ({
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
        })[];
    } & {
        id: number;
        nomStructure: string;
        sigle: string | null;
        type: string | null;
        isDeleted: boolean;
        createdAt: Date;
        updatedAt: Date;
        parentId: number | null;
    }>;
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
    }>;
    update(id: string, updateTuteurDto: UpdateTuteurDto): Promise<{
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
    }>;
    remove(id: string): Promise<{
        id: string;
        structureId: number | null;
        userId: string;
        serviceId: number | null;
    }>;
}
