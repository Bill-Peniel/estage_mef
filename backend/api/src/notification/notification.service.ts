import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { UserRole } from '@prisma/client';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
  ) {}

  async createNotification(data: {
    type: string;
    title: string;
    message: string;
    userId?: string;
    role?: UserRole;
  }) {
    try {
      this.logger.debug(`Création d'une notification: ${JSON.stringify(data)}`);

      // Créer la notification dans la base de données
      const notification = await this.prisma.notification.create({
        data: {
          type: data.type,
          title: data.title,
          message: data.message,
          userId: data.userId,
          role: data.role,
          read: false,
        },
      });

      this.logger.debug(`Notification créée avec succès: ${JSON.stringify(notification)}`);

      // Si la notification est pour un rôle spécifique (comme DPAF)
      if (data.role) {
        try {
          this.logger.debug(`Recherche des utilisateurs avec le rôle: ${data.role}`);
          
          // Envoyer un email aux utilisateurs avec ce rôle
          const users = await this.prisma.user.findMany({
            where: { role: data.role },
            include: { profile: true },
          });

          this.logger.debug(`Nombre d'utilisateurs trouvés: ${users.length}`);

          // Envoyer les emails de manière asynchrone
          for (const user of users) {
            if (user.email) {
              this.logger.debug(`Envoi d'email à: ${user.email}`);
              this.emailService.sendTestEmail(
                user.email
              ).catch(error => {
                this.logger.error(`Échec de l'envoi d'email à ${user.email}:`, error);
              });
            }
          }
        } catch (emailError) {
          this.logger.error('Erreur lors de l\'envoi des emails de notification:', emailError);
        }
      }

      return notification;
    } catch (error) {
      this.logger.error('Erreur lors de la création de la notification:', error);
      throw error;
    }
  }

  async getNotificationsByUser(userId: string) {
    try {
      this.logger.debug(`Récupération des notifications pour l'utilisateur: ${userId}`);

      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { role: true }
      });

      this.logger.debug(`Rôle de l'utilisateur: ${user?.role}`);

      // Récupérer toutes les notifications pertinentes en une seule requête
      const notifications = await this.prisma.notification.findMany({
        where: {
          OR: [
            { userId: userId },
            { role: user?.role }
          ]
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      this.logger.debug(`Nombre de notifications trouvées: ${notifications.length}`);

      return notifications;
    } catch (error) {
      this.logger.error('Erreur lors de la récupération des notifications:', error);
      throw error;
    }
  }

  async markAsRead(notificationId: string) {
    try {
      return await this.prisma.notification.update({
        where: { id: notificationId },
        data: { read: true },
      });
    } catch (error) {
      this.logger.error('Erreur lors du marquage de la notification comme lue:', error);
      throw error;
    }
  }

  async markAllAsRead(userId: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { role: true }
      });

      return await this.prisma.notification.updateMany({
        where: {
          OR: [
            { userId },
            { role: user?.role as UserRole }
          ],
          read: false,
        },
        data: { read: true },
      });
    } catch (error) {
      this.logger.error('Erreur lors du marquage de toutes les notifications comme lues:', error);
      throw error;
    }
  }

  async deleteNotification(notificationId: string) {
    try {
      return await this.prisma.notification.delete({
        where: { id: notificationId },
      });
    } catch (error) {
      this.logger.error('Erreur lors de la suppression de la notification:', error);
      throw error;
    }
  }
} 