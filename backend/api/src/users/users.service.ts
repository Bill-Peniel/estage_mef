import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { unlink } from 'fs/promises';
import { join } from 'path';
import { File as MulterFile } from 'multer';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });
    if (!user) throw new NotFoundException('Utilisateur non trouvé');
    // Adapter selon ton modèle (profile, avatar, etc.)
    return {
      id: user.id,
      email: user.email,
      firstName: user.profile?.prenom || '',
      lastName: user.profile?.nom || '',
      telephone: user.profile?.telephone || '',
      avatar: user.profile?.avatar || '',
      birthDate: user.profile?.birthDate || '',
      school: user.profile?.school || '',
      major: user.profile?.major || '',
      notifMessages: user.notifMessages,
      notifEvaluation: user.notifEvaluation,
      notifRapports: user.notifRapports,
    };
  }

  async updateMe(userId: string, body: any, avatar?: MulterFile) {
    // Récupérer le profil
    const user = await this.prisma.user.findUnique({ where: { id: userId }, include: { profile: true } });
    if (!user) throw new NotFoundException('Utilisateur non trouvé');
    let avatarPath = user.profile?.avatar;
    if (avatar) {
      // Supprimer l'ancien avatar si besoin
      if (avatarPath) {
        try { await unlink(join('uploads', avatarPath)); } catch {}
      }
      avatarPath = avatar.filename;
    }
    // Mettre à jour le profil et l'utilisateur
    await this.prisma.profile.update({
      where: { userId },
      data: {
        prenom: body.firstName,
        nom: body.lastName,
        telephone: body.telephone,
        avatar: avatarPath,
        birthDate: body.birthDate ? new Date(body.birthDate) : null,
        school: body.school,
        major: body.major,
      },
    });
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        email: body.email,
        notifMessages: body.notifMessages === 'true' || body.notifMessages === true,
        notifEvaluation: body.notifEvaluation === 'true' || body.notifEvaluation === true,
        notifRapports: body.notifRapports === 'true' || body.notifRapports === true,
      },
    });
    return { message: 'Profil mis à jour' };
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('Utilisateur non trouvé');
    const valid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!valid) throw new ForbiddenException('Mot de passe actuel incorrect');
    const hash = await bcrypt.hash(newPassword, 10);
    await this.prisma.user.update({ where: { id: userId }, data: { passwordHash: hash } });
    return { message: 'Mot de passe modifié' };
  }
} 