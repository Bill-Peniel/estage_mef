import { Injectable, NotFoundException } from '@nestjs/common';
import OpenAI from 'openai';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SuggestionsService {
  private openai: OpenAI;

  constructor(private prisma: PrismaService) {
    this.openai = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: 'https://api.groq.com/openai/v1',
    });
  }

  async suggestDepartmentsForUser(userId: string) {
    // Récupérer la filière du profil utilisateur
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });
    if (!user || !user.profile) throw new NotFoundException('Profil non trouvé');
    const filiere = (user.profile.major || '').trim();
    if (!filiere) return [];

    // Prompt IA
    const prompt = `Voici la filière d'un étudiant : "${filiere}". Sur la base de cette filière, propose une liste de départements d'accueil pertinents dans une administration publique. Réponds uniquement par une liste de noms de départements, séparés par des virgules. Si aucun département n'est pertinent, réponds "Aucune suggestion".`;
    try {
      const response = await this.openai.chat.completions.create({
        model: 'llama3-8b-8192',
        messages: [
          { role: 'system', content: "Tu es un assistant qui aide à orienter les étudiants vers les bons départements d'accueil pour leur stage, selon leur filière." },
          { role: 'user', content: prompt },
        ],
        max_tokens: 200,
        temperature: 0.2,
        user: userId,
      });
      const firstChoice = response.choices[0];
      if (firstChoice && firstChoice.message && firstChoice.message.content) {
        const content = firstChoice.message.content.trim();
        if (content.toLowerCase().includes('aucune suggestion')) return [];
        // Découper la réponse en liste
        return content.split(',').map(dep => dep.trim()).filter(Boolean);
      }
      return [];
    } catch (error) {
      console.error('Erreur Groq suggestion:', error);
      return [];
    }
  }
} 