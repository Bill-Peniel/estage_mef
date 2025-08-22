<template>
  <div class="min-h-screen bg-gray-100 flex flex-col">
    <header class="bg-slate-800 shadow-md shadow-[0_4px_6px_-1px_rgba(0,0,0,0.6)] fixed top-0 w-full z-20">
      <div class="px-4 py-4 flex justify-between items-center">
        <div class="flex items-center gap-4">
          <img src="@/assets/finance-logo1.png" alt="Logo du ministère" class="h-12 w-auto" />
          <h1 class="text-2xl font-bold text-white">DPAF - Gestion des Stages</h1>
        </div>
        <div class="flex items-center space-x-4">
          <span class="text-white">{{ store.getters.roleDisplay }}</span>
          <NotificationDropdown />
          <div class="relative" ref="userMenu">
            <button @click="toggleUserMenu" class="flex items-center space-x-3 focus:outline-none">
              <div class="w-8 h-8 border-primary rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition">
                <span class="text-sm font-medium">{{ userInitials }}</span>
              </div>
            </button>
            <div v-show="showUserMenu" class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
              <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                <i class="fas fa-user mr-2"></i> Mon profil
              </a>
              <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                <i class="fas fa-cog mr-2"></i> Paramètres
              </a>
              <button @click="logout" class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                <i class="fas fa-sign-out-alt mr-2"></i> Déconnexion
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>

    <div class="flex pt-16">
      <Sidebar class="fixed left-0 top-20 h-[calc(100vh-4rem)] z-10" />

      <div class="flex-1 md:ml-64 p-6 bg-gray-50">
        <router-view v-if="$route.path !== '/dashboard/dpaf'" />
        <div v-else>
          <!-- Message d'erreur -->
          <div v-if="error" class="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {{ error }}
          </div>

          <!-- Loading spinner -->
          <div v-if="loading" class="flex justify-center items-center py-8">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>

          <!-- Statistiques -->
          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div class="bg-white text-gray-800 rounded-lg p-6 shadow-sm border border-gray-100">
              <div class="flex justify-between items-center">
                <div class="w-full">
                  <p class="text-sm text-gray-600">Nouvelles demandes</p>
                  <h2 class="text-4xl font-bold mb-2 text-gray-800">{{ stats.nouveaux }}</h2>
                  <div class="w-full bg-gray-100 rounded-full h-2.5">
                    <div 
                      class="bg-blue-500 h-2.5 rounded-full animate-progress" 
                      :style="{ width: `${(stats.nouveaux / stats.total) * 100}%` }"
                    ></div>
                  </div>
                </div>
                <div class="text-3xl text-blue-700">
                  <i class="fas fa-file-alt"></i>
                </div>
              </div>
              <p class="mt-4 text-sm">
                <router-link to="/dashboard/dpaf/nouvelles-demandes" class="text-blue-800 hover:text-blue-500">
                  Voir les demandes <i class="fas fa-arrow-right ml-1"></i>
                </router-link>
              </p>
            </div>

            <div class="bg-white text-gray-800 rounded-lg p-6 shadow-sm border border-gray-100">
              <div class="flex justify-between items-center">
                <div class="w-full">
                  <p class="text-sm text-gray-600">Stages en cours</p>
                  <h2 class="text-4xl font-bold mb-2 text-gray-800">{{ stats.enCours }}</h2>
                  <div class="w-full bg-gray-100 rounded-full h-2.5">
                    <div 
                      class="bg-blue-500 h-2.5 rounded-full animate-progress" 
                      :style="{ width: `${(stats.enCours / stats.total) * 100}%` }"
                    ></div>
                  </div>
                </div>
                <div class="text-3xl text-blue-700">
                  <i class="fas fa-user-graduate"></i>
                </div>
              </div>
              <p class="mt-4 text-sm">
                <router-link to="/dashboard/dpaf/affectations" class="text-blue-800 hover:text-blue-500">
                  Voir les stages <i class="fas fa-arrow-right ml-1"></i>
                </router-link>
              </p>
            </div>

            <div class="bg-white text-gray-800 rounded-lg p-6 shadow-sm border border-gray-100">
              <div class="flex justify-between items-center">
                <div class="w-full">
                  <p class="text-sm text-gray-600">Stages terminés</p>
                  <h2 class="text-4xl font-bold mb-2 text-gray-800">{{ stats.confirmes }}</h2>
                  <div class="w-full bg-gray-100 rounded-full h-2.5">
                    <div 
                      class="bg-blue-500 h-2.5 rounded-full animate-progress" 
                      :style="{ width: `${(stats.confirmes / stats.total) * 100}%` }"
                    ></div>
                  </div>
                </div>
                <div class="text-3xl text-blue-700">
                  <i class="fas fa-check-circle"></i>
                </div>
              </div>
              <p class="mt-4 text-sm">
                <router-link to="/dashboard/dpaf/historique" class="text-blue-800 hover:text-blue-500">
                  Voir l'historique <i class="fas fa-arrow-right ml-1"></i>
                </router-link>
              </p>
            </div>

            <div class="bg-white text-gray-800 rounded-lg p-6 shadow-sm border border-gray-100">
              <div class="flex justify-between items-center">
                <div class="w-full">
                  <p class="text-sm text-gray-600">Demandes refusées</p>
                  <h2 class="text-4xl font-bold mb-2 text-gray-800">{{ stats.refuses }}</h2>
                  <div class="w-full bg-gray-100 rounded-full h-2.5">
                    <div 
                      class="bg-blue-500 h-2.5 rounded-full animate-progress" 
                      :style="{ width: `${(stats.refuses / stats.total) * 100}%` }"
                    ></div>
                  </div>
                </div>
                <div class="text-3xl text-blue-700">
                  <i class="fas fa-times-circle"></i>
                </div>
              </div>
              <p class="mt-4 text-sm">
                <router-link to="/dashboard/dpaf/historique" class="text-blue-800 hover:text-blue-500">
                  Voir les refus <i class="fas fa-arrow-right ml-1"></i>
                </router-link>
              </p>
            </div>
          </div>

          <!-- Graphiques -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div class="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
              <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-semibold text-gray-800">Répartition par structure</h3>
                <button class="text-gray-400 hover:text-gray-600">
                  <i class="fas fa-ellipsis-v"></i>
                </button>
              </div>
              <div class="relative h-80">
                <canvas ref="donutChart" class="w-full h-full"></canvas>
              </div>
            </div>

            <div class="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
              <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-semibold text-gray-800">Évolution des demandes</h3>
                <button class="text-gray-400 hover:text-gray-600">
                  <i class="fas fa-ellipsis-v"></i>
                </button>
              </div>
              <canvas ref="barChart" class="max-h-80"></canvas>
            </div>
          </div>

          <!-- Liste des dernières demandes -->
          <div class="bg-white shadow rounded-lg">
            <div class="px-4 py-5 border-b border-gray-200 sm:px-6">
              <h2 class="text-lg font-medium text-gray-900">Dernières demandes reçues</h2>
            </div>
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stagiaire</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Structure Demandée</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type de Stage</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date Soumission</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="demande in recentDemandes" :key="demande.id" class="hover:bg-gray-50">
                    <td class="px-6 py-4">
                      <div class="text-sm text-gray-900">{{ demande.nom }}</div>
                      <div class="text-sm text-gray-500">{{ demande.email }}</div>
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-500">{{ demande.structure }}</td>
                    <td class="px-6 py-4 text-sm text-gray-500">{{ demande.typeStage }}</td>
                    <td class="px-6 py-4 text-sm text-gray-500">{{ formatDate(demande.dateSoumission) }}</td>
                    <td class="px-6 py-4">
                      <span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                            :class="getStatusClass(demande.status)">
                        {{ getStatusLabel(demande.status) }}
                      </span>
                    </td>
                    <td class="px-6 py-4 text-sm font-medium space-x-2">
                      <button @click="viewDetails(demande)" class="text-primary hover:text-primary-dark">
                        <i class="fas fa-eye"></i>
                      </button>
                      <button v-if="canConfirm(demande)" @click="confirmDemande(demande)"
                              class="text-success hover:text-green-700">
                        <i class="fas fa-check"></i>
                      </button>
                      <button v-if="canReject(demande)" @click="rejectDemande(demande)"
                              class="text-danger hover:text-red-700">
                        <i class="fas fa-times"></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import Chart from 'chart.js/auto'
