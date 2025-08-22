import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SuggestionsService } from './suggestions.service';

@Controller('suggestions')
@UseGuards(JwtAuthGuard)
export class SuggestionsController {
  constructor(private readonly suggestionsService: SuggestionsService) {}

  @Get('departements')
  async suggestDepartments(@Req() req) {
    return this.suggestionsService.suggestDepartmentsForUser(req.user.id);
  }
} 