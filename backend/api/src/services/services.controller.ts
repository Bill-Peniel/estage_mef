import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request, Patch, ParseIntPipe } from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('services')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post()
  @Roles(UserRole.structure)
  async create(@Body() createServiceDto: CreateServiceDto, @Request() req) {
    return this.servicesService.create(createServiceDto, req.user.id);
  }

  @Get('structure/:structureId')
  @Roles(UserRole.admin, UserRole.structure)
  async findAllByStructure(@Param('structureId', ParseIntPipe) structureId: number) {
    return this.servicesService.findAllByStructure(structureId);
  }

  @Get(':id')
  @Roles(UserRole.admin, UserRole.structure, UserRole.tuteur)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.servicesService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.structure)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateServiceDto: UpdateServiceDto,
    @Request() req
  ) {
    return this.servicesService.update(id, updateServiceDto, req.user.id);
  }

  @Delete(':id')
  @Roles(UserRole.structure)
  async remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.servicesService.remove(id, req.user.id);
  }
}





