import { createStore } from 'vuex'
import { authService, stageRequestService, userService } from '../services/api'
import tutor from './modules/tutor'
import sousStructure from './modules/sousStructure'

export default createStore({
  state: {
    // User information
    user: null,
    
    // Utilisateurs prédéfinis pour le test (simulation de base de données)
    predefinedUsers: [
      {
        id: 'admin-1',
        email: 'adminestagefinances@gmail.com',
        password: 'Myadmin2025',
        name: 'Administrateur',
        role: 'admin'
      },
      {
        id: 'dpaf-1',
        email: 'dpaf@dpaf.com',
        password: 'dpaf2025',
        name: 'Direction du Personnel Administratif et Financier',
        role: 'dpaf'
      },
      {
        id: 'strc-1',
        email: 'strc@strc.com',
        password: 'strc2025',
        name: 'Structure de Stage',
        role: 'structure'
      },
      {
        id: 'tuteur-1',
        email: 'tuteur@tuteur.com',
        password: 'tuteur2025',
        name: 'Tuteur de Stage',
        role: 'tuteur'
      },
      {
        id: 'stg-1',
        email: 'stg@stg.com',
        password: 'stg2025',
        name: 'Stagiaire Test',
        role: 'stagiaire'
      }
    ],
    
    // Application form data
    applicationForm: {
      // Step 1: Personal Information
      personalInfo: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        dateOfBirth: '',
        nationality: '',
        gender: '',
        educationLevel: '',
        profilePhoto: ''
      },
      
      // Step 2: Internship Information
      internshipInfo: {
        internshipType: '',
        department: '',
        startDate: '',
        endDate: '',
        universityName: '',
        studyField: ''
      },
      
      // Step 3: Document Upload
      documents: {
        cv: null,
        coverLetter: null,
        identityCard: null,
        universityEnrollment: null,
        recommendation: null,
        otherDocuments: [],
        groupMembersDocuments: []
      },
      
      // Current step in the application process (1-4)
      currentStep: 1,
      
      // Whether submission is in progress
      isSubmitting: false,
      
      // Submission result
      submissionResult: null
    },
    stageRequests: [],
    currentStageRequest: null
  },
  
  mutations: {
    updatePersonalInfo(state, personalInfo) {
      console.log('Mise à jour des infos personnelles:', personalInfo);
      state.applicationForm.personalInfo = {
        ...state.applicationForm.personalInfo,
        ...personalInfo
      }
      console.log('State mis à jour:', state.applicationForm.personalInfo);
    },
    
    updateInternshipInfo(state, internshipInfo) {
      state.applicationForm.internshipInfo = {
        ...state.applicationForm.internshipInfo,
        ...internshipInfo
      }
    },
    
    updateDocuments(state, documents) {
      console.log('Mise à jour des documents:', documents)
      // S'assurer que les fichiers sont correctement stockés
      state.applicationForm.documents = {
        ...documents,
        cv: documents.cv instanceof File ? documents.cv : null,
        coverLetter: documents.coverLetter instanceof File ? documents.coverLetter : null,
        identityCard: documents.identityCard instanceof File ? documents.identityCard : null,
        universityEnrollment: documents.universityEnrollment instanceof File ? documents.universityEnrollment : null,
        recommendation: documents.recommendation instanceof File ? documents.recommendation : null,
        otherDocuments: Array.isArray(documents.otherDocuments) ? documents.otherDocuments.filter(doc => doc instanceof File) : [],
        groupMembersDocuments: Array.isArray(documents.groupMembersDocuments) ? documents.groupMembersDocuments.map(member => ({
          ...member,
          cv: member.cv instanceof File ? member.cv : null,
          coverLetter: member.coverLetter instanceof File ? member.coverLetter : null,
          recommendation: member.recommendation instanceof File ? member.recommendation : null
        })) : []
      }
    },
    
    setCurrentStep(state, step) {
      state.applicationForm.currentStep = step
    },
    
    nextStep(state) {
      if (state.applicationForm.currentStep < 4) {
        state.applicationForm.currentStep++
      }
    },
    
    previousStep(state) {
      if (state.applicationForm.currentStep > 1) {
        state.applicationForm.currentStep--
      }
    },
    
    resetApplicationForm(state) {
      state.applicationForm = {
        personalInfo: {
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          address: '',
          city: '',
          dateOfBirth: '',
          nationality: '',
          gender: '',
          educationLevel: '',
          profilePhoto: ''
        },
        internshipInfo: {
          internshipType: '',
          department: '',
          startDate: '',
          endDate: '',
          universityName: '',
          studyField: ''
        },
        documents: {
          cv: null,
          coverLetter: null,
          identityCard: null,
          universityEnrollment: null,
          recommendation: null,
          otherDocuments: [],
          groupMembersDocuments: []
        },
        currentStep: 1,
        isSubmitting: false,
        submissionResult: null
      }
    },
    
    setSubmitting(state, isSubmitting) {
      state.applicationForm.isSubmitting = isSubmitting
    },
    
    setSubmissionResult(state, result) {
      state.applicationForm.submissionResult = result
    },
    
    setUser(state, user) {
      state.user = {
        ...user,
        structureId: user.structureId || null,
        avatar: user.avatar || null
      }
      // Mettre à jour le localStorage
      localStorage.setItem('user', JSON.stringify(state.user))
    },
    
    clearUser(state) {
      state.user = null
    },
    
    setStageRequests(state, requests) {
      state.stageRequests = requests;
    },
    setCurrentStageRequest(state, request) {
      state.currentStageRequest = request;
    }
  },
  
  actions: {
    async submitApplication({ commit, state }) {
      try {
        commit('setSubmitting', true);
        
        // Vérifier l'authentification
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');
        
        if (!token || !userStr) {
          throw new Error('Vous devez être connecté pour soumettre une demande');
        }

        // Récupérer l'utilisateur connecté
        let user;
        try {
          user = JSON.parse(userStr);
        } catch (e) {
          throw new Error('Erreur lors de la récupération des informations utilisateur');
        }

        if (!user || !user.id) {
          throw new Error('Informations utilisateur invalides');
        }

        // Vérifier que les documents sont des fichiers
        if (!state.applicationForm.documents.cv || !(state.applicationForm.documents.cv instanceof File)) {
          throw new Error('Le CV est requis et doit être un fichier valide');
        }
        if (!state.applicationForm.documents.coverLetter || !(state.applicationForm.documents.coverLetter instanceof File)) {
          throw new Error('La lettre de motivation est requise et doit être un fichier valide');
        }

        // Préparer les données à envoyer
        const requestData = {
          stagiaireId: user.id,
          personalInfo: state.applicationForm.personalInfo,
          internshipInfo: state.applicationForm.internshipInfo,
          documents: {
            photo: state.applicationForm.personalInfo.profilePhoto,
            cv: state.applicationForm.documents.cv,
            coverLetter: state.applicationForm.documents.coverLetter,
            identityCard: state.applicationForm.documents.identityCard,
            universityEnrollment: state.applicationForm.documents.universityEnrollment,
            recommendation: state.applicationForm.documents.recommendation,
            otherDocuments: state.applicationForm.documents.otherDocuments
          }
        };

        console.log('Données à envoyer:', {
          photo: state.applicationForm.personalInfo.profilePhoto ? 'PRÉSENTE' : 'ABSENTE',
          photoLength: state.applicationForm.personalInfo.profilePhoto ? state.applicationForm.personalInfo.profilePhoto.length : 0
        });

        // Envoyer la requête à l'API
        const response = await stageRequestService.createStageRequest(requestData);

        commit('setSubmissionResult', {
          success: true,
          message: response.message || 'Votre demande de stage a été soumise avec succès.',
          applicationId: response.data?.codeUnique
        });

        return response;
      } catch (error) {
        console.error('Erreur lors de la soumission:', error);
        commit('setSubmissionResult', {
          success: false,
          message: error.message || 'Une erreur est survenue lors de la soumission de votre demande.'
        });
        throw error;
      } finally {
        commit('setSubmitting', false);
      }
    },
    
    login({ commit }, credentials) {
      return new Promise((resolve, reject) => {
        authService.login(credentials)
          .then(response => {
            const user = {
              id: response.user.id,
              email: response.user.email,
              name: `${response.user.profile.prenom} ${response.user.profile.nom}`,
              role: response.user.role.toLowerCase(),
              structureId: response.user.structureId,
              avatar: response.user.profile?.avatar || null
            }
            // Stocker le token dans le localStorage
            localStorage.setItem('token', response.access_token)
            localStorage.setItem('user', JSON.stringify(user))
            commit('setUser', user)
            resolve(user)
          })
          .catch(error => {
            console.error('Login error:', error)
            reject(new Error('Identifiants incorrects. Veuillez réessayer.'))
          })
      })
    },
    
    logout({ commit }) {
      return new Promise((resolve) => {
        // Supprimer le token du localStorage
        localStorage.removeItem('token')
        commit('clearUser')
        resolve()
      })
    },
    
    register({ commit }, userData) {
      return new Promise((resolve, reject) => {
        console.log('Registering user with data:', userData)
        authService.register({
          email: userData.email,
          password: userData.password,
          role: 'stagiaire',
          nom: userData.lastName,
          prenom: userData.firstName,
          telephone: userData.phone,
          adresse: ''
        })
        .then(response => {
          console.log('Registration response:', response)
          const user = {
            id: response.id,
            email: response.email,
            name: `${response.profile.prenom} ${response.profile.nom}`,
            role: response.role.toLowerCase()
          }
          commit('setUser', user)
          resolve(user)
        })
        .catch(error => {
          console.error('Registration error:', error)
          reject(error)
        })
      })
    },
    
    async fetchMyStageRequests({ commit }) {
      try {
        const requests = await stageRequestService.getMyStageRequests();
        commit('setStageRequests', requests);
        return requests;
      } catch (error) {
        console.error('Error fetching stage requests:', error);
        throw error;
      }
    },

    async fetchStageRequestsForDPAF({ commit }) {
      try {
        const requests = await stageRequestService.getStageRequestsForDPAF();
        commit('setStageRequests', requests);
        return requests;
      } catch (error) {
        console.error('Error fetching stage requests for DPAF:', error);
        throw error;
      }
    },

    async fetchUserProfile({ commit, state }) {
      try {
        const profile = await userService.getProfile();
        // On suppose que le state.user existe déjà (sinon, il faut le compléter)
        const user = {
          ...state.user,
          name: `${profile.prenom} ${profile.nom}`,
          email: profile.email,
          avatar: profile.avatar || null,
          telephone: profile.telephone || null
        };
        commit('setUser', user);
        localStorage.setItem('user', JSON.stringify(user));
        return user;
      } catch (error) {
        console.error('Erreur lors de la récupération du profil utilisateur:', error);
        throw error;
      }
    }
  },
  
  getters: {
    isAuthenticated: state => !!state.user,
    currentUser: state => state.user,
    applicationProgress: state => {
      const steps = 4
      return (state.applicationForm.currentStep / steps) * 100
    },
    // Getters pour vérifier le rôle de l'utilisateur
    isAdmin: state => state.user && state.user.role === 'admin',
    isDpaf: state => state.user && state.user.role === 'dpaf',
    isStructure: state => state.user && state.user.role === 'structure',
    isTuteur: state => state.user && state.user.role === 'tuteur',
    isStagiaire: state => state.user && state.user.role === 'stagiaire',
    isStructureDirectionnelle: state => state.user && state.user.role === 'structure' && state.user.structure?.type === 'directionnelle',
    isStructureTechnique: state => state.user && state.user.role === 'structure' && state.user.structure?.type === 'technique',
    // Permet de vérifier si l'utilisateur a accès à un tableau de bord administratif
    hasAdminAccess: state => {
      if (!state.user) return false;
      return ['admin', 'dpaf', 'structure', 'tuteur'].includes(state.user.role);
    },
    // Retourne le nom du rôle en français pour l'affichage
    roleDisplay: state => {
      if (!state.user) return '';
      
      switch (state.user.role) {
        case 'admin': return 'Administrateur';
        case 'dpaf': return 'DPAF';
        case 'structure': 
          if (state.user.structure?.type === 'directionnelle') return 'Responsable Structure Directionnelle';
          if (state.user.structure?.type === 'technique') return 'Responsable Structure Technique';
          return 'Responsable Structure';
        case 'tuteur': return 'Tuteur';
        case 'stagiaire': return 'Stagiaire';
        default: return 'Utilisateur';
      }
    }
  },
  modules: {
    tutor,
    sousStructure
  }
})
