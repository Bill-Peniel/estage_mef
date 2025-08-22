<template>
  <div class="bg-white shadow rounded-lg relative top-16">
    <div class="px-6 py-4 border-b border-gray-200">
      <h2 class="text-xl font-semibold text-gray-800">Paramètres</h2>
    </div>

    <div class="p-6">
      <!-- Paramètres généraux -->
      <div class="mb-8">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Paramètres généraux</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Nom de l'application</label>
            <input type="text" v-model="settings.appName" class="mt-1 input-field" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Email de contact</label>
            <input type="email" v-model="settings.contactEmail" class="mt-1 input-field" />
          </div>
        </div>
      </div>

      <!-- Paramètres des notifications -->
      <div class="mb-8">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Notifications</h3>
        <div class="space-y-4">
          <div class="flex items-center">
            <input type="checkbox" v-model="settings.emailNotifications" class="h-4 w-4 text-primary border-gray-300 rounded" />
            <label class="ml-2 block text-sm text-gray-900">Activer les notifications par email</label>
          </div>
          <div class="flex items-center">
            <input type="checkbox" v-model="settings.smsNotifications" class="h-4 w-4 text-primary border-gray-300 rounded" />
            <label class="ml-2 block text-sm text-gray-900">Activer les notifications par SMS</label>
          </div>
        </div>
      </div>

      <!-- Paramètres des stages -->
      <div class="mb-8">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Paramètres des stages</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Durée maximale d'un stage (en mois)</label>
            <input type="number" v-model="settings.maxInternshipDuration" class="mt-1 input-field" min="1" max="12" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Délai de traitement maximal (en jours)</label>
            <input type="number" v-model="settings.maxProcessingTime" class="mt-1 input-field" min="1" max="30" />
          </div>
        </div>
      </div>

      <!-- Boutons d'action -->
      <div class="flex justify-end space-x-3">
        <button @click="resetSettings" class="btn-outline">
          Réinitialiser
        </button>
        <button @click="saveSettings" class="btn-primary">
          Enregistrer les modifications
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'Parametres',
  setup() {
    const store = useStore()
    
    const settings = ref({
      appName: 'Gestion des Stages',
      contactEmail: 'contact@ministere.bj',
      emailNotifications: true,
      smsNotifications: false,
      maxInternshipDuration: 6,
      maxProcessingTime: 7
    })

    const saveSettings = async () => {
      try {
        // Implémenter la sauvegarde des paramètres
        console.log('Saving settings:', settings.value)
        // await store.dispatch('saveSettings', settings.value)
      } catch (error) {
        console.error('Error saving settings:', error)
      }
    }

    const resetSettings = () => {
      // Réinitialiser les paramètres aux valeurs par défaut
      settings.value = {
        appName: 'Gestion des Stages',
        contactEmail: 'contact@ministere.bj',
        emailNotifications: true,
        smsNotifications: false,
        maxInternshipDuration: 6,
        maxProcessingTime: 7
      }
    }

    return {
      settings,
      saveSettings,
      resetSettings
    }
  }
}
</script> 