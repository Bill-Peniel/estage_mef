import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

interface SMTPError extends Error {
  code?: string;
  command?: string;
  response?: string;
  responseCode?: number;
}

interface SMTPConfig {
  SMTP_HOST: string;
  SMTP_PORT: string;
  SMTP_USER: string;
  SMTP_PASS: string;
  SMTP_FROM: string;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor() {
    try {
      // Vérification des variables d'environnement requises
      const requiredEnvVars = {
        SMTP_HOST: process.env.SMTP_HOST,
        SMTP_PORT: process.env.SMTP_PORT,
        SMTP_USER: process.env.SMTP_USER,
        SMTP_PASS: process.env.SMTP_PASS,
        SMTP_FROM: process.env.SMTP_FROM
      } as SMTPConfig;

      // Vérifier si toutes les variables requises sont définies
      const missingVars = Object.entries(requiredEnvVars)
        .filter(([_, value]) => !value)
        .map(([key]) => key);

      if (missingVars.length > 0) {
        throw new Error(`Variables d'environnement manquantes: ${missingVars.join(', ')}`);
      }

      this.logger.debug('Initialisation du service email avec les configurations suivantes:');
      this.logger.debug(`Host: ${requiredEnvVars.SMTP_HOST}`);
      this.logger.debug(`Port: ${requiredEnvVars.SMTP_PORT}`);
      this.logger.debug(`User: ${requiredEnvVars.SMTP_USER}`);
      this.logger.debug(`From: ${requiredEnvVars.SMTP_FROM}`);

      this.transporter = nodemailer.createTransport({
        host: requiredEnvVars.SMTP_HOST,
        port: parseInt(requiredEnvVars.SMTP_PORT),
        secure: false,
        auth: {
          user: requiredEnvVars.SMTP_USER,
          pass: requiredEnvVars.SMTP_PASS,
        },
        tls: {
          rejectUnauthorized: false,
          minVersion: 'TLSv1'
        },
        pool: true,
        maxConnections: 1,
        maxMessages: 3,
        socketTimeout: 60000,
        connectionTimeout: 60000,
        debug: true,
        logger: true
      });

      // Vérifier la configuration SMTP
      this.transporter.verify((error, success) => {
        if (error) {
          const smtpError = error as SMTPError;
          this.logger.error('Erreur de configuration SMTP:', error);
          this.logger.error('Détails de l\'erreur:', {
            code: smtpError.code,
            command: smtpError.command,
            response: smtpError.response,
            responseCode: smtpError.responseCode
          });
        } else {
          this.logger.debug('Configuration SMTP validée avec succès');
          this.logger.debug('Configuration complète:', {
            host: requiredEnvVars.SMTP_HOST,
            port: parseInt(requiredEnvVars.SMTP_PORT),
            secure: false,
            user: requiredEnvVars.SMTP_USER,
            from: requiredEnvVars.SMTP_FROM
          });
        }
      });
    } catch (error) {
      this.logger.error('Erreur lors de l\'initialisation du service email:', error);
      throw error;
    }
  }

