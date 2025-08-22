import { Injectable } from '@nestjs/common';

interface Message {
  id: string;
  from: string;
  to: string;
  content: string;
  role: 'tuteur' | 'stagiaire';
  time: string;
}

@Injectable()
export class MessagesService {
  private messages: Message[] = [];

  // Récupérer la conversation entre un tuteur et un stagiaire
  getConversation(tuteurId: string, stagiaireId: string): Message[] {
    const conv = this.messages.filter(
      m =>
        (m.from === tuteurId && m.to === stagiaireId) ||
        (m.from === stagiaireId && m.to === tuteurId)
    );
    console.log('getConversation', { tuteurId, stagiaireId, conv, all: this.messages });
    return conv;
  }

  // Envoyer un message
  sendMessage({ from, to, content, role }: { from: string; to: string; content: string; role: 'tuteur' | 'stagiaire' }): Message {
    const message: Message = {
      id: Date.now().toString(),
      from,
      to,
      content,
      role,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    this.messages.push(message);
    console.log('Message envoyé:', message);
    return message;
  }
} 