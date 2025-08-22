import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { emailConfig } from '../config/email.config';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;
  private readonly maxRetries = 3;
  private readonly retryDelay = 5000; // 5 secondes

  constructor() {
    this.initializeTransporter();
  }

  private initializeTransporter() {
    this.transporter = nodemailer.createTransport({
      ...emailConfig,
      pool: true,
      maxConnections: 5,
      maxMessages: 100,
      rateDelta: 1000,
      rateLimit: 5
    });

    this.transporter.verify((error, success) => {
      if (error) {
        this.logger.error('Erreur de configuration SMTP:', error);
      } else {
        this.logger.log('Serveur SMTP prêt à envoyer des emails');
      }
    });
  }

  async sendEmail(to: string, subject: string, text: string, html?: string) {
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
      } catch (error) {
        retries++;
        this.logger.error(`Tentative ${retries}/${this.maxRetries} échouée:`, error);
        
        if (retries === this.maxRetries) {
          throw new Error(`Échec de l'envoi d'email après ${this.maxRetries} tentatives: ${error.message}`);
        }
        
        // Attendre avant de réessayer
        await new Promise(resolve => setTimeout(resolve, this.retryDelay));
        
        // Réinitialiser le transporteur si nécessaire
        if (error.code === 'ECONNECTION' || error.code === 'ESOCKET') {
          this.initializeTransporter();
        }
      }
    }
  }
} 