<template>
  <div class="p-4">
    <h1 class="text-2xl text-slate-800 font-bold mb-6 flex justify-center items-center">Demandes en attente</h1>

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
            <i class="fas fa-search border-2 text-slate-800 border-gray-300 rounded-lg p-2"></i>
            <input 
              type="text" 
              placeholder="Rechercher une demande..." 
              class="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              v-model="searchQuery"
            >
          </div>
          <button class="bg-[#E1AD01] text-white px-4 py-2 rounded-lg hover:bg-[#F5BC00]">
            <i class="fas fa-download mr-2"></i>Exporter
          </button>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50 bg-slate-500">
            <tr>
              <th class="px-6 py-3 text-left text-white text-xs font-medium uppercase tracking-wider">Stagiaire</th>
              <th class="px-6 bg-slate-700 py-3 text-left text-white text-xs font-medium uppercase tracking-wider">Département</th>
              <th class="px-6 py-3 text-left text-white text-xs font-medium uppercase tracking-wider">Université</th>
              <th class="px-6 bg-slate-700 py-3 text-left text-white text-xs font-medium uppercase tracking-wider">Type</th>
              <th class="px-6 py-3 text-left text-white text-xs font-medium uppercase tracking-wider">Date</th>
              <th class="px-6 bg-slate-700 py-3 text-left text-white text-xs font-medium uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="demande in paginatedDemandes" :key="demande.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ demande.nom }}</div>
                <div class="text-sm text-gray-500">{{ demande.email }}</div>
                <div class="text-xs text-gray-400">Code: {{ demande.code_suivi }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap bg-gray-200 text-sm text-gray-700">{{ demande.departement }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ demande.universite }}</td>
              <td class="px-6 py-4 whitespace-nowrap bg-gray-200 text-sm text-gray-700">{{ demande.typeStage }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(demande.dateSoumission) }}</td>
              <td class="px-6 py-4 whitespace-nowrap bg-gray-200 text-sm font-medium space-x-2">
                <button @click="viewDetails(demande)" class="text-blue-600 hover:text-yellow-dark flex justify-between items-center gap-2">
                  Voir
                  <i class="fas fa-eye"></i>
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
                <span class="font-medium">{{ filteredDemandes.length }}</span> résultats
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
                    currentPage === page ? 'z-10 bg-slate-50 border-slate-500 text-slate-600' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50',
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

    <DemandeDetails 
      v-if="selectedDemande" 
      :demande="selectedDemande" 
      @close="closeDetails"
      @approve="approveRequest"
      @reject="rejectRequest"
    />
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import DemandeDetails from '@/components/demandes/DemandeDetails.vue'
import { stageRequestService } from '@/services/api'
import { useToast } from 'vue-toastification'

