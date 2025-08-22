import { NotificationService } from './notification.service';
interface RequestWithUser extends Request {
    user: {
        id: string;
        role: string;
    };
}
export declare class NotificationController {
    private readonly notificationService;
    private readonly logger;
    constructor(notificationService: NotificationService);
    getNotifications(req: RequestWithUser): Promise<{
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
    markAsRead(id: string): Promise<{
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
    markAllAsRead(req: RequestWithUser): Promise<import(".prisma/client").Prisma.BatchPayload>;
    deleteNotification(id: string): Promise<{
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
export {};