  async sendStageRequestConfirmation(email: string, stageRequest: any) {
    if (!this.transporter) {
      this.logger.error('Service email non initialisé');
      return;
    }

    try {
      // Vérification de sécurité pour l'accès au profil
      const prenom = stageRequest.stagiaire?.profile?.prenom || 'Cher(e) candidat(e)';
      const nom = stageRequest.stagiaire?.profile?.nom || '';

      // Construire le contenu en fonction des flags d'invitation
      let bodyHtml: string;
      if (stageRequest.inviteCreateAccount) {
        const redirectUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/register?redirect=${encodeURIComponent(`/validate/${stageRequest.id}`)}`;
        bodyHtml = `
          <h1>Invitation à rejoindre la plateforme</h1>
          <p>Cher(e) ${prenom} ${nom},</p>
          <p>Un(e) binôme a initié une demande de stage en votre nom. Pour poursuivre, veuillez créer un compte et valider la demande.</p>
          <p>Code de suivi de la demande: <strong>${stageRequest.code_suivi}</strong></p>
          <p><a href="${redirectUrl}" target="_blank">Créer mon compte</a></p>
          <p>Après création, connectez-vous et validez la demande depuis votre tableau de bord.</p>
        `;
      } else if (stageRequest.inviteValidate) {
        const loginUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?redirect=${encodeURIComponent(`/validate/${stageRequest.id}`)}`;
        bodyHtml = `
          <h1>Validation de demande de stage requise</h1>
          <p>Cher(e) ${prenom} ${nom},</p>
          <p>Votre binôme a initié une demande de stage. Merci de vous connecter pour la valider afin qu'elle soit transmise à la DPAF.</p>
          <p><strong>Important:</strong> veuillez également charger votre photo avant de valider.</p>
          <p>Code de suivi de la demande: <strong>${stageRequest.code_suivi}</strong></p>
          <p><a href="${loginUrl}" target="_blank">Me connecter pour valider</a></p>
        `;
      } else {
        bodyHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
            <h1 style="color: #2c3e50; text-align: center; margin-bottom: 30px;">Confirmation de votre demande de stage</h1>
            <p style="color: #34495e; font-size: 16px;">Cher(e) ${prenom} ${nom},</p>
            <p style="color: #34495e; font-size: 16px;">Nous avons bien reçu votre demande de stage. Voici les détails de votre demande :</p>
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
              <ul style="list-style: none; padding: 0; margin: 0;">
                <li style="margin-bottom: 10px;"><strong>Type de stage :</strong> ${stageRequest.type}</li>
                <li style="margin-bottom: 10px;"><strong>Département :</strong> ${stageRequest.departement}</li>
                <li style="margin-bottom: 10px;"><strong>Date de début :</strong> ${new Date(stageRequest.dateDebut).toLocaleDateString()}</li>
                <li style="margin-bottom: 10px;"><strong>Date de fin :</strong> ${new Date(stageRequest.dateFin).toLocaleDateString()}</li>
                <li style="margin-bottom: 10px;"><strong>Université :</strong> ${stageRequest.universite}</li>
                <li style="margin-bottom: 10px;"><strong>Domaine d'études :</strong> ${stageRequest.domaineEtude}</li>
              </ul>
            </div>
            <div style="background-color: #e8f4f8; padding: 20px; border-radius: 5px; margin: 20px 0; text-align: center;">
              <p style="margin: 0; font-size: 18px; color: #2c3e50;"><strong>Code de suivi de votre demande :</strong></p>
              <p style="margin: 10px 0; font-size: 24px; color: #e74c3c; font-weight: bold;">${stageRequest.code_suivi}</p>
            </div>
            <p style="color: #34495e; font-size: 16px;">Conservez précieusement ce code. Vous en aurez besoin pour vérifier le statut de votre demande sur notre plateforme.</p>
            <p style="color: #34495e; font-size: 16px;">Votre demande est actuellement en cours d'examen. Nous vous tiendrons informé(e) de son statut.</p>
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
              <p style="color: #7f8c8d; font-size: 14px; text-align: center;">Cordialement,<br>L'équipe des stages</p>
            </div>
          </div>
        `;
      }

      const mailOptions = {
        from: process.env.SMTP_FROM || 'noreply@example.com',
        to: email,
        subject: 'Confirmation de votre demande de stage',
        html: bodyHtml,
      };

      const info = await this.transporter.sendMail(mailOptions);
      this.logger.debug(`Email de confirmation envoyé à ${email}`, info);
      return info;
    } catch (error) {
      this.logger.error(`Erreur lors de l'envoi de l'email de confirmation: ${error.message}`, error.stack);
      throw error;
    }
  }

  async sendStageRequestApproval(email: string, stageRequest: any) {
    if (!this.transporter) {
      this.logger.error('Service email non initialisé');
      return;
    }

    try {
      // Vérification de sécurité pour l'accès au profil
      const prenom = stageRequest.stagiaire?.profile?.prenom || 'Cher(e) stagiaire';
      const nom = stageRequest.stagiaire?.profile?.nom || '';

      const mailOptions = {
        from: process.env.SMTP_FROM || 'noreply@example.com',
        to: email,
        subject: 'Votre demande de stage a été approuvée',
        html: `
          <h1>Demande de stage approuvée</h1>
          <p>Cher(e) ${prenom} ${nom},</p>
          <p>Nous avons le plaisir de vous informer que votre demande de stage a été approuvée.</p>
          <p>Détails de votre stage :</p>
          <ul>
            <li>Type de stage : ${stageRequest.type}</li>
            <li>Département : ${stageRequest.departement}</li>
            <li>Date de début : ${new Date(stageRequest.dateDebut).toLocaleDateString()}</li>
            <li>Date de fin : ${new Date(stageRequest.dateFin).toLocaleDateString()}</li>
            <li>Université : ${stageRequest.universite}</li>
            <li>Domaine d'études : ${stageRequest.domaineEtude}</li>
          </ul>
          <p>Un membre de notre équipe vous contactera prochainement pour finaliser les détails de votre stage.</p>
          <p>Cordialement,<br>L'équipe des stages</p>
        `,
      };

      const info = await this.transporter.sendMail(mailOptions);
      this.logger.debug(`Email d'approbation envoyé à ${email}`, info);
      return info;
    } catch (error) {
      this.logger.error(`Erreur lors de l'envoi de l'email d'approbation: ${error.message}`, error.stack);
      throw error;
    }
  }

  async sendStageRequestRejection(email: string, stageRequest: any, motif: string) {
    if (!this.transporter) {
      this.logger.error('Service email non initialisé');
      return;
    }

    try {
      // Vérification de sécurité pour l'accès au profil
      const prenom = stageRequest.stagiaire?.profile?.prenom || 'Cher(e) stagiaire';
      const nom = stageRequest.stagiaire?.profile?.nom || '';

      const mailOptions = {
        from: process.env.SMTP_FROM || 'noreply@example.com',
        to: email,
        subject: 'Votre demande de stage a été refusée',
        html: `
          <h1>Demande de stage refusée</h1>
          <p>Cher(e) ${prenom} ${nom},</p>
          <p>Nous regrettons de vous informer que votre demande de stage a été refusée.</p>
          <p>Motif du refus : ${motif}</p>
          <p>Détails de votre demande :</p>
          <ul>
            <li>Type de stage : ${stageRequest.type}</li>
            <li>Département : ${stageRequest.departement}</li>
            <li>Date de début : ${new Date(stageRequest.dateDebut).toLocaleDateString()}</li>
            <li>Date de fin : ${new Date(stageRequest.dateFin).toLocaleDateString()}</li>
            <li>Université : ${stageRequest.universite}</li>
            <li>Domaine d'études : ${stageRequest.domaineEtude}</li>
          </ul>
          <p>Si vous avez des questions, n'hésitez pas à nous contacter.</p>
          <p>Cordialement,<br>L'équipe des stages</p>
        `,
      };

      const info = await this.transporter.sendMail(mailOptions);
      this.logger.debug(`Email de refus envoyé à ${email}`, info);
      return info;
    } catch (error) {
      this.logger.error(`Erreur lors de l'envoi de l'email de refus: ${error.message}`, error.stack);
      throw error;
    }
  }

  async sendTestEmail(email: string) {
    if (!this.transporter) {
      this.logger.error('Service email non initialisé');
      return;
    }

    try {
      const mailOptions = {
        from: process.env.SMTP_FROM || 'noreply@example.com',
        to: email,
        subject: 'Test de configuration SMTP',
        html: `
          <h1>Test de configuration SMTP</h1>
          <p>Si vous recevez cet email, cela signifie que la configuration SMTP fonctionne correctement.</p>
          <p>Détails de la configuration :</p>
          <ul>
            <li>Serveur SMTP : ${process.env.SMTP_HOST}</li>
            <li>Port : ${process.env.SMTP_PORT}</li>
            <li>Mode sécurisé : ${process.env.SMTP_SECURE}</li>
          </ul>
          <p>Cordialement,<br>L'équipe des stages</p>
        `,
      };

      const info = await this.transporter.sendMail(mailOptions);
      this.logger.debug(`Email de test envoyé à ${email}`, info);
      return info;
    } catch (error) {
      this.logger.error(`Erreur lors de l'envoi de l'email de test: ${error.message}`, error.stack);
      throw error;
    }
  }
} 