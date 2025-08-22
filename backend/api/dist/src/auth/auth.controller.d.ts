import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { Response, Request as ExpressRequest } from 'express';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
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
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        role: import(".prisma/client").$Enums.UserRole;
        isActive: boolean;
        structureId: number | null;
        notifMessages: boolean | null;
        notifEvaluation: boolean | null;
        notifRapports: boolean | null;
    }>;
    login(req: any): Promise<{
        access_token: string;
        user: {
            id: any;
            email: any;
            role: any;
            profile: any;
            structureId: any;
        };
    }>;
    googleAuth(): Promise<void>;
    googleAuthCallback(req: ExpressRequest, res: Response): Promise<void>;
    facebookAuth(): Promise<void>;
    facebookAuthCallback(req: ExpressRequest, res: Response): Promise<void>;
}
