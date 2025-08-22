import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
export declare class AuthService {
    private prisma;
    private jwtService;
    private readonly logger;
    constructor(prisma: PrismaService, jwtService: JwtService);
    validateUser(email: string, password: string): Promise<any>;
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
    login(user: any): Promise<{
        access_token: string;
        user: {
            id: any;
            email: any;
            role: any;
            profile: any;
            structureId: any;
        };
    }>;
    validateUserById(userId: string): Promise<{
        structureId: number | null;
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
        notifMessages: boolean | null;
        notifEvaluation: boolean | null;
        notifRapports: boolean | null;
    }>;
    loginOAuth(profile: any): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
            role: import(".prisma/client").$Enums.UserRole;
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
            structureId: number | null;
        };
    }>;
}
