<template>
  <div class="p-4">
    <h1 class="text-2xl text-green-800 font-bold mb-6">Historique des Stagiaires</h1>

    <!-- Message d'erreur -->
    <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      {{ error }}
    </div>

    <!-- Indicateur de chargement -->
    <div v-if="loading" class="flex justify-center items-center py-4">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>

    <div v-else class="bg-white rounded-lg shadow">
      <div class="p-4 border-b">
        <div class="flex justify-between items-center">
          <div class="flex items-center space-x-4">
            <input 
              type="text" 
              placeholder="Rechercher un stagiaire..." 
              class="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              v-model="searchQuery"
            >
            <select 
              v-model="filterStatus" 
              class="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Tous les statuts</option>
              <option value="APPROUVE">Approuvé</option>
              <option value="REFUSE">Refusé</option>
              <option value="EN_COURS">En cours</option>
              <option value="TERMINE">Terminé</option>
            </select>
          </div>
          <button class="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-700">
            <i class="fas fa-download mr-2"></i>Exporter
          </button>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stagiaire</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Structure</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tuteur</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Département</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="stagiaire in paginatedStagiaires" :key="stagiaire.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ stagiaire.nom }} {{ stagiaire.prenom }}</div>
                <div class="text-sm text-gray-500">{{ stagiaire.email }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ stagiaire.structure?.nomStructure || 'Non assigné' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ stagiaire.tuteur ? `${stagiaire.tuteur.nom} ${stagiaire.tuteur.prenom}` : 'Non assigné' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ stagiaire.departement }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div>Début: {{ formatDate(stagiaire.dateDebut) }}</div>
                <div>Fin: {{ formatDate(stagiaire.dateFin) }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                      :class="getStatusClass(stagiaire.status)">
                  {{ getStatusLabel(stagiaire.status) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <button @click="viewDetails(stagiaire)" class="text-primary hover:text-primary-dark">
                  <i class="fas fa-eye"></i>
                </button>
                <button v-if="stagiaire.status === 'EN_COURS'" 
                        @click="terminerStage(stagiaire)"
                        class="text-green-600 hover:text-green-800">
                  <i class="fas fa-check"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="px-4 py-3 border-t border-gray-200 sm:px-6">
        <div class="flex items-center justify-between">
          <div class="flex-1 flex justify-between sm:hidden">
            <button 
              @click="currentPage--" 
              :disabled="currentPage === 1"
              class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Précédent
            </button>
            <button 
              @click="currentPage++" 
              :disabled="currentPage >= totalPages"
              class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Suivant
            </button>
          </div>
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700">
                Affichage de <span class="font-medium">{{ startIndex + 1 }}</span> à 
                <span class="font-medium">{{ endIndex }}</span> sur 
                <span class="font-medium">{{ filteredStagiaires.length }}</span> stagiaires
              </p>
            </div>
            <div>
              <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button 
                  @click="currentPage--" 
                  :disabled="currentPage === 1"
                  class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span class="sr-only">Précédent</span>
                  <i class="fas fa-chevron-left"></i>
                </button>
                <button 
                  v-for="page in displayedPages" 
                  :key="page"
                  @click="currentPage = page"
                  :class="[
                    currentPage === page ? 'z-10 bg-primary-50 border-primary-500 text-primary-600' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50',
                    'relative inline-flex items-center px-4 py-2 border text-sm font-medium'
                  ]"
                >
                  {{ page }}
                </button>
                <button 
                  @click="currentPage++" 
                  :disabled="currentPage >= totalPages"
                  class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span class="sr-only">Suivant</span>
                  <i class="fas fa-chevron-right"></i>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de détails -->
    <div v-if="selectedStagiaire" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        <div class="p-6">
          <div class="flex justify-between items-start">
            <h3 class="text-lg font-medium text-gray-900">Détails du stagiaire</h3>
            <button @click="closeDetails" class="text-gray-400 hover:text-gray-500">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="mt-4 space-y-4">
            <div>
              <h4 class="text-sm font-medium text-gray-500">Informations personnelles</h4>
              <div class="mt-2 grid grid-cols-2 gap-4">
                <div>
                  <p class="text-sm text-gray-900">Nom complet</p>
                  <p class="mt-1 text-sm text-gray-500">{{ selectedStagiaire.nom }} {{ selectedStagiaire.prenom }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-900">Email</p>
                  <p class="mt-1 text-sm text-gray-500">{{ selectedStagiaire.email }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-900">Téléphone</p>
                  <p class="mt-1 text-sm text-gray-500">{{ selectedStagiaire.telephone || 'Non renseigné' }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-900">Université</p>
                  <p class="mt-1 text-sm text-gray-500">{{ selectedStagiaire.universite }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-900">Domaine d'études</p>
                  <p class="mt-1 text-sm text-gray-500">{{ selectedStagiaire.domaineEtude }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-900">Année d'études</p>
                  <p class="mt-1 text-sm text-gray-500">{{ selectedStagiaire.anneeEtude }}</p>
                </div>
              </div>
            </div>
            <div>
              <h4 class="text-sm font-medium text-gray-500">Informations du stage</h4>
              <div class="mt-2 grid grid-cols-2 gap-4">
                <div>
                  <p class="text-sm text-gray-900">Structure</p>
                  <p class="mt-1 text-sm text-gray-500">{{ selectedStagiaire.structure?.nomStructure || 'Non assigné' }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-900">Tuteur</p>
                  <p class="mt-1 text-sm text-gray-500">{{ selectedStagiaire.tuteur ? `${selectedStagiaire.tuteur.nom} ${selectedStagiaire.tuteur.prenom}` : 'Non assigné' }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-900">Département</p>
                  <p class="mt-1 text-sm text-gray-500">{{ selectedStagiaire.departement }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-900">Type de stage</p>
                  <p class="mt-1 text-sm text-gray-500">{{ selectedStagiaire.typeStage }}</p>
                </div>
              </div>
            </div>
            <div>
              <h4 class="text-sm font-medium text-gray-500">Dates</h4>
              <div class="mt-2 grid grid-cols-2 gap-4">
                <div>
                  <p class="text-sm text-gray-900">Date de début</p>
                  <p class="mt-1 text-sm text-gray-500">{{ formatDate(selectedStagiaire.dateDebut) }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-900">Date de fin</p>
                  <p class="mt-1 text-sm text-gray-500">{{ formatDate(selectedStagiaire.dateFin) }}</p>
                </div>
              </div>
            </div>
            <div>
              <h4 class="text-sm font-medium text-gray-500">Motivation et compétences</h4>
              <div class="mt-2 space-y-4">
                <div>
                  <p class="text-sm text-gray-900">Motivation</p>
                  <p class="mt-1 text-sm text-gray-500 whitespace-pre-wrap">{{ selectedStagiaire.motivation }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-900">Compétences</p>
                  <p class="mt-1 text-sm text-gray-500 whitespace-pre-wrap">{{ selectedStagiaire.competences }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-900">Expérience</p>
                  <p class="mt-1 text-sm text-gray-500 whitespace-pre-wrap">{{ selectedStagiaire.experience }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { stageRequestService } from '@/services/api'

export default {
  name: 'HistoriqueStagiaires',
  setup() {
    const searchQuery = ref('')
    const filterStatus = ref('')
    const stagiaires = ref([])
    const loading = ref(false)
    const error = ref(null)
    const currentPage = ref(1)
    const itemsPerPage = 10
    const selectedStagiaire = ref(null)

    // Charger les stagiaires depuis l'API
    const loadStagiaires = async () => {
      try {
        loading.value = true
        error.value = null
        const response = await stageRequestService.getHistoriqueStagiaires()
        stagiaires.value = response.map(request => ({
          id: request.id,
          stagiaireId: request.stagiaireId,
          nom: request.stagiaire.profile.nom,
          prenom: request.stagiaire.profile.prenom,
          email: request.stagiaire.email,
          telephone: request.stagiaire.profile.telephone,
          structure: request.stagiaire.stagiaire?.structure,
          tuteur: request.stagiaire.stagiaire?.tuteur?.user?.profile,
          departement: request.departement,
          dateDebut: request.dateDebut,
          dateFin: request.dateFin,
          status: request.status,
          typeStage: request.type,
          universite: request.universite,
          domaineEtude: request.domaineEtude,
          anneeEtude: request.anneeEtude,
          motivation: request.motivation,
          competences: request.competences,
          experience: request.experience
        }))
      } catch (err) {
        console.error('Erreur lors du chargement des stagiaires:', err)
        error.value = 'Erreur lors du chargement des stagiaires'
      } finally {
        loading.value = false
      }
    }

    // Charger les stagiaires au montage du composant
    onMounted(() => {
      loadStagiaires()
    })

    const filteredStagiaires = computed(() => {
      const searchLower = searchQuery.value.toLowerCase()
      return stagiaires.value.filter(stagiaire => {
        const matchQuery = 
          (stagiaire.nom?.toLowerCase() || '').includes(searchLower) ||
          (stagiaire.prenom?.toLowerCase() || '').includes(searchLower) ||
          (stagiaire.email?.toLowerCase() || '').includes(searchLower) ||
          (stagiaire.structure?.nomStructure?.toLowerCase() || '').includes(searchLower) ||
          (stagiaire.departement?.toLowerCase() || '').includes(searchLower)

        const matchStatus = !filterStatus.value || stagiaire.status === filterStatus.value

        return matchQuery && matchStatus
      })
    })

    const totalPages = computed(() => {
      return Math.ceil(filteredStagiaires.value.length / itemsPerPage)
    })

    const startIndex = computed(() => {
      return (currentPage.value - 1) * itemsPerPage
    })

    const endIndex = computed(() => {
      return Math.min(startIndex.value + itemsPerPage, filteredStagiaires.value.length)
    })

    const paginatedStagiaires = computed(() => {
      return filteredStagiaires.value.slice(startIndex.value, endIndex.value)
    })

    const displayedPages = computed(() => {
      const pages = []
      const maxDisplayedPages = 5
      
      if (totalPages.value <= maxDisplayedPages) {
        for (let i = 1; i <= totalPages.value; i++) {
          pages.push(i)
        }
      } else {
        let start = Math.max(1, currentPage.value - Math.floor(maxDisplayedPages / 2))
        let end = start + maxDisplayedPages - 1
        
        if (end > totalPages.value) {
          end = totalPages.value
          start = Math.max(1, end - maxDisplayedPages + 1)
        }
        
        for (let i = start; i <= end; i++) {
          pages.push(i)
        }
      }
      
      return pages
    })

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }

    const getStatusClass = (status) => {
      const classes = {
        APPROUVE: 'bg-green-100 text-green-800',
        REFUSE: 'bg-red-100 text-red-800',
        EN_COURS: 'bg-blue-100 text-blue-800',
        TERMINE: 'bg-gray-100 text-gray-800'
      }
      return classes[status] || 'bg-gray-100 text-gray-800'
    }

    const getStatusLabel = (status) => {
      const labels = {
        APPROUVE: 'Approuvé',
        REFUSE: 'Refusé',
        EN_COURS: 'En cours',
        TERMINE: 'Terminé'
      }
      return labels[status] || status
    }

    const viewDetails = (stagiaire) => {
      selectedStagiaire.value = stagiaire
    }

    const closeDetails = () => {
      selectedStagiaire.value = null
    }

    const terminerStage = async (stagiaire) => {
      try {
        await stageRequestService.terminerStage(stagiaire.id)
        await loadStagiaires() // Recharger la liste
        error.value = null
      } catch (err) {
        console.error('Erreur lors de la finalisation du stage:', err)
        error.value = err.message || 'Erreur lors de la finalisation du stage'
      }
    }

    return {
      searchQuery,
      filterStatus,
      filteredStagiaires,
      paginatedStagiaires,
      currentPage,
      totalPages,
      startIndex,
      endIndex,
      displayedPages,
      formatDate,
      getStatusClass,
      getStatusLabel,
      viewDetails,
      closeDetails,
      terminerStage,
      selectedStagiaire,
      loading,
      error
    }
  }
}
</script>

<style scoped>
.fixed {
  position: fixed;
  z-index: 9999;
}

/* Styles pour la pagination */
.relative.z-0 {
  z-index: 0;
}

.relative.z-10 {
  z-index: 10;
}
</style> 