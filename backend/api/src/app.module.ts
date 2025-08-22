import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { StructuresModule } from './structures/structures.module';
import { TuteursModule } from './tuteurs/tuteurs.module';
import { StageRequestModule } from './stage-request/stage-request.module';
import { EmailModule } from './email/email.module';
import { NotificationModule } from './notification/notification.module';
import { StagiairesModule } from './stagiaires/stagiaires.module';
import { StatisticsModule } from './statistics/statistics.module';
import { mkdirSync } from 'fs';
import { join } from 'path';
import { UsersModule } from './users/users.module';
import { AffectationsModule } from './affectations/affectations.module';
import { EvaluationModule } from './evaluation/evaluation.module';
import { ThemeModule } from './themes/theme.module';
import { DocumentModule } from './document/document.module';
import { SuggestionsModule } from './suggestions/suggestions.module';
import { ChatbotModule } from './chatbot/chatbot.module';
import { MessagesModule } from './messages/messages.module';
import { ServicesModule } from './services/services.module';

// Créer le dossier uploads s'il n'existe pas
const uploadsDir = join(__dirname, '..', 'uploads');
try {
  mkdirSync(uploadsDir, { recursive: true });
  console.log('Dossier uploads créé avec succès');
} catch (error) {
  console.error('Erreur lors de la création du dossier uploads:', error);
}

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    StructuresModule,
    TuteursModule,
    StageRequestModule,
    EmailModule,
    NotificationModule,
    StagiairesModule,
    StatisticsModule,
    UsersModule,
    AffectationsModule,
    EvaluationModule,
    ThemeModule,
    DocumentModule,
    SuggestionsModule,
    ChatbotModule,
    MessagesModule, // Ajout du module de messagerie
    ServicesModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
