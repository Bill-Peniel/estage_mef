import { ChatbotService } from './chatbot.service';
export declare class ChatbotController {
    private readonly chatbotService;
    constructor(chatbotService: ChatbotService);
    chat(message: string, userId?: string): Promise<{
        answer: string;
    }>;
}
