<template>
  <div class="p-4">
    <h1 class="text-2xl text-slate-800 font-bold mb-6 flex justify-center items-center">Gestion des Affectations</h1>

    <!-- Message d'erreur -->
    <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      {{ error }}
    </div>

    <!-- Indicateur de chargement -->
    <div v-if="loading" class="flex justify-center items-center py-4">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>

    <div v-else class="bg-white rounded-lg shadow">
      <!-- Filtres -->
      <div class="p-4 border-b">
        <div class="flex justify-between items-center">
          <div class="flex items-center space-x-4">
            <i class="fas fa-search border-2 text-slate-800 border-gray-300 rounded-lg p-2"></i>
            <input 
              type="text" 
              placeholder="Rechercher un stagiaire..." 
              class="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              v-model="searchQuery"
            >
          </div>
        </div>
      </div>

      <!-- Liste des stagiaires -->
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-slate-500">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Stagiaire</th>
              <th class="px-6 py-3 text-left text-xs font-medium bg-slate-700 text-white uppercase tracking-wider">Email</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Université</th>
              <th class="px-6 py-3 text-left text-xs font-medium bg-slate-700 text-white uppercase tracking-wider">Département souhaité</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Date de début</th>
              <th class="px-6 py-3 text-left text-xs font-medium bg-slate-700 text-white uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="stagiaire in paginatedStagiaires" :key="stagiaire.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">
                  {{ stagiaire.nom }} {{ stagiaire.prenom }}
                </div>
                <div class="text-xs text-gray-500">Code: {{ stagiaire.code_suivi }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ stagiaire.email }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ stagiaire.universite }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ stagiaire.departement }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(stagiaire.dateDebut) }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button 
                  @click="openAffectationModal(stagiaire)"
                  class="text-primary hover:text-primary-dark"
                >
                  <i class="fas fa-user-plus mr-1"></i>Affecter
                </button>
              </td>
            </tr>
          </tbody>
        </table>

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
              :disabled="currentPage >= totalPages"
              class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Suivant
            </button>
          </div>
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700">
                Affichage de 
                <span class="font-medium">{{ startIndex + 1 }}</span>
                à
                <span class="font-medium">{{ endIndex }}</span>
                sur
                <span class="font-medium">{{ filteredStagiaires.length }}</span>
                résultats
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

    <!-- Modal d'affectation -->
    <div v-if="showAffectationModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-bold text-gray-900">Affecter un stagiaire</h3>
          <button @click="closeAffectationModal" class="text-gray-400 hover:text-gray-500">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <form @submit.prevent="submitAffectation" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Stagiaire</label>
            <input 
              type="text" 
              :value="selectedStagiaire ? `${selectedStagiaire.nom} ${selectedStagiaire.prenom}` : ''" 
              disabled 
              class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Structure d'accueil</label>
            <select 
              v-model="affectation.structureId" 
              required 
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Sélectionner une structure</option>
              <option v-for="structure in structures" :key="structure.id" :value="structure.id">
                {{ structure.nomStructure }}
              </option>
            </select>
          </div>

          <div class="flex justify-end space-x-3">
            <button 
              type="button" 
              @click="closeAffectationModal"
              class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Annuler
            </button>
            <button 
              type="submit" 
              :disabled="loading"
              class="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
            >
              {{ loading ? 'Affectation en cours...' : 'Confirmer l\'affectation' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import api from '@/services/api'

export default {
  name: 'Affectations',
  setup() {
    const toast = useToast()
    const loading = ref(false)
    const error = ref(null)
    const searchQuery = ref('')
    const stagiaires = ref([])
    const structures = ref([])
    const showAffectationModal = ref(false)
    const selectedStagiaire = ref(null)
    const currentPage = ref(1)
    const itemsPerPage = 15
    const affectation = ref({
      structureId: '',
      tuteurId: ''
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

    const selectedStructure = computed(() => {
      if (!affectation.value.structureId) return null
      return structures.value.find(s => s.id === affectation.value.structureId)
    })

    const filteredStagiaires = computed(() => {
      if (!searchQuery.value) return stagiaires.value
      
      const query = searchQuery.value.toLowerCase()
      return stagiaires.value.filter(stagiaire => {
        const nom = `${stagiaire.nom} ${stagiaire.prenom}`.toLowerCase()
        const email = stagiaire.email.toLowerCase()
        return nom.includes(query) || email.includes(query)
      })
    })

    const formatDate = (date) => {
      if (!date) return 'Non spécifiée'
      return new Date(date).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }

    const fetchStagiaires = async () => {
      try {
        loading.value = true
        error.value = null
        const response = await api.get('/stage-request/dpaf')
        
        console.log('Réponse complète de l\'API:', response.data)
        
        // Filtrer les demandes avec le statut APPROUVE
        const demandesApprouvees = response.data.filter(request => {
          console.log('Statut de la demande:', request.status, 'pour le stagiaire:', request.stagiaire?.email)
          return request.status === 'APPROUVE'
        })
        
        console.log('Demandes approuvées:', demandesApprouvees)
        
        stagiaires.value = demandesApprouvees
          .filter(request => {
            // Vérifier si le stagiaire a une structure affectée
            const hasStructure = request.stagiaire?.stagiaire?.structureAffecteeId
            console.log('Stagiaire:', request.stagiaire?.email, 'Structure:', hasStructure)
            // Ne garder que les stagiaires sans structure affectée
            return !hasStructure
          })
          .map(request => {
            console.log('Traitement du stagiaire:', request.stagiaire?.email)
            return {
              id: request.stagiaire?.stagiaire?.id,
              stagiaireId: request.stagiaireId,
              email: request.stagiaire?.email,
              nom: request.stagiaire?.profile?.nom,
              prenom: request.stagiaire?.profile?.prenom,
              code_suivi: request.code_suivi,
              universite: request.universite,
              departement: request.departement,
              dateDebut: request.dateDebut
            }
          })

        console.log('Stagiaires à affecter:', stagiaires.value)
      } catch (err) {
        console.error('Erreur lors du chargement des stagiaires:', err)
        error.value = 'Erreur lors du chargement des stagiaires'
      } finally {
        loading.value = false
      }
    }

    const fetchStructures = async () => {
      try {
        const response = await api.get('/structures')
        console.log('Structures reçues:', response.data)
        // Filtrer pour ne garder que les structures créées par l'admin (parentId est null)
        structures.value = response.data.filter(structure => !structure.parentId)
        console.log('Structures filtrées (structures principales):', structures.value)
      } catch (err) {
        console.error('Erreur lors du chargement des structures:', err)
        toast.error('Erreur lors du chargement des structures')
      }
    }

    const openAffectationModal = (stagiaire) => {
      selectedStagiaire.value = stagiaire
      affectation.value = {
        structureId: '',
        tuteurId: ''
      }
      showAffectationModal.value = true
    }

    const closeAffectationModal = () => {
      showAffectationModal.value = false
      selectedStagiaire.value = null
      affectation.value = {
        structureId: '',
        tuteurId: ''
      }
    }

    const submitAffectation = async () => {
      if (!selectedStagiaire.value || !affectation.value.structureId) return

      try {
        loading.value = true
        
        // Vérifier le token
        const token = localStorage.getItem('token')
        if (!token) {
          throw new Error('Non authentifié. Veuillez vous reconnecter.')
        }

        const payload = {
          stagiaireId: selectedStagiaire.value.stagiaireId,
          structureId: Number(affectation.value.structureId),
          tuteurId: affectation.value.tuteurId || null
        }

        console.log('Token:', token)
        console.log('Payload envoyé:', JSON.stringify(payload, null, 2))

        const response = await api.post('/structures/assign-stagiaire', payload)

        if (response.data) {
          // Supprimer le stagiaire de la liste avant de fermer le modal
          stagiaires.value = stagiaires.value.filter(s => s.stagiaireId !== selectedStagiaire.value.stagiaireId)
          
          // Réinitialiser la pagination si nécessaire
          if (paginatedStagiaires.value.length === 0 && currentPage.value > 1) {
            currentPage.value = Math.max(1, currentPage.value - 1)
          }
          
          toast.success('Stagiaire affecté avec succès')
          closeAffectationModal()
          
          // Vider la recherche
          searchQuery.value = ''
        } else {
          throw new Error('Réponse invalide du serveur')
        }
      } catch (err) {
        console.error('Erreur lors de l\'affectation:', err)
        console.error('Détails de l\'erreur:', {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status,
          headers: err.response?.headers,
          config: err.config
        })
        
        let errorMessage = 'Erreur lors de l\'affectation'
        if (err.response?.status === 404) {
          errorMessage = 'Endpoint non trouvé. Veuillez vérifier que le serveur est bien démarré.'
        } else if (err.response?.status === 401) {
          errorMessage = 'Session expirée. Veuillez vous reconnecter.'
        } else if (err.response?.data?.message) {
          errorMessage = err.response.data.message
        } else if (err.message) {
          errorMessage = err.message
        }
        
        toast.error(errorMessage)
      } finally {
        loading.value = false
      }
    }

    onMounted(() => {
      fetchStagiaires()
      fetchStructures()
    })

    return {
      loading,
      error,
      searchQuery,
      stagiaires,
      structures,
      showAffectationModal,
      selectedStagiaire,
      selectedStructure,
      affectation,
      filteredStagiaires,
      paginatedStagiaires,
      currentPage,
      totalPages,
      startIndex,
      endIndex,
      displayedPages,
      formatDate,
      openAffectationModal,
      closeAffectationModal,
      submitAffectation
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