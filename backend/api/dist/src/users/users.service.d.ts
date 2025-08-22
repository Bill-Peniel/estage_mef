import { PrismaService } from '../prisma/prisma.service';
import { File as MulterFile } from 'multer';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    getMe(userId: string): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        telephone: string;
        avatar: string;
        birthDate: string | Date;
        school: string;
        major: string;
        notifMessages: boolean | null;
        notifEvaluation: boolean | null;
        notifRapports: boolean | null;
    }>;
    updateMe(userId: string, body: any, avatar?: MulterFile): Promise<{
        message: string;
    }>;
    changePassword(userId: string, currentPassword: string, newPassword: string): Promise<{
        message: string;
    }>;
}
