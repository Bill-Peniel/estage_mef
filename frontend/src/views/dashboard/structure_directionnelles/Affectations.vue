<template>
  <div class="space-y-6">
    <!-- En-tête -->
    <div class="bg-white rounded-lg shadow p-6">
      <h2 class="text-2xl font-bold text-gray-900">Gestion des Affectations</h2>
      <p class="text-gray-600 mt-2">
        Gérez les affectations des stagiaires à vos sous-structures techniques
      </p>
    </div>

    <!-- Liste des affectations -->
    <div class="bg-white rounded-lg shadow">
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900">Affectations actuelles</h3>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stagiaire
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sous-structure
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tuteur assigné
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date d'affectation
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="affectation in affectations" :key="affectation.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">
                  {{ affectation.stagiaire?.user?.profile?.prenom }} {{ affectation.stagiaire?.user?.profile?.nom }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ affectation.stagiaire?.user?.email }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ affectation.structure?.nomStructure }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">
                  {{ affectation.tuteur?.user?.profile?.prenom }} {{ affectation.tuteur?.user?.profile?.nom }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ formatDate(affectation.createdAt) }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  @click="viewAffectation(affectation)"
                  class="text-primary hover:text-primary-dark mr-3"
                >
                  <i class="fas fa-eye"></i>
                </button>
                <button
                  @click="editAffectation(affectation)"
                  class="text-blue-600 hover:text-blue-900 mr-3"
                >
                  <i class="fas fa-edit"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal de visualisation de l'affectation -->
    <div v-if="showAffectationModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-2xl shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-medium text-gray-900">Détails de l'affectation</h3>
            <button @click="showAffectationModal = false" class="text-gray-400 hover:text-gray-600">
              <i class="fas fa-times"></i>
            </button>
          </div>

          <div v-if="selectedAffectation" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Stagiaire</label>
                <p class="text-sm text-gray-900">
                  {{ selectedAffectation.stagiaire?.user?.profile?.prenom }} {{ selectedAffectation.stagiaire?.user?.profile?.nom }}
                </p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Email</label>
                <p class="text-sm text-gray-900">{{ selectedAffectation.stagiaire?.user?.email }}</p>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Sous-structure</label>
                <p class="text-sm text-gray-900">{{ selectedAffectation.structure?.nomStructure }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Tuteur</label>
                <p class="text-sm text-gray-900">
                  {{ selectedAffectation.tuteur?.user?.profile?.prenom }} {{ selectedAffectation.tuteur?.user?.profile?.nom }}
                </p>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Date d'affectation</label>
              <p class="text-sm text-gray-900">{{ formatDate(selectedAffectation.createdAt) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import { structureService } from '@/services/api'

export default {
  name: 'StructureDirectionnelleAffectations',
  setup() {
    const store = useStore()
    const affectations = ref([])
    const showAffectationModal = ref(false)
    const selectedAffectation = ref(null)

    const loadAffectations = async () => {
      try {
        const user = store.state.user
        const response = await structureService.getStructures()
        const userStructure = response.find(structure => 
          structure.users?.some(u => u.id === user?.id) ||
          structure.tuteurs?.some(t => t.userId === user?.id)
        )
        
        if (userStructure) {
          // Récupérer les sous-structures
          const sousStructures = response.filter(structure => 
            structure.parentId === userStructure.id && structure.type === 'technique'
          )
          
          // Récupérer toutes les affectations des sous-structures
          const allAffectations = []
          for (const sousStructure of sousStructures) {
            if (sousStructure.stagiaires) {
              for (const stagiaire of sousStructure.stagiaires) {
                allAffectations.push({
                  id: stagiaire.id,
                  stagiaire,
                  structure: sousStructure,
                  tuteur: stagiaire.tuteur,
                  createdAt: stagiaire.createdAt || new Date()
                })
              }
            }
          }
          affectations.value = allAffectations
        }
      } catch (error) {
        console.error('Erreur lors du chargement des affectations:', error)
        store.dispatch('setNotification', {
          type: 'error',
          message: 'Erreur lors du chargement des affectations'
        })
      }
    }

    const viewAffectation = (affectation) => {
      selectedAffectation.value = affectation
      showAffectationModal.value = true
    }

    const editAffectation = (affectation) => {
      // Pour l'instant, on ne peut que visualiser
      // L'édition pourrait être implémentée plus tard
      console.log('Édition de l\'affectation:', affectation)
    }

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('fr-FR')
    }

    onMounted(() => {
      loadAffectations()
    })

    return {
      affectations,
      showAffectationModal,
      selectedAffectation,
      viewAffectation,
      editAffectation,
      formatDate
    }
  }
}
</script>

