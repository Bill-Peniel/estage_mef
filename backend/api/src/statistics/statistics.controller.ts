import { Controller, Get, Param } from '@nestjs/common';
import { StatisticsService } from './statistics.service';

@Controller('stage-request/statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get()
  async getGeneralStats() {
    try {
      return await this.statisticsService.getGeneralStats();
    } catch (error) {
      console.error('Erreur dans le contrôleur getGeneralStats:', error);
      throw error;
    }
  }

  @Get('types')
  async getTypeStats() {
    try {
      return await this.statisticsService.getTypeStats();
    } catch (error) {
      console.error('Erreur dans le contrôleur getTypeStats:', error);
      throw error;
    }
  }

  @Get('education')
  async getEducationStats() {
    try {
      return await this.statisticsService.getEducationStats();
    } catch (error) {
      console.error('Erreur dans le contrôleur getEducationStats:', error);
      throw error;
    }
  }

  @Get('structures')
  async getStructuresStats() {
    try {
      return await this.statisticsService.getStructuresStats();
    } catch (error) {
      console.error('Erreur dans le contrôleur getStructuresStats:', error);
      throw error;
    }
  }

  @Get('evolution')
  async getDemandesEvolution() {
    try {
      return await this.statisticsService.getDemandesEvolution();
    } catch (error) {
      console.error('Erreur dans le contrôleur getDemandesEvolution:', error);
      throw error;
    }
  }

  @Get('overview')
  async getOverview() {
    try {
      const [general, types, education, tuteurs, evolution] = await Promise.all([
        this.statisticsService.getGeneralStats(),
        this.statisticsService.getTypeStats(),
        this.statisticsService.getEducationStats(),
        this.statisticsService.getStructuresStats(),
        this.statisticsService.getDemandesEvolution()
      ]);
      return {
        general,
        types,
        education,
        tuteurs,
        evolution
      };
    } catch (error) {
      console.error('Erreur dans le contrôleur getOverview:', error);
      throw error;
    }
  }

  @Get('tuteurs/:structureId')
  async getTuteursStats(@Param('structureId') structureId: string) {
    try {
      return await this.statisticsService.getTuteursStats(Number(structureId));
    } catch (error) {
      console.error('Erreur dans le contrôleur getTuteursStats:', error);
      throw error;
    }
  }

  @Get('overview/:structureId')
  async getOverviewByStructure(@Param('structureId') structureId: string) {
    try {
      const [general, types, education, tuteurs, evolution] = await Promise.all([
        this.statisticsService.getGeneralStatsByStructure(Number(structureId)),
        this.statisticsService.getTypeStatsByStructure(Number(structureId)),
        this.statisticsService.getEducationStatsByStructure(Number(structureId)),
        this.statisticsService.getTuteursStats(Number(structureId)),
        this.statisticsService.getDemandesEvolutionByStructure(Number(structureId))
      ]);
      return {
        general,
        types,
        education,
        tuteurs,
        evolution
      };
    } catch (error) {
      console.error('Erreur dans le contrôleur getOverviewByStructure:', error);
      throw error;
    }
  }

  @Get('tuteur/:tuteurId')
  async getTuteurStats(@Param('tuteurId') tuteurId: string) {
    try {
      return await this.statisticsService.getTuteurStats(tuteurId);
    } catch (error) {
      console.error('Erreur dans le contrôleur getTuteurStats:', error);
      throw error;
    }
  }

  @Get('tuteur/:tuteurId/activities')
  async getTuteurActivities(@Param('tuteurId') tuteurId: string) {
    try {
      return await this.statisticsService.getTuteurActivities(tuteurId);
    } catch (error) {
      console.error('Erreur dans le contrôleur getTuteurActivities:', error);
      throw error;
    }
  }
} 