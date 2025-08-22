<template>
  <div class="p-6">
    <h1 class="text-2xl text-green-800 font-bold mb-6">Paramètres</h1>

    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Paramètres généraux -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <h2 class="text-lg font-semibold mb-4">Paramètres généraux</h2>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Durée maximale de stage (mois)
            </label>
            <input type="number" v-model.number="settings.maxDuration" min="1" max="12"
                   class="input-field" :disabled="loading" />
            <p class="text-sm text-gray-500 mt-1">Entre 1 et 12 mois</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Nombre maximum de stagiaires par structure
            </label>
            <input type="number" v-model.number="settings.maxStagiairesPerStructure" min="1"
                   class="input-field" :disabled="loading" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Délai de réponse aux demandes (jours)
            </label>
            <input type="number" v-model.number="settings.responseDelay" min="1"
                   class="input-field" :disabled="loading" />
          </div>
        </div>

        <div class="mt-6">
          <button @click="saveGeneralSettings" 
                  class="btn-primary"
                  :disabled="loading">
            <span v-if="loading" class="mr-2">
              <i class="fas fa-spinner fa-spin"></i>
            </span>
            Enregistrer les modifications
          </button>
        </div>
      </div>

      <!-- Notifications -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <h2 class="text-lg font-semibold mb-4">Paramètres de notification</h2>
        
        <div class="space-y-4">
          <div class="flex items-center">
            <input type="checkbox" v-model="notifications.newRequests"
                   class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                   :disabled="loading" />
            <label class="ml-2 block text-sm text-gray-700">
              Nouvelles demandes de stage
            </label>
          </div>

          <div class="flex items-center">
            <input type="checkbox" v-model="notifications.endingInternships"
                   class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                   :disabled="loading" />
            <label class="ml-2 block text-sm text-gray-700">
              Stages arrivant à terme
            </label>
          </div>

          <div class="flex items-center">
            <input type="checkbox" v-model="notifications.evaluations"
                   class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                   :disabled="loading" />
            <label class="ml-2 block text-sm text-gray-700">
              Nouvelles évaluations
            </label>
          </div>
        </div>

        <div class="mt-6">
          <button @click="saveNotificationSettings" 
                  class="btn-primary"
                  :disabled="loading">
            <span v-if="loading" class="mr-2">
              <i class="fas fa-spinner fa-spin"></i>
            </span>
            Enregistrer les préférences
          </button>
        </div>
      </div>

      <!-- Documents requis -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <h2 class="text-lg font-semibold mb-4">Documents requis</h2>
        
        <div class="space-y-4">
          <div v-for="(doc, index) in requiredDocs" :key="index" class="flex items-center gap-2">
            <input type="text" v-model="doc.name" 
                   class="input-field flex-1"
                   placeholder="Nom du document"
                   :disabled="loading" />
            <button @click="removeDocument(index)" 
                    class="text-red-600 hover:text-red-800"
                    :disabled="loading">
              <i class="fas fa-trash"></i>
            </button>
          </div>

          <button @click="addDocument" 
                  class="btn-outline w-full"
                  :disabled="loading">
            <i class="fas fa-plus mr-2"></i>Ajouter un document
          </button>
        </div>

        <div class="mt-6">
          <button @click="saveDocumentSettings" 
                  class="btn-primary"
                  :disabled="loading">
            <span v-if="loading" class="mr-2">
              <i class="fas fa-spinner fa-spin"></i>
            </span>
            Enregistrer la liste
          </button>
        </div>
      </div>

      <!-- Périodes de stage -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <h2 class="text-lg font-semibold mb-4">Périodes de stage</h2>
        
        <div class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Date de début
              </label>
              <input type="date" v-model="periodSettings.startDate" 
                     class="input-field"
                     :disabled="loading" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Date de fin
              </label>
              <input type="date" v-model="periodSettings.endDate" 
                     class="input-field"
                     :disabled="loading" />
            </div>
          </div>

          <div class="flex items-center">
            <input type="checkbox" v-model="periodSettings.allowFlexibleDates"
                   class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                   :disabled="loading" />
            <label class="ml-2 block text-sm text-gray-700">
              Autoriser les dates flexibles
            </label>
          </div>
        </div>

        <div class="mt-6">
          <button @click="savePeriodSettings" 
                  class="btn-primary"
                  :disabled="loading">
            <span v-if="loading" class="mr-2">
              <i class="fas fa-spinner fa-spin"></i>
            </span>
            Enregistrer les périodes
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import { settingsService } from '@/services/settings.service'

