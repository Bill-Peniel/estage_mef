import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class ChatbotService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: 'https://api.groq.com/openai/v1',
    });
  }

  async getAnswer(message: string, userId?: string): Promise<string> {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'llama3-8b-8192',
        messages: [
          {
            role: 'system',
            content:
              "Tu es l'assistant intelligent de la plateforme de gestion de stages. Tu dois répondre uniquement aux questions en rapport avec la plateforme, ses fonctionnalités, ou le contexte universitaire des stages. Si la question n'a aucun rapport avec la plateforme ou les stages, réponds clairement : 'Je suis désolé, je ne peux répondre qu’aux questions concernant la plateforme de gestion de stages.' Si tu ne sais pas, invite l'utilisateur à contacter le support.",
          },
          { role: 'user', content: message },
        ],
        max_tokens: 300,
        temperature: 0.7,
        user: userId,
      });
      const firstChoice = response.choices[0];
      if (firstChoice && firstChoice.message && firstChoice.message.content) {
        return firstChoice.message.content.trim();
      }
      return "Je n'ai pas compris votre question. Essayez de la reformuler.";
    } catch (error) {
      console.error('Erreur Groq:', error);
      return "Je rencontre un problème pour répondre actuellement. Merci de réessayer plus tard.";
    }
  }
} 