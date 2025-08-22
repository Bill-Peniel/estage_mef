import axios from 'axios';

const API_URL = 'http://localhost:3002/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true,
  timeout: 10000,
});

// Créer une instance séparée pour les demandes de stage (laisser le navigateur définir la boundary multipart)
const stageRequestApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Accept': 'application/json'
  },
  withCredentials: true,
  timeout: 180000, // 3 minutes pour laisser le backend traiter la création et les notifications
  maxContentLength: 50 * 1024 * 1024, // 50MB
  maxBodyLength: 50 * 1024 * 1024, // 50MB
  retry: 3,
  retryDelay: 1000
});

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log(`Requête ${config.method.toUpperCase()} vers ${config.url}:`, {
    headers: config.headers,
    data: config.data instanceof FormData ? 'FormData' : JSON.stringify(config.data, null, 2)
  });
  return config;
}, (error) => {
  console.error('Erreur de configuration de la requête:', error);
  return Promise.reject(error);
});

// Intercepteur pour l'instance stageRequestApi
stageRequestApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercepteur pour gérer les erreurs avec retry
const setupRetryInterceptor = (axiosInstance) => {
  axiosInstance.interceptors.response.use(null, async (error) => {
    const config = error.config;
    
    // Si la requête a déjà été réessayée ou n'est pas configurée pour le retry
    if (!config || !config.retry || config.__retryCount >= config.retry) {
      return Promise.reject(error);
    }

    // Incrémenter le compteur de tentatives
    config.__retryCount = config.__retryCount || 0;
    config.__retryCount++;

    // Attendre avant de réessayer
    await new Promise(resolve => setTimeout(resolve, config.retryDelay));

    // Réessayer la requête
    return axiosInstance(config);
  });
};

setupRetryInterceptor(api);
setupRetryInterceptor(stageRequestApi);

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Erreur de réponse:', error);
    if (error.code === 'ECONNREFUSED') {
      console.error('Le serveur est inaccessible. Vérifiez que le serveur backend est en cours d\'exécution.');
      return Promise.reject(new Error('Le serveur est inaccessible. Veuillez vérifier que le serveur backend est en cours d\'exécution.'));
    }
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error.response?.data || error.message);
  }
);

// Intercepteur pour les requêtes
api.interceptors.request.use((config) => {
  console.log(`Requête ${config.method.toUpperCase()} vers ${config.url}:`, {
    headers: config.headers,
    data: config.data instanceof FormData ? 'FormData' : JSON.stringify(config.data, null, 2)
  });
  return config;
});

// Intercepteur pour les réponses
api.interceptors.response.use(
  (response) => {
    console.log(`Réponse de ${response.config.url}:`, {
      status: response.status,
      data: JSON.stringify(response.data, null, 2)
    });
    return response;
  },
  (error) => {
    if (error.config) {
      console.error(`Erreur pour ${error.config.url}:`, {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers,
        config: {
          url: error.config.url,
          method: error.config.method,
          headers: error.config.headers,
          data: error.config.data instanceof FormData ? 'FormData' : JSON.stringify(error.config.data, null, 2)
        }
      });
    } else {
      console.error('Erreur de réponse:', error);
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      console.log('Réponse de connexion complète:', JSON.stringify(response.data, null, 2));
      
      // Vérifier la présence du token (access_token ou token)
      const token = response.data.access_token || response.data.token;
      if (!token) {
        throw new Error('Token manquant dans la réponse');
      }

      // Stocker le token
      localStorage.setItem('token', token);
      console.log('Token stocké:', token);
      
      // Extraire et stocker les informations de l'utilisateur
      const userData = response.data.user;
      console.log('Données utilisateur reçues:', JSON.stringify(userData, null, 2));

      if (!userData) {
        throw new Error('Données utilisateur manquantes dans la réponse');
      }

      // Construire l'objet utilisateur
      const user = {
        id: userData.id || userData._id, // Essayer les deux formats possibles d'ID
        email: userData.email,
        name: userData.profile ? 
          `${userData.profile.prenom || ''} ${userData.profile.nom || ''}`.trim() : 
          userData.email,
        role: (userData.role || 'stagiaire').toLowerCase(),
        structureId: userData.structureId || null,
        avatar: userData.profile?.avatar || null
      };

      console.log('Objet utilisateur construit:', user);
      
      // Vérifier que l'ID est présent
      if (!user.id) {
        throw new Error('ID utilisateur manquant');
      }

      // Stocker l'utilisateur
      localStorage.setItem('user', JSON.stringify(user));
      console.log('Utilisateur stocké dans localStorage');
      
      // Vérifier le stockage
      const storedUser = localStorage.getItem('user');
      console.log('Vérification du stockage:', storedUser);
      
      if (!storedUser) {
        throw new Error('Échec du stockage des informations utilisateur');
      }

      return response.data;
    } catch (error) {
      console.error('Erreur de connexion détaillée:', error);
      // Nettoyer le localStorage en cas d'erreur
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      throw error.response?.data || error.message;
    }
  },

  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  logout: () => {
    console.log('Déconnexion - Nettoyage du localStorage');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    try {
      const userStr = localStorage.getItem('user');
      console.log('Données utilisateur brutes:', userStr);
      
      if (!userStr) {
        console.log('Aucun utilisateur trouvé dans le localStorage');
        return null;
      }
      
      const user = JSON.parse(userStr);
      console.log('Utilisateur parsé:', user);
      
      if (!user || !user.id) {
        console.error('Données utilisateur invalides:', user);
        return null;
      }
      
      return user;
    } catch (e) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', e);
      return null;
    }
  },

  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    console.log('État de l\'authentification:', {
      token: token ? 'présent' : 'absent',
      user: user ? 'présent' : 'absent',
      userData: user
    });
    return !!(token && user);
  }
};

