<template>
  <div class="space-y-6">
    <!-- En-tête -->
    <div class="bg-white rounded-lg shadow p-6">
      <h2 class="text-2xl font-bold text-gray-900">Paramètres</h2>
      <p class="text-gray-600 mt-2">
        Configurez les paramètres de votre compte et de votre structure
      </p>
    </div>

    <!-- Paramètres de notification -->
    <div class="bg-white rounded-lg shadow p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Paramètres de notification</h3>
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <label class="text-sm font-medium text-gray-700">Notifications par email</label>
            <p class="text-sm text-gray-500">Recevoir des notifications par email</p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" v-model="settings.emailNotifications" class="sr-only peer">
            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div class="flex items-center justify-between">
          <div>
            <label class="text-sm font-medium text-gray-700">Notifications push</label>
            <p class="text-sm text-gray-500">Recevoir des notifications push dans le navigateur</p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" v-model="settings.pushNotifications" class="sr-only peer">
            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div class="flex items-center justify-between">
          <div>
            <label class="text-sm font-medium text-gray-700">Rapports automatiques</label>
            <p class="text-sm text-gray-500">Générer des rapports automatiques mensuels</p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" v-model="settings.autoReports" class="sr-only peer">
            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>
    </div>

    <!-- Paramètres de sécurité -->
    <div class="bg-white rounded-lg shadow p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Paramètres de sécurité</h3>
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Changer le mot de passe</label>
          <button
            @click="showPasswordModal = true"
            class="mt-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg"
          >
            Modifier le mot de passe
          </button>
        </div>

        <div class="flex items-center justify-between">
          <div>
            <label class="text-sm font-medium text-gray-700">Authentification à deux facteurs</label>
            <p class="text-sm text-gray-500">Activer l'authentification à deux facteurs pour plus de sécurité</p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" v-model="settings.twoFactorAuth" class="sr-only peer">
            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>
    </div>

    <!-- Paramètres de la structure -->
    <div class="bg-white rounded-lg shadow p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Paramètres de la structure</h3>
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Visibilité des stagiaires</label>
          <select v-model="settings.stagiaireVisibility" class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary focus:border-primary">
            <option value="all">Tous les stagiaires</option>
            <option value="own">Uniquement mes stagiaires</option>
            <option value="none">Aucun stagiaire</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Fréquence des rapports</label>
          <select v-model="settings.reportFrequency" class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary focus:border-primary">
            <option value="weekly">Hebdomadaire</option>
            <option value="monthly">Mensuel</option>
            <option value="quarterly">Trimestriel</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Bouton de sauvegarde -->
    <div class="flex justify-end">
      <button
        @click="saveSettings"
        class="px-6 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg"
      >
        Sauvegarder les paramètres
      </button>
    </div>

    <!-- Modal de changement de mot de passe -->
    <div v-if="showPasswordModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-medium text-gray-900">Changer le mot de passe</h3>
            <button @click="showPasswordModal = false" class="text-gray-400 hover:text-gray-600">
              <i class="fas fa-times"></i>
            </button>
          </div>

          <form @submit.prevent="changePassword" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Mot de passe actuel</label>
              <input
                v-model="passwordForm.currentPassword"
                type="password"
                required
                class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Nouveau mot de passe</label>
              <input
                v-model="passwordForm.newPassword"
                type="password"
                required
                class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Confirmer le nouveau mot de passe</label>
              <input
                v-model="passwordForm.confirmPassword"
                type="password"
                required
                class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>

            <div class="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                @click="showPasswordModal = false"
                class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                type="submit"
                class="px-4 py-2 bg-primary border border-transparent rounded-md text-sm font-medium text-white hover:bg-primary-dark"
              >
                Changer le mot de passe
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'StructureDirectionnelleParametres',
  setup() {
    const store = useStore()
    const showPasswordModal = ref(false)

    const settings = reactive({
      emailNotifications: true,
      pushNotifications: true,
      autoReports: false,
      twoFactorAuth: false,
      stagiaireVisibility: 'all',
      reportFrequency: 'monthly'
    })

    const passwordForm = reactive({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    })

    const loadSettings = () => {
      // Ici vous pouvez charger les paramètres depuis l'API
      // Pour l'instant, on utilise des valeurs par défaut
    }

    const saveSettings = async () => {
      try {
        // Ici vous pouvez sauvegarder les paramètres via l'API
        store.dispatch('setNotification', {
          type: 'success',
          message: 'Paramètres sauvegardés avec succès'
        })
      } catch (error) {
        console.error('Erreur lors de la sauvegarde des paramètres:', error)
        store.dispatch('setNotification', {
          type: 'error',
          message: 'Erreur lors de la sauvegarde des paramètres'
        })
      }
    }

    const changePassword = async () => {
      if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        store.dispatch('setNotification', {
          type: 'error',
          message: 'Les mots de passe ne correspondent pas'
        })
        return
      }

      try {
        // Ici vous pouvez changer le mot de passe via l'API
        store.dispatch('setNotification', {
          type: 'success',
          message: 'Mot de passe changé avec succès'
        })
        
        showPasswordModal.value = false
        passwordForm.currentPassword = ''
        passwordForm.newPassword = ''
        passwordForm.confirmPassword = ''
      } catch (error) {
        console.error('Erreur lors du changement de mot de passe:', error)
        store.dispatch('setNotification', {
          type: 'error',
          message: 'Erreur lors du changement de mot de passe'
        })
      }
    }

    onMounted(() => {
      loadSettings()
    })

    return {
      settings,
      showPasswordModal,
      passwordForm,
      saveSettings,
      changePassword
    }
  }
}
</script>

