import { StructuresService } from './structures.service';
import { CreateStructureDto } from './dto/create-structure.dto';
import { UpdateStructureDto } from './dto/update-structure.dto';
import { AssignStagiaireDto } from './dto/assign-stagiaire.dto';
export declare class StructuresController {
    private readonly structuresService;
    constructor(structuresService: StructuresService);
    create(createStructureDto: CreateStructureDto, req: any): Promise<{
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
    findSousStructures(req: any): Promise<({
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
    findOne(id: string): Promise<{
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
    update(id: string, updateStructureDto: UpdateStructureDto, req: any): Promise<{
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
    remove(id: string, req: any): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        type: string | null;
        nomStructure: string;
        sigle: string | null;
        isDeleted: boolean;
        parentId: number | null;
    }>;
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
    getStagiairesByStructure(id: string): Promise<({
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
    getStructureUsers(id: string, req: any): Promise<({
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
}