export default {
  name: 'Parametres',
  setup() {
    const toast = useToast()
    const loading = ref(false)

    const settings = ref({
      maxDuration: 6,
      maxStagiairesPerStructure: 5,
      responseDelay: 7
    })

    const notifications = ref({
      newRequests: true,
      endingInternships: true,
      evaluations: true
    })

    const requiredDocs = ref([
      { name: 'Lettre de motivation' },
      { name: 'CV' },
      { name: 'Carte étudiant' }
    ])

    const periodSettings = ref({
      startDate: '',
      endDate: '',
      allowFlexibleDates: false
    })

    const fetchSettings = async () => {
      try {
        loading.value = true
        const data = await settingsService.getSettings()
        
        // Mettre à jour les paramètres avec les données reçues
        if (data.general) {
          settings.value = data.general
        }
        if (data.notifications) {
          notifications.value = data.notifications
        }
        if (data.documents) {
          requiredDocs.value = data.documents
        }
        if (data.periods) {
          periodSettings.value = data.periods
        }
      } catch (error) {
        console.error('Erreur lors du chargement des paramètres:', error)
        toast.error('Erreur lors du chargement des paramètres')
      } finally {
        loading.value = false
      }
    }

    const addDocument = () => {
      requiredDocs.value.push({ name: '' })
    }

    const removeDocument = (index) => {
      requiredDocs.value.splice(index, 1)
    }

    const saveGeneralSettings = async () => {
      try {
        loading.value = true
        await settingsService.updateGeneralSettings(settings.value)
        toast.success('Paramètres généraux mis à jour avec succès')
      } catch (error) {
        console.error('Erreur lors de la sauvegarde des paramètres généraux:', error)
        toast.error('Erreur lors de la sauvegarde des paramètres généraux')
      } finally {
        loading.value = false
      }
    }

    const saveNotificationSettings = async () => {
      try {
        loading.value = true
        await settingsService.updateNotificationSettings(notifications.value)
        toast.success('Paramètres de notification mis à jour avec succès')
      } catch (error) {
        console.error('Erreur lors de la sauvegarde des paramètres de notification:', error)
        toast.error('Erreur lors de la sauvegarde des paramètres de notification')
      } finally {
        loading.value = false
      }
    }

    const saveDocumentSettings = async () => {
      try {
        loading.value = true
        // Filtrer les documents vides
        const validDocuments = requiredDocs.value.filter(doc => doc.name.trim() !== '')
        await settingsService.updateRequiredDocuments(validDocuments)
        toast.success('Liste des documents mise à jour avec succès')
      } catch (error) {
        console.error('Erreur lors de la sauvegarde des documents requis:', error)
        toast.error('Erreur lors de la sauvegarde des documents requis')
      } finally {
        loading.value = false
      }
    }

    const savePeriodSettings = async () => {
      try {
        loading.value = true
        await settingsService.updatePeriodSettings(periodSettings.value)
        toast.success('Périodes de stage mises à jour avec succès')
      } catch (error) {
        console.error('Erreur lors de la sauvegarde des périodes:', error)
        toast.error('Erreur lors de la sauvegarde des périodes')
      } finally {
        loading.value = false
      }
    }

    onMounted(() => {
      fetchSettings()
    })

    return {
      settings,
      notifications,
      requiredDocs,
      periodSettings,
      loading,
      addDocument,
      removeDocument,
      saveGeneralSettings,
      saveNotificationSettings,
      saveDocumentSettings,
      savePeriodSettings
    }
  }
}
</script>
