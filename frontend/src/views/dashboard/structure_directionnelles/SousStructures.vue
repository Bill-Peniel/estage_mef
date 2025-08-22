<template>
  <div class="space-y-6">
    <!-- En-tête -->
    <div class="bg-white rounded-lg shadow p-6">
      <div class="flex justify-between items-center">
        <div>
          <h2 class="text-2xl font-bold text-gray-900">Gestion des Sous-structures</h2>
          <p class="text-gray-600 mt-2">
            Créez et gérez les sous-structures techniques de votre structure directionnelle
          </p>
        </div>
        <button
          @click="showAddModal = true"
          class="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg flex items-center"
        >
          <i class="fas fa-plus mr-2"></i>
          Nouvelle sous-structure
        </button>
      </div>
    </div>

    <!-- Liste des sous-structures -->
    <div class="bg-white rounded-lg shadow">
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900">Sous-structures existantes</h3>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nom
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sigle
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Agents
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stagiaires
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="sousStructure in sousStructures" :key="sousStructure.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ sousStructure.nomStructure }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ sousStructure.sigle || '-' }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ sousStructure.agents?.length || 0 }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ sousStructure.stagiaires?.length || 0 }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  @click="editSousStructure(sousStructure)"
                  class="text-primary hover:text-primary-dark mr-3"
                >
                  <i class="fas fa-edit"></i>
                </button>
                <button
                  @click="deleteSousStructure(sousStructure.id)"
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
              {{ showEditModal ? 'Modifier la sous-structure' : 'Nouvelle sous-structure' }}
            </h3>
            <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
              <i class="fas fa-times"></i>
            </button>
          </div>

          <form @submit.prevent="showEditModal ? updateSousStructure() : createSousStructure()" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Nom de la sous-structure</label>
              <input
                v-model="formData.nomStructure"
                type="text"
                required
                class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Sigle (optionnel)</label>
              <input
                v-model="formData.sigle"
                type="text"
                class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary focus:border-primary"
              />
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
import { structureService } from '@/services/api'

export default {
  name: 'StructureDirectionnelleSousStructures',
  setup() {
    const store = useStore()
    const showAddModal = ref(false)
    const showEditModal = ref(false)
    const sousStructures = ref([])
    const editingId = ref(null)

    const formData = reactive({
      nomStructure: '',
      sigle: ''
    })

    const loadSousStructures = async () => {
      try {
        const user = store.state.user
        const response = await structureService.getStructures()
        const userStructure = response.find(structure => 
          structure.users?.some(u => u.id === user?.id) ||
          structure.tuteurs?.some(t => t.userId === user?.id)
        )
        
        if (userStructure) {
          // Récupérer les sous-structures (structures avec parentId = userStructure.id)
          sousStructures.value = response.filter(structure => 
            structure.parentId === userStructure.id && structure.type === 'technique'
          )
        }
      } catch (error) {
        console.error('Erreur lors du chargement des sous-structures:', error)
        store.dispatch('setNotification', {
          type: 'error',
          message: 'Erreur lors du chargement des sous-structures'
        })
      }
    }

    const createSousStructure = async () => {
      try {
        const user = store.state.user
        const response = await structureService.getStructures()
        const userStructure = response.find(structure => 
          structure.users?.some(u => u.id === user?.id) ||
          structure.tuteurs?.some(t => t.userId === user?.id)
        )

        if (!userStructure) {
          throw new Error('Structure utilisateur non trouvée')
        }

        const newSousStructure = {
          nomStructure: formData.nomStructure,
          sigle: formData.sigle || null,
          type: 'technique',
          parentId: userStructure.id
        }

        await structureService.createStructure(newSousStructure)
        
        store.dispatch('setNotification', {
          type: 'success',
          message: 'Sous-structure créée avec succès'
        })

        closeModal()
        await loadSousStructures()
      } catch (error) {
        console.error('Erreur lors de la création:', error)
        store.dispatch('setNotification', {
          type: 'error',
          message: 'Erreur lors de la création de la sous-structure'
        })
      }
    }

    const editSousStructure = (sousStructure) => {
      editingId.value = sousStructure.id
      formData.nomStructure = sousStructure.nomStructure
      formData.sigle = sousStructure.sigle || ''
      showEditModal.value = true
    }

    const updateSousStructure = async () => {
      try {
        await structureService.updateStructure(editingId.value, {
          nomStructure: formData.nomStructure,
          sigle: formData.sigle || null
        })

        store.dispatch('setNotification', {
          type: 'success',
          message: 'Sous-structure modifiée avec succès'
        })

        closeModal()
        await loadSousStructures()
      } catch (error) {
        console.error('Erreur lors de la modification:', error)
        store.dispatch('setNotification', {
          type: 'error',
          message: 'Erreur lors de la modification de la sous-structure'
        })
      }
    }

    const deleteSousStructure = async (id) => {
      if (!confirm('Êtes-vous sûr de vouloir supprimer cette sous-structure ?')) {
        return
      }

      try {
        await structureService.deleteStructure(id)
        
        store.dispatch('setNotification', {
          type: 'success',
          message: 'Sous-structure supprimée avec succès'
        })

        await loadSousStructures()
      } catch (error) {
        console.error('Erreur lors de la suppression:', error)
        store.dispatch('setNotification', {
          type: 'error',
          message: 'Erreur lors de la suppression de la sous-structure'
        })
      }
    }

    const closeModal = () => {
      showAddModal.value = false
      showEditModal.value = false
      editingId.value = null
      formData.nomStructure = ''
      formData.sigle = ''
    }

    onMounted(() => {
      loadSousStructures()
    })

    return {
      showAddModal,
      showEditModal,
      sousStructures,
      formData,
      createSousStructure,
      editSousStructure,
      updateSousStructure,
      deleteSousStructure,
      closeModal
    }
  }
}
</script>

