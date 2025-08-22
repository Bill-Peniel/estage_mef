import { MessagesService } from './messages.service';
export declare class MessagesController {
    private readonly messagesService;
    constructor(messagesService: MessagesService);
    getConversation(tuteurId: string, stagiaireId: string): Promise<any>;
    sendMessage(from: string, to: string, content: string, role: 'tuteur' | 'stagiaire'): Promise<any>;
}
