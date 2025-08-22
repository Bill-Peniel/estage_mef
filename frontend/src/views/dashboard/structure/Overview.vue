<template>
  <div class="p-6">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div v-for="stat in generalStats" :key="stat.title" 
           class="bg-white p-6 rounded-lg shadow-sm">
        <div class="flex justify-between items-center">
          <div>
            <p class="text-sm text-gray-600">{{ stat.title }}</p>
            <h2 class="text-3xl font-bold mt-2">{{ stat.value }}</h2>
            <p class="text-sm mt-2" :class="stat.trend >= 0 ? 'text-green-600' : 'text-red-600'">
              <i :class="stat.trend >= 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></i>
              {{ Math.abs(stat.trend) }}% depuis le mois dernier
            </p>
          </div>
          <div :class="stat.iconColor" class="p-4 rounded-full">
            <i :class="stat.icon" class="text-2xl"></i>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <div class="bg-white p-6 rounded-lg shadow-sm">
        <h3 class="text-lg font-semibold mb-4">Évolution mensuelle des stagiaires</h3>
        <canvas ref="monthlyChart" height="300"></canvas>
      </div>

      <div class="bg-white p-6 rounded-lg shadow-sm">
        <h3 class="text-lg font-semibold mb-4">Répartition par type de stage</h3>
        <canvas ref="typeChart" height="300"></canvas>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="bg-white p-6 rounded-lg shadow-sm">
        <h3 class="text-lg font-semibold mb-4">Répartition par tuteur</h3>
        <div class="space-y-4">
          <div v-for="tuteur in tuteurStats" :key="tuteur.name" class="flex items-center">
            <div class="flex-1">
              <div class="flex justify-between mb-1">
                <span class="text-sm font-medium">{{ tuteur.name }}</span>
                <span class="text-sm text-gray-600">{{ tuteur.count }} stagiaires</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="bg-blue-600 h-2 rounded-full" :style="{ width: tuteur.percentage + '%' }"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow-sm">
        <h3 class="text-lg font-semibold mb-4">Répartition par niveau d'études</h3>
        <canvas ref="educationChart" height="300"></canvas>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import Chart from 'chart.js/auto'
import { getStructureOverview, getTuteursStats } from '@/services/api/statistics.service.js'

export default {
  name: 'StructureOverview',
  setup() {
    const store = useStore()
    const monthlyChart = ref(null)
    const typeChart = ref(null)
    const educationChart = ref(null)
    const generalStats = ref([])
    const tuteurStats = ref([])

    onMounted(async () => {
      const structureId = store.state.user?.structureId
      if (!structureId) return
      const stats = await getStructureOverview(structureId)

      // Cartes
      generalStats.value = [
      {
        title: 'Total des stagiaires',
          value: stats.general.total,
          trend: stats.general.trend,
        icon: 'fas fa-users',
        iconColor: 'bg-blue-100 text-blue-600'
      },
      {
        title: 'Tuteurs actifs',
          value: stats.tuteurs.length,
          trend: 0,
        icon: 'fas fa-chalkboard-teacher',
        iconColor: 'bg-green-100 text-green-600'
      },
      {
        title: 'Taux de completion',
          value: stats.general.tauxCompletion + '%',
          trend: stats.general.trendCompletion,
        icon: 'fas fa-check-circle',
        iconColor: 'bg-yellow-100 text-yellow-600'
      },
      {
        title: 'Taux de satisfaction',
          value: stats.general.tauxSatisfaction + '/5',
          trend: stats.general.trendSatisfaction,
        icon: 'fas fa-star',
        iconColor: 'bg-purple-100 text-purple-600'
      }
      ]

      // Récupérer les tuteurs et stagiaires par tuteur
      const tuteurs = await getTuteursStats(structureId)
      const totalStagiaires = tuteurs.reduce((sum, t) => sum + t.count, 0)
      tuteurStats.value = tuteurs.map(t => ({
        name: t.nom,
        count: t.count,
        percentage: totalStagiaires ? Math.round((t.count / totalStagiaires) * 100) : 0
      }))

      // Graphiques
      new Chart(monthlyChart.value, {
        type: 'bar',
        data: {
          labels: stats.evolution.map(e => e.month),
          datasets: [{
            label: 'Nombre de stagiaires',
            data: stats.evolution.map(e => e.count),
            backgroundColor: '#3B82F6'
          }]
        }
      })

      new Chart(typeChart.value, {
        type: 'doughnut',
        data: {
          labels: stats.types.map(t => t.type),
          datasets: [{
            data: stats.types.map(t => t.count),
            backgroundColor: ['#3B82F6', '#10B981', '#8B5CF6']
          }]
        }
      })

      new Chart(educationChart.value, {
        type: 'bar',
        data: {
          labels: stats.education.map(e => e.niveau),
          datasets: [{
            label: 'Nombre de stagiaires',
            data: stats.education.map(e => e.count),
            backgroundColor: '#60A5FA'
          }]
        }
      })
    })

    return {
      generalStats,
      tuteurStats,
      monthlyChart,
      typeChart,
      educationChart
    }
  }
}
</script>