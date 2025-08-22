import { Controller, Get, Param, UseGuards, Request } from '@nestjs/common';
import { StagiairesService } from './stagiaires.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('stagiaires')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StagiairesController {
  constructor(private readonly stagiairesService: StagiairesService) {}

  @Get('sans-affectation')
  @Roles(UserRole.dpaf)
  findSansAffectation() {
    return this.stagiairesService.findSansAffectation();
  }

  @Get('me')
  @Roles(UserRole.stagiaire)
  async getMyStagiaire(@Request() req) {
    return this.stagiairesService.findOneByUserId(req.user.id);
  }

  @Get(':id')
  @Roles(UserRole.structure)
  async getStagiaireDetails(@Param('id') id: string) {
    return this.stagiairesService.findOne(id);
  }
} 