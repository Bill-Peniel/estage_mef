import { PrismaService } from '../prisma/prisma.service';
export declare class DocumentService {
    private prisma;
    constructor(prisma: PrismaService);
    findAllByUser(userId: string): Promise<{
        id: string;
        type: string;
        name: string;
        userId: string;
        path: string;
        uploadedAt: Date;
    }[]>;
    create(userId: string, type: string, name: string, path: string): Promise<{
        id: string;
        type: string;
        name: string;
        userId: string;
        path: string;
        uploadedAt: Date;
    }>;
    remove(id: string, userId: string): Promise<{
        id: string;
        type: string;
        name: string;
        userId: string;
        path: string;
        uploadedAt: Date;
    }>;
}
