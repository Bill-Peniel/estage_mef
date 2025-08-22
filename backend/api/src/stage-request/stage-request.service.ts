import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { EmailService } from '../email/email.service';
import { NotificationService } from '../notification/notification.service';
import { UserRole } from '@prisma/client';

@Injectable()
export class StageRequestService {
  private readonly logger = new Logger(StageRequestService.name);

  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
    private notificationService: NotificationService,
  ) {}

  private generateTrackingCode(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `STG-${timestamp}-${random}`.toUpperCase();
  }

  async createStageRequest(data: any) {
    try {
      this.logger.debug('Création d\'une nouvelle demande de stage');
      this.logger.debug('Données reçues:', JSON.stringify(data, null, 2));

      if (!data.stagiaireId) {
        throw new Error('ID du stagiaire manquant');
      }

      // Valider que le stagiaireId correspond à un utilisateur au rôle 'stagiaire'
      const targetUser = await this.prisma.user.findUnique({
        where: { id: data.stagiaireId },
        select: { id: true, role: true, email: true, profile: true }
      });
      if (!targetUser) {
        throw new Error('Stagiaire cible introuvable');
      }
      if (targetUser.role !== UserRole.stagiaire) {
        throw new Error('Le destinataire de la demande doit être un utilisateur avec le rôle stagiaire');
      }

      // Extraire les informations du stage
      const internshipInfo = data.internshipInfo || {};
      const personalInfo = data.personalInfo || {};

      // Validation des données requises
      const requiredFields = [
        { field: 'startDate', name: 'dateDebut' },
        { field: 'endDate', name: 'dateFin' },
        { field: 'internshipType', name: 'type' },
        { field: 'department', name: 'departement' },
        { field: 'universityName', name: 'universite' },
        { field: 'studyField', name: 'domaineEtude' }
      ];

      const missingFields = requiredFields
        .filter(({ field }) => !internshipInfo[field])
        .map(({ name }) => name);
      
      if (missingFields.length > 0) {
        this.logger.error(`Champs manquants: ${missingFields.join(', ')}`);
        throw new Error(`Champs manquants: ${missingFields.join(', ')}`);
      }

      // Générer le code de suivi
      const codeSuivi = this.generateTrackingCode();

      // Gérer les fichiers
      const documents = data.documents || {};
      const handleFile = (file: any) => {
        if (!file) return null;
        if (Array.isArray(file)) {
          return file[0]?.filename ? `/uploads/${file[0].filename}` : null;
        }
        return file.filename ? `/uploads/${file.filename}` : null;
      };

      // Ajout d'un log pour vérifier la structure des fichiers reçus
      this.logger.debug('Fichiers reçus dans le service:', JSON.stringify(documents, null, 2));
      this.logger.debug('Photo reçue:', documents.photo ? 'OUI' : 'NON');
      if (documents.photo) {
        this.logger.debug('Photo details:', {
          isArray: Array.isArray(documents.photo),
          length: Array.isArray(documents.photo) ? documents.photo.length : 'N/A',
          filename: Array.isArray(documents.photo) ? documents.photo[0]?.filename : documents.photo?.filename
        });
      }

      // Déterminer l'email du binôme s'il s'agit d'une demande en binôme
      let candidate2Email: string | null = null;
      let secondCandidateUserId: string | null = null;
      try {
        if ((personalInfo?.stageType || '').toLowerCase() === 'binome') {
          if (Array.isArray(personalInfo.groupMembers)) {
            const firstMember = personalInfo.groupMembers.find((m: any) => m?.email);
            if (firstMember?.email) candidate2Email = String(firstMember.email);
          }
          const altEmails = [
            personalInfo?.candidate2Email,
            personalInfo?.partnerEmail,
            personalInfo?.binomeEmail,
          ].filter((e) => typeof e === 'string') as string[];
          if (!candidate2Email && altEmails.length > 0) {
            candidate2Email = altEmails[0];
          }
        }
      } catch (_) {
        // Ignorer si extraction impossible
      }

      // Détecter si le candidat 2 a déjà un compte
      if (candidate2Email) {
        const secondUser = await this.prisma.user.findFirst({ where: { email: candidate2Email } });
        if (secondUser) {
          secondCandidateUserId = secondUser.id;
        }
      }

      // Créer la demande de stage avec un mapping robuste
      const stageRequestData = {
        stagiaireId: data.stagiaireId,
        dateDebut: new Date(internshipInfo.startDate),
        dateFin: new Date(internshipInfo.endDate),
        type: internshipInfo.internshipType,
        departement: internshipInfo.department, // Département préféré par le stagiaire
        universite: internshipInfo.universityName,
        domaineEtude: internshipInfo.studyField,
        status: 'EN_ATTENTE',
        code_suivi: codeSuivi,
        motivation: personalInfo.motivation || "Non spécifiée",
        competences: personalInfo.competences || "Non spécifiées",
        experience: personalInfo.experience || "Non spécifiée",
        anneeEtude: personalInfo.educationLevel || "Non spécifiée",
        photo: handleFile(Array.isArray(documents.photo) ? documents.photo[0] : documents.photo),
        cv: handleFile(Array.isArray(documents.cv) ? documents.cv[0] : documents.cv),
        lettreMotivation: handleFile(Array.isArray(documents.coverLetter) ? documents.coverLetter[0] : documents.coverLetter),
        carteIdentite: handleFile(Array.isArray(documents.identityCard) ? documents.identityCard[0] : documents.identityCard),
        inscriptionUniversitaire: handleFile(Array.isArray(documents.universityEnrollment) ? documents.universityEnrollment[0] : documents.universityEnrollment),
        recommandation: handleFile(Array.isArray(documents.recommendation) ? documents.recommendation[0] : documents.recommendation),
        autresDocuments: Array.isArray(documents.otherDocuments)
          ? documents.otherDocuments.map(file => handleFile(file))
          : [],
        candidate2Email: candidate2Email || null,
        requiresSecondCandidateValidation: !!candidate2Email,
        // Toujours exiger une validation explicite du binôme, même s'il a déjà un compte
        secondCandidateValidated: false,
        secondCandidateUserId: secondCandidateUserId || null,
      };

      this.logger.debug('Données préparées pour la création:', stageRequestData);

      // Sauvegarder la demande dans la base de données avec les relations nécessaires
      const savedRequest = await this.prisma.stageRequest.create({
        data: stageRequestData,
        include: {
          stagiaire: {
            include: {
              profile: true
            }
          }
        }
      });

      // Mettre à jour le profil de l'utilisateur avec les nouvelles informations personnelles
      try {
        const updateData: any = {};
        
        if (personalInfo.firstName || personalInfo.lastName) {
          updateData.prenom = personalInfo.firstName || undefined;
          updateData.nom = personalInfo.lastName || undefined;
        }
        
        if (personalInfo.phone) {
          updateData.telephone = personalInfo.phone;
        }

        if (Object.keys(updateData).length > 0) {
          await this.prisma.profile.update({
            where: { userId: data.stagiaireId },
            data: updateData
          });
          this.logger.debug('Profil utilisateur mis à jour avec les nouvelles informations');
        }
      } catch (updateError) {
        this.logger.warn('Erreur lors de la mise à jour du profil:', updateError);
        // Ne pas bloquer le processus si la mise à jour du profil échoue
      }

      // Créer une notification pour la DPAF UNIQUEMENT si pas de validation requise
      try {
        if (stageRequestData.requiresSecondCandidateValidation && !stageRequestData.secondCandidateValidated) {
          // Ne pas notifier DPAF tant que la validation du binôme n'est pas faite
        } else {
        const stagiaireName = savedRequest.stagiaire?.profile 
          ? `${savedRequest.stagiaire.profile.prenom} ${savedRequest.stagiaire.profile.nom}`
          : 'Un stagiaire';

        await this.notificationService.createNotification({
          type: 'info',
          title: 'Nouvelle demande de stage',
          message: `Une nouvelle demande de stage a été soumise par ${stagiaireName}. Code de suivi : ${savedRequest.code_suivi}`,
          role: UserRole.dpaf
        });

        // Créer une entrée dans le journal des actions
        await this.prisma.journalAction.create({
          data: {
            userId: savedRequest.stagiaireId,
            action: 'NOUVELLE_DEMANDE',
            cible: `Nouvelle demande de stage de ${stagiaireName}`
          }
        });
        }
      } catch (notificationError) {
        this.logger.error('Erreur lors de la création de la notification:', notificationError);
        // Ne pas bloquer le processus si la notification échoue
      }

      // Envoyer l'email de confirmation au(x) candidat(s) (non bloquant)
      const recipientEmails = new Set<string>();
      if (savedRequest.stagiaire?.email) {
        recipientEmails.add(savedRequest.stagiaire.email);
      } else {
        this.logger.warn('Email non trouvé pour l\'envoi de la confirmation du stagiaire principal');
      }

      // Inclure l'email du binôme détecté et/ou stocké
      if (candidate2Email) recipientEmails.add(candidate2Email);

      // Si binôme, tenter de récupérer l'email du/de la second(e) candidat(e) depuis personalInfo
      try {
        if ((personalInfo?.stageType || '').toLowerCase() === 'binome') {
          // 1) Tableau groupMembers: [{ email, ... }]
          if (Array.isArray(personalInfo.groupMembers)) {
            for (const member of personalInfo.groupMembers) {
              if (member?.email && typeof member.email === 'string') {
                recipientEmails.add(member.email);
              }
            }
          }
          // 2) Champs alternatifs possibles
          const altEmails = [
            personalInfo?.candidate2Email,
            personalInfo?.partnerEmail,
            personalInfo?.binomeEmail,
          ].filter((e) => typeof e === 'string');
          for (const e of altEmails as string[]) recipientEmails.add(e);
        }
      } catch (e) {
        this.logger.warn('Impossible d\'extraire l\'email du second candidat:', e);
      }

      this.logger.debug('Destinataires email (création demande): ' + JSON.stringify(Array.from(recipientEmails)));

      // Envoi des emails de confirmation à tous les destinataires collectés
      for (const email of recipientEmails) {
        // Le message pour le candidat 2 change si validation requise et qu'il n'a pas de compte
        if (email === candidate2Email && stageRequestData.requiresSecondCandidateValidation && !secondCandidateUserId) {
          // Inviter à créer un compte et valider la demande
          this.emailService
            .sendStageRequestConfirmation(email, { ...savedRequest, inviteCreateAccount: true })
            .catch((emailError) => {
              this.logger.warn(`Échec de l'envoi de l'email d'invitation candidat 2 à ${email}:`, emailError);
            });
        } else if (email === candidate2Email && stageRequestData.requiresSecondCandidateValidation && secondCandidateUserId && !stageRequestData.secondCandidateValidated) {
          // Inviter à valider la demande (a déjà un compte)
          this.emailService
            .sendStageRequestConfirmation(email, { ...savedRequest, inviteValidate: true })
            .catch((emailError) => {
              this.logger.warn(`Échec de l'envoi de l'email de validation candidat 2 à ${email}:`, emailError);
            });
        } else {
          // Email standard
          this.emailService
            .sendStageRequestConfirmation(email, savedRequest)
            .catch((emailError) => {
              this.logger.warn(`Échec de l'envoi de l'email de confirmation à ${email}:`, emailError);
            });
        }
      }

      return {
        success: true,
        message: `Votre demande de stage a été soumise avec succès !\nVotre code de suivi est : ${codeSuivi}\nConservez précieusement ce code pour suivre l'état de votre demande.`,
        data: savedRequest
      };
    } catch (error) {
      this.logger.error('Erreur lors de la création de la demande:', error);
      throw error;
    }
  }

  async getStageRequestsByStagiaire(stagiaireId: string) {
    return this.prisma.stageRequest.findMany({
      where: { stagiaireId },
      include: {
        stagiaire: {
          include: {
            profile: true
          }
        }
      }
    });
  }

  async getStageRequestsForDPAF() {
    try {
      const requests = await this.prisma.stageRequest.findMany({
        where: {
          status: {
            in: ['EN_ATTENTE', 'APPROUVE', 'VALIDEE', 'TERMINE', 'REJETEE']
          }
        },
        include: {
          stagiaire: {
            include: {
              profile: true,
              stagiaire: {
                include: {
                  structure: true
                }
              }
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      this.logger.debug('Demandes récupérées pour DPAF:', JSON.stringify(requests, null, 2));
      return requests;
    } catch (error) {
      this.logger.error('Erreur lors de la récupération des demandes pour DPAF:', error);
      throw new InternalServerErrorException('Erreur lors de la récupération des demandes');
    }
  }

  async getHistoriqueStagiaires() {
    return this.prisma.stageRequest.findMany({
      include: {
        stagiaire: {
          include: {
            profile: true,
            stagiaire: {
              include: {
                structure: true,
                tuteur: {
                  include: {
                    user: {
                      include: {
                        profile: true
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  async approveStageRequest(requestId: string) {
    try {
      this.logger.debug(`Approbation de la demande de stage ${requestId}`);

      // Vérifier si la demande existe
      const existingRequest = await this.prisma.stageRequest.findUnique({
        where: { id: requestId },
        include: {
          stagiaire: {
            include: {
              profile: true
            }
          }
        }
      });

      if (!existingRequest) {
        throw new Error('Demande de stage non trouvée');
      }

      if (existingRequest.status === 'APPROUVE') {
        throw new Error('Cette demande a déjà été approuvée');
      }

      if (existingRequest.status === 'REFUSE') {
        throw new Error('Impossible d\'approuver une demande qui a été refusée');
      }

      const updatedRequest = await this.prisma.stageRequest.update({
        where: { id: requestId },
        data: {
          status: 'APPROUVE',
          updatedAt: new Date()
        },
        include: {
          stagiaire: {
            include: {
              profile: true
            }
          }
        }
      });

      try {
        // Créer une notification pour le stagiaire
        await this.notificationService.createNotification({
          type: 'success',
          title: 'Demande de stage approuvée',
          message: `Votre demande de stage (${updatedRequest.code_suivi}) a été approuvée.`,
          userId: updatedRequest.stagiaireId
        });
      } catch (notificationError) {
        this.logger.error('Erreur lors de la création de la notification:', notificationError);
        // Ne pas bloquer le processus si la notification échoue
      }

      // Envoyer un email au stagiaire (non bloquant)
      try {
        const stagiaire = await this.prisma.user.findUnique({
          where: { id: updatedRequest.stagiaireId },
          include: { profile: true }
        });
        const recipients = new Set<string>();
        if (stagiaire?.email) recipients.add(stagiaire.email);
        if (updatedRequest.candidate2Email) recipients.add(updatedRequest.candidate2Email);
        this.logger.debug('Destinataires email (approbation): ' + JSON.stringify(Array.from(recipients)));
        for (const email of recipients) {
          this.emailService
            .sendStageRequestApproval(email, { ...updatedRequest, stagiaire })
            .catch((emailError) => {
              this.logger.error(`Erreur lors de l'envoi de l'email d'approbation à ${email}:`, emailError);
            });
        }
      } catch (lookupError) {
        this.logger.error('Erreur lors de la préparation des emails d\'approbation:', lookupError);
      }

      try {
        // Créer une entrée dans le journal des actions
        await this.prisma.journalAction.create({
          data: {
            userId: updatedRequest.stagiaireId,
            action: 'APPROBATION_DEMANDE',
            cible: `Demande de stage ${updatedRequest.code_suivi} approuvée`
          }
        });
      } catch (journalError) {
        this.logger.error('Erreur lors de la création de l\'entrée dans le journal:', journalError);
        // Ne pas bloquer le processus si le journal échoue
      }

      return {
        success: true,
        message: 'La demande de stage a été approuvée avec succès',
        data: updatedRequest
      };
    } catch (error) {
      this.logger.error('Erreur lors de l\'approbation de la demande:', error);
      throw error;
    }
  }

  async rejectStageRequest(requestId: string, motif: string) {
    try {
      this.logger.debug(`Refus de la demande de stage ${requestId}`);

      const updatedRequest = await this.prisma.stageRequest.update({
        where: { id: requestId },
        data: {
          status: 'REFUSE',
          updatedAt: new Date(),
          motivation: `Motif de refus : ${motif}`
        },
        include: {
          stagiaire: {
            include: {
              profile: true
            }
          }
        }
      });

      // Créer une notification pour le stagiaire
      await this.notificationService.createNotification({
        type: 'error',
        title: 'Demande de stage refusée',
        message: `Votre demande de stage (${updatedRequest.code_suivi}) a été refusée. Motif : ${motif}`,
        userId: updatedRequest.stagiaireId
      });

      // Envoyer un email au stagiaire (non bloquant)
      try {
      const stagiaire = await this.prisma.user.findUnique({
        where: { id: updatedRequest.stagiaireId },
          include: { profile: true }
        });
        const recipients = new Set<string>();
        if (stagiaire?.email) recipients.add(stagiaire.email);
        if (updatedRequest.candidate2Email) recipients.add(updatedRequest.candidate2Email);
        this.logger.debug('Destinataires email (refus): ' + JSON.stringify(Array.from(recipients)));
        for (const email of recipients) {
          this.emailService
            .sendStageRequestRejection(email, { ...updatedRequest, stagiaire }, motif)
            .catch((emailError) => {
              this.logger.error(`Erreur lors de l'envoi de l'email de refus à ${email}:`, emailError);
            });
        }
      } catch (lookupError) {
        this.logger.error('Erreur lors de la préparation des emails de refus:', lookupError);
      }

      // Créer une entrée dans le journal des actions
      await this.prisma.journalAction.create({
        data: {
          userId: updatedRequest.stagiaireId,
          action: 'REFUS_DEMANDE',
          cible: `Demande de stage ${updatedRequest.code_suivi} refusée`
        }
      });

      return {
        success: true,
        message: 'La demande de stage a été refusée avec succès',
        data: updatedRequest
      };
    } catch (error) {
      this.logger.error('Erreur lors du refus de la demande:', error);
      throw error;
    }
  }

  async getStatistics() {
    try {
      const [
        nouveaux,
        enCours,
        confirmes,
        refuses
      ] = await Promise.all([
        // Nouvelles demandes (EN_ATTENTE)
        this.prisma.stageRequest.count({
          where: { status: 'EN_ATTENTE' }
        }),
        // Stages en cours
        this.prisma.stageRequest.count({
          where: { status: 'VALIDEE' }
        }),
        // Stages terminés
        this.prisma.stageRequest.count({
          where: { status: 'TERMINE' }
        }),
        // Demandes refusées
        this.prisma.stageRequest.count({
          where: { status: 'REJETEE' }
        })
      ]);

      return {
        nouveaux,
        enCours,
        confirmes,
        refuses,
        total: nouveaux + enCours + confirmes + refuses
      };
    } catch (error) {
      this.logger.error('Erreur lors de la récupération des statistiques:', error);
      throw new InternalServerErrorException('Erreur lors de la récupération des statistiques');
    }
  }

  async getRecentStageRequests() {
    try {
      const recentRequests = await this.prisma.stageRequest.findMany({
        take: 5, // Limiter à 5 dernières demandes
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          stagiaire: {
            include: {
              profile: true,
              stagiaire: {
                include: {
                  structure: true
                }
              }
            }
          }
        }
      });

      return recentRequests.map(request => ({
        id: request.id,
        nom: request.stagiaire?.profile ? 
          `${request.stagiaire.profile.prenom} ${request.stagiaire.profile.nom}` : 
          'Stagiaire inconnu',
        email: request.stagiaire?.email || 'Email non disponible',
        structure: request.stagiaire?.stagiaire?.structure?.nomStructure || 'Structure non définie',
        typeStage: request.type,
        dateSoumission: request.createdAt,
        status: request.status,
        code_suivi: request.code_suivi
      }));
    } catch (error) {
      this.logger.error('Erreur lors de la récupération des dernières demandes:', error);
      throw new InternalServerErrorException('Erreur lors de la récupération des dernières demandes');
    }
  }

  async findStageRequestByTrackingCodeAndEmail(code_suivi: string, email: string) {
    try {
      const request = await this.prisma.stageRequest.findFirst({
        where: {
          code_suivi,
          stagiaire: {
            email
          }
        },
        include: {
          stagiaire: {
            include: { profile: true, structure: true }
          }
        }
      });
      if (!request) {
        throw new Error('Aucune demande trouvée pour ce code et cet email.');
      }
      return request;
    } catch (error) {
      this.logger.error('Erreur lors de la recherche de la demande par code et email:', error);
      throw new InternalServerErrorException('Erreur lors de la recherche de la demande.');
    }
  }

  async findById(id: string) {
    return this.prisma.stageRequest.findUnique({ where: { id } });
  }

  async updateDocuments(id: string, files: any) {
    // Préparer les champs à mettre à jour
    const data: any = {};
    const handleFile = (file: any) => file ? `/uploads/${file.filename}` : undefined;
    if (files.cv && files.cv[0]) data.cv = handleFile(files.cv[0]);
    if (files.coverLetter && files.coverLetter[0]) data.lettreMotivation = handleFile(files.coverLetter[0]);
    if (files.identityCard && files.identityCard[0]) data.carteIdentite = handleFile(files.identityCard[0]);
    if (files.universityEnrollment && files.universityEnrollment[0]) data.inscriptionUniversitaire = handleFile(files.universityEnrollment[0]);
    if (files.recommendation && files.recommendation[0]) data.recommandation = handleFile(files.recommendation[0]);
    if (files.otherDocuments) data.autresDocuments = files.otherDocuments.map(f => handleFile(f));
    return this.prisma.stageRequest.update({
      where: { id },
      data
    });
  }

  async validateSecondCandidate(requestId: string, validator: { userId: string; email: string }) {
    const request = await this.prisma.stageRequest.findUnique({ where: { id: requestId } });
    if (!request) {
      throw new Error('Demande non trouvée');
    }
    if (!request.requiresSecondCandidateValidation) {
      throw new Error('Validation du second candidat non requise');
    }
    if (request.secondCandidateValidated) {
      return request; // déjà validée
    }
    if (request.candidate2Email && request.candidate2Email.toLowerCase() !== validator.email.toLowerCase()) {
      throw new Error('Cet utilisateur ne correspond pas au second candidat');
    }
    if (!request.candidate2Photo) {
      throw new Error('Veuillez d\'abord charger votre photo avant de valider la demande');
    }

    const updated = await this.prisma.stageRequest.update({
      where: { id: requestId },
      data: {
        secondCandidateValidated: true,
        secondCandidateUserId: validator.userId,
        updatedAt: new Date()
      },
      include: {
        stagiaire: { include: { profile: true } }
      }
    });

    // Une fois validée, notifier la DPAF comme pour une demande standard
    try {
      const stagiaireName = updated.stagiaire?.profile 
        ? `${updated.stagiaire.profile.prenom} ${updated.stagiaire.profile.nom}`
        : 'Un stagiaire';

      await this.notificationService.createNotification({
        type: 'info',
        title: 'Nouvelle demande de stage (binôme validé)',
        message: `Une demande de stage binôme a été validée par le second candidat. Code de suivi : ${updated.code_suivi} (Stagiaire: ${stagiaireName})`,
        role: UserRole.dpaf
      });

      await this.prisma.journalAction.create({
        data: {
          userId: updated.stagiaireId,
          action: 'VALIDATION_BINOME',
          cible: `Validation du second candidat pour la demande ${updated.code_suivi}`
        }
      });
    } catch (err) {
      this.logger.error('Erreur lors de la notification après validation du binôme:', err);
    }

    return updated;
  }

  async getSecondCandidateSummary(requestId: string, opts: { token?: string; userEmail?: string }) {
    const request = await this.prisma.stageRequest.findUnique({
      where: { id: requestId },
      include: {
        stagiaire: { include: { profile: true } }
      }
    });
    if (!request) {
      throw new Error('Demande non trouvée');
    }
    if (!request.requiresSecondCandidateValidation) {
      throw new Error('Cette demande ne nécessite pas de validation du second candidat');
    }

    // Optionnel: si token à terme, vérifier ici token/expiration
    // if (opts.token) { ... }

    // Filtrer les infos affichées au candidat 2
    return {
      id: request.id,
      codeSuivi: request.code_suivi,
      type: request.type,
      departement: request.departement,
      dateDebut: request.dateDebut,
      dateFin: request.dateFin,
      universite: request.universite,
      domaineEtude: request.domaineEtude,
      stagiaire: request.stagiaire?.profile ? `${request.stagiaire.profile.prenom} ${request.stagiaire.profile.nom}` : 'Stagiaire inconnu',
      candidate2Email: request.candidate2Email,
      secondCandidateValidated: request.secondCandidateValidated,
      requiresSecondCandidateValidation: request.requiresSecondCandidateValidation
    };
  }

  async refuseSecondCandidate(requestId: string, validator: { userId: string; email: string }) {
    const request = await this.prisma.stageRequest.findUnique({ where: { id: requestId } });
    if (!request) {
      throw new Error('Demande non trouvée');
    }
    if (!request.requiresSecondCandidateValidation) {
      throw new Error('Refus non applicable pour cette demande');
    }
    if (request.candidate2Email && request.candidate2Email.toLowerCase() !== validator.email.toLowerCase()) {
      throw new Error('Cet utilisateur ne correspond pas au second candidat');
    }

    const updated = await this.prisma.stageRequest.update({
      where: { id: requestId },
      data: {
        status: 'REJETEE',
        secondCandidateValidated: false,
        updatedAt: new Date()
      }
    });

    // Journaliser et éventuellement notifier le stagiaire principal du refus
    try {
      await this.prisma.journalAction.create({
        data: {
          userId: updated.stagiaireId,
          action: 'REFUS_BINOME',
          cible: `Refus par le second candidat pour la demande ${updated.code_suivi}`
        }
      });
    } catch (err) {
      this.logger.error('Erreur lors du journal après refus du binôme:', err);
    }

    return updated;
  }

  async updateCandidate2Photo(requestId: string, file?: any) {
    if (!file?.filename) {
      throw new Error('Fichier photo manquant');
    }
    const path = `/uploads/${file.filename}`;
    return this.prisma.stageRequest.update({
      where: { id: requestId },
      data: { candidate2Photo: path, updatedAt: new Date() }
    });
  }
} 