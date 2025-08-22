import { Controller, Post, Body, UseInterceptors, UploadedFiles, UseGuards, Get, Req, BadRequestException, Logger, UnauthorizedException, ForbiddenException, Param, InternalServerErrorException, Request, Patch, Query } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { StageRequestService } from './stage-request.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { join } from 'path';

interface RequestWithUser extends Request {
  user: any;
}

@Controller('stage-request')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StageRequestController {
  private readonly logger = new Logger(StageRequestController.name);

  constructor(private readonly stageRequestService: StageRequestService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'cv', maxCount: 1 },
      { name: 'coverLetter', maxCount: 1 },
      { name: 'identityCard', maxCount: 1 },
      { name: 'universityEnrollment', maxCount: 1 },
      { name: 'recommendation', maxCount: 1 },
      { name: 'otherDocuments', maxCount: 5 },
      { name: 'photo', maxCount: 1 }
    ], {
      storage: diskStorage({
        destination: join(process.cwd(), 'uploads'),
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          const ext = extname(file.originalname);
          const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
          callback(null, filename);
        }
      })
    })
  )
  async createStageRequest(
    @Req() req: RequestWithUser,
    @Body() data: any,
    @UploadedFiles() files: any
  ) {
    try {
      this.logger.debug('Requête de création de demande de stage reçue');
      this.logger.debug('Données reçues:', JSON.stringify(data, null, 2));
      this.logger.debug('Fichiers reçus:', JSON.stringify(files, null, 2));

      // Vérifier l'authentification
      if (!req.user) {
        throw new UnauthorizedException('Utilisateur non authentifié');
      }

      // Normaliser les champs imbriqués envoyés en multipart (personalInfo[...], internshipInfo[...])
      const normalizeNested = (prefix: string) => {
        const result: Record<string, any> = {};
        Object.keys(data || {}).forEach((key) => {
          if (key.startsWith(`${prefix}[`) && key.endsWith(']')) {
            const nestedKey = key.slice(prefix.length + 1, -1);
            result[nestedKey] = data[key];
          }
        });
        // Si l'objet existe déjà en JSON string, le parser
        if (typeof data?.[prefix] === 'string') {
          try {
            return { ...result, ...JSON.parse(data[prefix]) };
          } catch (_) {
            // ignorer si non JSON
          }
        } else if (typeof data?.[prefix] === 'object' && data[prefix] !== null) {
          return { ...result, ...data[prefix] };
        }
        return result;
      };

      // Construire les objets normalisés
      const normalizedPersonalInfo = normalizeNested('personalInfo');
      const normalizedInternshipInfo = normalizeNested('internshipInfo');

      // Injecter dans data pour le service
      data = {
        ...data,
        personalInfo: normalizedPersonalInfo,
        internshipInfo: normalizedInternshipInfo,
      };

      // Préparer les données
      const requestData: any = {
        ...data,
        documents: files
      };

      // Déterminer le stagiaire cible selon le rôle
      if (req.user.role === 'stagiaire') {
        requestData.stagiaireId = req.user.id;
      } else if (req.user.role === 'dpaf' || req.user.role === 'tuteur') {
        // Attendre que le service valide que stagiaireId appartient bien à un utilisateur au rôle 'stagiaire'
        requestData.stagiaireId = data.stagiaireId;
      } else {
        throw new ForbiddenException('Vous n\'êtes pas autorisé à soumettre une demande de stage');
      }

      this.logger.debug('Données préparées pour le service:', JSON.stringify(requestData, null, 2));

      // Créer la demande
      const result = await this.stageRequestService.createStageRequest(requestData);
      
      this.logger.debug('Demande créée avec succès:', JSON.stringify(result, null, 2));

      // Retourner la réponse avec le code de suivi
      return {
        success: true,
        message: `Votre demande de stage a été soumise avec succès !\nVotre code de suivi est : ${result.data.code_suivi}\nConservez précieusement ce code pour suivre l'état de votre demande.`,
        data: result.data
      };
    } catch (error) {
      this.logger.error('Erreur lors de la création de la demande:', error);
      throw error;
    }
  }

  @Get('mes-demandes')
  @Roles(UserRole.stagiaire)
  async getMyStageRequests(@Req() req: any) {
    if (!req.user) {
      throw new BadRequestException('Utilisateur non authentifié');
    }
    return this.stageRequestService.getStageRequestsByStagiaire(req.user.id);
  }

  @Get('dpaf')
  @Roles(UserRole.dpaf)
  async getStageRequestsForDPAF() {
    return this.stageRequestService.getStageRequestsForDPAF();
  }

  @Get('historique')
  @Roles(UserRole.dpaf)
  async getHistoriqueStagiaires() {
    return this.stageRequestService.getHistoriqueStagiaires();
  }

  @Post(':id/approve')
  @Roles(UserRole.dpaf)
  async approveStageRequest(
    @Param('id') id: string,
    @Req() req: RequestWithUser
  ) {
    try {
      if (!id) {
        throw new BadRequestException('ID de la demande manquant');
      }

      // Vérifier que l'utilisateur a le rôle DPAF
      if (req.user.role !== UserRole.dpaf) {
        throw new ForbiddenException('Vous n\'avez pas les droits nécessaires pour approuver une demande');
      }

      const result = await this.stageRequestService.approveStageRequest(id);
      return result;
    } catch (error) {
      this.logger.error(`Erreur lors de l'approbation de la demande ${id}:`, error);
      if (error instanceof BadRequestException || error instanceof ForbiddenException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Une erreur est survenue lors de l\'approbation de la demande'
      );
    }
  }

  @Post(':id/reject')
  @Roles(UserRole.dpaf)
  async rejectStageRequest(
    @Param('id') id: string,
    @Body('motif') motif: string,
    @Req() req: RequestWithUser
  ) {
    try {
      if (!motif) {
        throw new BadRequestException('Le motif du refus est requis');
      }

      // Vérifier que l'utilisateur a le rôle DPAF
      if (req.user.role !== UserRole.dpaf) {
        throw new ForbiddenException('Vous n\'avez pas les droits nécessaires pour refuser une demande');
      }

      return this.stageRequestService.rejectStageRequest(id, motif);
    } catch (error) {
      this.logger.error(`Erreur lors du refus de la demande ${id}:`, error);
      if (error instanceof BadRequestException || error instanceof ForbiddenException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Une erreur est survenue lors du refus de la demande'
      );
    }
  }

  @Get('statistics')
  @Roles(UserRole.dpaf)
  async getStatistics() {
    return this.stageRequestService.getStatistics();
  }

  @Get('recent')
  @Roles(UserRole.dpaf)
  async getRecentStageRequests() {
    return this.stageRequestService.getRecentStageRequests();
  }

  @Post('status')
  async checkStageRequestStatus(@Body('code_suivi') code_suivi: string, @Body('email') email: string) {
    if (!code_suivi || !email) {
      throw new BadRequestException('Le code de suivi et l\'email sont requis.');
    }
    try {
      const request = await this.stageRequestService.findStageRequestByTrackingCodeAndEmail(code_suivi, email);
      return {
        requestId: request.code_suivi,
        submissionDate: request.createdAt,
        status: request.status,
        structure: request.stagiaire?.structure?.nomStructure || 'Non renseignée',
        lastUpdate: request.updatedAt,
      };
    } catch (error) {
      throw new BadRequestException(error.message || 'Erreur lors de la recherche de la demande.');
    }
  }

  @Patch(':id/documents')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'cv', maxCount: 1 },
      { name: 'coverLetter', maxCount: 1 },
      { name: 'identityCard', maxCount: 1 },
      { name: 'universityEnrollment', maxCount: 1 },
      { name: 'recommendation', maxCount: 1 },
      { name: 'otherDocuments', maxCount: 5 }
    ], {
      storage: diskStorage({
        destination: join(process.cwd(), 'uploads'),
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          const ext = extname(file.originalname);
          const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
          callback(null, filename);
        }
      })
    })
  )
  async updateDocuments(
    @Param('id') id: string,
    @Req() req: RequestWithUser,
    @UploadedFiles() files: any
  ) {
    // Vérifier l'authentification
    if (!req.user) {
      throw new UnauthorizedException('Utilisateur non authentifié');
    }
    // Vérifier que la demande appartient bien au stagiaire connecté
    const stageRequest = await this.stageRequestService.findById(id);
    if (!stageRequest) {
      throw new BadRequestException('Demande non trouvée');
    }
    if (stageRequest.stagiaireId !== req.user.id) {
      throw new ForbiddenException('Vous ne pouvez modifier que vos propres documents');
    }
    // Mettre à jour les documents
    const updated = await this.stageRequestService.updateDocuments(id, files);
    return {
      success: true,
      message: 'Documents mis à jour',
      data: updated
    };
  }

  @Post(':id/validate-second')
  @UseGuards(JwtAuthGuard)
  async validateSecondCandidate(
    @Param('id') id: string,
    @Req() req: RequestWithUser
  ) {
    try {
      if (!req.user) {
        throw new UnauthorizedException('Utilisateur non authentifié');
      }
      const result = await this.stageRequestService.validateSecondCandidate(id, {
        userId: req.user.id,
        email: req.user.email
      });
      return {
        success: true,
        message: 'Validation du second candidat effectuée avec succès',
        data: result
      };
    } catch (error) {
      this.logger.error('Erreur lors de la validation du second candidat:', error);
      throw error;
    }
  }

  @Patch(':id/candidate2-photo')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'candidate2Photo', maxCount: 1 },
    ], {
      storage: diskStorage({
        destination: join(process.cwd(), 'uploads'),
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          const ext = extname(file.originalname);
          const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
          callback(null, filename);
        }
      })
    })
  )
  async uploadCandidate2Photo(
    @Param('id') id: string,
    @Req() req: RequestWithUser,
    @UploadedFiles() files: any
  ) {
    if (!req.user) {
      throw new UnauthorizedException('Utilisateur non authentifié');
    }
    const updated = await this.stageRequestService.updateCandidate2Photo(id, files?.candidate2Photo?.[0]);
    return {
      success: true,
      message: 'Photo du candidat 2 mise à jour',
      data: updated
    };
  }

  @Get(':id/summary')
  async getSecondCandidateSummary(
    @Param('id') id: string,
    @Query('token') token?: string,
    @Req() req?: RequestWithUser,
  ) {
    try {
      const userEmail = req?.user?.email;
      const result = await this.stageRequestService.getSecondCandidateSummary(id, {
        token,
        userEmail,
      });
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      this.logger.error('Erreur lors de la récupération du résumé pour le second candidat:', error);
      throw error;
    }
  }

  @Post(':id/refuse-second')
  @UseGuards(JwtAuthGuard)
  async refuseSecondCandidate(
    @Param('id') id: string,
    @Req() req: RequestWithUser
  ) {
    try {
      if (!req.user) {
        throw new UnauthorizedException('Utilisateur non authentifié');
      }
      const result = await this.stageRequestService.refuseSecondCandidate(id, {
        userId: req.user.id,
        email: req.user.email
      });
      return {
        success: true,
        message: 'Refus du second candidat enregistré. La demande a été annulée.',
        data: result
      };
    } catch (error) {
      this.logger.error('Erreur lors du refus par le second candidat:', error);
      throw error;
    }
  }
} 