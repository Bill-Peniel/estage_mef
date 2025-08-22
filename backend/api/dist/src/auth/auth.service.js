"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = require("bcrypt");
let AuthService = AuthService_1 = class AuthService {
    prisma;
    jwtService;
    logger = new common_1.Logger(AuthService_1.name);
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async validateUser(email, password) {
        try {
            this.logger.debug(`Validation de l'utilisateur: ${email}`);
            const user = await this.prisma.user.findFirst({
                where: {
                    email,
                    isActive: true
                },
                include: {
                    profile: true,
                    structure: true
                },
            });
            if (!user) {
                this.logger.debug(`Utilisateur non trouvé: ${email}`);
                return null;
            }
            const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
            if (!isPasswordValid) {
                this.logger.debug(`Mot de passe invalide pour l'utilisateur: ${email}`);
                return null;
            }
            const { passwordHash, ...result } = user;
            return {
                ...result,
                structureId: user.structure?.id || null
            };
        }
        catch (error) {
            this.logger.error(`Erreur lors de la validation de l'utilisateur: ${error.message}`, error.stack);
            throw new common_1.UnauthorizedException('Une erreur est survenue lors de la validation de l\'utilisateur');
        }
    }
    async register(registerDto) {
        try {
            const { email, password, role, nom, prenom, telephone, structureId } = registerDto;
            this.logger.debug(`Tentative d'inscription pour l'email: ${email}`);
            const existingUser = await this.prisma.user.findFirst({
                where: { email },
            });
            if (existingUser) {
                this.logger.debug(`Email déjà utilisé: ${email}`);
                throw new common_1.ConflictException('Un utilisateur avec cet email existe déjà');
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await this.prisma.user.create({
                data: {
                    email,
                    passwordHash: hashedPassword,
                    role,
                    isActive: true,
                    structure: structureId ? {
                        connect: { id: structureId }
                    } : undefined,
                    profile: {
                        create: {
                            nom: nom || '',
                            prenom: prenom || '',
                            telephone: telephone || '',
                        },
                    },
                },
                include: {
                    profile: true,
                    structure: true,
                },
            });
            this.logger.debug(`Inscription réussie pour l'email: ${email}`);
            const { passwordHash, ...result } = user;
            return result;
        }
        catch (error) {
            this.logger.error(`Erreur lors de l'inscription: ${error.message}`, error.stack);
            if (error instanceof common_1.ConflictException) {
                throw error;
            }
            throw new Error('Une erreur est survenue lors de l\'inscription');
        }
    }
    async login(user) {
        try {
            if (!user) {
                this.logger.debug('Tentative de connexion avec des identifiants invalides');
                throw new common_1.UnauthorizedException('Identifiants invalides');
            }
            const payload = {
                email: user.email,
                sub: user.id,
                role: user.role
            };
            this.logger.debug(`Génération du token pour l'utilisateur: ${user.email}`);
            return {
                access_token: this.jwtService.sign(payload),
                user: {
                    id: user.id,
                    email: user.email,
                    role: user.role,
                    profile: user.profile,
                    structureId: user.structure?.id || null
                }
            };
        }
        catch (error) {
            this.logger.error(`Erreur lors de la connexion: ${error.message}`, error.stack);
            throw new common_1.UnauthorizedException('Une erreur est survenue lors de la connexion');
        }
    }
    async validateUserById(userId) {
        try {
            this.logger.debug(`Validation de l'utilisateur par ID: ${userId}`);
            const user = await this.prisma.user.findFirst({
                where: {
                    id: userId,
                    isActive: true
                },
                include: {
                    profile: true,
                    structure: true
                },
            });
            if (!user) {
                this.logger.debug(`Utilisateur non trouvé pour l'ID: ${userId}`);
                throw new common_1.UnauthorizedException('Utilisateur non trouvé');
            }
            const { passwordHash, ...result } = user;
            return {
                ...result,
                structureId: user.structure?.id || null
            };
        }
        catch (error) {
            this.logger.error(`Erreur lors de la validation de l'utilisateur par ID: ${error.message}`, error.stack);
            throw new common_1.UnauthorizedException('Une erreur est survenue lors de la validation de l\'utilisateur');
        }
    }
    async loginOAuth(profile) {
        let user = await this.prisma.user.findFirst({
            where: { email: profile.email },
            include: { profile: true, structure: true }
        });
        if (!user) {
            user = await this.prisma.user.create({
                data: {
                    email: profile.email,
                    passwordHash: '',
                    role: 'stagiaire',
                    isActive: true,
                    profile: {
                        create: {
                            nom: profile.lastName || '',
                            prenom: profile.firstName || '',
                            telephone: '',
                        },
                    },
                },
                include: { profile: true, structure: true }
            });
        }
        const payload = {
            email: user.email,
            sub: user.id,
            role: user.role,
            prenom: user.profile?.prenom || '',
            nom: user.profile?.nom || '',
            structureId: user.structure?.id || null
        };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                profile: user.profile,
                structureId: user.structure?.id || null
            }
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map