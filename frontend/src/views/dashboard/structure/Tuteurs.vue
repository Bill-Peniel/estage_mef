<template>
  <div class="min-h-screen bg-gray-100">
    <div class="flex-1">
      <header class="bg-primary shadow">
        <div class="px-4 py-4 flex justify-between items-center">
          <h1 class="text-2xl font-bold text-white">Gestion des agents</h1>
          <button @click="showAddModal = true" class="bg-white text-primary px-4 py-2 rounded hover:bg-gray-100">
            <i class="fas fa-plus mr-2"></i> Ajouter un agent
          </button>
        </div>
      </header>

      <main class="p-6">
        <!-- Formulaire d'ajout d'agent -->
        <div v-if="showAddModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div class="bg-white rounded-lg w-full max-w-md p-6">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-xl font-semibold">{{ editMode ? 'Modifier' : 'Ajouter' }} un agent</h2>
              <button @click="closeModal" class="text-gray-500 hover:text-gray-700">
                <i class="fas fa-times"></i>
              </button>
            </div>

            <form @submit.prevent="editMode ? updateAgent() : createAgent()" class="space-y-4">
              <div v-if="errorMessage" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {{ errorMessage }}
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700">Nom</label>
                  <input type="text" v-model="formData.nom" required class="mt-1 input-field" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Prénom</label>
                  <input type="text" v-model="formData.prenom" required class="mt-1 input-field" />
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" v-model="formData.email" required class="mt-1 input-field" />
                <p v-if="emailError" class="text-red-500 text-sm mt-1">{{ emailError }}</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">Téléphone</label>
                <input type="tel" v-model="formData.telephone" required class="mt-1 input-field" />
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
                    v-model="formData.structureId"
                  />
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">Sous-structure</label>
                <select v-model="formData.sousStructureId" required class="mt-1 input-field">
                  <option value="">Sélectionner une sous-structure</option>
                  <option v-for="sousStructure in sousStructures" :key="sousStructure.id" :value="sousStructure.id">
                    {{ sousStructure.nomStructure }}
                  </option>
                </select>
              </div>

              <div v-if="!editMode">
                <label class="block text-sm font-medium text-gray-700">Mot de passe</label>
                <input type="password" v-model="formData.password" :required="!editMode" class="mt-1 input-field" />
                <p v-if="passwordError" class="text-red-500 text-sm mt-1">{{ passwordError }}</p>
              </div>

              <div class="flex justify-end space-x-3">
                <button type="button" @click="closeModal" class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                  Annuler
                </button>
                <button type="submit" class="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark">
                  {{ editMode ? 'Modifier' : 'Créer' }} l'agent
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
                Êtes-vous sûr de vouloir supprimer l'agent "{{ agentToDelete?.user?.profile?.nom }} {{ agentToDelete?.user?.profile?.prenom }}" ?
                Cette action est irréversible.
              </p>
            </div>
            <div class="flex justify-end space-x-3">
              <button
                @click="showDeleteModal = false"
                class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                @click="confirmDelete"
                class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>

        <!-- Liste des agents -->
        <div class="bg-white shadow rounded-lg">
          <div class="p-4 border-b border-gray-200">
            <div class="relative">
              <input
                type="text"
                v-model="searchQuery"
                placeholder="Rechercher un agent..."
                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              />
              <i class="fas fa-search absolute right-3 top-3 text-gray-400"></i>
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Téléphone</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="agent in filteredAgents" :key="agent.id">
                  <td class="px-6 py-4">{{ agent.user?.profile?.nom }} {{ agent.user?.profile?.prenom }}</td>
                  <td class="px-6 py-4">{{ agent.user?.email }}</td>
                  <td class="px-6 py-4">{{ agent.user?.profile?.telephone }}</td>
                  <td class="px-6 py-4">
                    <button @click="editAgent(agent)" class="text-primary hover:text-primary-dark mr-3">
                      <i class="fas fa-edit"></i>
                    </button>
                    <button @click="deleteAgent(agent)" class="text-red-600 hover:text-red-900">
                      <i class="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useStore } from 'vuex'
