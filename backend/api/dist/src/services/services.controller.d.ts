import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
export declare class ServicesController {
    private readonly servicesService;
    constructor(servicesService: ServicesService);
    create(createServiceDto: CreateServiceDto, req: any): Promise<{
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
        stagiaires: {
            id: string;
            userId: string;
            structureAffecteeId: number | null;
            serviceAffecteId: number | null;
            tuteurId: string | null;
        }[];
        tuteurs: {
            id: string;
            structureId: number | null;
            userId: string;
            serviceId: number | null;
        }[];
    } & {
        id: number;
        isDeleted: boolean;
        createdAt: Date;
        updatedAt: Date;
        structureId: number;
        nomService: string;
        description: string | null;
    }>;
    findAllByStructure(structureId: number): Promise<({
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
        stagiaires: {
            id: string;
            userId: string;
            structureAffecteeId: number | null;
            serviceAffecteId: number | null;
            tuteurId: string | null;
        }[];
        tuteurs: {
            id: string;
            structureId: number | null;
            userId: string;
            serviceId: number | null;
        }[];
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
        stagiaires: {
            id: string;
            userId: string;
            structureAffecteeId: number | null;
            serviceAffecteId: number | null;
            tuteurId: string | null;
        }[];
        tuteurs: {
            id: string;
            structureId: number | null;
            userId: string;
            serviceId: number | null;
        }[];
    } & {
        id: number;
        isDeleted: boolean;
        createdAt: Date;
        updatedAt: Date;
        structureId: number;
        nomService: string;
        description: string | null;
    }>;
    update(id: number, updateServiceDto: UpdateServiceDto, req: any): Promise<{
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
        stagiaires: {
            id: string;
            userId: string;
            structureAffecteeId: number | null;
            serviceAffecteId: number | null;
            tuteurId: string | null;
        }[];
        tuteurs: {
            id: string;
            structureId: number | null;
            userId: string;
            serviceId: number | null;
        }[];
    } & {
        id: number;
        isDeleted: boolean;
        createdAt: Date;
        updatedAt: Date;
        structureId: number;
        nomService: string;
        description: string | null;
    }>;
    remove(id: number, req: any): Promise<{
        message: string;
    }>;
}
