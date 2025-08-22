import { Module } from '@nestjs/common';
import { EvaluationService } from './evaluation.service';
import { EvaluationController } from './evaluation.controller';
import { PrismaService } from '../prisma/prisma.service';
 
@Module({
  controllers: [EvaluationController],
  providers: [EvaluationService, PrismaService],
})
export class EvaluationModule {} 