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
var EmailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const nodemailer = require("nodemailer");
const email_config_1 = require("../config/email.config");
let EmailService = EmailService_1 = class EmailService {
    logger = new common_1.Logger(EmailService_1.name);
    transporter;
    maxRetries = 3;
    retryDelay = 5000;
    constructor() {
        this.initializeTransporter();
    }
    initializeTransporter() {
        this.transporter = nodemailer.createTransport({
            ...email_config_1.emailConfig,
            pool: true,
            maxConnections: 5,
            maxMessages: 100,
            rateDelta: 1000,
            rateLimit: 5
        });
        this.transporter.verify((error, success) => {
            if (error) {
                this.logger.error('Erreur de configuration SMTP:', error);
            }
            else {
                this.logger.log('Serveur SMTP prêt à envoyer des emails');
            }
        });
    }
    async sendEmail(to, subject, text, html) {
        let retries = 0;
        while (retries < this.maxRetries) {
            try {
                const info = await this.transporter.sendMail({
                    from: process.env.EMAIL_USER,
                    to,
                    subject,
                    text,
                    html
                });
                this.logger.log(`Email envoyé avec succès: ${info.messageId}`);
                return info;
            }
            catch (error) {
                retries++;
                this.logger.error(`Tentative ${retries}/${this.maxRetries} échouée:`, error);
                if (retries === this.maxRetries) {
                    throw new Error(`Échec de l'envoi d'email après ${this.maxRetries} tentatives: ${error.message}`);
                }
                await new Promise(resolve => setTimeout(resolve, this.retryDelay));
                if (error.code === 'ECONNECTION' || error.code === 'ESOCKET') {
                    this.initializeTransporter();
                }
            }
        }
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = EmailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], EmailService);
//# sourceMappingURL=email.service.js.map