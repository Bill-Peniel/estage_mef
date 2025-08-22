import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EvaluationService {
  constructor(private prisma: PrismaService) {}

  async createEvaluation(tuteurId: string, stagiaireId: string, criteres: any, commentaire: string) {
    // Vérifier que le stagiaire est bien affecté à ce tuteur
    const stagiaire = await this.prisma.stagiaire.findFirst({
      where: { userId: stagiaireId, tuteurId },
    });
    if (!stagiaire) {
      throw new ForbiddenException('Ce stagiaire ne vous est pas affecté');
    }
    return this.prisma.evaluation.create({
      data: {
        tuteurId,
        stagiaireId,
        criteres,
        commentaire,
      },
    });
  }

  async getEvaluationForStagiaire(stagiaireId: string) {
    const evaluation = await this.prisma.evaluation.findFirst({
      where: { stagiaireId },
    });
    if (!evaluation) {
      throw new NotFoundException('Aucune évaluation trouvée pour ce stagiaire');
    }
    return evaluation;
  }
} 