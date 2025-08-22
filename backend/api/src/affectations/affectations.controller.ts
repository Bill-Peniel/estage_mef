import { Controller, Get, Post, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { AffectationsService } from './affectations.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('affectations')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AffectationsController {
  constructor(private readonly affectationsService: AffectationsService) {}

  @Get('stagiaires')
  @Roles(UserRole.admin, UserRole.structure)
  async getStagiaires(@Request() req) {
    const structureId = req.user.structureId;
    return this.affectationsService.getStagiaires(structureId);
  }

  @Get('tuteurs')
  @Roles(UserRole.admin, UserRole.structure)
  async getTuteurs(@Request() req) {
    const structureId = req.user.structureId;
    return this.affectationsService.getTuteurs(structureId);
  }

  @Get()
  @Roles(UserRole.admin, UserRole.structure)
  async getAffectations(@Request() req) {
    const structureId = req.user.structureId;
    return this.affectationsService.getAffectations(structureId);
  }

  @Post()
  @Roles(UserRole.admin, UserRole.structure)
  async createAffectation(
    @Body() body: { stagiaireId: string; tuteurId: string },
    @Request() req
  ) {
    const structureId = req.user.structureId;
    return this.affectationsService.createAffectation(
      body.stagiaireId,
      body.tuteurId,
      structureId
    );
  }

  @Delete(':stagiaireId')
  @Roles(UserRole.admin, UserRole.structure)
  async deleteAffectation(
    @Param('stagiaireId') stagiaireId: string,
    @Request() req
  ) {
    const structureId = req.user.structureId;
    return this.affectationsService.deleteAffectation(stagiaireId, structureId);
  }

  @Get('tuteur/stagiaires')
  @UseGuards(JwtAuthGuard)
  async getStagiairesByTuteur(@Request() req) {
    const tuteurId = req.user.userId;
    return this.affectationsService.getStagiairesByTuteur(tuteurId);
  }
} 