<template>
  <div class="p-6">
    <h1 class="text-2xl text-slate-800 font-bold mb-6">Statistiques Détaillées</h1>
    
    <!-- Statistiques générales -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

    <!-- Graphiques -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <!-- Evolution mensuelle -->
      <div class="bg-white p-6 rounded-lg shadow-sm">
        <h3 class="text-lg font-semibold mb-4">Évolution mensuelle des stages</h3>
        <canvas ref="monthlyChart" height="300"></canvas>
      </div>

      <!-- Répartition par type -->
      <div class="bg-white p-6 rounded-lg shadow-sm">
        <h3 class="text-lg font-semibold mb-4">Répartition par type de stage</h3>
        <canvas ref="typeChart" height="300"></canvas>
      </div>
    </div>

    <!-- Statistiques détaillées -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Par structure -->
      <div class="bg-white p-6 rounded-lg shadow-sm">
        <h3 class="text-lg font-semibold mb-4">Répartition par structure</h3>
        <div class="space-y-4">
          <div v-for="structure in structureStats" :key="structure.name" class="flex items-center">
            <div class="flex-1">
              <div class="flex justify-between mb-1">
                <span class="text-sm font-medium">{{ structure.name }}</span>
                <span class="text-sm text-gray-600">{{ structure.count }} stagiaires</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="bg-blue-600 h-2 rounded-full" :style="{ width: structure.percentage + '%' }"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Par niveau d'études -->
      <div class="bg-white p-6 rounded-lg shadow-sm">
        <h3 class="text-lg font-semibold mb-4">Répartition par niveau d'études</h3>
        <canvas ref="educationChart" height="300"></canvas>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import Chart from 'chart.js/auto'
import { stageRequestService } from '@/services/api'
import { useToast } from 'vue-toastification'

export default {
  name: 'Statistiques',
  setup() {
    const toast = useToast()
    const monthlyChart = ref(null)
    const typeChart = ref(null)
    const educationChart = ref(null)
    const charts = ref({ monthly: null, type: null, education: null })

    const generalStats = ref([
      {
        title: 'Total des stages',
        value: '0',
        trend: 0,
        icon: 'fas fa-users',
        iconColor: 'bg-blue-100 text-blue-600'
      },
      {
        title: 'Stages en cours',
        value: '0',
        trend: 0,
        icon: 'fas fa-clock',
        iconColor: 'bg-green-100 text-green-600'
      },
      {
        title: 'Taux de completion',
        value: '0%',
        trend: 0,
        icon: 'fas fa-check-circle',
        iconColor: 'bg-yellow-100 text-yellow-600'
      },
      {
        title: 'Taux de satisfaction',
        value: '0/5',
        trend: 0,
        icon: 'fas fa-star',
        iconColor: 'bg-purple-100 text-purple-600'
      }
    ])

    const structureStats = ref([])

    const destroyChart = (chartKey) => {
      if (charts.value[chartKey]) {
        charts.value[chartKey].destroy()
        charts.value[chartKey] = null
      }
    }

    const fetchGeneralStats = async () => {
      try {
        const response = await stageRequestService.getGeneralStats()
        const stats = response.data

        generalStats.value = [
          {
            title: 'Total des stages',
            value: stats.total?.toString() || '0',
            trend: stats.trend || 0,
            icon: 'fas fa-users',
            iconColor: 'bg-blue-100 text-blue-600'
          },
          {
            title: 'Stages en cours',
            value: stats.enCours?.toString() || '0',
            trend: stats.trendEnCours || 0,
            icon: 'fas fa-clock',
            iconColor: 'bg-green-100 text-green-600'
          },
          {
            title: 'Taux de completion',
            value: `${stats.tauxCompletion || 0}%`,
            trend: stats.trendCompletion || 0,
            icon: 'fas fa-check-circle',
            iconColor: 'bg-yellow-100 text-yellow-600'
          },
          {
            title: 'Taux de satisfaction',
            value: `${stats.tauxSatisfaction || 0}/5`,
            trend: stats.trendSatisfaction || 0,
            icon: 'fas fa-star',
            iconColor: 'bg-purple-100 text-purple-600'
          }
        ]
      } catch (error) {
        console.error('Erreur lors de la récupération des statistiques générales:', error)
        toast.error('Erreur lors du chargement des statistiques générales')
      }
    }

    const fetchStructureStats = async () => {
      try {
        const response = await stageRequestService.getStructuresStats()
        const structures = response.data || []
        const total = structures.reduce((sum, structure) => sum + (structure.count || 0), 0)
        
        structureStats.value = structures.map(structure => ({
          name: structure.nom || 'Structure inconnue',
          count: structure.count || 0,
          percentage: total > 0 ? Math.round(((structure.count || 0) / total) * 100) : 0
        }))
      } catch (error) {
        console.error('Erreur lors de la récupération des statistiques des structures:', error)
        toast.error('Erreur lors du chargement des statistiques des structures')
      }
    }

    const initMonthlyChart = async () => {
      try {
        destroyChart('monthly')
        const response = await stageRequestService.getDemandesEvolution()
        const evolutionData = response.data || []
        
        charts.value.monthly = new Chart(monthlyChart.value, {
        type: 'line',
        data: {
            labels: evolutionData.map(item => {
              const date = new Date(item.month)
              return date.toLocaleDateString('fr-FR', { month: 'short' })
            }),
          datasets: [{
            label: 'Nouveaux stages',
              data: evolutionData.map(item => item.count || 0),
            borderColor: '#3B82F6',
            tension: 0.4
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top'
            }
          }
        }
      })
      } catch (error) {
        console.error('Erreur lors de l\'initialisation du graphique mensuel:', error)
        toast.error('Erreur lors du chargement des données mensuelles')
      }
    }

    const initTypeChart = async () => {
      try {
        destroyChart('type')
        const response = await stageRequestService.getTypeStats()
        const typeData = response.data || []
        
        charts.value.type = new Chart(typeChart.value, {
        type: 'doughnut',
        data: {
            labels: typeData.map(item => item.type || 'Type inconnu'),
          datasets: [{
              data: typeData.map(item => item.count || 0),
            backgroundColor: ['#3B82F6', '#10B981', '#8B5CF6']
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'right'
            }
          }
        }
      })
      } catch (error) {
        console.error('Erreur lors de l\'initialisation du graphique des types:', error)
        toast.error('Erreur lors du chargement des données des types')
      }
    }

    const initEducationChart = async () => {
      try {
        destroyChart('education')
        const response = await stageRequestService.getEducationStats()
        const educationData = response.data || []
        
        charts.value.education = new Chart(educationChart.value, {
        type: 'bar',
        data: {
            labels: educationData.map(item => item.niveau || 'Niveau inconnu'),
          datasets: [{
            label: 'Nombre de stagiaires',
              data: educationData.map(item => item.count || 0),
            backgroundColor: '#60A5FA'
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: false
            }
          }
        }
      })
      } catch (error) {
        console.error('Erreur lors de l\'initialisation du graphique des niveaux:', error)
        toast.error('Erreur lors du chargement des données des niveaux')
      }
    }

    onMounted(async () => {
      await Promise.all([
        fetchGeneralStats(),
        fetchStructureStats(),
        initMonthlyChart(),
        initTypeChart(),
        initEducationChart()
      ])
    })

    onBeforeUnmount(() => {
      Object.keys(charts.value).forEach(key => destroyChart(key))
    })

    return {
      generalStats,
      structureStats,
      monthlyChart,
      typeChart,
      educationChart
    }
  }
}
</script>