import { tuteurService, structureService } from '@/services/api'

export default {
  name: 'Tuteurs',
  setup() {
    const store = useStore()
    const agents = ref([])
    const sousStructures = ref([])
    const showAddModal = ref(false)
    const showDeleteModal = ref(false)
    const agentToDelete = ref(null)
    const agentToEdit = ref(null)
    const editMode = ref(false)
    const searchQuery = ref('')
    const errorMessage = ref('')
    const emailError = ref('')
    const passwordError = ref('')

    const userStructure = ref({
      id: null,
      nomStructure: '',
      sigle: ''
    })

    // Récupérer le structureId de l'utilisateur connecté
    const structureId = computed(() => {
      const id = store.state.user?.structureId
      console.log('Structure ID:', id) // Pour le débogage
      return id
    })

    const formData = ref({
      nom: '',
      prenom: '',
      email: '',
      telephone: '',
      password: '',
      role: 'tuteur',
      structureId: null,
      sousStructureId: ''
    })

    // Mettre à jour le structureId dans formData quand il change
    watch(structureId, (newId) => {
      if (newId) {
        formData.value.structureId = newId
      }
    }, { immediate: true })

    // Charger les sous-structures
    const fetchSousStructures = async () => {
      try {
        const response = await structureService.getSousStructures()
        sousStructures.value = response.filter(sousStructure => 
          sousStructure.parentId === store.state.user.structureId
        )

        // Récupérer la structure de l'utilisateur
        const structuresResponse = await structureService.getStructures()
        const structure = structuresResponse.find(s => s.id === store.state.user.structureId)
        if (structure) {
          userStructure.value = {
            id: structure.id,
            nomStructure: structure.nomStructure,
            sigle: structure.sigle
          }
          formData.value.structureId = structure.id
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des sous-structures:', error)
        errorMessage.value = 'Erreur lors de la récupération des sous-structures'
      }
    }

    const filteredAgents = computed(() => {
      if (!searchQuery.value) return agents.value
      
      const query = searchQuery.value.toLowerCase()
      return agents.value.filter(agent => {
        const nom = `${agent.user?.profile?.nom} ${agent.user?.profile?.prenom}`.toLowerCase()
        const email = agent.user?.email.toLowerCase()
        return nom.includes(query) || email.includes(query)
      })
    })

    const validateEmail = (email) => {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return re.test(email)
    }

    const createAgent = async () => {
      try {
        errorMessage.value = ''
        emailError.value = ''
        passwordError.value = ''

        // Validation
        if (!validateEmail(formData.value.email)) {
          emailError.value = 'Veuillez entrer une adresse email valide'
          return
        }

        if (formData.value.password.length < 6) {
          passwordError.value = 'Le mot de passe doit contenir au moins 6 caractères'
          return
        }

        if (!structureId.value) {
          errorMessage.value = 'ID de structure non disponible. Veuillez vous reconnecter.'
          return
        }

        if (!formData.value.sousStructureId) {
          errorMessage.value = 'Veuillez sélectionner une sous-structure'
          return
        }

        const agentData = {
          ...formData.value,
          structureId: structureId.value,
          role: 'tuteur'
        }

        console.log('Données envoyées:', agentData) // Pour le débogage

        await tuteurService.createTuteur(agentData)
        store.dispatch('setSuccess', 'Agent ajouté avec succès')

        // Réinitialiser le formulaire et fermer la modal
        formData.value = {
          nom: '',
          prenom: '',
          email: '',
          telephone: '',
          password: '',
          role: 'tuteur',
          structureId: structureId.value,
          sousStructureId: ''
        }
        showAddModal.value = false
        await fetchAgents()
      } catch (error) {
        console.error('Erreur lors de la création de l\'agent:', error)
        if (error.response?.status === 409) {
          emailError.value = 'Un utilisateur avec cet email existe déjà'
        } else if (error.response?.status === 400) {
          errorMessage.value = error.response.data.message || 'Données invalides'
        } else {
          errorMessage.value = error.response?.data?.message || 'Une erreur est survenue lors de la création de l\'agent'
        }
      }
    }

    const closeModal = () => {
      showAddModal.value = false
      editMode.value = false
      agentToEdit.value = null
      resetForm()
    }

    const resetForm = () => {
      formData.value = {
        nom: '',
        prenom: '',
        email: '',
        telephone: '',
        password: '',
        role: 'tuteur',
        structureId: structureId.value,
        sousStructureId: ''
      }
      errorMessage.value = ''
      emailError.value = ''
      passwordError.value = ''
    }

    const editAgent = (agent) => {
      editMode.value = true
      agentToEdit.value = agent
      formData.value = {
        nom: agent.user.profile.nom,
        prenom: agent.user.profile.prenom,
        email: agent.user.email,
        telephone: agent.user.profile.telephone || '',
        structureId: structureId.value,
        sousStructureId: agent.structureId,
        role: 'tuteur'
      }
      showAddModal.value = true
    }

    const updateAgent = async () => {
      try {
        errorMessage.value = ''
        emailError.value = ''
        passwordError.value = ''

        if (!validateEmail(formData.value.email)) {
          emailError.value = 'Veuillez entrer une adresse email valide'
          return
        }

        if (!formData.value.sousStructureId) {
          errorMessage.value = 'Veuillez sélectionner une sous-structure'
          return
        }

        const agentData = {
          ...formData.value,
          structureId: formData.value.sousStructureId
        }

        await tuteurService.updateTuteur(agentToEdit.value.id, agentData)
        store.dispatch('setSuccess', 'Agent modifié avec succès')
        closeModal()
        await fetchAgents()
      } catch (error) {
        console.error('Erreur lors de la modification de l\'agent:', error)
        errorMessage.value = error.response?.data?.message || 'Une erreur est survenue lors de la modification de l\'agent'
      }
    }

    const deleteAgent = (agent) => {
      agentToDelete.value = agent
      showDeleteModal.value = true
    }

    const confirmDelete = async () => {
      try {
        await tuteurService.deleteTuteur(agentToDelete.value.id)
        store.dispatch('setSuccess', 'Agent supprimé avec succès')
        showDeleteModal.value = false
        agentToDelete.value = null
        await fetchAgents()
      } catch (error) {
        console.error('Erreur lors de la suppression de l\'agent:', error)
        errorMessage.value = error.response?.data?.message || 'Erreur lors de la suppression de l\'agent'
          }
    }

    const fetchAgents = async () => {
      try {
        const response = await tuteurService.getTuteurs()
        // Filtrer les agents en fonction de la structure de l'utilisateur connecté
        agents.value = response.filter(agent => {
          // Vérifier si l'agent appartient à une sous-structure de la structure parente
          const isInStructure = agent.structure?.parentId === store.state.user.structureId
          return isInStructure && agent.user?.role === 'tuteur'
        })
        console.log('Agents filtrés:', agents.value) // Pour le débogage
      } catch (error) {
        console.error('Erreur lors de la récupération des agents:', error)
        errorMessage.value = error.response?.data?.message || 'Erreur lors de la récupération des agents'
      }
    }

    onMounted(() => {
      fetchAgents()
      fetchSousStructures()
    })

    return {
      agents,
      sousStructures,
      showAddModal,
      showDeleteModal,
      agentToDelete,
      agentToEdit,
      editMode,
      searchQuery,
      formData,
      errorMessage,
      emailError,
      passwordError,
      filteredAgents,
      createAgent,
      updateAgent,
      deleteAgent,
      confirmDelete,
      editAgent,
      closeModal,
      userStructure
    }
  }
}
</script>

<style scoped>
.input-field {
  @apply w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent;
}
</style>
