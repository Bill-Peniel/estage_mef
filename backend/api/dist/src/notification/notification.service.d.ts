import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { UserRole } from '@prisma/client';
export declare class NotificationService {
    private prisma;
    private emailService;
    private readonly logger;
    constructor(prisma: PrismaService, emailService: EmailService);
    createNotification(data: {
        type: string;
        title: string;
        message: string;
        userId?: string;
        role?: UserRole;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: string;
        role: import(".prisma/client").$Enums.UserRole | null;
        userId: string | null;
        title: string;
        message: string;
        read: boolean;
    }>;
    getNotificationsByUser(userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: string;
        role: import(".prisma/client").$Enums.UserRole | null;
        userId: string | null;
        title: string;
        message: string;
        read: boolean;
    }[]>;
    markAsRead(notificationId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: string;
        role: import(".prisma/client").$Enums.UserRole | null;
        userId: string | null;
        title: string;
        message: string;
        read: boolean;
    }>;
    markAllAsRead(userId: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
    deleteNotification(notificationId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: string;
        role: import(".prisma/client").$Enums.UserRole | null;
        userId: string | null;
        title: string;
        message: string;
        read: boolean;
    }>;
}
