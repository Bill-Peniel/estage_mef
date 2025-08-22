import { Controller, Post, Body, UseGuards, Request, Get, Param, BadRequestException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { EvaluationService } from './evaluation.service';

@Controller('evaluations')
@UseGuards(JwtAuthGuard)
export class EvaluationController {
  constructor(private readonly evaluationService: EvaluationService) {}

  @Post()
  async createEvaluation(@Request() req, @Body() body: any) {
    const tuteurId = req.user.id;
    const { stagiaireId, criteres, commentaire } = body;
    
    if (!stagiaireId || typeof stagiaireId !== 'string') {
      throw new BadRequestException('stagiaireId requis et doit être une chaîne de caractères');
    }
    
    return this.evaluationService.createEvaluation(tuteurId, stagiaireId, criteres, commentaire);
  }

  @Get(':stagiaireId')
  async getEvaluation(@Param('stagiaireId') stagiaireId: string) {
    return this.evaluationService.getEvaluationForStagiaire(stagiaireId);
  }
} 