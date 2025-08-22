import { Controller, Post, Body } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';

@Controller('chatbot')
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  @Post()
  async chat(@Body('message') message: string, @Body('userId') userId?: string) {
    const answer = await this.chatbotService.getAnswer(message, userId);
    return { answer };
  }
} 