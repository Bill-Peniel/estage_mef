import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ThemeService } from './theme.service';

@Controller('themes')
@UseGuards(JwtAuthGuard)
export class ThemeController {
  constructor(private readonly themeService: ThemeService) {}

  @Get('mes-themes')
  async getThemes(@Request() req) {
    return this.themeService.getThemesByTuteur(req.user.id);
  }

  @Post()
  async createTheme(@Request() req, @Body() body: { titre: string, description?: string, disponible?: boolean }) {
    return this.themeService.createTheme(req.user.id, body);
  }

  @Put(':id')
  async updateTheme(@Request() req, @Param('id') id: string, @Body() body: { titre: string, description?: string, disponible?: boolean }) {
    return this.themeService.updateTheme(req.user.id, id, body);
  }

  @Delete(':id')
  async deleteTheme(@Request() req, @Param('id') id: string) {
    return this.themeService.deleteTheme(req.user.id, id);
  }

  @Post(':id/affecter')
  async affecterTheme(@Request() req, @Param('id') id: string, @Body() body: { stagiaireId: string }) {
    return this.themeService.affecterTheme(req.user.id, id, body.stagiaireId);
  }
} 