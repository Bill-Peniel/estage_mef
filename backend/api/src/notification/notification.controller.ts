import { Controller, Get, Post, Delete, UseGuards, Req, Param, Logger } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

interface RequestWithUser extends Request {
  user: {
    id: string;
    role: string;
  };
}

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationController {
  private readonly logger = new Logger(NotificationController.name);

  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  async getNotifications(@Req() req: RequestWithUser) {
    try {
      return await this.notificationService.getNotificationsByUser(req.user.id);
    } catch (error) {
      this.logger.error('Erreur lors de la récupération des notifications:', error);
      throw error;
    }
  }

  @Post(':id/read')
  async markAsRead(@Param('id') id: string) {
    try {
      return await this.notificationService.markAsRead(id);
    } catch (error) {
      this.logger.error('Erreur lors du marquage de la notification comme lue:', error);
      throw error;
    }
  }

  @Post('read-all')
  async markAllAsRead(@Req() req: RequestWithUser) {
    try {
      return await this.notificationService.markAllAsRead(req.user.id);
    } catch (error) {
      this.logger.error('Erreur lors du marquage de toutes les notifications comme lues:', error);
      throw error;
    }
  }

  @Delete(':id')
  async deleteNotification(@Param('id') id: string) {
    try {
      return await this.notificationService.deleteNotification(id);
    } catch (error) {
      this.logger.error('Erreur lors de la suppression de la notification:', error);
      throw error;
    }
  }
} 