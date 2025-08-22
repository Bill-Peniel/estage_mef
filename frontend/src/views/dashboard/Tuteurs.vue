<template>
  <div class="min-h-screen bg-gray-100 top-10 md:top-16 lg:top-16 relative z-0">
    <div class="flex-1">
      <header class="bg-white shadow sticky top-0 z-20">
        <div class="px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-2">
          <h1 class="text-2xl font-bold text-primary text-center sm:text-left">Gestion des agents</h1>
          <button @click="showAddModal = true" class="bg-primary text-white px-4 py-2 rounded hover:bg-green-900 w-full sm:w-auto">
            <i class="fas fa-plus mr-2"></i> Ajouter un agent
          </button>
        </div>
      </header>

      <main class="p-2 sm:p-6">
        <div class="bg-white shadow rounded-lg">
          <!-- Barre de recherche -->
          <div class="p-4 border-b border-gray-200">
            <div class="relative">
              <input
                type="text"
                v-model="searchQuery"
                placeholder="Rechercher un tuteur..."
                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              />
              <i class="fas fa-search absolute right-3 top-3 text-gray-400"></i>
            </div>
          </div>

          <!-- Desktop Table -->
          <div class="overflow-x-auto hidden md:block">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom complet</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Structure</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Téléphone</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="tuteur in paginatedTuteurs" :key="tuteur.id" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap">{{ tuteur.user?.profile?.nom }} {{ tuteur.user?.profile?.prenom }}</td>
                  <td class="px-6 py-4 break-words">{{ tuteur.structure?.nomStructure }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">{{ tuteur.user?.email }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">{{ tuteur.user?.profile?.telephone }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-2">
                    <button @click="editTuteur(tuteur)" class="text-primary hover:text-primary-dark" title="Modifier">
                      <i class="fas fa-edit"></i>
                    </button>
                    <button @click="deleteTuteur(tuteur.id)" class="text-danger hover:text-red-700" title="Supprimer">
                      <i class="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
                <tr v-if="paginatedTuteurs.length === 0">
                  <td colspan="5" class="px-6 py-4 text-center text-gray-500">
                    Aucun tuteur trouvé
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Mobile Cards -->
          <div class="md:hidden space-y-4 p-2">
            <div v-for="tuteur in paginatedTuteurs" :key="tuteur.id" class="bg-white rounded-lg shadow p-4 flex flex-col gap-2">
              <div class="flex items-center justify-between mb-1">
                <span class="font-semibold text-gray-900">{{ tuteur.user?.profile?.nom }} {{ tuteur.user?.profile?.prenom }}</span>
                <span class="text-xs text-gray-500">{{ tuteur.structure?.nomStructure }}</span>
              </div>
              <div class="flex items-center text-gray-700 text-sm mb-1">
                <i class="fas fa-envelope mr-1 text-primary"></i>
                <span>{{ tuteur.user?.email }}</span>
              </div>
              <div class="flex items-center text-gray-700 text-sm mb-1">
                <i class="fas fa-phone mr-1 text-primary"></i>
                <span>{{ tuteur.user?.profile?.telephone }}</span>
              </div>
              <div class="flex items-center gap-2 mt-2">
                <button @click="editTuteur(tuteur)" class="text-primary hover:text-primary-dark" title="Modifier">
                  <i class="fas fa-edit"></i>
                </button>
                <button @click="deleteTuteur(tuteur.id)" class="text-danger hover:text-red-700" title="Supprimer">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </div>
            <!-- Pagination mobile -->
            <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
              <button 
                @click="currentPage--" 
                :disabled="currentPage === 1"
                class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Précédent
              </button>
              <span class="text-sm text-gray-700">Page {{ currentPage }} / {{ totalPages }}</span>
              <button 
                @click="currentPage++" 
                :disabled="currentPage === totalPages"
                class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Suivant
              </button>
            </div>
          </div>

        </div>
      </main>
    </div>

    <!-- Modal d'ajout/modification -->
    <div v-if="showAddModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto ">
      <div class="relative top-16 mb-16 bg-white rounded-lg w-full max-w-md my-8 mx-2 sm:mx-auto">
        <div class="px-4 py-3 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-center">{{ editMode ? 'Modifier' : 'Ajouter' }} un agent</h3>
        </div>
        <form @submit.prevent="saveTuteur" class="p-4 space-y-3">
          <div v-if="errorMessage" class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {{ errorMessage }}
          </div>
          <div class="space-y-3">
            <div class="grid grid-cols-1 gap-3">
              <div>
                <label class="block text-sm font-medium text-gray-700">Nom</label>
                <input type="text" v-model="formData.nom" required class="mt-1 input-field" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Prénom</label>
                <input type="text" v-model="formData.prenom" required class="mt-1 input-field" />
              </div>
            </div>

            <div class="grid grid-cols-1 gap-3">
              <div>
                <label class="block text-sm font-medium text-gray-700">Sexe</label>
                <select v-model="formData.sexe" required class="mt-1 input-field">
                  <option value="">Sélectionnez</option>
                  <option value="M">Masculin</option>
                  <option value="F">Féminin</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Téléphone</label>
                <input type="tel" v-model="formData.telephone" required class="mt-1 input-field" />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Structure</label>
              <div class="relative">
                <input
                  type="text"
                  v-model="searchStructure"
                  @focus="showStructuresList = true"
                  placeholder="Rechercher une structure..."
                  class="mt-1 input-field"
                />
                <div v-if="showStructuresList" class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto">
                  <div
                    v-for="structure in filteredStructures"
                    :key="structure.id"
                    @click="selectStructure(structure)"
                    class="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                  >
                    {{ structure.nomStructure }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Nouveau champ pour la sous-structure -->
            <div v-if="selectedStructure && selectedStructure.sousStructures && selectedStructure.sousStructures.length > 0">
              <label class="block text-sm font-medium text-gray-700">Sous-structure (optionnel)</label>
              <select v-model="formData.sousStructureId" class="mt-1 input-field">
                <option value="">Sélectionner une sous-structure</option>
                <option v-for="sousStructure in selectedStructure.sousStructures" 
                        :key="sousStructure.id" 
                        :value="sousStructure.id">
                  {{ sousStructure.nomStructure }}
                </option>
              </select>
            </div>

            <div class="grid grid-cols-1 gap-3">
              <div>
                <label class="block text-sm font-medium text-gray-700">Email</label>
                <input 
                  type="email" 
                  v-model="formData.email" 
                  @input="validateEmailOnInput"
                  required 
                  class="mt-1 input-field"
                  :class="{ 'error': emailError }"
                />
                <p v-if="emailError" class="mt-1 text-sm text-red-600">{{ emailError }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Mot de passe</label>
                <input 
                  type="password" 
                  v-model="formData.password" 
                  @input="validatePasswordOnInput"
                  required 
                  class="mt-1 input-field"
                  :class="{ 'error': passwordError }"
                  placeholder="Mot de passe" 
                />
                <p v-if="passwordError" class="mt-1 text-sm text-red-600">{{ passwordError }}</p>
              </div>
            </div>
          </div>

          <div class="mt-4 flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2">
            <button type="button" @click="showAddModal = false" class="btn-outline w-full sm:w-auto">
              Annuler
            </button>
            <button type="submit" class="btn-primary w-full sm:w-auto">
              {{ editMode ? 'Modifier' : 'Ajouter' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { tuteurService } from '@/services/api'
import { useStore } from 'vuex'

export default {
  name: 'Tuteurs',
  setup() {
    const store = useStore()
    const showAddModal = ref(false)
    const editMode = ref(false)
    const tuteurs = ref([])
    const searchQuery = ref('')
    const searchStructure = ref('')
    const showStructuresList = ref(false)
    const structures = ref([])
    const errorMessage = ref('')
    const emailError = ref('')
    const passwordError = ref('')
    const currentPage = ref(1)
    const itemsPerPage = 20
    const selectedStructure = ref(null)

    // Réinitialiser la page courante quand la recherche change
    watch(searchQuery, () => {
      currentPage.value = 1
    })

    // Filtrage des tuteurs
    const filteredTuteurs = computed(() => {
      const query = searchQuery.value.toLowerCase()
      return tuteurs.value.filter(tuteur => {
        const nomComplet = `${tuteur.user?.profile?.nom} ${tuteur.user?.profile?.prenom}`.toLowerCase()
        const email = tuteur.user?.email?.toLowerCase() || ''
        const telephone = tuteur.user?.profile?.telephone?.toLowerCase() || ''
        const structure = tuteur.structure?.nomStructure?.toLowerCase() || ''

        return nomComplet.includes(query) ||
               email.includes(query) ||
               telephone.includes(query) ||
               structure.includes(query)
      })
    })

    // Pagination
    const totalPages = computed(() => Math.ceil(filteredTuteurs.value.length / itemsPerPage))
    
    const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage)
    
    const endIndex = computed(() => {
      const end = startIndex.value + itemsPerPage
      return end > filteredTuteurs.value.length ? filteredTuteurs.value.length : end
    })

    const paginatedTuteurs = computed(() => {
      return filteredTuteurs.value.slice(startIndex.value, endIndex.value)
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

    const formData = ref({
      nom: '',
      prenom: '',
      sexe: '',
      telephone: '',
      structureId: '',
      sousStructureId: '',
      email: '',
      password: '',
      role: 'agent'
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
      formData.value.structureId = structure.id
      searchStructure.value = structure.nomStructure
      selectedStructure.value = structure
      formData.value.sousStructureId = '' // Réinitialiser la sous-structure
      showStructuresList.value = false
    }

    // Charger les tuteurs et les structures au montage du composant
    onMounted(async () => {
      try {
        const [tuteursData, structuresData] = await Promise.all([
          tuteurService.getTuteurs(),
          tuteurService.getStructures()
        ])
        console.log('Tous les tuteurs reçus:', tuteursData)
        console.log('Rôle de l\'utilisateur connecté:', store.state.user?.role)
        
        // Filtrer les tuteurs en fonction du rôle de l'utilisateur connecté
        if (store.state.user?.role === 'admin') {
          // L'admin ne voit que les agents qu'il a créés (role === 'structure')
          tuteurs.value = tuteursData.filter(tuteur => {
            console.log('Tuteur:', tuteur.user?.role, tuteur.user?.email)
            return tuteur.user?.role === 'structure'
          })
          console.log('Tuteurs filtrés pour admin:', tuteurs.value)
        } else {
          // Les autres utilisateurs voient tous les tuteurs
        tuteurs.value = tuteursData
        }
        structures.value = structuresData.filter(s => !s.isDeleted)
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error)
        store.dispatch('setError', 'Erreur lors du chargement des données')
      }
    })

    const validateEmail = (email) => {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    };

    const validateEmailOnInput = () => {
      emailError.value = ''
      if (!formData.value.email) {
        emailError.value = 'L\'email est requis'
        return
      }
      if (!validateEmail(formData.value.email)) {
        emailError.value = 'Veuillez entrer une adresse email valide'
      }
    }

    const validatePasswordOnInput = () => {
      passwordError.value = ''
      if (!formData.value.password) {
        passwordError.value = 'Le mot de passe est requis'
        return
      }
      if (formData.value.password.length < 6) {
        passwordError.value = 'Le mot de passe doit contenir au moins 6 caractères'
      }
    }

    const saveTuteur = async () => {
      try {
        // Validation des champs obligatoires
        if (!formData.value.email || !formData.value.password || !formData.value.nom || !formData.value.prenom) {
          errorMessage.value = 'Veuillez remplir tous les champs obligatoires';
          return;
        }

        // Validation du format de l'email
        if (!validateEmail(formData.value.email)) {
          emailError.value = 'Veuillez entrer une adresse email valide';
          return;
        }

        // Validation de la structure
        if (!formData.value.structureId) {
          errorMessage.value = 'Veuillez sélectionner une structure';
          return;
        }

        // Validation du mot de passe
        if (formData.value.password.length < 6) {
          passwordError.value = 'Le mot de passe doit contenir au moins 6 caractères';
          return;
        }

        const tuteurData = {
          email: formData.value.email,
          password: formData.value.password,
          nom: formData.value.nom,
          prenom: formData.value.prenom,
          telephone: formData.value.telephone,
          structureId: parseInt(formData.value.structureId),
          role: store.state.user?.role === 'admin' ? 'agent' : 'tuteur'
        };

        // Vérifier si la structure sélectionnée a des sous-structures
        const selectedStructure = structures.value.find(s => s.id === parseInt(formData.value.structureId));
        console.log('Structure sélectionnée:', selectedStructure);

        // Si l'utilisateur est un admin, on n'exige pas de sous-structure
        if (store.state.user?.role !== 'admin' && selectedStructure?.sousStructures?.length > 0) {
          // Si la structure a des sous-structures et que l'utilisateur n'est pas admin, on doit en sélectionner une
          if (!formData.value.sousStructureId) {
            errorMessage.value = 'Veuillez sélectionner une sous-structure';
            return;
          }
          // Vérifier que la sous-structure sélectionnée appartient bien à la structure
          const sousStructure = selectedStructure.sousStructures.find(s => s.id === parseInt(formData.value.sousStructureId));
          if (!sousStructure) {
            errorMessage.value = 'La sous-structure sélectionnée n\'appartient pas à la structure';
            return;
          }
          tuteurData.sousStructureId = parseInt(formData.value.sousStructureId);
        } else if (formData.value.sousStructureId && formData.value.sousStructureId !== formData.value.structureId) {
          // Si une sous-structure différente de la structure parente est sélectionnée
          tuteurData.sousStructureId = parseInt(formData.value.sousStructureId);
        } else {
          // Si aucune sous-structure n'est sélectionnée ou si c'est la même que la structure parente
          tuteurData.sousStructureId = null;
        }

        console.log('Données envoyées pour création:', JSON.stringify(tuteurData, null, 2))

        if (editMode.value) {
          await tuteurService.updateTuteur(editingTuteurId.value, tuteurData);
          store.dispatch('setSuccess', 'Agent modifié avec succès');
        } else {
          try {
            const response = await tuteurService.createTuteur(tuteurData);
            console.log('Réponse de création:', response.data)
            store.dispatch('setSuccess', 'Agent ajouté avec succès');
          } catch (error) {
            console.error('Erreur détaillée:', {
              status: error.response?.status,
              data: error.response?.data,
              message: error.response?.data?.message,
              config: error.config
            });
            if (error.response?.status === 409) {
              emailError.value = error.response.data.message || 'Un utilisateur avec cet email existe déjà';
              return;
            }
            throw error;
          }
        }

        await loadTuteurs();
        showAddModal.value = false;
        resetForm();
      } catch (error) {
        console.error('Erreur lors de la sauvegarde du tuteur:', error);
        if (error.response?.status === 409) {
          emailError.value = error.response.data.message || 'Un utilisateur avec cet email existe déjà';
        } else if (error.response?.status === 400) {
          errorMessage.value = typeof error.response.data.message === 'string' 
            ? error.response.data.message 
            : Array.isArray(error.response.data.message) 
              ? error.response.data.message.join(', ')
              : 'Données invalides';
        } else if (error.response?.status === 500) {
          errorMessage.value = 'Une erreur est survenue lors de la création du tuteur. Veuillez réessayer.';
        } else {
          errorMessage.value = error.response?.data?.message || 'Une erreur est survenue';
        }
        console.error('Message d\'erreur complet:', errorMessage.value);
      }
    };

    const editTuteur = (tuteur) => {
      editMode.value = true
      formData.value = { ...tuteur }
      searchStructure.value = tuteur.structure?.nomStructure || ''
      showAddModal.value = true
    }

    const deleteTuteur = async (id) => {
      if (confirm('Êtes-vous sûr de vouloir supprimer cet agent ?')) {
        try {
          await tuteurService.deleteTuteur(id)
          tuteurs.value = tuteurs.value.filter(t => t.id !== id)
        } catch (error) {
          console.error('Erreur lors de la suppression du tuteur:', error)
          errorMessage.value = error.response?.data?.message || 'Erreur lors de la suppression du tuteur'
        }
      }
    }

    const resetForm = () => {
      editMode.value = false;
      formData.value = {
        nom: '',
        prenom: '',
        sexe: '',
        telephone: '',
        structureId: '',
        sousStructureId: '',
        email: '',
        password: '',
        role: 'agent'
      };
      searchStructure.value = '';
      selectedStructure.value = null;
      errorMessage.value = '';
      emailError.value = '';
      passwordError.value = '';
    }

    const loadTuteurs = async () => {
      try {
        const tuteursData = await tuteurService.getTuteurs();
        console.log('Tuteurs reçus lors du rechargement:', tuteursData)
        console.log('Rôle de l\'utilisateur connecté:', store.state.user?.role)
        
        // Filtrer les tuteurs en fonction du rôle de l'utilisateur connecté
        if (store.state.user?.role === 'admin') {
          // L'admin ne voit que les agents qu'il a créés (role === 'structure')
          tuteurs.value = tuteursData.filter(tuteur => {
            console.log('Tuteur filtré:', tuteur.user?.role, tuteur.user?.email)
            return tuteur.user?.role === 'structure'
          })
          console.log('Tuteurs filtrés pour admin:', tuteurs.value)
        } else {
          // Les autres utilisateurs voient tous les tuteurs
          tuteurs.value = tuteursData
        }
      } catch (error) {
        console.error('Erreur lors du chargement des tuteurs:', error);
        store.dispatch('setError', 'Erreur lors du chargement des tuteurs');
      }
    };

    const fetchStructures = async () => {
      try {
        const response = await api.get('/structures')
        console.log('Structures reçues:', response.data)
        // Filtrer pour ne garder que les structures principales (parentId est null)
        structures.value = response.data.filter(structure => !structure.parentId)
        
        // Pour chaque structure principale, récupérer ses sous-structures
        for (let structure of structures.value) {
          const sousStructures = response.data.filter(s => s.parentId === structure.id)
          structure.sousStructures = sousStructures
        }
        
        console.log('Structures avec sous-structures:', structures.value)
      } catch (err) {
        console.error('Erreur lors du chargement des structures:', err)
        toast.error('Erreur lors du chargement des structures')
      }
    }

    return {
      showAddModal,
      editMode,
      tuteurs,
      filteredTuteurs,
      paginatedTuteurs,
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
      saveTuteur,
      editTuteur,
      deleteTuteur,
      errorMessage,
      emailError,
      passwordError,
      validateEmailOnInput,
      validatePasswordOnInput,
      loadTuteurs,
      selectedStructure,
      fetchStructures
    }
  }
}
</script>

<style scoped>
.input-field {
  @apply w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary;
}

.input-field.error {
  @apply border-red-500 focus:ring-red-500 focus:border-red-500;
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
