"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const auth_module_1 = require("./auth/auth.module");
const prisma_module_1 = require("./prisma/prisma.module");
const structures_module_1 = require("./structures/structures.module");
const tuteurs_module_1 = require("./tuteurs/tuteurs.module");
const stage_request_module_1 = require("./stage-request/stage-request.module");
const email_module_1 = require("./email/email.module");
const notification_module_1 = require("./notification/notification.module");
const stagiaires_module_1 = require("./stagiaires/stagiaires.module");
const statistics_module_1 = require("./statistics/statistics.module");
const fs_1 = require("fs");
const path_1 = require("path");
const users_module_1 = require("./users/users.module");
const affectations_module_1 = require("./affectations/affectations.module");
const evaluation_module_1 = require("./evaluation/evaluation.module");
const theme_module_1 = require("./themes/theme.module");
const document_module_1 = require("./document/document.module");
const suggestions_module_1 = require("./suggestions/suggestions.module");
const chatbot_module_1 = require("./chatbot/chatbot.module");
const messages_module_1 = require("./messages/messages.module");
const services_module_1 = require("./services/services.module");
const uploadsDir = (0, path_1.join)(__dirname, '..', 'uploads');
try {
    (0, fs_1.mkdirSync)(uploadsDir, { recursive: true });
    console.log('Dossier uploads créé avec succès');
}
catch (error) {
    console.error('Erreur lors de la création du dossier uploads:', error);
}
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            structures_module_1.StructuresModule,
            tuteurs_module_1.TuteursModule,
            stage_request_module_1.StageRequestModule,
            email_module_1.EmailModule,
            notification_module_1.NotificationModule,
            stagiaires_module_1.StagiairesModule,
            statistics_module_1.StatisticsModule,
            users_module_1.UsersModule,
            affectations_module_1.AffectationsModule,
            evaluation_module_1.EvaluationModule,
            theme_module_1.ThemeModule,
            document_module_1.DocumentModule,
            suggestions_module_1.SuggestionsModule,
            chatbot_module_1.ChatbotModule,
            messages_module_1.MessagesModule,
            services_module_1.ServicesModule
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map