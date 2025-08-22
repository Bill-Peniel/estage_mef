<template>
  <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="bg-white shadow-lg rounded-lg overflow-hidden">
      <div class="p-6">
        <h1 class="text-2xl font-bold text-gray-900 mb-6">Vérifier le statut de votre demande</h1>
        
        <!-- Formulaire de recherche -->
        <form @submit.prevent="checkStatus" class="space-y-6">
          <div class="form-group">
            <label for="requestId" class="form-label">Numéro de la demande</label>
            <input
              id="requestId"
              v-model="requestId"
              type="text"
              class="input-field"
              placeholder="Ex: STG001"
              required
            />
            <p class="text-sm text-gray-500 mt-1">
              Entrez le numéro de demande qui vous a été communiqué lors de votre soumission
            </p>
          </div>
          
          <div class="form-group">
            <label for="email" class="form-label">Email</label>
            <input
              id="email"
              v-model="email"
              type="email"
              class="input-field"
              placeholder="Votre adresse email"
              required
            />
          </div>
          
          <div>
            <button type="submit" class="btn-primary w-full" :disabled="loading">
              <span v-if="loading">
                <i class="fas fa-circle-notch fa-spin mr-2"></i>
                Recherche en cours...
              </span>
              <span v-else>Vérifier le statut</span>
            </button>
          </div>
        </form>

        <!-- Résultat de la recherche -->
        <div v-if="status" class="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Statut de la demande</h2>
          
          <div class="space-y-4">
            <div class="flex items-center justify-between py-3 border-b border-gray-200">
              <span class="text-gray-600">Numéro de demande</span>
              <span class="font-medium">{{ status.requestId }}</span>
            </div>
            
            <div class="flex items-center justify-between py-3 border-b border-gray-200">
              <span class="text-gray-600">Date de soumission</span>
              <span class="font-medium">{{ formatDate(status.submissionDate) }}</span>
            </div>
            
            <div class="flex items-center justify-between py-3 border-b border-gray-200">
              <span class="text-gray-600">Statut actuel</span>
              <span :class="getStatusClass()">{{ getStatusLabel() }}</span>
            </div>
            
            <div class="flex items-center justify-between py-3 border-b border-gray-200">
              <span class="text-gray-600">Structure</span>
              <span class="font-medium">{{ status.structure }}</span>
            </div>
            
            <div v-if="status.lastUpdate" class="mt-6">
              <h3 class="text-sm font-semibold text-gray-900 mb-2">Dernière mise à jour</h3>
              <p class="text-gray-600">{{ status.lastUpdate }}</p>
            </div>
          </div>
        </div>

        <!-- Message d'erreur -->
        <div v-if="error" class="mt-4 p-4 bg-red-50 rounded-md">
          <div class="flex">
            <div class="flex-shrink-0">
              <i class="fas fa-exclamation-circle text-red-400"></i>
            </div>
            <div class="ml-3">
              <p class="text-sm text-red-700">{{ error }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { checkStageRequestStatus } from '../services/api.js'

export default {
  name: 'Status',
  setup() {
    const requestId = ref('')
    const email = ref('')
    const loading = ref(false)
    const status = ref(null)
    const error = ref('')

    const checkStatus = async () => {
      loading.value = true
      error.value = ''
      status.value = null
      try {
        const res = await checkStageRequestStatus({ code_suivi: requestId.value, email: email.value })
        status.value = {
          requestId: res.requestId,
          submissionDate: res.submissionDate,
          status: res.status?.toLowerCase(),
          structure: res.structure,
          lastUpdate: res.lastUpdate ? new Date(res.lastUpdate).toLocaleString('fr-FR') : ''
        }
      } catch (e) {
        error.value = e?.message || 'Impossible de trouver la demande avec les informations fournies.'
      } finally {
        loading.value = false
      }
    }

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    }

    const getStatusClass = () => {
      const classes = {
        en_attente: 'text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full text-sm',
        en_cours: 'text-blue-600 bg-blue-100 px-2 py-1 rounded-full text-sm',
        approuve: 'text-green-600 bg-green-100 px-2 py-1 rounded-full text-sm',
        validee: 'text-green-600 bg-green-100 px-2 py-1 rounded-full text-sm',
        refuse: 'text-red-600 bg-red-100 px-2 py-1 rounded-full text-sm',
        rejetee: 'text-red-600 bg-red-100 px-2 py-1 rounded-full text-sm',
        termine: 'text-gray-600 bg-gray-100 px-2 py-1 rounded-full text-sm'
      }
      return classes[status.value?.status] || ''
    }

    const getStatusLabel = () => {
      const labels = {
        en_attente: 'En attente',
        en_cours: 'En cours de traitement',
        approuve: 'Approuvée',
        validee: 'Validée',
        refuse: 'Refusée',
        rejetee: 'Refusée',
        termine: 'Terminée'
      }
      return labels[status.value?.status] || status.value?.status
    }

    return {
      requestId,
      email,
      loading,
      status,
      error,
      checkStatus,
      formatDate,
      getStatusClass,
      getStatusLabel
    }
  }
}
</script> 