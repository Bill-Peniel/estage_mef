import { PrismaService } from '../prisma/prisma.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
export declare class ServicesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(createServiceDto: CreateServiceDto, userId: string): Promise<{
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
    update(id: number, updateServiceDto: UpdateServiceDto, userId: string): Promise<{
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
    remove(id: number, userId: string): Promise<{
        message: string;
    }>;
}
