<template>
  <div class="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow">
    <h1 class="text-2xl font-bold mb-4">Validation de la demande binôme</h1>
    <div v-if="loading" class="text-gray-500">Chargement...</div>
    <div v-else-if="error" class="text-red-600">{{ error }}</div>
    <div v-else>
      <div class="space-y-2">
        <p><strong>Code suivi:</strong> {{ summary.codeSuivi }}</p>
        <p><strong>Type:</strong> {{ summary.type }}</p>
        <p><strong>Département:</strong> {{ summary.departement }}</p>
        <p><strong>Dates:</strong> {{ formatDate(summary.dateDebut) }} → {{ formatDate(summary.dateFin) }}</p>
        <p><strong>Université:</strong> {{ summary.universite }}</p>
        <p><strong>Domaine:</strong> {{ summary.domaineEtude }}</p>
        <p><strong>Candidat principal:</strong> {{ summary.stagiaire }}</p>
        <p v-if="summary.secondCandidateValidated" class="text-green-600 font-medium">Déjà validée</p>
      </div>
      <div class="mt-6 flex gap-3">
        <button class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700" @click="onValidate" :disabled="actionLoading">
          Valider
        </button>
        <button class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700" @click="onRefuse" :disabled="actionLoading">
          Refuser
        </button>
      </div>
      <p v-if="actionMessage" class="mt-4" :class="actionError ? 'text-red-600' : 'text-green-700'">{{ actionMessage }}</p>
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { stageRequestService } from '@/services/api'

export default {
  name: 'ValidateBinome',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const summary = ref(null)
    const loading = ref(true)
    const error = ref('')
    const actionLoading = ref(false)
    const actionMessage = ref('')
    const actionError = ref(false)

    const requestId = route.params.id
    const token = route.query.token

    const loadSummary = async () => {
      try {
        loading.value = true
        const res = await stageRequestService.getSecondCandidateSummary(requestId, token)
        summary.value = res.data
      } catch (e) {
        error.value = e?.message || 'Impossible de charger la demande'
      } finally {
        loading.value = false
      }
    }

    const onValidate = async () => {
      try {
        actionLoading.value = true
        const res = await stageRequestService.validateSecondCandidate(requestId)
        actionMessage.value = res.message || 'Validation enregistrée'
        actionError.value = false
        await loadSummary()
      } catch (e) {
        actionMessage.value = e?.message || 'Erreur lors de la validation'
        actionError.value = true
      } finally {
        actionLoading.value = false
      }
    }

    const onRefuse = async () => {
      try {
        actionLoading.value = true
        const res = await stageRequestService.refuseSecondCandidate(requestId)
        actionMessage.value = res.message || 'Refus enregistré'
        actionError.value = false
        // Optionnel: rediriger après refus
        // router.push('/')
      } catch (e) {
        actionMessage.value = e?.message || 'Erreur lors du refus'
        actionError.value = true
      } finally {
        actionLoading.value = false
      }
    }

    const formatDate = (d) => new Date(d).toLocaleDateString()

    onMounted(loadSummary)

    return { summary, loading, error, onValidate, onRefuse, actionLoading, actionMessage, actionError, formatDate }
  }
}
</script>

<style scoped>
</style>


