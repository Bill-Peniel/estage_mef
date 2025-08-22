<template>
  <div class="space-y-6">
    <!-- En-tête -->
    <div class="bg-white rounded-lg shadow p-6">
      <div class="flex justify-between items-center">
        <div>
          <h2 class="text-2xl font-bold text-gray-900">Gestion des Agents</h2>
          <p class="text-gray-600 mt-2">
            Créez et gérez les agents de vos sous-structures techniques
          </p>
        </div>
        <button
          @click="showAddModal = true"
          class="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg flex items-center"
        >
          <i class="fas fa-plus mr-2"></i>
          Nouvel agent
        </button>
      </div>
    </div>

    <!-- Liste des agents -->
    <div class="bg-white rounded-lg shadow">
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900">Agents existants</h3>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nom
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Téléphone
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sous-structure
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="agent in agents" :key="agent.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">
                  {{ agent.user?.profile?.prenom }} {{ agent.user?.profile?.nom }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ agent.user?.email }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ agent.user?.profile?.telephone || '-' }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ agent.structure?.nomStructure }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  @click="editAgent(agent)"
                  class="text-primary hover:text-primary-dark mr-3"
                >
                  <i class="fas fa-edit"></i>
                </button>
                <button
                  @click="deleteAgent(agent.id)"
                  class="text-red-600 hover:text-red-900"
                >
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal d'ajout/édition -->
    <div v-if="showAddModal || showEditModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-medium text-gray-900">
              {{ showEditModal ? 'Modifier l\'agent' : 'Nouvel agent' }}
            </h3>
            <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
              <i class="fas fa-times"></i>
            </button>
          </div>

          <form @submit.prevent="showEditModal ? updateAgent() : createAgent()" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Prénom</label>
                <input
                  v-model="formData.prenom"
                  type="text"
                  required
                  class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Nom</label>
                <input
                  v-model="formData.nom"
                  type="text"
                  required
                  class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary focus:border-primary"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Email</label>
              <input
                v-model="formData.email"
                type="email"
                required
                class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Téléphone</label>
              <input
                v-model="formData.telephone"
                type="tel"
                required
                class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>

            <div v-if="!showEditModal">
              <label class="block text-sm font-medium text-gray-700">Mot de passe</label>
              <input
                v-model="formData.password"
                type="password"
                required
                class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Sous-structure</label>
              <select
                v-model="formData.sousStructureId"
                required
                class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary focus:border-primary"
              >
                <option value="">Sélectionner une sous-structure</option>
                <option
                  v-for="sousStructure in sousStructures"
                  :key="sousStructure.id"
                  :value="sousStructure.id"
                >
                  {{ sousStructure.nomStructure }}
                </option>
              </select>
            </div>

            <div class="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                @click="closeModal"
                class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                type="submit"
                class="px-4 py-2 bg-primary border border-transparent rounded-md text-sm font-medium text-white hover:bg-primary-dark"
              >
                {{ showEditModal ? 'Modifier' : 'Créer' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, reactive } from 'vue'
import { useStore } from 'vuex'
import { structureService, tuteurService } from '@/services/api'

export default {
  name: 'StructureDirectionnelleTuteurs',
  setup() {
    const store = useStore()
    const showAddModal = ref(false)
    const showEditModal = ref(false)
    const agents = ref([])
    const sousStructures = ref([])
    const editingId = ref(null)

    const formData = reactive({
      nom: '',
      prenom: '',
      email: '',
      telephone: '',
      password: '',
      sousStructureId: ''
    })

    const loadData = async () => {
      try {
        const user = store.state.user
        const response = await structureService.getStructures()
        const userStructure = response.find(structure => 
          structure.users?.some(u => u.id === user?.id) ||
          structure.tuteurs?.some(t => t.userId === user?.id)
        )
        
        if (userStructure) {
          // Récupérer les sous-structures
          sousStructures.value = response.filter(structure => 
            structure.parentId === userStructure.id && structure.type === 'technique'
          )
          
          // Récupérer les agents des sous-structures
          const allAgents = []
          for (const sousStructure of sousStructures.value) {
            const structureAgents = await tuteurService.getTuteursByStructure(sousStructure.id)
            allAgents.push(...structureAgents)
          }
          agents.value = allAgents
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error)
        store.dispatch('setNotification', {
          type: 'error',
          message: 'Erreur lors du chargement des données'
        })
      }
    }

    const createAgent = async () => {
      try {
        const newAgent = {
          nom: formData.nom,
          prenom: formData.prenom,
          email: formData.email,
          telephone: formData.telephone,
          password: formData.password,
          structureId: formData.sousStructureId,
          role: 'agent'
        }

        await tuteurService.createTuteur(newAgent)
        
        store.dispatch('setNotification', {
          type: 'success',
          message: 'Agent créé avec succès'
        })

        closeModal()
        await loadData()
      } catch (error) {
        console.error('Erreur lors de la création:', error)
        store.dispatch('setNotification', {
          type: 'error',
          message: 'Erreur lors de la création de l\'agent'
        })
      }
    }

    const editAgent = (agent) => {
      editingId.value = agent.id
      formData.nom = agent.user?.profile?.nom || ''
      formData.prenom = agent.user?.profile?.prenom || ''
      formData.email = agent.user?.email || ''
      formData.telephone = agent.user?.profile?.telephone || ''
      formData.sousStructureId = agent.structureId || ''
      showEditModal.value = true
    }

    const updateAgent = async () => {
      try {
        // Pour la mise à jour, on ne peut que modifier les informations de base
        // Le mot de passe et la structure ne peuvent pas être modifiés
        await tuteurService.updateTuteur(editingId.value, {
          nom: formData.nom,
          prenom: formData.prenom,
          telephone: formData.telephone
        })

        store.dispatch('setNotification', {
          type: 'success',
          message: 'Agent modifié avec succès'
        })

        closeModal()
        await loadData()
      } catch (error) {
        console.error('Erreur lors de la modification:', error)
        store.dispatch('setNotification', {
          type: 'error',
          message: 'Erreur lors de la modification de l\'agent'
        })
      }
    }

    const deleteAgent = async (id) => {
      if (!confirm('Êtes-vous sûr de vouloir supprimer cet agent ?')) {
        return
      }

      try {
        await tuteurService.deleteTuteur(id)
        
        store.dispatch('setNotification', {
          type: 'success',
          message: 'Agent supprimé avec succès'
        })

        await loadData()
      } catch (error) {
        console.error('Erreur lors de la suppression:', error)
        store.dispatch('setNotification', {
          type: 'error',
          message: 'Erreur lors de la suppression de l\'agent'
        })
      }
    }

    const closeModal = () => {
      showAddModal.value = false
      showEditModal.value = false
      editingId.value = null
      formData.nom = ''
      formData.prenom = ''
      formData.email = ''
      formData.telephone = ''
      formData.password = ''
      formData.sousStructureId = ''
    }

    onMounted(() => {
      loadData()
    })

    return {
      showAddModal,
      showEditModal,
      agents,
      sousStructures,
      formData,
      createAgent,
      editAgent,
      updateAgent,
      deleteAgent,
      closeModal
    }
  }
}
</script>