// Fonctions pour les tuteurs
export const tuteurService = {
  async createTuteur(tuteurData) {
    const response = await api.post('/tuteurs', tuteurData);
    return response.data;
  },

  async updateTuteur(id, tuteurData) {
    const response = await api.patch(`/tuteurs/${id}`, tuteurData);
    return response.data;
  },

  async deleteTuteur(id) {
    const response = await api.delete(`/tuteurs/${id}`);
    return response.data;
  },

  async getTuteurs() {
    const response = await api.get('/tuteurs');
    return response.data;
  },

  async getMyStructure() {
    const response = await api.get('/tuteurs/my-structure');
    return response.data;
  },

  async getStructures() {
    try {
      const response = await api.get('/structures');
      console.log('Structures reçues:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des structures:', error);
      throw error;
    }
  }
};

export const stageRequestService = {
  async createStageRequest(data) {
    try {
      console.log('Préparation de la requête de stage:', data);
      
      // Vérifier que nous avons un token
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Non authentifié. Veuillez vous connecter.');
      }

      // Créer un objet FormData pour les fichiers
      const formData = new FormData();

      // Ajouter les informations personnelles
      if (data.personalInfo) {
        // envoyer aussi en JSON pour robustesse côté backend
        formData.append('personalInfo', JSON.stringify(data.personalInfo));
        Object.entries(data.personalInfo).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            formData.append(`personalInfo[${key}]`, value);
          }
        });

        // Si binôme et email du candidat 2 présent, l'ajouter explicitement
        try {
          const candidate2Email =
            (Array.isArray(data.personalInfo.groupMembers) && data.personalInfo.groupMembers[0]?.email) ||
            data.personalInfo.candidate2Email ||
            data.personalInfo.partnerEmail ||
            data.personalInfo.binomeEmail;
          if (candidate2Email) {
            formData.append('personalInfo[candidate2Email]', candidate2Email);
            console.log('Email du candidat 2 ajouté au FormData:', candidate2Email);
          }
        } catch (e) {
          console.warn('Impossible d\'ajouter candidate2Email au FormData:', e);
        }
      }

      // Ajouter les informations du stage
      if (data.internshipInfo) {
        formData.append('internshipInfo', JSON.stringify(data.internshipInfo));
        Object.entries(data.internshipInfo).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            formData.append(`internshipInfo[${key}]`, value);
          }
        });
      }

      // Ajouter les documents
      if (data.documents) {
        // Ajouter la photo de profil si elle existe
        if (data.documents.photo) {
          console.log('Photo trouvée dans les documents, conversion en blob...');
          try {
            const photoBlob = await fetch(data.documents.photo).then(r => r.blob());
            formData.append('photo', photoBlob, 'profile-photo.jpg');
            console.log('Photo ajoutée au FormData');
          } catch (error) {
            console.error('Erreur lors de la conversion de la photo:', error);
          }
        }
        
        if (data.documents.cv) formData.append('cv', data.documents.cv);
        if (data.documents.coverLetter) formData.append('coverLetter', data.documents.coverLetter);
        if (data.documents.identityCard) formData.append('identityCard', data.documents.identityCard);
        if (data.documents.universityEnrollment) formData.append('universityEnrollment', data.documents.universityEnrollment);
        if (data.documents.recommendation) formData.append('recommendation', data.documents.recommendation);
        if (data.documents.otherDocuments) {
          data.documents.otherDocuments.forEach((doc, index) => {
            formData.append(`otherDocuments`, doc);
          });
        }
      }

      console.log('FormData préparé:', Object.fromEntries(formData.entries()));

      // Configurer les headers
      const headers = {
        'Authorization': `Bearer ${token}`,
        // Ne pas définir Content-Type, laissez le navigateur le faire avec la boundary
      };

      console.log('Envoi de la requête au serveur...');
      
      // Envoyer la requête avec l'instance stageRequestApi pour multipart
      const response = await stageRequestApi.post(
        '/stage-request',
        formData,
        {
          headers,
          timeout: 60000, // 60 secondes pour les uploads
          maxContentLength: 50 * 1024 * 1024, // 50MB max
          maxBodyLength: 50 * 1024 * 1024,
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            console.log(`Progression de l'upload: ${percentCompleted}%`);
          }
        }
      );

      console.log('Réponse du serveur:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erreur détaillée:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers
      });

      if (error.response) {
        // Le serveur a répondu avec un code d'erreur
        throw new Error(error.response.data.message || 'Erreur lors de la création de la demande');
      } else if (error.request) {
        // La requête a été faite mais pas de réponse
        throw new Error('Le serveur ne répond pas. Veuillez vérifier votre connexion.');
      } else {
        // Erreur lors de la configuration de la requête
        throw new Error('Erreur lors de la préparation de la requête: ' + error.message);
      }
    }
  },

  async getSecondCandidateSummary(id, token) {
    try {
      const response = await api.get(`/stage-request/${id}/summary`, {
        params: token ? { token } : {}
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async validateSecondCandidate(id) {
    try {
      const response = await api.post(`/stage-request/${id}/validate-second`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async refuseSecondCandidate(id) {
    try {
      const response = await api.post(`/stage-request/${id}/refuse-second`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async testConnection() {
    try {
      const response = await api.get('/health');
      return response.data;
    } catch (error) {
      console.error('Erreur de connexion au serveur:', error);
      throw new Error('Impossible de se connecter au serveur. Veuillez vérifier que le serveur est en cours d\'exécution.');
    }
  },

  getMyStageRequests: async () => {
    try {
      const response = await api.get('/stage-request/mes-demandes');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async getStageRequestsForDPAF() {
    try {
      const response = await api.get('/stage-request/dpaf');
      console.log('Réponse brute du serveur pour DPAF:', response.data);
      
      // Construire les URLs complètes pour les documents
      const transformedData = response.data.map(request => {
        return {
          ...request,
          photo: request.photo ? `${request.photo}` : null, // Ajouté pour la photo de profil
          cv: request.cv ? `${request.cv}` : null,
          lettreMotivation: request.lettreMotivation ? `${request.lettreMotivation}` : null,
          carteIdentite: request.carteIdentite ? `${request.carteIdentite}` : null,
          inscriptionUniversitaire: request.inscriptionUniversitaire ? `${request.inscriptionUniversitaire}` : null,
          recommandation: request.recommandation ? `${request.recommandation}` : null,
          autresDocuments: request.autresDocuments ? request.autresDocuments.map(doc => `${doc}`) : []
        };
      });

      return transformedData;
    } catch (error) {
      console.error('Erreur lors de la récupération des demandes:', error);
      throw error;
    }
  },

  async approveStageRequest(requestId) {
    try {
      const response = await api.post(`/stage-request/${requestId}/approve`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async rejectStageRequest(requestId, motif) {
    try {
      const response = await api.post(`/stage-request/${requestId}/reject`, { motif }, {
        timeout: 30000, // Augmenter le timeout à 30 secondes
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors du refus de la demande:', error);
      if (error.code === 'ECONNABORTED') {
        throw new Error('Le serveur met trop de temps à répondre. Veuillez réessayer.');
      }
      throw error.response?.data || error.message;
    }
  },

  async getHistoriqueStagiaires() {
    try {
      const response = await api.get('/stage-request/historique')
      return response.data
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'historique des stagiaires:', error)
      throw error.response?.data?.message || 'Erreur lors de la récupération de l\'historique des stagiaires'
    }
  },

  async terminerStage(stagiaireId) {
    try {
      const response = await api.put(`/stage-request/${stagiaireId}/terminer`)
      return response.data
    } catch (error) {
      console.error('Erreur lors de la finalisation du stage:', error)
      throw error.response?.data?.message || 'Erreur lors de la finalisation du stage'
    }
  },

  async getStatistics() {
    try {
      const response = await api.get('/stage-request/statistics');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async getRecentStageRequests() {
    try {
      const response = await api.get('/stage-request/recent')
      return response.data
    } catch (error) {
      console.error('Erreur lors de la récupération des dernières demandes:', error)
      throw error
    }
  },

  async getStructuresStats() {
    try {
      const response = await api.get('/stage-request/statistics/structures')
      return response
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques des structures:', error)
      throw error
    }
  },

  async getDemandesEvolution() {
    try {
      const response = await api.get('/stage-request/statistics/evolution')
      return response
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'évolution des demandes:', error)
      throw error
    }
  },

  async getGeneralStats() {
    try {
      const response = await api.get('/stage-request/statistics')
      return response
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques générales:', error)
      throw error
    }
  },

  async getTypeStats() {
    try {
      const response = await api.get('/stage-request/statistics/types')
      return response
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques par type:', error)
      throw error
    }
  },

  async getEducationStats() {
    try {
      const response = await api.get('/stage-request/statistics/education')
      return response
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques par niveau:', error)
      throw error
    }
  },

  async checkStageRequestStatus({ code_suivi, email }) {
    return api.post('/stage-request/status', { code_suivi, email })
      .then(res => res.data)
      .catch(err => { throw err; });
  }
};

// Service de notifications
export const notificationService = {
  // Récupérer toutes les notifications
  getNotifications: async () => {
    try {
      const response = await api.get('/notifications')
      return response.data
    } catch (error) {
      console.error('Erreur lors de la récupération des notifications:', error)
      throw error.response?.data?.message || 'Erreur lors de la récupération des notifications'
    }
  },

  // Marquer une notification comme lue
  markAsRead: async (notificationId) => {
    try {
      const response = await api.post(`/notifications/${notificationId}/read`)
      return response.data
    } catch (error) {
      console.error('Erreur lors du marquage comme lu:', error)
      throw error.response?.data?.message || 'Erreur lors du marquage comme lu'
    }
  },

  // Marquer toutes les notifications comme lues
  markAllAsRead: async () => {
    try {
      const response = await api.post('/notifications/read-all')
      return response.data
    } catch (error) {
      console.error('Erreur lors du marquage de toutes les notifications comme lues:', error)
      throw error.response?.data?.message || 'Erreur lors du marquage de toutes les notifications comme lues'
    }
  },

  // Supprimer une notification
  deleteNotification: async (notificationId) => {
    try {
      const response = await api.delete(`/notifications/${notificationId}`)
      return response.data
    } catch (error) {
      console.error('Erreur lors de la suppression de la notification:', error)
      throw error.response?.data?.message || 'Erreur lors de la suppression de la notification'
    }
  }
}

// Fonctions pour les structures
export const structureService = {
  async getStructures() {
    const response = await api.get('/structures');
    return response.data;
  },

  async getSousStructures() {
    const response = await api.get('/structures/sous-structures');
    return response.data;
  },

  async createSousStructure(sousStructureData) {
    try {
      console.log('Création de sous-structure - Données envoyées:', sousStructureData);
      const response = await api.post('/structures', {
        ...sousStructureData,
        type: 'sous-structure',
        isDeleted: false
      });
      return response.data;
    } catch (error) {
      console.error('Création de sous-structure - Erreur:', error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      } else {
        throw new Error('Une erreur est survenue lors de la création de la sous-structure');
      }
    }
  },

  async updateSousStructure(id, sousStructureData) {
    try {
    const response = await api.patch(`/structures/${id}`, sousStructureData);
    return response.data;
    } catch (error) {
      console.error('Mise à jour de sous-structure - Erreur:', error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      } else {
        throw new Error('Une erreur est survenue lors de la mise à jour de la sous-structure');
      }
    }
  },

  async deleteSousStructure(id) {
    try {
    const response = await api.delete(`/structures/${id}`);
    return response.data;
    } catch (error) {
      console.error('Suppression de sous-structure - Erreur:', error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      } else {
        throw new Error('Une erreur est survenue lors de la suppression de la sous-structure');
      }
    }
  },

  async getSousStructures() {
    try {
      const response = await api.get('/structures/sous-structures');
      return response.data;
    } catch (error) {
      console.error('Récupération des sous-structures - Erreur:', error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      } else {
        throw new Error('Une erreur est survenue lors de la récupération des sous-structures');
      }
    }
  },

  async updateStructure(id, structureData) {
    try {
      const response = await api.patch(`/structures/${id}`, structureData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la structure:', error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      } else {
        throw new Error('Une erreur est survenue lors de la mise à jour de la structure');
      }
    }
  }
};

// Service pour les stagiaires
export const stagiaireService = {
  // Récupérer les stagiaires d'une structure
  getStagiairesByStructure: async (structureId) => {
    try {
      const response = await api.get(`/structures/${structureId}/stagiaires`)
      return response.data
    } catch (error) {
      console.error('Erreur lors de la récupération des stagiaires:', error)
      throw error
    }
  },

  // Récupérer les détails d'un stagiaire
  getStagiaireDetails: async (stagiaireId) => {
    try {
      const response = await api.get(`/stagiaires/${stagiaireId}`)
      return response.data
    } catch (error) {
      console.error('Erreur lors de la récupération des détails du stagiaire:', error)
      throw error
    }
  }
}

export const userService = {
  updateEmail: async (email) => {
    try {
      const response = await api.put('/users/email', { email });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'email:', error);
      throw error;
    }
  },

  updatePassword: async (passwordData) => {
    try {
      const response = await api.put('/users/password', passwordData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du mot de passe:', error);
      throw error;
    }
  },

  getUserStructure: async () => {
    try {
      const response = await api.get('/users/structure');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération de la structure:', error);
      throw error;
    }
  },

  async getProfile() {
    const response = await api.get('/users/profile');
    return response.data;
  },

  async updateProfile(data) {
    const response = await api.patch('/users/profile', data);
    return response.data;
  },

  async changePassword(data) {
    const response = await api.patch('/users/change-password', data);
    return response.data;
  },

  async updateNotificationPreferences(data) {
    const response = await api.patch('/users/notification-preferences', data);
    return response.data;
  },

  async uploadAvatar(formData) {
    const response = await api.post('/users/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }
};

export const affectationService = {
  async assignStagiaireToMe(stagiaireId) {
    try {
      const response = await api.post('/affectations', {
        stagiaireId,
        tuteurId: JSON.parse(localStorage.getItem('user')).id
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async assignStagiaireToTuteur(stagiaireId, tuteurId) {
    try {
      const response = await api.post('/affectations', {
        stagiaireId,
        tuteurId
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export const evaluationService = {
  async createEvaluation({ stagiaireId, criteres, commentaire }) {
    const response = await api.post('/evaluations', { stagiaireId, criteres, commentaire });
    return response.data;
  },
  async getEvaluation(stagiaireId) {
    const response = await api.get(`/evaluations/${stagiaireId}`);
    return response.data;
  }
};

export const themeService = {
  async getThemes() {
    const response = await api.get('/themes/mes-themes');
    return response.data;
  },
  async createTheme(data) {
    const response = await api.post('/themes', data);
    return response.data;
  },
  async updateTheme(id, data) {
    const response = await api.put(`/themes/${id}`, data);
    return response.data;
  },
  async deleteTheme(id) {
    const response = await api.delete(`/themes/${id}`);
    return response.data;
  },
  async affecterTheme(id, stagiaireId) {
    const response = await api.post(`/themes/${id}/affecter`, { stagiaireId });
    return response.data;
  }
};

export default api; 

export async function checkStageRequestStatus({ code_suivi, email }) {
  return api.post('/stage-request/status', { code_suivi, email })
    .then(res => res.data)
    .catch(err => { throw err; });
} 