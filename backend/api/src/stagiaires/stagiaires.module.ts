import { Module } from '@nestjs/common';
import { StagiairesController } from './stagiaires.controller';
import { StagiairesService } from './stagiaires.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [StagiairesController],
  providers: [StagiairesService, PrismaService],
  exports: [StagiairesService]
})
export class StagiairesModule {} 