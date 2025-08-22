<template>
  <div class="min-h-screen bg-gray-100">
    <div class="flex-1">
      <header class="bg-white shadow">
        <div class="px-4 py-4 flex justify-between items-center">
          <h1 class="text-2xl font-bold text-primary">Gestion des sous-structures</h1>
          <button @click="showAddModal = true" class="bg-primary text-white px-4 py-2 rounded hover:bg-green-900">
            <i class="fas fa-plus mr-2"></i> Ajouter une sous-structure
          </button>
        </div>
      </header>

      <main class="p-6">
        <div class="bg-white shadow rounded-lg">
          <!-- Barre de recherche -->
          <div class="p-4 border-b border-gray-200">
            <div class="relative">
              <input
                type="text"
                v-model="searchQuery"
                placeholder="Rechercher une sous-structure..."
                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              />
              <i class="fas fa-search absolute right-3 top-3 text-gray-400"></i>
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Structure parente</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Adresse</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Téléphone</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="sousStructure in paginatedSousStructures" :key="sousStructure.id" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap">{{ sousStructure.nomStructure }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">{{ sousStructure.structureParente?.nomStructure }}</td>
                  <td class="px-6 py-4 break-words">{{ sousStructure.adresse }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">{{ sousStructure.telephone }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button @click="editSousStructure(sousStructure)" class="text-primary hover:text-primary-dark mr-3">
                      <i class="fas fa-edit"></i>
                    </button>
                    <button @click="deleteSousStructure(sousStructure)" class="text-danger hover:text-red-700">
                      <i class="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
                <tr v-if="paginatedSousStructures.length === 0">
                  <td colspan="5" class="px-6 py-4 text-center text-gray-500">
                    Aucune sous-structure trouvée
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
                  :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }"
                >
                  Précédent
                </button>
                <button
                  @click="currentPage++"
                  :disabled="currentPage >= totalPages"
                  class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  :class="{ 'opacity-50 cursor-not-allowed': currentPage >= totalPages }"
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
                    <span class="font-medium">{{ filteredSousStructures.length }}</span>
                    résultats
                  </p>
                </div>
                <div>
                  <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      @click="currentPage--"
                      :disabled="currentPage === 1"
                      class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                      :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }"
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
                      :class="{ 'opacity-50 cursor-not-allowed': currentPage >= totalPages }"
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
      </main>
    </div>

    <!-- Modal d'ajout/modification -->
    <div v-if="showAddModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
      <div class="bg-white rounded-lg w-full max-w-md my-8">
        <div class="px-4 py-3 border-b border-gray-200">
          <h3 class="text-lg font-semibold">{{ editMode ? 'Modifier' : 'Ajouter' }} une sous-structure</h3>
        </div>
        <form @submit.prevent="saveSousStructure" class="p-4">
          <div v-if="errorMessage" class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {{ errorMessage }}
          </div>
          <div class="space-y-3">

            <div>
              <label class="block text-sm font-medium text-gray-700">Sigle</label>
              <input type="text" v-model="formData.sigle" required class="w-28 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Nom de la sous-structure</label>
              <input type="text" v-model="formData.nomStructure" required class="mt-1 input-field" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Structure parente</label>
              <div class="relative">
                <input
                  type="text"
                  v-model="userStructure.nomStructure"
                  disabled
                  class="mt-1 input-field bg-gray-100"
                />
                <input
                  type="hidden"
                  v-model="formData.structureParenteId"
                />
              </div>
            </div>
          </div>

          <div class="mt-4 flex justify-end space-x-2">
            <button type="button" @click="showAddModal = false" class="btn-outline">
              Annuler
            </button>
            <button type="submit" class="btn-primary">
              {{ editMode ? 'Modifier' : 'Ajouter' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal de confirmation de suppression -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg w-full max-w-md p-6">
        <div class="text-center">
          <i class="fas fa-exclamation-triangle text-yellow-500 text-4xl mb-4"></i>
          <h3 class="text-lg font-semibold mb-2">Confirmer la suppression</h3>
          <p class="text-gray-600 mb-6">
            Êtes-vous sûr de vouloir supprimer la sous-structure "{{ structureToDelete?.nomStructure }}" ?
            Cette action est irréversible.
          </p>
        </div>
        <div class="flex justify-end space-x-3">
          <button
            @click="showDeleteModal = false"
            class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Annuler
          </button>
          <button
            @click="confirmDelete"
            class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ref, computed, onMounted, watch } from 'vue'
import { useStore } from 'vuex'
import { structureService } from '@/services/api'

export default {
  name: 'SousStructures',
  setup() {
    const store = useStore()
    const showAddModal = ref(false)
    const showDeleteModal = ref(false)
    const structureToDelete = ref(null)
    const editMode = ref(false)
    const sousStructures = ref([])
    const structures = ref([])
    const searchQuery = ref('')
    const searchStructure = ref('')
    const showStructuresList = ref(false)
    const errorMessage = ref('')
    const currentPage = ref(1)
    const itemsPerPage = 20
    const editingSousStructureId = ref(null)
    const userStructure = ref({
      id: null,
      nomStructure: '',
      sigle: ''
    })

    const formData = ref({
      nomStructure: '',
      sigle: '',
      structureParenteId: null
    })

    // Charger les données au démarrage
    onMounted(async () => {
      await loadUserData()
      await fetchSousStructures()
    })

    // Charger les données de l'utilisateur
    const loadUserData = async () => {
      try {
        // Vérifier si l'utilisateur est dans le store
        let userData = store.state.user
        
        // Si non, essayer de charger depuis localStorage
        if (!userData || !userData.structureId) {
          const storedUser = localStorage.getItem('user')
          if (storedUser) {
            userData = JSON.parse(storedUser)
            // Mettre à jour le store
            store.commit('setUser', userData)
          }
        }

        if (!userData) {
          console.error('Aucune donnée utilisateur trouvée')
          errorMessage.value = 'Aucune donnée utilisateur trouvée'
          return false
        }

        return true
      } catch (error) {
        console.error('Erreur lors du chargement des données utilisateur:', error)
        errorMessage.value = 'Erreur lors du chargement des données utilisateur'
        return false
      }
    }

    // Réinitialiser la page courante quand la recherche change
    watch(searchQuery, () => {
      currentPage.value = 1
    })

    // Filtrage des sous-structures
    const filteredSousStructures = computed(() => {
      const query = searchQuery.value.toLowerCase()
      return sousStructures.value.filter(sousStructure => {
        const nom = sousStructure.nomStructure?.toLowerCase() || ''
        const adresse = sousStructure.adresse?.toLowerCase() || ''
        const telephone = sousStructure.telephone?.toLowerCase() || ''
        const structureParente = sousStructure.structureParente?.nomStructure?.toLowerCase() || ''

        return nom.includes(query) ||
               adresse.includes(query) ||
               telephone.includes(query) ||
               structureParente.includes(query)
      })
    })

    // Pagination
    const totalPages = computed(() => Math.ceil(filteredSousStructures.value.length / itemsPerPage))
    const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage)
    const endIndex = computed(() => {
      const end = startIndex.value + itemsPerPage
      return end > filteredSousStructures.value.length ? filteredSousStructures.value.length : end
    })
    const paginatedSousStructures = computed(() => {
      return filteredSousStructures.value.slice(startIndex.value, endIndex.value)
    })

    const displayedPages = computed(() => {
      const pages = []
      const maxVisiblePages = 5
      
      if (totalPages.value <= maxVisiblePages) {
        for (let i = 1; i <= totalPages.value; i++) {
          pages.push(i)
        }
      } else {
        let start = Math.max(1, currentPage.value - Math.floor(maxVisiblePages / 2))
        let end = start + maxVisiblePages - 1
        
        if (end > totalPages.value) {
          end = totalPages.value
          start = Math.max(1, end - maxVisiblePages + 1)
        }
        
        for (let i = start; i <= end; i++) {
          pages.push(i)
        }
      }
      
      return pages
    })

    const filteredStructures = computed(() => {
      const search = searchStructure.value.toLowerCase()
      return structures.value
        .filter(structure => !structure.isDeleted)
        .filter(structure => 
          structure.nomStructure.toLowerCase().includes(search)
        )
    })

    const selectStructure = (structure) => {
      formData.value.structureParenteId = structure.id
      searchStructure.value = structure.nomStructure
      showStructuresList.value = false
    }

    // Charger les sous-structures
    const fetchSousStructures = async () => {
      try {
        // Vérifier que les données utilisateur sont chargées
        const userDataLoaded = await loadUserData()
        if (!userDataLoaded) return

        const userData = store.state.user
        console.log('Données utilisateur:', userData)

        // Récupérer uniquement la structure de l'utilisateur avec ses enfants
        const userStructureId = userData.structureId
        console.log('Structure ID de l\'utilisateur:', userStructureId)

        if (!userStructureId) {
          console.error('Aucune structure trouvée pour l\'utilisateur')
          errorMessage.value = 'Aucune structure associée à votre compte'
          return
        }

        // Récupérer toutes les structures et trouver celle de l'utilisateur
        const structuresData = await structureService.getStructures()
        const structure = structuresData.find(s => s.id === userStructureId)
        console.log('Structure récupérée:', structure)

          if (structure) {
          userStructure.value = {
            id: structure.id,
            nomStructure: structure.nomStructure,
            sigle: structure.sigle
          }
            formData.value.structureParenteId = structure.id

          // Récupérer les sous-structures
          const sousStructuresData = await structureService.getSousStructures()
          console.log('Toutes les sous-structures:', sousStructuresData)
          
          // Filtrer les sous-structures qui ont cette structure comme parent
          sousStructures.value = sousStructuresData.filter(sousStructure => 
            sousStructure.parentId === userStructureId
          )
          console.log('Sous-structures filtrées:', sousStructures.value)
        } else {
          console.error('Structure non trouvée pour l\'ID:', userStructureId)
          errorMessage.value = 'Structure non trouvée'
          return
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error)
        errorMessage.value = 'Erreur lors du chargement des données'
      }
    }

    const saveSousStructure = async () => {
      try {
        errorMessage.value = '';
        console.log('Mode création - Envoi des données:', formData.value);

        if (!formData.value.structureParenteId) {
          errorMessage.value = 'La structure parente est requise';
          return;
        }

        const sousStructureData = {
          nomStructure: formData.value.nomStructure,
          sigle: formData.value.sigle,
          parentId: Number(formData.value.structureParenteId),
          userId: null // Ajout explicite de userId null pour une sous-structure
        };

        console.log('Données de sous-structure à envoyer:', sousStructureData);

        if (editMode.value) {
          await structureService.updateSousStructure(editingSousStructureId.value, sousStructureData);
        } else {
          const response = await structureService.createSousStructure(sousStructureData);
          console.log('Réponse création sous-structure:', response);
        }

        // Rafraîchir la liste des sous-structures
        await fetchSousStructures();
        
        // Fermer le modal et réinitialiser le formulaire
        showAddModal.value = false;
        resetForm();

        // Afficher un message de succès
        store.dispatch('notification/setSuccess', 'Sous-structure créée avec succès');
      } catch (error) {
        console.error('Erreur lors de la création:', error);
        console.error('Détails de l\'erreur:', error.response?.data);
        
        if (error.response?.data?.message) {
          errorMessage.value = Array.isArray(error.response.data.message) 
            ? error.response.data.message.join(', ')
            : error.response.data.message;
        } else if (error.response?.data?.error) {
          errorMessage.value = error.response.data.error;
        } else {
          errorMessage.value = 'Une erreur est survenue lors de la sauvegarde de la sous-structure. Veuillez réessayer.';
      }
    }
    };

    const editSousStructure = (sousStructure) => {
      editMode.value = true
      editingSousStructureId.value = sousStructure.id
      formData.value = {
        nomStructure: sousStructure.nomStructure,
        sigle: sousStructure.sigle,
        structureParenteId: sousStructure.structureParenteId
      }
      searchStructure.value = sousStructure.structureParente?.nomStructure || ''
      showAddModal.value = true
    }

    const deleteSousStructure = (structure) => {
      structureToDelete.value = structure
      showDeleteModal.value = true
    }

    const confirmDelete = async () => {
        try {
        await structureService.deleteSousStructure(structureToDelete.value.id)
        sousStructures.value = sousStructures.value.filter(s => s.id !== structureToDelete.value.id)
        store.dispatch('notification/setSuccess', 'Sous-structure supprimée avec succès')
        showDeleteModal.value = false
        structureToDelete.value = null
        } catch (error) {
          console.error('Erreur lors de la suppression de la sous-structure:', error)
        store.dispatch('notification/setError', error.response?.data?.message || 'Erreur lors de la suppression')
      }
    }

    const resetForm = () => {
      editMode.value = false;
      editingSousStructureId.value = null;
      formData.value = {
        nomStructure: '',
        sigle: '',
        structureParenteId: userStructure.value?.id || null
      };
      searchStructure.value = '';
      errorMessage.value = '';
    }

    return {
      showAddModal,
      showDeleteModal,
      structureToDelete,
      editMode,
      sousStructures,
      filteredSousStructures,
      paginatedSousStructures,
      searchQuery,
      currentPage,
      totalPages,
      startIndex,
      endIndex,
      displayedPages,
      formData,
      searchStructure,
      showStructuresList,
      structures,
      filteredStructures,
      selectStructure,
      saveSousStructure,
      editSousStructure,
      deleteSousStructure,
      confirmDelete,
      errorMessage,
      userStructure
    }
  }
}
</script>

<style scoped>
.input-field {
  @apply w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary;
}

.btn-primary {
  @apply px-3 py-1.5 text-sm bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-1 focus:ring-primary focus:ring-offset-1;
}

.btn-outline {
  @apply px-3 py-1.5 text-sm border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-primary focus:ring-offset-1;
}

/* Styles pour le tableau */
table {
  @apply w-full;
}

th {
  @apply sticky top-0 z-10;
}

tr {
  @apply transition-colors duration-150;
}

td {
  @apply text-sm text-gray-900;
}
</style> 