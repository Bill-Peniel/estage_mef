import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
export declare class ServicesController {
    private readonly servicesService;
    constructor(servicesService: ServicesService);
    create(createServiceDto: CreateServiceDto, req: any): Promise<{
        id: number;
        isDeleted: boolean;
        createdAt: Date;
        updatedAt: Date;
        structureId: number;
        nomService: string;
        description: string | null;
    }>;
    findAllByStructure(structureId: number): Promise<({
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
        } & {
            id: string;
            userId: string;
            structureAffecteeId: number | null;
            serviceAffecteId: number | null;
            tuteurId: string | null;
        })[];
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
        isDeleted: boolean;
        createdAt: Date;
        updatedAt: Date;
        structureId: number;
        nomService: string;
        description: string | null;
    })[]>;
    findOne(id: number): Promise<{
        structure: {
            id: number;
            nomStructure: string;
            sigle: string | null;
            type: string | null;
            isDeleted: boolean;
            createdAt: Date;
            updatedAt: Date;
            parentId: number | null;
        };
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
        } & {
            id: string;
            userId: string;
            structureAffecteeId: number | null;
            serviceAffecteId: number | null;
            tuteurId: string | null;
        })[];
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
        isDeleted: boolean;
        createdAt: Date;
        updatedAt: Date;
        structureId: number;
        nomService: string;
        description: string | null;
    }>;
    update(id: number, updateServiceDto: Partial<CreateServiceDto>, req: any): Promise<{
        id: number;
        isDeleted: boolean;
        createdAt: Date;
        updatedAt: Date;
        structureId: number;
        nomService: string;
        description: string | null;
    }>;
    remove(id: number, req: any): Promise<{
        id: number;
        isDeleted: boolean;
        createdAt: Date;
        updatedAt: Date;
        structureId: number;
        nomService: string;
        description: string | null;
    }>;
}
