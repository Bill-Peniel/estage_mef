<template>
  <div class="space-y-6">
    <!-- En-tête -->
    <div class="bg-white rounded-lg shadow p-6">
      <h2 class="text-2xl font-bold text-gray-900">Évaluations des Stagiaires</h2>
      <p class="text-gray-600 mt-2">
        Consultez les évaluations des stagiaires de vos sous-structures techniques
      </p>
    </div>

    <!-- Liste des évaluations -->
    <div class="bg-white rounded-lg shadow">
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900">Évaluations récentes</h3>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stagiaire
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sous-structure
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tuteur
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="evaluation in evaluations" :key="evaluation.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">
                  {{ evaluation.stagiaire?.user?.profile?.prenom }} {{ evaluation.stagiaire?.user?.profile?.nom }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ evaluation.stagiaire?.structure?.nomStructure }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">
                  {{ evaluation.tuteur?.user?.profile?.prenom }} {{ evaluation.tuteur?.user?.profile?.nom }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ formatDate(evaluation.createdAt) }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  @click="viewEvaluation(evaluation)"
                  class="text-primary hover:text-primary-dark"
                >
                  <i class="fas fa-eye"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal de visualisation de l'évaluation -->
    <div v-if="showEvaluationModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-2xl shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-medium text-gray-900">Détails de l'évaluation</h3>
            <button @click="showEvaluationModal = false" class="text-gray-400 hover:text-gray-600">
              <i class="fas fa-times"></i>
            </button>
          </div>

          <div v-if="selectedEvaluation" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Stagiaire</label>
                <p class="text-sm text-gray-900">
                  {{ selectedEvaluation.stagiaire?.user?.profile?.prenom }} {{ selectedEvaluation.stagiaire?.user?.profile?.nom }}
                </p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Tuteur</label>
                <p class="text-sm text-gray-900">
                  {{ selectedEvaluation.tuteur?.user?.profile?.prenom }} {{ selectedEvaluation.tuteur?.user?.profile?.nom }}
                </p>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Commentaire</label>
              <p class="text-sm text-gray-900">{{ selectedEvaluation.commentaire || 'Aucun commentaire' }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Critères d'évaluation</label>
              <div class="mt-2 space-y-2">
                <div v-for="(value, key) in selectedEvaluation.criteres" :key="key" class="flex justify-between">
                  <span class="text-sm text-gray-700">{{ key }}</span>
                  <span class="text-sm font-medium text-gray-900">{{ value }}/5</span>
                </div>
              </div>
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
  name: 'StructureDirectionnelleEvaluations',
  setup() {
    const store = useStore()
    const evaluations = ref([])
    const showEvaluationModal = ref(false)
    const selectedEvaluation = ref(null)

    const loadEvaluations = async () => {
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
          
          // Récupérer toutes les évaluations des sous-structures
          const allEvaluations = []
          for (const sousStructure of sousStructures) {
            if (sousStructure.tuteurs) {
              for (const tuteur of sousStructure.tuteurs) {
                if (tuteur.evaluations) {
                  allEvaluations.push(...tuteur.evaluations)
                }
              }
            }
          }
          evaluations.value = allEvaluations
        }
      } catch (error) {
        console.error('Erreur lors du chargement des évaluations:', error)
        store.dispatch('setNotification', {
          type: 'error',
          message: 'Erreur lors du chargement des évaluations'
        })
      }
    }

    const viewEvaluation = (evaluation) => {
      selectedEvaluation.value = evaluation
      showEvaluationModal.value = true
    }

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('fr-FR')
    }

    onMounted(() => {
      loadEvaluations()
    })

    return {
      evaluations,
      showEvaluationModal,
      selectedEvaluation,
      viewEvaluation,
      formatDate
    }
  }
}
</script>

