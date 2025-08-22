import { Controller, Get, Post, Query, Body } from '@nestjs/common';
import { MessagesService } from './messages.service';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  // Récupérer la conversation entre un tuteur et un stagiaire
  @Get('conversation')
  async getConversation(
    @Query('tuteurId') tuteurId: string,
    @Query('stagiaireId') stagiaireId: string
  ): Promise<any> {
    return this.messagesService.getConversation(tuteurId, stagiaireId);
  }

  // Envoyer un message
  @Post('send')
  async sendMessage(
    @Body('from') from: string,
    @Body('to') to: string,
    @Body('content') content: string,
    @Body('role') role: 'tuteur' | 'stagiaire'
  ): Promise<any> {
    return this.messagesService.sendMessage({ from, to, content, role });
  }
} 