<template>
  <div class="p-8 min-h-screen affectation-bg">
    <div class="bg-white p-4 rounded-lg shadow-md">
    <h1 class="text-2xl font-bold mb-2">Affectation de mes stagiaires</h1>
    <p class="mb-2 text-gray-700 flex items-center">
      <i class="fas fa-user-circle text-primary text-xl mr-2"></i>
      Connecté en tant que <span class="font-semibold text-primary ml-1">{{ currentTuteurName }}</span>
    </p>
    <p class="mb-6 text-gray-700">Vous pouvez réaffecter vos stagiaires à un autre membre de la structure.</p>

    <!-- Snackbar notification -->
    <transition name="snackbar-fade">
      <div v-if="feedback.message" :class="['snackbar', feedback.success ? 'snackbar-success' : 'snackbar-error']">
        <i :class="feedback.success ? 'fas fa-check-circle' : 'fas fa-exclamation-triangle'" class="mr-2"></i>
        {{ feedback.message }}
      </div>
    </transition>

    <div>
      <h2 class="text-lg font-semibold mb-2">Mes stagiaires</h2>
      <ul v-if="assignedInterns.length">
        <li v-for="stagiaire in assignedInterns" :key="stagiaire.id" class="py-2 border-b flex flex-col md:flex-row md:items-center md:justify-between gap-2 bg-white bg-opacity-80 rounded-lg transition hover:shadow-lg hover:bg-blue-50/80 group">
          <div>
            <span class="font-medium text-gray-900 group-hover:text-primary transition">{{ stagiaire.name }}</span>
            <span class="text-gray-500"> ({{ stagiaire.email }})</span>
            <span class="ml-2 text-xs text-gray-500">{{ stagiaire.status }}</span>
          </div>
          <div class="flex items-center gap-2">
            <select v-model="selectedTuteur[stagiaire.id]" class="border border-primary rounded px-2 py-1 focus:ring-2 focus:ring-primary focus:border-primary transition">
              <option disabled value="">Affecter à...</option>
              <option v-for="tuteur in filteredTuteurs" :key="tuteur.id" :value="tuteur.id">
                {{ tuteur.nom }}
              </option>
            </select>
            <button @click="confirmAssign(stagiaire.id)" :disabled="!selectedTuteur[stagiaire.id] || loading[stagiaire.id]" class="px-3 py-1 bg-primary text-white rounded shadow hover:bg-primary-dark disabled:opacity-50 flex items-center transition">
              <span v-if="loading[stagiaire.id]" class="loader mr-2"></span>
              Réaffecter
            </button>
          </div>
        </li>
      </ul>
      <p v-else class="text-gray-400">Aucun stagiaire affecté pour le moment.</p>
    </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { useStore } from 'vuex'
import { affectationService, tuteurService } from '@/services/api'

export default {
  name: 'AffectationTuteur',
  setup() {
    const store = useStore()
    const assignedInterns = ref([])
    const tuteurs = ref([])
    const selectedTuteur = ref({})
    const loading = ref({})
    const feedback = ref({ message: '', success: true })
    const currentTuteur = ref(null)
    let snackbarTimeout = null

    const fetchAssignedInterns = async () => {
      const result = await store.dispatch('tutor/getAssignedInterns')
      assignedInterns.value = result || []
    }

    const fetchTuteurs = async () => {
      try {
        const res = await tuteurService.getTuteurs()
        tuteurs.value = res.data || res
      } catch (e) {
        tuteurs.value = []
      }
    }

    const getCurrentTuteur = () => {
      const userStr = localStorage.getItem('user')
      if (!userStr) return null
      try {
        return JSON.parse(userStr)
      } catch {
        return null
      }
    }

    const currentTuteurId = computed(() => getCurrentTuteur()?.id)
    const currentTuteurName = computed(() => getCurrentTuteur()?.name || 'Inconnu')

    const filteredTuteurs = computed(() => tuteurs.value.filter(t => t.id !== currentTuteurId.value))

    const showSnackbar = (msg, success = true) => {
      feedback.value = { message: msg, success }
      if (snackbarTimeout) clearTimeout(snackbarTimeout)
      snackbarTimeout = setTimeout(() => { feedback.value.message = '' }, 3500)
    }

    const assignToTuteur = async (stagiaireId) => {
      const tuteurId = selectedTuteur.value[stagiaireId]
      if (!tuteurId) return
      loading.value[stagiaireId] = true
      try {
        await affectationService.assignStagiaireToTuteur(stagiaireId, tuteurId)
        showSnackbar('Stagiaire réaffecté avec succès !', true)
        await fetchAssignedInterns()
        selectedTuteur.value[stagiaireId] = ''
      } catch (e) {
        showSnackbar(e.message || 'Erreur lors de la réaffectation', false)
      }
      loading.value[stagiaireId] = false
    }

    const confirmAssign = (stagiaireId) => {
      const tuteurId = selectedTuteur.value[stagiaireId]
      const tuteurNom = tuteurs.value.find(t => t.id === tuteurId)?.nom || 'ce tuteur'
      if (!tuteurId) return
      if (window.confirm(`Voulez-vous vraiment réaffecter ce stagiaire à ${tuteurNom} ?`)) {
        assignToTuteur(stagiaireId)
      }
    }

    onMounted(() => {
      fetchAssignedInterns()
      fetchTuteurs()
    })

    return {
      assignedInterns,
      tuteurs,
      selectedTuteur,
      assignToTuteur,
      confirmAssign,
      feedback,
      filteredTuteurs,
      loading,
      currentTuteurName
    }
  }
}
</script>

<style scoped>
.affectation-bg {
  background: gray-300;
}
.snackbar {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  min-width: 260px;
  max-width: 350px;
  z-index: 9999;
  display: flex;
  align-items: center;
  padding: 1rem 1.5rem;
  border-radius: 0.75rem;
  font-weight: 500;
  box-shadow: 0 4px 24px 0 rgba(30,66,159,0.12);
  font-size: 1rem;
  opacity: 0.98;
}
.snackbar-success {
  background: #e6f9f0;
  color: #0e9f6e;
  border-left: 5px solid #0e9f6e;
}
.snackbar-error {
  background: #fef2f2;
  color: #e02424;
  border-left: 5px solid #e02424;
}
.snackbar-fade-enter-active, .snackbar-fade-leave-active {
  transition: all 0.4s cubic-bezier(.4,0,.2,1);
}
.snackbar-fade-enter-from, .snackbar-fade-leave-to {
  opacity: 0;
  transform: translateY(40px);
}
.loader {
  border: 2px solid #f3f3f3;
  border-top: 2px solid #3498db;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  animation: spin 1s linear infinite;
  display: inline-block;
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style> 