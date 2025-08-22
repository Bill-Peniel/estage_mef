import api from './api'

const STORAGE_KEY = 'dpaf_settings'

const defaultSettings = {
  general: {
    maxDuration: 6,
    maxStagiairesPerStructure: 5,
    responseDelay: 7
  },
  notifications: {
    newRequests: true,
    endingInternships: true,
    evaluations: true
  },
  documents: [
    { name: 'Lettre de motivation' },
    { name: 'CV' },
    { name: 'Carte étudiant' }
  ],
  periods: {
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(new Date().getFullYear(), 11, 31).toISOString().split('T')[0],
    allowFlexibleDates: false
  }
}

export const settingsService = {
  async getSettings() {
    try {
      // Récupérer les paramètres du localStorage
      const storedSettings = localStorage.getItem(STORAGE_KEY)
      if (storedSettings) {
        return JSON.parse(storedSettings)
      }
      
      // Si aucun paramètre n'est stocké, retourner les valeurs par défaut
      return defaultSettings
    } catch (error) {
      console.error('Erreur lors de la récupération des paramètres:', error)
      return defaultSettings
    }
  },

  async updateGeneralSettings(settings) {
    try {
      // Récupérer les paramètres actuels
      const currentSettings = await this.getSettings()
      
      // Mettre à jour les paramètres généraux
      const updatedSettings = {
        ...currentSettings,
        general: settings
      }
      
      // Sauvegarder dans le localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSettings))
      
      return { success: true, data: settings }
    } catch (error) {
      console.error('Erreur lors de la mise à jour des paramètres généraux:', error)
      throw error
    }
  },

  async updateNotificationSettings(settings) {
    try {
      // Récupérer les paramètres actuels
      const currentSettings = await this.getSettings()
      
      // Mettre à jour les paramètres de notification
      const updatedSettings = {
        ...currentSettings,
        notifications: settings
      }
      
      // Sauvegarder dans le localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSettings))
      
      return { success: true, data: settings }
    } catch (error) {
      console.error('Erreur lors de la mise à jour des paramètres de notification:', error)
      throw error
    }
  },

  async updateRequiredDocuments(documents) {
    try {
      // Récupérer les paramètres actuels
      const currentSettings = await this.getSettings()
      
      // Mettre à jour les documents requis
      const updatedSettings = {
        ...currentSettings,
        documents: documents
      }
      
      // Sauvegarder dans le localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSettings))
      
      return { success: true, data: documents }
    } catch (error) {
      console.error('Erreur lors de la mise à jour des documents requis:', error)
      throw error
    }
  },

  async updatePeriodSettings(settings) {
    try {
      // Récupérer les paramètres actuels
      const currentSettings = await this.getSettings()
      
      // Mettre à jour les périodes
      const updatedSettings = {
        ...currentSettings,
        periods: settings
      }
      
      // Sauvegarder dans le localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSettings))
      
      return { success: true, data: settings }
    } catch (error) {
      console.error('Erreur lors de la mise à jour des périodes:', error)
      throw error
    }
  },

  // Méthode pour réinitialiser les paramètres aux valeurs par défaut
  resetSettings() {
    localStorage.removeItem(STORAGE_KEY)
    return defaultSettings
  }
} 