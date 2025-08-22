import { Injectable, UnauthorizedException, ConflictException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
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
    } catch (error) {
      this.logger.error(`Erreur lors de la validation de l'utilisateur: ${error.message}`, error.stack);
      throw new UnauthorizedException('Une erreur est survenue lors de la validation de l\'utilisateur');
    }
  }

  async register(registerDto: RegisterDto) {
    try {
      const { email, password, role, nom, prenom, telephone, structureId } = registerDto;
      this.logger.debug(`Tentative d'inscription pour l'email: ${email}`);

      const existingUser = await this.prisma.user.findFirst({
        where: { email },
      });

      if (existingUser) {
        this.logger.debug(`Email déjà utilisé: ${email}`);
        throw new ConflictException('Un utilisateur avec cet email existe déjà');
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
    } catch (error) {
      this.logger.error(`Erreur lors de l'inscription: ${error.message}`, error.stack);
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new Error('Une erreur est survenue lors de l\'inscription');
    }
  }

  async login(user: any) {
    try {
      if (!user) {
        this.logger.debug('Tentative de connexion avec des identifiants invalides');
        throw new UnauthorizedException('Identifiants invalides');
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
    } catch (error) {
      this.logger.error(`Erreur lors de la connexion: ${error.message}`, error.stack);
      throw new UnauthorizedException('Une erreur est survenue lors de la connexion');
    }
  }

  async validateUserById(userId: string) {
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
        throw new UnauthorizedException('Utilisateur non trouvé');
      }

      const { passwordHash, ...result } = user;
      return {
        ...result,
        structureId: user.structure?.id || null
      };
    } catch (error) {
      this.logger.error(`Erreur lors de la validation de l'utilisateur par ID: ${error.message}`, error.stack);
      throw new UnauthorizedException('Une erreur est survenue lors de la validation de l\'utilisateur');
    }
  }

  async loginOAuth(profile: any) {
    // profile: { provider, providerId, email, firstName, lastName, picture }
    let user = await this.prisma.user.findFirst({
      where: { email: profile.email },
      include: { profile: true, structure: true }
    });
    if (!user) {
      // Créer un nouvel utilisateur
      user = await this.prisma.user.create({
        data: {
          email: profile.email,
          passwordHash: '', // Pas de mot de passe pour social
          role: 'stagiaire', // Par défaut, à adapter selon ton besoin
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
    // Générer le JWT
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
} 