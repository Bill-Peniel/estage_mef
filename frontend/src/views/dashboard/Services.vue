<template>
  <div class="space-y-6">
    <!-- En-tête -->
    <div class="bg-white rounded-lg shadow p-6">
      <div class="flex justify-between items-center">
        <div>
          <h2 class="text-2xl font-bold text-gray-900">Gestion des Services</h2>
          <p class="text-gray-600 mt-2">
            Créez et gérez les services de vos structures techniques
          </p>
        </div>
        <button
          @click="showAddModal = true"
          class="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg flex items-center"
        >
          <i class="fas fa-plus mr-2"></i>
          Nouveau service
        </button>
      </div>
    </div>

    <!-- Liste des services -->
    <div class="bg-white rounded-lg shadow">
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900">Services existants</h3>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nom du service
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Structure
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
            <tr v-for="service in services" :key="service.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ service.nomService }}</div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-900">{{ service.description || '-' }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ service.structure?.nomStructure }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ service.tuteurs?.length || 0 }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ service.stagiaires?.length || 0 }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  @click="editService(service)"
                  class="text-blue-600 hover:text-blue-900 mr-3"
                >
                  <i class="fas fa-edit"></i>
                </button>
                <button
                  @click="deleteService(service.id)"
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
              {{ showEditModal ? 'Modifier le service' : 'Nouveau service' }}
            </h3>
            <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
              <i class="fas fa-times"></i>
            </button>
          </div>

          <form @submit.prevent="showEditModal ? updateService() : createService()" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Nom du service</label>
              <input
                v-model="formData.nomService"
                type="text"
                required
                class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                v-model="formData.description"
                rows="3"
                class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary focus:border-primary"
              ></textarea>
            </div>

            <div v-if="!showEditModal">
              <label class="block text-sm font-medium text-gray-700">Structure</label>
              <select
                v-model="formData.structureId"
                required
                class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary focus:border-primary"
              >
                <option value="">Sélectionner une structure</option>
                <option
                  v-for="structure in structures"
                  :key="structure.id"
                  :value="structure.id"
                  v-if="structure.type === 'technique'"
                >
                  {{ structure.nomStructure }}
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
import { structureService } from '@/services/api'

export default {
  name: 'Services',
  setup() {
    const store = useStore()
    const showAddModal = ref(false)
    const showEditModal = ref(false)
    const services = ref([])
    const structures = ref([])
    const editingId = ref(null)

    const formData = reactive({
      nomService: '',
      description: '',
      structureId: ''
    })

    const loadData = async () => {
      try {
        // Charger les structures
        const structuresResponse = await structureService.getStructures()
        structures.value = structuresResponse.filter(s => s.type === 'technique')

        // Charger les services
        // Ici vous devriez appeler l'API des services
        services.value = []
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error)
        store.dispatch('setNotification', {
          type: 'error',
          message: 'Erreur lors du chargement des données'
        })
      }
    }

    const createService = async () => {
      try {
        // Ici vous devriez appeler l'API pour créer un service
        console.log('Création du service:', formData)
        
        store.dispatch('setNotification', {
          type: 'success',
          message: 'Service créé avec succès'
        })

        closeModal()
        await loadData()
      } catch (error) {
        console.error('Erreur lors de la création:', error)
        store.dispatch('setNotification', {
          type: 'error',
          message: 'Erreur lors de la création du service'
        })
      }
    }

    const editService = (service) => {
      editingId.value = service.id
      formData.nomService = service.nomService
      formData.description = service.description || ''
      showEditModal.value = true
    }

    const updateService = async () => {
      try {
        // Ici vous devriez appeler l'API pour mettre à jour le service
        console.log('Mise à jour du service:', editingId.value, formData)
        
        store.dispatch('setNotification', {
          type: 'success',
          message: 'Service modifié avec succès'
        })

        closeModal()
        await loadData()
      } catch (error) {
        console.error('Erreur lors de la modification:', error)
        store.dispatch('setNotification', {
          type: 'error',
          message: 'Erreur lors de la modification du service'
        })
      }
    }

    const deleteService = async (id) => {
      if (!confirm('Êtes-vous sûr de vouloir supprimer ce service ?')) {
        return
      }

      try {
        // Ici vous devriez appeler l'API pour supprimer le service
        console.log('Suppression du service:', id)
        
        store.dispatch('setNotification', {
          type: 'success',
          message: 'Service supprimé avec succès'
        })

        await loadData()
      } catch (error) {
        console.error('Erreur lors de la suppression:', error)
        store.dispatch('setNotification', {
          type: 'error',
          message: 'Erreur lors de la suppression du service'
        })
      }
    }

    const closeModal = () => {
      showAddModal.value = false
      showEditModal.value = false
      editingId.value = null
      formData.nomService = ''
      formData.description = ''
      formData.structureId = ''
    }

    onMounted(() => {
      loadData()
    })

    return {
      showAddModal,
      showEditModal,
      services,
      structures,
      formData,
      createService,
      editService,
      updateService,
      deleteService,
      closeModal
    }
  }
}
</script>





