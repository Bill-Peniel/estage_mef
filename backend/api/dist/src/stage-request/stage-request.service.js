"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var StageRequestService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StageRequestService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const email_service_1 = require("../email/email.service");
const notification_service_1 = require("../notification/notification.service");
const client_1 = require("@prisma/client");
let StageRequestService = StageRequestService_1 = class StageRequestService {
    prisma;
    emailService;
    notificationService;
    logger = new common_1.Logger(StageRequestService_1.name);
    constructor(prisma, emailService, notificationService) {
        this.prisma = prisma;
        this.emailService = emailService;
        this.notificationService = notificationService;
    }
    generateTrackingCode() {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substring(2, 8);
        return `STG-${timestamp}-${random}`.toUpperCase();
    }
    async createStageRequest(data) {
        try {
            this.logger.debug('Création d\'une nouvelle demande de stage');
            this.logger.debug('Données reçues:', JSON.stringify(data, null, 2));
            if (!data.stagiaireId) {
                throw new Error('ID du stagiaire manquant');
            }
            const targetUser = await this.prisma.user.findUnique({
                where: { id: data.stagiaireId },
                select: { id: true, role: true, email: true, profile: true }
            });
            if (!targetUser) {
                throw new Error('Stagiaire cible introuvable');
            }
            if (targetUser.role !== client_1.UserRole.stagiaire) {
                throw new Error('Le destinataire de la demande doit être un utilisateur avec le rôle stagiaire');
            }
            const internshipInfo = data.internshipInfo || {};
            const personalInfo = data.personalInfo || {};
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
            const codeSuivi = this.generateTrackingCode();
            const documents = data.documents || {};
            const handleFile = (file) => {
                if (!file)
                    return null;
                if (Array.isArray(file)) {
                    return file[0]?.filename ? `/uploads/${file[0].filename}` : null;
                }
                return file.filename ? `/uploads/${file.filename}` : null;
            };
            this.logger.debug('Fichiers reçus dans le service:', JSON.stringify(documents, null, 2));
            this.logger.debug('Photo reçue:', documents.photo ? 'OUI' : 'NON');
            if (documents.photo) {
                this.logger.debug('Photo details:', {
                    isArray: Array.isArray(documents.photo),
                    length: Array.isArray(documents.photo) ? documents.photo.length : 'N/A',
                    filename: Array.isArray(documents.photo) ? documents.photo[0]?.filename : documents.photo?.filename
                });
            }
            let candidate2Email = null;
            let secondCandidateUserId = null;
            try {
                if ((personalInfo?.stageType || '').toLowerCase() === 'binome') {
                    if (Array.isArray(personalInfo.groupMembers)) {
                        const firstMember = personalInfo.groupMembers.find((m) => m?.email);
                        if (firstMember?.email)
                            candidate2Email = String(firstMember.email);
                    }
                    const altEmails = [
                        personalInfo?.candidate2Email,
                        personalInfo?.partnerEmail,
                        personalInfo?.binomeEmail,
                    ].filter((e) => typeof e === 'string');
                    if (!candidate2Email && altEmails.length > 0) {
                        candidate2Email = altEmails[0];
                    }
                }
            }
            catch (_) {
            }
            if (candidate2Email) {
                const secondUser = await this.prisma.user.findFirst({ where: { email: candidate2Email } });
                if (secondUser) {
                    secondCandidateUserId = secondUser.id;
                }
            }
            const stageRequestData = {
                stagiaireId: data.stagiaireId,
                dateDebut: new Date(internshipInfo.startDate),
                dateFin: new Date(internshipInfo.endDate),
                type: internshipInfo.internshipType,
                departement: internshipInfo.department,
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
                secondCandidateValidated: false,
                secondCandidateUserId: secondCandidateUserId || null,
            };
            this.logger.debug('Données préparées pour la création:', stageRequestData);
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
            try {
                const updateData = {};
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
            }
            catch (updateError) {
                this.logger.warn('Erreur lors de la mise à jour du profil:', updateError);
            }
            try {
                if (stageRequestData.requiresSecondCandidateValidation && !stageRequestData.secondCandidateValidated) {
                }
                else {
                    const stagiaireName = savedRequest.stagiaire?.profile
                        ? `${savedRequest.stagiaire.profile.prenom} ${savedRequest.stagiaire.profile.nom}`
                        : 'Un stagiaire';
                    await this.notificationService.createNotification({
                        type: 'info',
                        title: 'Nouvelle demande de stage',
                        message: `Une nouvelle demande de stage a été soumise par ${stagiaireName}. Code de suivi : ${savedRequest.code_suivi}`,
                        role: client_1.UserRole.dpaf
                    });
                    await this.prisma.journalAction.create({
                        data: {
                            userId: savedRequest.stagiaireId,
                            action: 'NOUVELLE_DEMANDE',
                            cible: `Nouvelle demande de stage de ${stagiaireName}`
                        }
                    });
                }
            }
            catch (notificationError) {
                this.logger.error('Erreur lors de la création de la notification:', notificationError);
            }
            const recipientEmails = new Set();
            if (savedRequest.stagiaire?.email) {
                recipientEmails.add(savedRequest.stagiaire.email);
            }
            else {
                this.logger.warn('Email non trouvé pour l\'envoi de la confirmation du stagiaire principal');
            }
            if (candidate2Email)
                recipientEmails.add(candidate2Email);
            try {
                if ((personalInfo?.stageType || '').toLowerCase() === 'binome') {
                    if (Array.isArray(personalInfo.groupMembers)) {
                        for (const member of personalInfo.groupMembers) {
                            if (member?.email && typeof member.email === 'string') {
                                recipientEmails.add(member.email);
                            }
                        }
                    }
                    const altEmails = [
                        personalInfo?.candidate2Email,
                        personalInfo?.partnerEmail,
                        personalInfo?.binomeEmail,
                    ].filter((e) => typeof e === 'string');
                    for (const e of altEmails)
                        recipientEmails.add(e);
                }
            }
            catch (e) {
                this.logger.warn('Impossible d\'extraire l\'email du second candidat:', e);
            }
            this.logger.debug('Destinataires email (création demande): ' + JSON.stringify(Array.from(recipientEmails)));
            for (const email of recipientEmails) {
                if (email === candidate2Email && stageRequestData.requiresSecondCandidateValidation && !secondCandidateUserId) {
                    this.emailService
                        .sendStageRequestConfirmation(email, { ...savedRequest, inviteCreateAccount: true })
                        .catch((emailError) => {
                        this.logger.warn(`Échec de l'envoi de l'email d'invitation candidat 2 à ${email}:`, emailError);
                    });
                }
                else if (email === candidate2Email && stageRequestData.requiresSecondCandidateValidation && secondCandidateUserId && !stageRequestData.secondCandidateValidated) {
                    this.emailService
                        .sendStageRequestConfirmation(email, { ...savedRequest, inviteValidate: true })
                        .catch((emailError) => {
                        this.logger.warn(`Échec de l'envoi de l'email de validation candidat 2 à ${email}:`, emailError);
                    });
                }
                else {
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
        }
        catch (error) {
            this.logger.error('Erreur lors de la création de la demande:', error);
            throw error;
        }
    }
    async getStageRequestsByStagiaire(stagiaireId) {
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
        }
        catch (error) {
            this.logger.error('Erreur lors de la récupération des demandes pour DPAF:', error);
            throw new common_1.InternalServerErrorException('Erreur lors de la récupération des demandes');
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
    async approveStageRequest(requestId) {
        try {
            this.logger.debug(`Approbation de la demande de stage ${requestId}`);
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
                await this.notificationService.createNotification({
                    type: 'success',
                    title: 'Demande de stage approuvée',
                    message: `Votre demande de stage (${updatedRequest.code_suivi}) a été approuvée.`,
                    userId: updatedRequest.stagiaireId
                });
            }
            catch (notificationError) {
                this.logger.error('Erreur lors de la création de la notification:', notificationError);
            }
            try {
                const stagiaire = await this.prisma.user.findUnique({
                    where: { id: updatedRequest.stagiaireId },
                    include: { profile: true }
                });
                const recipients = new Set();
                if (stagiaire?.email)
                    recipients.add(stagiaire.email);
                if (updatedRequest.candidate2Email)
                    recipients.add(updatedRequest.candidate2Email);
                this.logger.debug('Destinataires email (approbation): ' + JSON.stringify(Array.from(recipients)));
                for (const email of recipients) {
                    this.emailService
                        .sendStageRequestApproval(email, { ...updatedRequest, stagiaire })
                        .catch((emailError) => {
                        this.logger.error(`Erreur lors de l'envoi de l'email d'approbation à ${email}:`, emailError);
                    });
                }
            }
            catch (lookupError) {
                this.logger.error('Erreur lors de la préparation des emails d\'approbation:', lookupError);
            }
            try {
                await this.prisma.journalAction.create({
                    data: {
                        userId: updatedRequest.stagiaireId,
                        action: 'APPROBATION_DEMANDE',
                        cible: `Demande de stage ${updatedRequest.code_suivi} approuvée`
                    }
                });
            }
            catch (journalError) {
                this.logger.error('Erreur lors de la création de l\'entrée dans le journal:', journalError);
            }
            return {
                success: true,
                message: 'La demande de stage a été approuvée avec succès',
                data: updatedRequest
            };
        }
        catch (error) {
            this.logger.error('Erreur lors de l\'approbation de la demande:', error);
            throw error;
        }
    }
    async rejectStageRequest(requestId, motif) {
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
            await this.notificationService.createNotification({
                type: 'error',
                title: 'Demande de stage refusée',
                message: `Votre demande de stage (${updatedRequest.code_suivi}) a été refusée. Motif : ${motif}`,
                userId: updatedRequest.stagiaireId
            });
            try {
                const stagiaire = await this.prisma.user.findUnique({
                    where: { id: updatedRequest.stagiaireId },
                    include: { profile: true }
                });
                const recipients = new Set();
                if (stagiaire?.email)
                    recipients.add(stagiaire.email);
                if (updatedRequest.candidate2Email)
                    recipients.add(updatedRequest.candidate2Email);
                this.logger.debug('Destinataires email (refus): ' + JSON.stringify(Array.from(recipients)));
                for (const email of recipients) {
                    this.emailService
                        .sendStageRequestRejection(email, { ...updatedRequest, stagiaire }, motif)
                        .catch((emailError) => {
                        this.logger.error(`Erreur lors de l'envoi de l'email de refus à ${email}:`, emailError);
                    });
                }
            }
            catch (lookupError) {
                this.logger.error('Erreur lors de la préparation des emails de refus:', lookupError);
            }
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
        }
        catch (error) {
            this.logger.error('Erreur lors du refus de la demande:', error);
            throw error;
        }
    }
    async getStatistics() {
        try {
            const [nouveaux, enCours, confirmes, refuses] = await Promise.all([
                this.prisma.stageRequest.count({
                    where: { status: 'EN_ATTENTE' }
                }),
                this.prisma.stageRequest.count({
                    where: { status: 'VALIDEE' }
                }),
                this.prisma.stageRequest.count({
                    where: { status: 'TERMINE' }
                }),
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
        }
        catch (error) {
            this.logger.error('Erreur lors de la récupération des statistiques:', error);
            throw new common_1.InternalServerErrorException('Erreur lors de la récupération des statistiques');
        }
    }
    async getRecentStageRequests() {
        try {
            const recentRequests = await this.prisma.stageRequest.findMany({
                take: 5,
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
        }
        catch (error) {
            this.logger.error('Erreur lors de la récupération des dernières demandes:', error);
            throw new common_1.InternalServerErrorException('Erreur lors de la récupération des dernières demandes');
        }
    }
    async findStageRequestByTrackingCodeAndEmail(code_suivi, email) {
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
        }
        catch (error) {
            this.logger.error('Erreur lors de la recherche de la demande par code et email:', error);
            throw new common_1.InternalServerErrorException('Erreur lors de la recherche de la demande.');
        }
    }
    async findById(id) {
        return this.prisma.stageRequest.findUnique({ where: { id } });
    }
    async updateDocuments(id, files) {
        const data = {};
        const handleFile = (file) => file ? `/uploads/${file.filename}` : undefined;
        if (files.cv && files.cv[0])
            data.cv = handleFile(files.cv[0]);
        if (files.coverLetter && files.coverLetter[0])
            data.lettreMotivation = handleFile(files.coverLetter[0]);
        if (files.identityCard && files.identityCard[0])
            data.carteIdentite = handleFile(files.identityCard[0]);
        if (files.universityEnrollment && files.universityEnrollment[0])
            data.inscriptionUniversitaire = handleFile(files.universityEnrollment[0]);
        if (files.recommendation && files.recommendation[0])
            data.recommandation = handleFile(files.recommendation[0]);
        if (files.otherDocuments)
            data.autresDocuments = files.otherDocuments.map(f => handleFile(f));
        return this.prisma.stageRequest.update({
            where: { id },
            data
        });
    }
    async validateSecondCandidate(requestId, validator) {
        const request = await this.prisma.stageRequest.findUnique({ where: { id: requestId } });
        if (!request) {
            throw new Error('Demande non trouvée');
        }
        if (!request.requiresSecondCandidateValidation) {
            throw new Error('Validation du second candidat non requise');
        }
        if (request.secondCandidateValidated) {
            return request;
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
        try {
            const stagiaireName = updated.stagiaire?.profile
                ? `${updated.stagiaire.profile.prenom} ${updated.stagiaire.profile.nom}`
                : 'Un stagiaire';
            await this.notificationService.createNotification({
                type: 'info',
                title: 'Nouvelle demande de stage (binôme validé)',
                message: `Une demande de stage binôme a été validée par le second candidat. Code de suivi : ${updated.code_suivi} (Stagiaire: ${stagiaireName})`,
                role: client_1.UserRole.dpaf
            });
            await this.prisma.journalAction.create({
                data: {
                    userId: updated.stagiaireId,
                    action: 'VALIDATION_BINOME',
                    cible: `Validation du second candidat pour la demande ${updated.code_suivi}`
                }
            });
        }
        catch (err) {
            this.logger.error('Erreur lors de la notification après validation du binôme:', err);
        }
        return updated;
    }
    async getSecondCandidateSummary(requestId, opts) {
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
    async refuseSecondCandidate(requestId, validator) {
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
        try {
            await this.prisma.journalAction.create({
                data: {
                    userId: updated.stagiaireId,
                    action: 'REFUS_BINOME',
                    cible: `Refus par le second candidat pour la demande ${updated.code_suivi}`
                }
            });
        }
        catch (err) {
            this.logger.error('Erreur lors du journal après refus du binôme:', err);
        }
        return updated;
    }
    async updateCandidate2Photo(requestId, file) {
        if (!file?.filename) {
            throw new Error('Fichier photo manquant');
        }
        const path = `/uploads/${file.filename}`;
        return this.prisma.stageRequest.update({
            where: { id: requestId },
            data: { candidate2Photo: path, updatedAt: new Date() }
        });
    }
};
exports.StageRequestService = StageRequestService;
exports.StageRequestService = StageRequestService = StageRequestService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        email_service_1.EmailService,
        notification_service_1.NotificationService])
], StageRequestService);
//# sourceMappingURL=stage-request.service.js.map