export default {
  name: 'ToutesDemandes',
  components: {
    DemandeDetails
  },
  setup() {
    const searchQuery = ref('')
    const selectedDemande = ref(null)
    const demandes = ref([])
    const loading = ref(false)
    const error = ref(null)
    const currentPage = ref(1)
    const itemsPerPage = 15
    const toast = useToast()
    const showRejectModal = ref(false)
    const rejectReason = ref('')

    // Charger les demandes depuis l'API
    const loadDemandes = async () => {
      try {
        loading.value = true;
        error.value = null;
        const response = await stageRequestService.getStageRequestsForDPAF();
        console.log('Réponse brute de l\'API:', response);
        demandes.value = response
          .filter(demande => demande.status === 'EN_ATTENTE')
          .map(demande => {
            console.log('Documents de la demande:', {
              photo: demande.photo,
              cv: demande.cv,
              lettreMotivation: demande.lettreMotivation,
              carteIdentite: demande.carteIdentite,
              inscriptionUniversitaire: demande.inscriptionUniversitaire,
              recommandation: demande.recommandation,
              autresDocuments: demande.autresDocuments
            });
            return {
          id: demande.id,
            nom: `${demande.stagiaire?.profile?.prenom || ''} ${demande.stagiaire?.profile?.nom || ''}`.trim(),
            email: demande.stagiaire?.email || '',
            telephone: demande.stagiaire?.profile?.telephone || '',
            typeStage: demande.type || '',
            departement: demande.departement || '',
            universite: demande.universite || '',
            domaineEtude: demande.domaineEtude || '',
          dateSoumission: demande.createdAt,
          dateDebut: demande.dateDebut,
          dateFin: demande.dateFin,
            status: demande.status || 'EN_ATTENTE',
            code_suivi: demande.code_suivi || '',
            photo: demande.photo,
            cv: demande.cv,
            lettreMotivation: demande.lettreMotivation,
            carteIdentite: demande.carteIdentite,
            inscriptionUniversitaire: demande.inscriptionUniversitaire,
            recommandation: demande.recommandation,
              autresDocuments: demande.autresDocuments || []
            };
          });
        console.log('Demandes transformées:', demandes.value);
      } catch (err) {
        console.error('Erreur lors du chargement des demandes:', err);
        error.value = 'Erreur lors du chargement des demandes';
      } finally {
        loading.value = false;
      }
    }

    // Charger les demandes au montage du composant
    onMounted(() => {
      loadDemandes()
    })

    const filteredDemandes = computed(() => {
      const searchLower = searchQuery.value.toLowerCase();
      return demandes.value.filter(demande => {
        return (demande.nom?.toLowerCase() || '').includes(searchLower) ||
               (demande.email?.toLowerCase() || '').includes(searchLower) ||
               (demande.departement?.toLowerCase() || '').includes(searchLower) ||
               (demande.universite?.toLowerCase() || '').includes(searchLower);
      });
    })

    const totalPages = computed(() => {
      return Math.ceil(filteredDemandes.value.length / itemsPerPage)
    })

    const startIndex = computed(() => {
      return (currentPage.value - 1) * itemsPerPage
    })

    const endIndex = computed(() => {
      return Math.min(startIndex.value + itemsPerPage, filteredDemandes.value.length)
    })

    const paginatedDemandes = computed(() => {
      return filteredDemandes.value.slice(startIndex.value, endIndex.value)
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

    const viewDetails = (demande) => {
      selectedDemande.value = demande
    }

    const closeDetails = () => {
      selectedDemande.value = null
    }

    const approveRequest = async (demande) => {
      try {
        loading.value = true
        await stageRequestService.approveStageRequest(demande.id)
        toast.success('Demande approuvée avec succès')
        // Mettre à jour la liste des demandes
        await loadDemandes()
        // Réinitialiser la pagination
        currentPage.value = 1
        // Fermer les détails
        closeDetails()
      } catch (error) {
        console.error('Erreur lors de l\'approbation:', error)
        toast.error(error.message || 'Erreur lors de l\'approbation de la demande')
      } finally {
        loading.value = false
      }
    }

    const rejectRequest = async (demande) => {
      try {
        loading.value = true
        await stageRequestService.rejectStageRequest(demande.id, rejectReason.value)
        toast.success('Demande rejetée avec succès')
        // Mettre à jour la liste des demandes
        await loadDemandes()
        // Réinitialiser la pagination
        currentPage.value = 1
        // Fermer les détails et le modal de rejet
        closeDetails()
        showRejectModal.value = false
        rejectReason.value = ''
      } catch (error) {
        console.error('Erreur lors du rejet:', error)
        toast.error(error.message || 'Erreur lors du rejet de la demande')
      } finally {
        loading.value = false
      }
    }

    const fetchDemandes = async () => {
      try {
        loading.value = true
        error.value = null
        const response = await stageRequestService.getStageRequestsForDPAF()
        demandes.value = response
      } catch (err) {
        console.error('Erreur lors du chargement des demandes:', err)
        error.value = 'Erreur lors du chargement des demandes'
      } finally {
        loading.value = false
      }
    }

    return {
      searchQuery,
      filteredDemandes,
      paginatedDemandes,
      currentPage,
      totalPages,
      startIndex,
      endIndex,
      displayedPages,
      formatDate,
      viewDetails,
      approveRequest,
      rejectRequest,
      selectedDemande,
      closeDetails,
      loading,
      error,
      showRejectModal,
      rejectReason,
      fetchDemandes
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
