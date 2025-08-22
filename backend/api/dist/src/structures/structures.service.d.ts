import { PrismaService } from '../prisma/prisma.service';
import { CreateStructureDto } from './dto/create-structure.dto';
import { UpdateStructureDto } from './dto/update-structure.dto';
import { AssignStagiaireDto } from './dto/assign-stagiaire.dto';
import { NotificationService } from '../notification/notification.service';
export declare class StructuresService {
    private prisma;
    private notificationService;
    constructor(prisma: PrismaService, notificationService: NotificationService);
    create(createStructureDto: CreateStructureDto): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        type: string | null;
        nomStructure: string;
        sigle: string | null;
        isDeleted: boolean;
        parentId: number | null;
    }>;
    findAll(): Promise<({
        stagiaires: ({
            user: {
                profile: {
                    id: string;
                    userId: string;
                    nom: string;
                    prenom: string;
                    telephone: string | null;
                    avatar: string | null;
                    birthDate: Date | null;
                    school: string | null;
                    major: string | null;
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
                        userId: string;
                        nom: string;
                        prenom: string;
                        telephone: string | null;
                        avatar: string | null;
                        birthDate: Date | null;
                        school: string | null;
                        major: string | null;
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
            createdAt: Date;
            updatedAt: Date;
            type: string | null;
            nomStructure: string;
            sigle: string | null;
            isDeleted: boolean;
            parentId: number | null;
        } | null;
        children: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            type: string | null;
            nomStructure: string;
            sigle: string | null;
            isDeleted: boolean;
            parentId: number | null;
        }[];
        tuteurs: ({
            user: {
                profile: {
                    id: string;
                    userId: string;
                    nom: string;
                    prenom: string;
                    telephone: string | null;
                    avatar: string | null;
                    birthDate: Date | null;
                    school: string | null;
                    major: string | null;
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
        createdAt: Date;
        updatedAt: Date;
        type: string | null;
        nomStructure: string;
        sigle: string | null;
        isDeleted: boolean;
        parentId: number | null;
    })[]>;
    findSousStructures(): Promise<({
        stagiaires: ({
            user: {
                profile: {
                    id: string;
                    userId: string;
                    nom: string;
                    prenom: string;
                    telephone: string | null;
                    avatar: string | null;
                    birthDate: Date | null;
                    school: string | null;
                    major: string | null;
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
                        userId: string;
                        nom: string;
                        prenom: string;
                        telephone: string | null;
                        avatar: string | null;
                        birthDate: Date | null;
                        school: string | null;
                        major: string | null;
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
            createdAt: Date;
            updatedAt: Date;
            type: string | null;
            nomStructure: string;
            sigle: string | null;
            isDeleted: boolean;
            parentId: number | null;
        } | null;
        children: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            type: string | null;
            nomStructure: string;
            sigle: string | null;
            isDeleted: boolean;
            parentId: number | null;
        }[];
        tuteurs: ({
            user: {
                profile: {
                    id: string;
                    userId: string;
                    nom: string;
                    prenom: string;
                    telephone: string | null;
                    avatar: string | null;
                    birthDate: Date | null;
                    school: string | null;
                    major: string | null;
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
        createdAt: Date;
        updatedAt: Date;
        type: string | null;
        nomStructure: string;
        sigle: string | null;
        isDeleted: boolean;
        parentId: number | null;
    })[]>;
    findOne(id: number): Promise<{
        stagiaires: ({
            user: {
                profile: {
                    id: string;
                    userId: string;
                    nom: string;
                    prenom: string;
                    telephone: string | null;
                    avatar: string | null;
                    birthDate: Date | null;
                    school: string | null;
                    major: string | null;
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
                        userId: string;
                        nom: string;
                        prenom: string;
                        telephone: string | null;
                        avatar: string | null;
                        birthDate: Date | null;
                        school: string | null;
                        major: string | null;
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
            createdAt: Date;
            updatedAt: Date;
            type: string | null;
            nomStructure: string;
            sigle: string | null;
            isDeleted: boolean;
            parentId: number | null;
        } | null;
        children: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            type: string | null;
            nomStructure: string;
            sigle: string | null;
            isDeleted: boolean;
            parentId: number | null;
        }[];
        tuteurs: ({
            user: {
                profile: {
                    id: string;
                    userId: string;
                    nom: string;
                    prenom: string;
                    telephone: string | null;
                    avatar: string | null;
                    birthDate: Date | null;
                    school: string | null;
                    major: string | null;
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
        createdAt: Date;
        updatedAt: Date;
        type: string | null;
        nomStructure: string;
        sigle: string | null;
        isDeleted: boolean;
        parentId: number | null;
    }>;
    update(id: number, updateStructureDto: UpdateStructureDto): Promise<{
        stagiaires: ({
            user: {
                profile: {
                    id: string;
                    userId: string;
                    nom: string;
                    prenom: string;
                    telephone: string | null;
                    avatar: string | null;
                    birthDate: Date | null;
                    school: string | null;
                    major: string | null;
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
                        userId: string;
                        nom: string;
                        prenom: string;
                        telephone: string | null;
                        avatar: string | null;
                        birthDate: Date | null;
                        school: string | null;
                        major: string | null;
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
            createdAt: Date;
            updatedAt: Date;
            type: string | null;
            nomStructure: string;
            sigle: string | null;
            isDeleted: boolean;
            parentId: number | null;
        } | null;
        children: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            type: string | null;
            nomStructure: string;
            sigle: string | null;
            isDeleted: boolean;
            parentId: number | null;
        }[];
        tuteurs: ({
            user: {
                profile: {
                    id: string;
                    userId: string;
                    nom: string;
                    prenom: string;
                    telephone: string | null;
                    avatar: string | null;
                    birthDate: Date | null;
                    school: string | null;
                    major: string | null;
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
        createdAt: Date;
        updatedAt: Date;
        type: string | null;
        nomStructure: string;
        sigle: string | null;
        isDeleted: boolean;
        parentId: number | null;
    }>;
    remove(id: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        type: string | null;
        nomStructure: string;
        sigle: string | null;
        isDeleted: boolean;
        parentId: number | null;
    }>;
    private isChildStructure;
    assignStagiaire(assignStagiaireDto: AssignStagiaireDto): Promise<({
        user: {
            profile: {
                id: string;
                userId: string;
                nom: string;
                prenom: string;
                telephone: string | null;
                avatar: string | null;
                birthDate: Date | null;
                school: string | null;
                major: string | null;
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
        structure: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            type: string | null;
            nomStructure: string;
            sigle: string | null;
            isDeleted: boolean;
            parentId: number | null;
        } | null;
        tuteur: ({
            user: {
                profile: {
                    id: string;
                    userId: string;
                    nom: string;
                    prenom: string;
                    telephone: string | null;
                    avatar: string | null;
                    birthDate: Date | null;
                    school: string | null;
                    major: string | null;
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
    }) | null>;
    findSousStructuresByParentId(parentId: number): Promise<({
        stagiaires: ({
            user: {
                profile: {
                    id: string;
                    userId: string;
                    nom: string;
                    prenom: string;
                    telephone: string | null;
                    avatar: string | null;
                    birthDate: Date | null;
                    school: string | null;
                    major: string | null;
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
                        userId: string;
                        nom: string;
                        prenom: string;
                        telephone: string | null;
                        avatar: string | null;
                        birthDate: Date | null;
                        school: string | null;
                        major: string | null;
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
            createdAt: Date;
            updatedAt: Date;
            type: string | null;
            nomStructure: string;
            sigle: string | null;
            isDeleted: boolean;
            parentId: number | null;
        } | null;
        children: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            type: string | null;
            nomStructure: string;
            sigle: string | null;
            isDeleted: boolean;
            parentId: number | null;
        }[];
        tuteurs: ({
            user: {
                profile: {
                    id: string;
                    userId: string;
                    nom: string;
                    prenom: string;
                    telephone: string | null;
                    avatar: string | null;
                    birthDate: Date | null;
                    school: string | null;
                    major: string | null;
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
        createdAt: Date;
        updatedAt: Date;
        type: string | null;
        nomStructure: string;
        sigle: string | null;
        isDeleted: boolean;
        parentId: number | null;
    })[]>;
    getStagiairesByStructure(structureId: string): Promise<({
        user: {
            profile: {
                id: string;
                userId: string;
                nom: string;
                prenom: string;
                telephone: string | null;
                avatar: string | null;
                birthDate: Date | null;
                school: string | null;
                major: string | null;
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
                    userId: string;
                    nom: string;
                    prenom: string;
                    telephone: string | null;
                    avatar: string | null;
                    birthDate: Date | null;
                    school: string | null;
                    major: string | null;
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
    getStagiairesStats(): Promise<{
        id: number;
        nom: string;
        count: number;
    }[]>;
    getStructureUsers(structureId: number): Promise<({
        stagiaire: {
            id: string;
            userId: string;
            structureAffecteeId: number | null;
            serviceAffecteId: number | null;
            tuteurId: string | null;
        } | null;
        profile: {
            id: string;
            userId: string;
            nom: string;
            prenom: string;
            telephone: string | null;
            avatar: string | null;
            birthDate: Date | null;
            school: string | null;
            major: string | null;
        } | null;
        tuteur: {
            id: string;
            structureId: number | null;
            userId: string;
            serviceId: number | null;
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
    })[]>;
    findUserStructure(userId: string): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        type: string | null;
        nomStructure: string;
        sigle: string | null;
        isDeleted: boolean;
        parentId: number | null;
    } | null>;
    findTuteurStructure(userId: string): Promise<{
        structureId: number | null;
    } | null>;
}
