import { Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
interface JwtPayload {
    email: string;
    sub: string;
    role: string;
}
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private authService;
    constructor(authService: AuthService);
    validate(payload: JwtPayload): Promise<{
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
}
export {};
