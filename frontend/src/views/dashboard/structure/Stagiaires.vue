<template>
  <div class="container mx-auto px-4 py-8">
    <!-- En-tête avec titre et filtres -->
    <div class="mb-8">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-800">Liste des Stagiaires</h1>
        <div class="flex gap-4">
          <div class="relative">
            <input
              type="text"
              v-model="searchQuery"
              placeholder="Rechercher un stagiaire..."
              class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            />
            <i class="fas fa-search absolute left-3 top-3 text-gray-400"></i>
          </div>
          <select
            v-model="statusFilter"
            class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
          >
            <option value="all">Tous les statuts</option>
            <option value="active">En cours</option>
            <option value="completed">Terminés</option>
            <option value="upcoming">À venir</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Message d'erreur -->
    <div v-if="error" class="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
      {{ error }}
    </div>

    <!-- Loading spinner -->
    <div v-if="loading" class="flex justify-center items-center py-8">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>

    <!-- Tableau des stagiaires -->
    <div v-else class="bg-white rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stagiaire
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type de stage
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Période
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tuteur
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="stagiaire in filteredStagiaires" :key="stagiaire.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <div class="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span class="text-primary font-medium">{{ getInitials(stagiaire.nom) }}</span>
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ stagiaire.nom }}</div>
                    <div class="text-sm text-gray-500">{{ stagiaire.email }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                  {{ stagiaire.typeStage }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(stagiaire.dateDebut) }} - {{ formatDate(stagiaire.dateFin) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ stagiaire.tuteur }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getStatusClass(stagiaire.statut)">
                  {{ stagiaire.statut }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex space-x-3">
                  <button @click="viewDetails(stagiaire)" class="text-primary hover:text-primary-dark">
                    <i class="fas fa-eye"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
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
            :disabled="currentPage === totalPages"
            class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Suivant
          </button>
        </div>
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700">
              Affichage de <span class="font-medium">{{ startIndex }}</span> à
              <span class="font-medium">{{ endIndex }}</span> sur
              <span class="font-medium">{{ totalItems }}</span> résultats
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
                  currentPage === page
                    ? 'z-10 bg-primary border-primary text-white'
                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50',
                  'relative inline-flex items-center px-4 py-2 border text-sm font-medium'
                ]"
              >
                {{ page }}
              </button>
              <button
                @click="currentPage++"
                :disabled="currentPage === totalPages"
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

    <!-- Modal des détails -->
    <div v-if="showDetailsModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold text-gray-800">Détails du Stagiaire</h2>
          <button @click="closeDetailsModal" class="text-gray-500 hover:text-gray-700">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <div v-if="selectedStagiaire" class="space-y-4">
          <!-- Informations personnelles -->
          <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="font-semibold text-gray-700 mb-2">Informations Personnelles</h3>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-sm text-gray-600">Nom complet</p>
                <p class="font-medium">{{ selectedStagiaire.user.profile.nom }} {{ selectedStagiaire.user.profile.prenom }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600">Email</p>
                <p class="font-medium">{{ selectedStagiaire.user.email }}</p>
              </div>
            </div>
          </div>

          <!-- Détails du stage -->
          <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="font-semibold text-gray-700 mb-2">Détails du Stage</h3>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-sm text-gray-600">Type de stage</p>
                <p class="font-medium">{{ selectedStagiaire.typeStage }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600">Statut</p>
                <p class="font-medium" :class="getStatusClass(selectedStagiaire.statut)">
                  {{ selectedStagiaire.statut }}
                </p>
              </div>
              <div>
                <p class="text-sm text-gray-600">Date de début</p>
                <p class="font-medium">{{ formatDate(selectedStagiaire.dateDebut) }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600">Date de fin</p>
                <p class="font-medium">{{ formatDate(selectedStagiaire.dateFin) }}</p>
              </div>
            </div>
          </div>

          <!-- Tuteur -->
          <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="font-semibold text-gray-700 mb-2">Tuteur</h3>
            <div v-if="selectedStagiaire.tuteur" class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-sm text-gray-600">Nom du tuteur</p>
                <p class="font-medium">
                  {{ selectedStagiaire.tuteur.user.profile.nom }} {{ selectedStagiaire.tuteur.user.profile.prenom }}
                </p>
              </div>
              <div>
                <p class="text-sm text-gray-600">Email du tuteur</p>
                <p class="font-medium">{{ selectedStagiaire.tuteur.user.email }}</p>
              </div>
            </div>
            <p v-else class="text-gray-500">Aucun tuteur assigné</p>
          </div>

          <!-- Détails de la demande -->
          <div v-if="selectedStagiaire.user.demandesStage" class="bg-gray-50 p-4 rounded-lg">
            <h3 class="font-semibold text-gray-700 mb-2">Détails de la Demande</h3>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-sm text-gray-600">Code de suivi</p>
                <p class="font-medium">{{ selectedStagiaire.user.demandesStage.code_suivi }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600">Université</p>
                <p class="font-medium">{{ selectedStagiaire.user.demandesStage.universite }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600">Département</p>
                <p class="font-medium">{{ selectedStagiaire.user.demandesStage.departement }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600">Domaine d'études</p>
                <p class="font-medium">{{ selectedStagiaire.user.demandesStage.domaineEtude }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600">Année d'études</p>
                <p class="font-medium">{{ selectedStagiaire.user.demandesStage.anneeEtude }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600">Statut de la demande</p>
                <p class="font-medium" :class="getStatusClass(selectedStagiaire.user.demandesStage.status)">
                  {{ selectedStagiaire.user.demandesStage.status }}
                </p>
              </div>
              <div class="col-span-2">
                <p class="text-sm text-gray-600">Motivation</p>
                <p class="font-medium">{{ selectedStagiaire.user.demandesStage.motivation }}</p>
              </div>
              <div class="col-span-2">
                <p class="text-sm text-gray-600">Compétences</p>
                <p class="font-medium">{{ selectedStagiaire.user.demandesStage.competences }}</p>
              </div>
              <div class="col-span-2">
                <p class="text-sm text-gray-600">Expérience</p>
                <p class="font-medium">{{ selectedStagiaire.user.demandesStage.experience }}</p>
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
import { useStore } from 'vuex'
import { stagiaireService } from '@/services/api'

export default {
  name: 'Stagiaires',
  setup() {
    const store = useStore()
    const searchQuery = ref('')
    const statusFilter = ref('all')
    const currentPage = ref(1)
    const itemsPerPage = 10
    const loading = ref(false)
    const error = ref(null)
    const stagiaires = ref([])
    const showDetailsModal = ref(false)
    const selectedStagiaire = ref(null)

    // Récupérer l'ID de la structure connectée
    const structureId = computed(() => {
      const user = store.state.user
      return user?.structureId
    })

    // Charger les stagiaires de la structure
    const loadStagiaires = async () => {
      if (!structureId.value) {
        error.value = 'Structure non trouvée'
        return
      }

      loading.value = true
      error.value = null

      try {
        const data = await stagiaireService.getStagiairesByStructure(structureId.value)
        stagiaires.value = data.map(stagiaire => ({
          id: stagiaire.id,
          nom: `${stagiaire.user.profile.nom} ${stagiaire.user.profile.prenom}`,
          email: stagiaire.user.email,
          typeStage: stagiaire.typeStage,
          dateDebut: stagiaire.dateDebut,
          dateFin: stagiaire.dateFin,
          tuteur: stagiaire.tuteur ? `${stagiaire.tuteur.user.profile.nom} ${stagiaire.tuteur.user.profile.prenom}` : 'Non assigné',
          statut: getStageStatus(stagiaire.dateDebut, stagiaire.dateFin)
        }))
      } catch (err) {
        console.error('Erreur lors du chargement des stagiaires:', err)
        error.value = 'Erreur lors du chargement des stagiaires'
      } finally {
        loading.value = false
      }
    }

    // Déterminer le statut du stage en fonction des dates
    const getStageStatus = (dateDebut, dateFin) => {
      const now = new Date()
      const debut = new Date(dateDebut)
      const fin = new Date(dateFin)

      if (now < debut) return 'À venir'
      if (now > fin) return 'Terminé'
      return 'En cours'
    }

    // Filtrage des stagiaires
    const filteredStagiaires = computed(() => {
      let filtered = stagiaires.value

      // Filtre par recherche
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(stagiaire =>
          stagiaire.nom.toLowerCase().includes(query) ||
          stagiaire.email.toLowerCase().includes(query)
        )
      }

      // Filtre par statut
      if (statusFilter.value !== 'all') {
        const statusMap = {
          'active': 'En cours',
          'completed': 'Terminé',
          'upcoming': 'À venir'
        }
        filtered = filtered.filter(stagiaire => stagiaire.statut === statusMap[statusFilter.value])
      }

      return filtered
    })

    // Pagination
    const totalItems = computed(() => filteredStagiaires.value.length)
    const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage))
    const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage + 1)
    const endIndex = computed(() => Math.min(currentPage.value * itemsPerPage, totalItems.value))

    const displayedPages = computed(() => {
      const pages = []
      const maxPages = 5
      let start = Math.max(1, currentPage.value - Math.floor(maxPages / 2))
      let end = Math.min(totalPages.value, start + maxPages - 1)

      if (end - start + 1 < maxPages) {
        start = Math.max(1, end - maxPages + 1)
      }

      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      return pages
    })

    // Méthodes utilitaires
    const getInitials = (name) => {
      return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
    }

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('fr-FR')
    }

    const getStatusClass = (status) => {
      const classes = {
        'En cours': 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800',
        'Terminé': 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800',
        'À venir': 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800'
      }
      return classes[status] || classes['En cours']
    }

    // Actions
    const viewDetails = async (stagiaire) => {
      try {
        const details = await stagiaireService.getStagiaireDetails(stagiaire.id)
        selectedStagiaire.value = details
        showDetailsModal.value = true
      } catch (err) {
        console.error('Erreur lors de la récupération des détails:', err)
        store.dispatch('notification/setError', 'Erreur lors de la récupération des détails')
      }
    }

    const closeDetailsModal = () => {
      showDetailsModal.value = false
      selectedStagiaire.value = null
    }

    onMounted(() => {
      loadStagiaires()
    })

    return {
      searchQuery,
      statusFilter,
      currentPage,
      stagiaires,
      filteredStagiaires,
      totalItems,
      totalPages,
      startIndex,
      endIndex,
      displayedPages,
      loading,
      error,
      showDetailsModal,
      selectedStagiaire,
      getInitials,
      formatDate,
      getStatusClass,
      viewDetails,
      closeDetailsModal
    }
  }
}
</script> 