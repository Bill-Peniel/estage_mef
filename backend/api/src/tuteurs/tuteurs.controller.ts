import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Logger, Request } from '@nestjs/common';
import { TuteursService } from './tuteurs.service';
import { CreateTuteurDto } from './dto/create-tuteur.dto';
import { UpdateTuteurDto } from './dto/update-tuteur.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('tuteurs')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TuteursController {
  private readonly logger = new Logger(TuteursController.name);

  constructor(private readonly tuteursService: TuteursService) {}

  @Post()
  @Roles(UserRole.admin, UserRole.structure)
  async create(@Body() createTuteurDto: CreateTuteurDto) {
    try {
      this.logger.debug('Tentative de création d\'un tuteur');
      const tuteur = await this.tuteursService.create(createTuteurDto);
      this.logger.debug('Tuteur créé avec succès');
      return tuteur;
    } catch (error) {
      this.logger.error(`Erreur lors de la création du tuteur: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Get()
  @Roles(UserRole.admin, UserRole.structure, UserRole.tuteur)
  findAll() {
    return this.tuteursService.findAll();
  }

  @Get('assigned-interns')
  @Roles(UserRole.tuteur)
  async getAssignedInterns(@Request() req) {
    try {
      this.logger.debug('Récupération des stagiaires affectés');
      const interns = await this.tuteursService.getAssignedInterns(req.user.id);
      this.logger.debug(`${interns.length} stagiaires trouvés`);
      return { data: interns };
    } catch (error) {
      this.logger.error(`Erreur lors de la récupération des stagiaires: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Get('my-structure')
  @Roles(UserRole.tuteur)
  getMyStructure(@Request() req) {
    return this.tuteursService.getMyStructure(req.user.id);
  }

  @Get(':id')
  @Roles(UserRole.admin, UserRole.structure, UserRole.tuteur)
  findOne(@Param('id') id: string) {
    return this.tuteursService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.admin, UserRole.structure)
  update(@Param('id') id: string, @Body() updateTuteurDto: UpdateTuteurDto) {
    return this.tuteursService.update(id, updateTuteurDto);
  }

  @Delete(':id')
  @Roles(UserRole.admin, UserRole.structure)
  remove(@Param('id') id: string) {
    return this.tuteursService.remove(id);
  }
} 