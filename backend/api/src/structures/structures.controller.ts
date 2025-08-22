import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request, Patch, ForbiddenException, BadRequestException } from '@nestjs/common';
import { StructuresService } from './structures.service';
import { CreateStructureDto } from './dto/create-structure.dto';
import { UpdateStructureDto } from './dto/update-structure.dto';
import { AssignStagiaireDto } from './dto/assign-stagiaire.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('structures')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StructuresController {
  constructor(private readonly structuresService: StructuresService) {}

  @Post()
  @Roles(UserRole.admin, UserRole.structure, UserRole.tuteur)
  async create(@Body() createStructureDto: CreateStructureDto, @Request() req) {
    // Seul l'admin peut créer des structures principales
    if (req.user.role === UserRole.admin) {
      // L'admin peut créer des structures directionnelles ou techniques
      if (!createStructureDto.type) {
        throw new BadRequestException('Le type de structure est requis');
      }
      return this.structuresService.create(createStructureDto);
    }
    
    // Si l'utilisateur est une structure, il ne peut créer que des sous-structures
    if (req.user.role === UserRole.structure) {
      // Récupérer la structure de l'utilisateur
      const userStructure = await this.structuresService.findUserStructure(req.user.id);
      if (!userStructure) {
        throw new ForbiddenException('Vous n\'êtes pas associé à une structure');
      }

      // Si c'est une structure directionnelle, elle peut créer des sous-structures (techniques)
      if (userStructure.type === 'directionnelle') {
        createStructureDto.parentId = userStructure.id;
        createStructureDto.type = 'technique'; // Forcer le type technique pour les sous-structures
        return this.structuresService.create(createStructureDto);
      }
      
      // Si c'est une structure technique, elle ne peut pas créer de sous-structures
      throw new ForbiddenException('Les structures techniques ne peuvent pas créer de sous-structures');
    }
    
    // Si l'utilisateur est un tuteur, il ne peut pas créer de structures
    if (req.user.role === UserRole.tuteur) {
      throw new ForbiddenException('Les tuteurs ne peuvent pas créer de structures');
    }

    throw new ForbiddenException('Rôle non autorisé');
  }

  @Get()
  findAll() {
    return this.structuresService.findAll();
  }

  @Get('sous-structures')
  findSousStructures(@Request() req) {
    // Si l'utilisateur est une structure, ne retourner que ses sous-structures
    if (req.user.role === UserRole.structure) {
      return this.structuresService.findSousStructuresByParentId(req.user.structureId);
    }
    // Si l'utilisateur est admin, retourner toutes les sous-structures
    return this.structuresService.findSousStructures();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.structuresService.findOne(parseInt(id));
  }

  @Patch(':id')
  @Roles(UserRole.admin, UserRole.structure)
  async update(@Param('id') id: string, @Body() updateStructureDto: UpdateStructureDto, @Request() req) {
    // Si l'utilisateur est une structure, vérifier qu'il modifie sa propre sous-structure
    if (req.user.role === UserRole.structure) {
      const structure = await this.structuresService.findOne(parseInt(id));
      if (structure.parentId !== req.user.structureId) {
        throw new ForbiddenException('Vous n\'êtes pas autorisé à modifier cette sous-structure');
      }
    }
    return this.structuresService.update(parseInt(id), updateStructureDto);
  }

  @Delete(':id')
  @Roles(UserRole.admin, UserRole.structure)
  async remove(@Param('id') id: string, @Request() req) {
    // Si l'utilisateur est une structure, vérifier qu'il supprime sa propre sous-structure
    if (req.user.role === UserRole.structure) {
      const structure = await this.structuresService.findOne(parseInt(id));
      if (structure.parentId !== req.user.structureId) {
        throw new ForbiddenException('Vous n\'êtes pas autorisé à supprimer cette sous-structure');
      }
    }
    return this.structuresService.remove(parseInt(id));
  }

  @Post('assign-stagiaire')
  @Roles(UserRole.dpaf)
  assignStagiaire(@Body() assignStagiaireDto: AssignStagiaireDto) {
    return this.structuresService.assignStagiaire(assignStagiaireDto);
  }

  @Get(':id/stagiaires')
  @Roles(UserRole.structure)
  async getStagiairesByStructure(@Param('id') id: string) {
    return this.structuresService.getStagiairesByStructure(id);
  }

  @Get('stats/stagiaires')
  @Roles(UserRole.dpaf)
  async getStagiairesStats() {
    return this.structuresService.getStagiairesStats();
  }

  @Get(':id/users')
  @Roles(UserRole.admin, UserRole.structure)
  async getStructureUsers(@Param('id') id: string, @Request() req) {
    // Si l'utilisateur est une structure, vérifier qu'il demande ses propres utilisateurs
    if (req.user.role === UserRole.structure && req.user.structureId !== parseInt(id)) {
      throw new ForbiddenException('Vous n\'êtes pas autorisé à voir les utilisateurs de cette structure');
    }
    return this.structuresService.getStructureUsers(parseInt(id));
  }
} 