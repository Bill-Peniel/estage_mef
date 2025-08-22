import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { EmailService } from './email.service';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('test')
  @HttpCode(HttpStatus.OK)
  async sendTestEmail(@Body() body: { email: string }) {
    try {
      const result = await this.emailService.sendTestEmail(body.email);
      return {
        success: true,
        message: 'Email de test envoyé avec succès',
        details: result
      };
    } catch (error) {
      return {
        success: false,
        message: 'Erreur lors de l\'envoi de l\'email de test',
        error: error.message
      };
    }
  }
} 