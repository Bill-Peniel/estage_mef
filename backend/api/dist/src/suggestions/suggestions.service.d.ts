import { PrismaService } from '../prisma/prisma.service';
export declare class SuggestionsService {
    private prisma;
    private openai;
    constructor(prisma: PrismaService);
    suggestDepartmentsForUser(userId: string): Promise<string[]>;
}
