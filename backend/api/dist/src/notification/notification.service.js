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
var NotificationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const email_service_1 = require("../email/email.service");
let NotificationService = NotificationService_1 = class NotificationService {
    prisma;
    emailService;
    logger = new common_1.Logger(NotificationService_1.name);
    constructor(prisma, emailService) {
        this.prisma = prisma;
        this.emailService = emailService;
    }
    async createNotification(data) {
        try {
            this.logger.debug(`Création d'une notification: ${JSON.stringify(data)}`);
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
            if (data.role) {
                try {
                    this.logger.debug(`Recherche des utilisateurs avec le rôle: ${data.role}`);
                    const users = await this.prisma.user.findMany({
                        where: { role: data.role },
                        include: { profile: true },
                    });
                    this.logger.debug(`Nombre d'utilisateurs trouvés: ${users.length}`);
                    for (const user of users) {
                        if (user.email) {
                            this.logger.debug(`Envoi d'email à: ${user.email}`);
                            this.emailService.sendTestEmail(user.email).catch(error => {
                                this.logger.error(`Échec de l'envoi d'email à ${user.email}:`, error);
                            });
                        }
                    }
                }
                catch (emailError) {
                    this.logger.error('Erreur lors de l\'envoi des emails de notification:', emailError);
                }
            }
            return notification;
        }
        catch (error) {
            this.logger.error('Erreur lors de la création de la notification:', error);
            throw error;
        }
    }
    async getNotificationsByUser(userId) {
        try {
            this.logger.debug(`Récupération des notifications pour l'utilisateur: ${userId}`);
            const user = await this.prisma.user.findUnique({
                where: { id: userId },
                select: { role: true }
            });
            this.logger.debug(`Rôle de l'utilisateur: ${user?.role}`);
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
        }
        catch (error) {
            this.logger.error('Erreur lors de la récupération des notifications:', error);
            throw error;
        }
    }
    async markAsRead(notificationId) {
        try {
            return await this.prisma.notification.update({
                where: { id: notificationId },
                data: { read: true },
            });
        }
        catch (error) {
            this.logger.error('Erreur lors du marquage de la notification comme lue:', error);
            throw error;
        }
    }
    async markAllAsRead(userId) {
        try {
            const user = await this.prisma.user.findUnique({
                where: { id: userId },
                select: { role: true }
            });
            return await this.prisma.notification.updateMany({
                where: {
                    OR: [
                        { userId },
                        { role: user?.role }
                    ],
                    read: false,
                },
                data: { read: true },
            });
        }
        catch (error) {
            this.logger.error('Erreur lors du marquage de toutes les notifications comme lues:', error);
            throw error;
        }
    }
    async deleteNotification(notificationId) {
        try {
            return await this.prisma.notification.delete({
                where: { id: notificationId },
            });
        }
        catch (error) {
            this.logger.error('Erreur lors de la suppression de la notification:', error);
            throw error;
        }
    }
};
exports.NotificationService = NotificationService;
exports.NotificationService = NotificationService = NotificationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        email_service_1.EmailService])
], NotificationService);
//# sourceMappingURL=notification.service.js.map