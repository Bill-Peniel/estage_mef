<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Tableau de bord</h1>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>

    <!-- Stats Cards -->
    <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="bg-white rounded-lg p-6 shadow-sm">
        <div class="flex items-center">
          <div class="rounded-full p-3 bg-primary-light">
            <i class="fas fa-users text-primary text-xl"></i>
          </div>
          <div class="ml-4">
            <h4 class="text-gray-500 text-sm">Total Stagiaires</h4>
            <div class="flex items-baseline">
              <p class="text-2xl font-semibold">{{ stats.totalStagiaires || 0 }}</p>
              <p class="text-green-500 text-sm ml-2">+{{ stats.tauxEvaluation || 0 }}%</p>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg p-6 shadow-sm">
        <div class="flex items-center">
          <div class="rounded-full p-3 bg-blue-100">
            <i class="fas fa-user-graduate text-blue-600 text-xl"></i>
          </div>
          <div class="ml-4">
            <h4 class="text-gray-500 text-sm">Stagiaires Actifs</h4>
            <div class="flex items-baseline">
              <p class="text-2xl font-semibold">{{ stats.stagiairesActifs || 0 }}</p>
              <span class="text-sm text-gray-500 ml-2">En cours</span>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg p-6 shadow-sm">
        <div class="flex items-center">
          <div class="rounded-full p-3 bg-green-100">
            <i class="fas fa-check-circle text-green-600 text-xl"></i>
          </div>
          <div class="ml-4">
            <h4 class="text-gray-500 text-sm">Stages Terminés</h4>
            <div class="flex items-baseline">
              <p class="text-2xl font-semibold">{{ stats.stagiairesTermines || 0 }}</p>
              <span class="text-sm text-gray-500 ml-2">{{ stats.tauxCompletion || 0 }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="bg-white rounded-lg shadow-sm">
      <div class="p-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Activités Récentes</h2>
        <div v-if="activities.length === 0" class="text-center py-8 text-gray-500">
          <i class="fas fa-inbox text-4xl mb-4"></i>
          <p>Aucune activité récente</p>
            </div>
        <div v-else class="space-y-4">
          <div v-for="activity in activities" :key="`${activity.type}-${activity.date}`" class="flex items-center p-4 border rounded-lg">
            <div :class="`rounded-full ${activity.color} p-2`">
              <i :class="activity.icon"></i>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium">{{ activity.title }}</p>
              <p class="text-xs text-gray-500">{{ activity.description }}</p>
              <p class="text-xs text-gray-400">{{ formatDate(activity.date) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import { getTuteurOverview, getTuteurActivities } from '@/services/api/statistics.service.js'

export default {
  name: 'Overview',
  setup() {
    const store = useStore()
    const loading = ref(true)
    const stats = ref({})
    const activities = ref([])
    const error = ref(null)

    const formatDate = (dateString) => {
      const date = new Date(dateString)
      const now = new Date()
      const diffTime = Math.abs(now - date)
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      
      if (diffDays === 1) return 'Il y a 1 jour'
      if (diffDays < 7) return `Il y a ${diffDays} jours`
      if (diffDays < 30) return `Il y a ${Math.floor(diffDays / 7)} semaines`
      return `Il y a ${Math.floor(diffDays / 30)} mois`
    }

    const fetchDashboardData = async () => {
      try {
        loading.value = true
        const tuteurId = store.state.user?.id
        
        if (!tuteurId) {
          throw new Error('ID du tuteur non trouvé')
        }

        // Récupérer les statistiques et activités en parallèle
        const [statsData, activitiesData] = await Promise.all([
          getTuteurOverview(tuteurId),
          getTuteurActivities(tuteurId)
        ])

        stats.value = statsData
        activities.value = activitiesData
      } catch (err) {
        console.error('Erreur lors du chargement du tableau de bord:', err)
        error.value = 'Erreur lors du chargement des données'
      } finally {
        loading.value = false
      }
    }

    onMounted(() => {
      fetchDashboardData()
    })

    return {
      loading,
      stats,
      activities,
      error,
      formatDate
    }
  }
}
</script>