import Sidebar from '../../components/SidebarDpaf.vue'
import NotificationDropdown from '../../components/NotificationDropdown.vue'
import { stageRequestService } from '@/services/api'
import { useToast } from 'vue-toastification'
import axios from 'axios'

export default {
  name: 'DpafDashboard',
  components: {
    Sidebar,
    NotificationDropdown
  },
  setup() {
    const store = useStore()
    const router = useRouter()
    const showUserMenu = ref(false)
    const showNotifMenu = ref(false)
    const userMenu = ref(null)
    const notifMenu = ref(null)
    const unreadNotifications = ref(2)
    const toast = useToast()

    const notifications = ref([
      {
        id: 1,
        type: 'info',
        title: 'Nouvelle demande',
        message: 'Une nouvelle demande de stage a été soumise',
        date: new Date(),
        read: false
      },
      {
        id: 2,
        type: 'warning',
        title: 'Rappel',
        message: 'Évaluation de stage en attente',
        date: new Date(Date.now() - 3600000),
        read: true
      }
    ])

    const getNotificationTypeClass = (type) => {
      const classes = {
        info: 'bg-blue-100 text-blue-600',
        success: 'bg-green-100 text-green-600',
        warning: 'bg-yellow-100 text-yellow-600',
        error: 'bg-red-100 text-red-600'
      }
      return classes[type] || classes.info
    }

    const getNotificationIcon = (type) => {
      const icons = {
        info: 'fa-info',
        success: 'fa-check',
        warning: 'fa-exclamation',
        error: 'fa-times'
      }
      return icons[type] || icons.info
    }

    const formatNotifDate = (date) => {
      return new Date(date).toLocaleDateString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    const toggleNotifMenu = () => {
      showNotifMenu.value = !showNotifMenu.value
      if (showUserMenu.value) showUserMenu.value = false
    }

    const markAllAsRead = () => {
      notifications.value.forEach(notif => {
        notif.read = true
      })
      unreadNotifications.value = 0
    }

    const userInitials = computed(() => {
      const user = store.state.user
      if (!user || !user.name) return '' // Handle potential undefined user.name
      return user.name.charAt(0).toUpperCase()
    })

    const toggleUserMenu = () => {
      showUserMenu.value = !showUserMenu.value
    }

    // Close menu when clicking outside
    onMounted(() => {
      document.addEventListener('click', (e) => {
        if (userMenu.value && !userMenu.value.contains(e.target)) {
          showUserMenu.value = false
        }
        if (notifMenu.value && !notifMenu.value.contains(e.target)) {
          showNotifMenu.value = false
        }
      })
    })
    const donutChart = ref(null)
    const barChart = ref(null)
    const charts = ref({ donut: null, bar: null, stats: null })

    const destroyChart = (chartKey) => {
      if (charts.value[chartKey]) {
        charts.value[chartKey].destroy()
        charts.value[chartKey] = null
      }
    }

    const initChart = async (data) => {
      if (!donutChart.value) {
        console.error('Canvas element not found')
        return
      }

      try {
        // Détruire le graphique existant avant d'en créer un nouveau
        destroyChart('stats')

        // Préparer les données pour le graphique
        const labels = ['Nouveaux', 'En cours', 'Confirmés', 'Refusés']
        const values = [
          data.nouveaux || 0,
          data.enCours || 0,
          data.confirmes || 0,
          data.refuses || 0
        ]
        const backgroundColors = [
          '#FF6384', // Nouveaux - Rouge
          '#36A2EB', // En cours - Bleu
          '#4BC0C0', // Confirmés - Vert
          '#FFCE56'  // Refusés - Jaune
        ]

        const ctx = donutChart.value.getContext('2d')
        charts.value.stats = new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: labels,
            datasets: [{
              data: values,
              backgroundColor: backgroundColors,
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'right',
                labels: {
                  font: {
                    size: 12
                  }
                }
              },
              title: {
                display: true,
                text: 'Statut des demandes de stage',
                font: {
                  size: 16
                }
              }
            }
          }
        })
      } catch (error) {
        console.error('Erreur lors de l\'initialisation du graphique:', error)
        toast.error('Erreur lors de l\'initialisation du graphique')
      }
    }

    const initDonutChart = async () => {
      if (!donutChart.value) return

      try {
        // Détruire le graphique existant
        destroyChart('donut')

        // Récupérer les données des structures
        const response = await stageRequestService.getStructuresStats()
        const structuresData = response.data || []

      charts.value.donut = new Chart(donutChart.value, {
        type: 'doughnut',
        data: {
            labels: structuresData.map(structure => structure.nom || 'Structure inconnue'),
          datasets: [{
              data: structuresData.map(structure => structure.count || 0),
            backgroundColor: [
              '#1E40AF', // blue-800
              '#3B82F6', // blue-500
              '#60A5FA', // blue-400
              '#FBBF24', // yellow-400
              '#FCD34D', // yellow-300
              '#FDE68A'  // yellow-200
            ]
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'right',
              labels: {
                color: '#374151' // gray-700
                }
              },
              title: {
                display: true,
                text: 'Répartition des stagiaires par structure',
                font: {
                  size: 16
                }
              }
            }
          }
        })
      } catch (error) {
        console.error('Erreur lors de l\'initialisation du graphique des structures:', error)
        toast.error('Erreur lors du chargement des données des structures')
      }
    }

    const initBarChart = async () => {
      if (!barChart.value) return

      try {
        // Détruire le graphique existant
        destroyChart('bar')

        // Récupérer les données d'évolution des demandes
        const response = await stageRequestService.getDemandesEvolution()
        const evolutionData = response.data || []

      charts.value.bar = new Chart(barChart.value, {
        type: 'bar',
        data: {
            labels: evolutionData.map(item => {
              const date = new Date(item.month)
              return date.toLocaleDateString('fr-FR', { month: 'short' })
            }),
          datasets: [{
              label: 'Demandes de stage',
              data: evolutionData.map(item => item.count || 0),
            backgroundColor: '#3B82F6', // blue-500
            borderColor: '#1E40AF', // blue-800
            borderWidth: 1,
            borderRadius: 4,
            hoverBackgroundColor: '#60A5FA' // blue-400
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: false
              },
              title: {
                display: true,
                text: 'Évolution des demandes de stage',
                font: {
                  size: 16
                }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: '#E5E7EB' // gray-200
              },
              ticks: {
                  color: '#374151', // gray-700
                  precision: 0 // Afficher uniquement des nombres entiers
              }
            },
            x: {
              grid: {
                display: false
              },
              ticks: {
                color: '#374151' // gray-700
              }
            }
          }
        }
      })
      } catch (error) {
        console.error('Erreur lors de l\'initialisation du graphique d\'évolution:', error)
        toast.error('Erreur lors du chargement des données d\'évolution')
      }
    }

    onMounted(async () => {
      await nextTick()
      await Promise.all([
        initDonutChart(),
        initBarChart()
      ])
    })

    // Réinitialiser les graphiques lors du retour sur la page
    const route = useRouter()
    watch(() => route.currentRoute.value.path, (newPath) => {
      if (newPath === '/dashboard/dpaf') {
        nextTick(() => {
          initDonutChart()
          initBarChart()
        })
      }
    })

    onBeforeUnmount(() => {
      // Détruire tous les graphiques avant de démonter le composant
      Object.keys(charts.value).forEach(key => destroyChart(key))
    })

    const stats = ref({
      nouveaux: 0,
      enCours: 0,
      confirmes: 0,
      refuses: 0,
      total: 0
    })
    const loading = ref(true)
    const error = ref(null)

    const loadStatistics = async () => {
      try {
        loading.value = true
        error.value = null
        const data = await stageRequestService.getStatistics()
        stats.value = data
      } catch (err) {
        console.error('Erreur lors du chargement des statistiques:', err)
        error.value = 'Erreur lors du chargement des statistiques'
      } finally {
        loading.value = false
      }
    }

    const recentDemandes = ref([])
    const loadingDemandes = ref(true)
    const errorDemandes = ref(null)

    const loadRecentDemandes = async () => {
      try {
        loadingDemandes.value = true
        errorDemandes.value = null
        const data = await stageRequestService.getRecentStageRequests()
        recentDemandes.value = data
      } catch (err) {
        console.error('Erreur lors du chargement des dernières demandes:', err)
        errorDemandes.value = 'Erreur lors du chargement des dernières demandes'
      } finally {
        loadingDemandes.value = false
      }
    }

    onMounted(() => {
      loadStatistics()
      loadRecentDemandes()
    })

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    }

    const getStatusClass = (status) => {
      const classes = {
        EN_ATTENTE: 'bg-blue-100 text-blue-800',
        VALIDEE: 'bg-yellow-100 text-yellow-800',
        TERMINE: 'bg-green-100 text-green-800',
        REJETEE: 'bg-red-100 text-red-800'
      }
      return classes[status] || ''
    }

    const getStatusLabel = (status) => {
      const labels = {
        EN_ATTENTE: 'En attente',
        VALIDEE: 'Validée',
        TERMINE: 'Terminé',
        REJETEE: 'Refusé'
      }
      return labels[status] || status
    }

    const canConfirm = (demande) => demande.status === 'EN_ATTENTE'
    const canReject = (demande) => demande.status === 'EN_ATTENTE'

    const viewDetails = (demande) => {
      router.push(`/dashboard/dpaf/demandes/${demande.id}`)
    }

    const confirmDemande = async (demande) => {
      try {
        await stageRequestService.approveStageRequest(demande.id)
        await loadRecentDemandes() // Recharger les données
      } catch (error) {
        console.error('Erreur lors de la confirmation de la demande:', error)
      }
    }

    const rejectDemande = async (demande) => {
      try {
        const motif = prompt('Veuillez indiquer le motif du refus :')
        if (motif) {
          await stageRequestService.rejectStageRequest(demande.id, motif)
          await loadRecentDemandes() // Recharger les données
        }
      } catch (error) {
        console.error('Erreur lors du refus de la demande:', error)
      }
    }

    const logout = async () => {
      await store.dispatch('logout')
      router.push('/login')
    }

    return {
      store,
      stats,
      recentDemandes,
      donutChart,
      barChart,
      formatDate,
      getStatusClass,
      getStatusLabel,
      canConfirm,
      canReject,
      viewDetails,
      confirmDemande,
      rejectDemande,
      logout,
      showUserMenu,
      showNotifMenu,
      toggleUserMenu,
      toggleNotifMenu,
      userMenu,
      notifMenu,
      userInitials,
      notifications,
      unreadNotifications,
      getNotificationTypeClass,
      getNotificationIcon,
      formatNotifDate,
      markAllAsRead,
      initDonutChart,
      initBarChart,
      loading,
      error,
      loadingDemandes,
      errorDemandes
    }
  }
}
</script>