import { Module } from '@nestjs/common';
import { AffectationsController } from './affectations.controller';
import { AffectationsService } from './affectations.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [AffectationsController],
  providers: [AffectationsService, PrismaService],
  exports: [AffectationsService],
})
export class AffectationsModule {} 