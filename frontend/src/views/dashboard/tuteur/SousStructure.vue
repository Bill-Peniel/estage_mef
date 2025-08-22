<template>
  <div class="min-h-screen bg-gray-100">
    <div class="flex-1">
      <header class="bg-white shadow">
        <div class="px-4 py-4 flex justify-between items-center">
          <h1 class="text-2xl font-bold text-primary">Ma sous-structure</h1>
          <button @click="showAddSubStructureModal = true" class="bg-primary text-white px-4 py-2 rounded hover:bg-green-900">
            <i class="fas fa-plus mr-2"></i> Ajouter une sous-structure
          </button>
        </div>
      </header>

      <main class="p-6">
        <div v-if="loading" class="flex justify-center items-center h-64">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>

        <div v-else-if="sousStructure" class="space-y-6">
          <!-- Informations de la sous-structure -->
          <div class="bg-white shadow rounded-lg p-6">
            <h2 class="text-xl font-semibold mb-4">Informations</h2>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-sm text-gray-600">Nom</p>
                <p class="font-medium">{{ sousStructure.nomStructure }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600">Sigle</p>
                <p class="font-medium">{{ sousStructure.sigle }}</p>
              </div>
            </div>
          </div>

          <!-- Liste des membres -->
          <div class="bg-white shadow rounded-lg p-6">
            <h2 class="text-xl font-semibold mb-4">Membres</h2>
            <div v-if="membres.length === 0" class="text-gray-500 text-center py-4">
              Aucun membre pour le moment
            </div>
            <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div v-for="membre in membres" :key="membre.id" class="border rounded-lg p-4">
                <div class="flex items-center space-x-3">
                  <div class="flex-shrink-0">
                    <div class="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white">
                      {{ membre.user?.profile?.prenom?.[0] }}{{ membre.user?.profile?.nom?.[0] }}
                    </div>
                  </div>
                  <div>
                    <p class="font-medium">{{ membre.user?.profile?.prenom }} {{ membre.user?.profile?.nom }}</p>
                    <p class="text-sm text-gray-500">{{ membre.user?.email }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Liste des sous-structures -->
          <div class="bg-white shadow rounded-lg p-6">
            <h2 class="text-xl font-semibold mb-4">Sous-structures</h2>
            <div v-if="sousStructures.length === 0" class="text-gray-500 text-center py-4">
              Aucune sous-structure pour le moment
            </div>
            <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div v-for="subStructure in sousStructures" :key="subStructure.id" class="border rounded-lg p-4">
                <div class="flex justify-between items-start">
                  <div>
                    <h3 class="font-medium">{{ subStructure.nomStructure }}</h3>
                    <p class="text-sm text-gray-500">{{ subStructure.sigle }}</p>
                  </div>
                  <div class="flex space-x-2">
                    <button @click="editSubStructure(subStructure)" class="text-primary hover:text-primary-dark">
                      <i class="fas fa-edit"></i>
                    </button>
                    <button @click="removeSubStructure(subStructure)" class="text-danger hover:text-red-700">
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-12">
          <p class="text-gray-500">Aucune sous-structure trouvée</p>
        </div>
      </main>
    </div>

    <!-- Modal d'ajout de sous-structure -->
    <div v-if="showAddSubStructureModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Ajouter une sous-structure</h3>
        <form @submit.prevent="handleAddSubStructure">
          <div class="mb-3">
            <label for="nom" class="form-label">Nom de la sous-structure</label>
            <input
              type="text"
              class="mt-1 input-field"
              id="nom"
              v-model="newSubStructure.nom"
              required
            >
          </div>
          <div class="text-end">
            <button type="button" class="btn-outline me-2" @click="showAddSubStructureModal = false">
              Annuler
            </button>
            <button type="submit" class="btn-primary" :disabled="loading">
              {{ loading ? 'Création en cours...' : 'Créer' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useToast } from 'vue-toastification'

export default {
  name: 'SousStructure',
  setup() {
    const store = useStore()
    const notification = useToast()
    const loading = ref(false)
    const sousStructure = ref(null)
    const membres = ref([])
    const sousStructures = ref([])
    const showAddSubStructureModal = ref(false)
    const newSubStructure = ref({
      nom: ''
    })

    const fetchSousStructure = async () => {
      try {
        loading.value = true
        const response = await store.dispatch('sousStructure/getSousStructure')
        console.log('Réponse de la sous-structure:', response)
        
        if (response) {
          sousStructure.value = response
          membres.value = response.membres || []
          sousStructures.value = response.children || []
        } else {
          console.error('Aucune sous-structure trouvée')
          notification.error('Aucune sous-structure trouvée')
        }
      } catch (error) {
        console.error('Erreur lors de la récupération de la sous-structure:', error)
        notification.error(error.message || 'Erreur lors de la récupération de la sous-structure')
      } finally {
        loading.value = false
      }
    }

    const handleAddSubStructure = async () => {
      try {
        loading.value = true
        await store.dispatch('sousStructure/addSubStructure', {
          nomStructure: newSubStructure.value.nom,
          parentId: sousStructure.value.id
        })
        showAddSubStructureModal.value = false
        newSubStructure.value.nom = ''
        notification.success('Sous-structure créée avec succès')
        await fetchSousStructure()
      } catch (error) {
        console.error('Erreur lors de la création de la sous-structure:', error)
        notification.error(error.message || 'Erreur lors de la création de la sous-structure')
      } finally {
        loading.value = false
      }
    }

    const editSubStructure = async (subStructure) => {
      // TODO: Implémenter l'édition
      console.log('Édition de la sous-structure:', subStructure)
    }

    const removeSubStructure = async (subStructure) => {
      if (confirm('Êtes-vous sûr de vouloir supprimer cette sous-structure ?')) {
        try {
          loading.value = true
          await store.dispatch('sousStructure/removeSubStructure', subStructure.id)
          notification.success('Sous-structure supprimée avec succès')
          await fetchSousStructure()
        } catch (error) {
          console.error('Erreur lors de la suppression de la sous-structure:', error)
          notification.error(error.message || 'Erreur lors de la suppression de la sous-structure')
        } finally {
          loading.value = false
        }
      }
    }

    onMounted(fetchSousStructure)

    return {
      loading,
      sousStructure,
      membres,
      sousStructures,
      showAddSubStructureModal,
      newSubStructure,
      handleAddSubStructure,
      editSubStructure,
      removeSubStructure
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
</style> 