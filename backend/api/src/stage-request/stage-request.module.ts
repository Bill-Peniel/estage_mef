import { Module } from '@nestjs/common';
import { StageRequestController } from './stage-request.controller';
import { StageRequestService } from './stage-request.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { EmailModule } from '../email/email.module';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [PrismaModule, AuthModule, EmailModule, NotificationModule],
  controllers: [StageRequestController],
  providers: [StageRequestService],
  exports: [StageRequestService]
})
export class StageRequestModule {} 