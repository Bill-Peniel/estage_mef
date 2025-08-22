import { UsersService } from './users.service';
import { File as MulterFile } from 'multer';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getMe(req: any): Promise<{
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
    updateMe(req: any, body: any, avatar?: MulterFile): Promise<{
        message: string;
    }>;
    changePassword(req: any, body: any): Promise<{
        message: string;
    }>;
}
