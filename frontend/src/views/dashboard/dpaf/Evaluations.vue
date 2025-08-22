
<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">Évaluations des Stagiaires</h1>

    <!-- Statistiques d'évaluation -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="bg-white p-6 rounded-lg shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <div>
            <p class="text-sm text-gray-600">Note moyenne</p>
            <h3 class="text-3xl font-bold text-primary">4.5/5</h3>
          </div>
          <div class="bg-blue-100 p-3 rounded-full text-primary">
            <i class="fas fa-star text-xl"></i>
          </div>
        </div>
        <div class="mt-4">
          <div class="flex items-center mb-2">
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div class="bg-primary h-2 rounded-full" style="width: 90%"></div>
            </div>
            <span class="ml-2 text-sm text-gray-600">90%</span>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <div>
            <p class="text-sm text-gray-600">Évaluations complétées</p>
            <h3 class="text-3xl font-bold text-green-600">85%</h3>
          </div>
          <div class="bg-green-100 p-3 rounded-full text-green-600">
            <i class="fas fa-check-circle text-xl"></i>
          </div>
        </div>
        <div class="mt-4">
          <div class="flex items-center mb-2">
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div class="bg-green-600 h-2 rounded-full" style="width: 85%"></div>
            </div>
            <span class="ml-2 text-sm text-gray-600">85%</span>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <div>
            <p class="text-sm text-gray-600">En attente</p>
            <h3 class="text-3xl font-bold text-yellow-600">15%</h3>
          </div>
          <div class="bg-yellow-100 p-3 rounded-full text-yellow-600">
            <i class="fas fa-clock text-xl"></i>
          </div>
        </div>
        <div class="mt-4">
          <div class="flex items-center mb-2">
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div class="bg-yellow-600 h-2 rounded-full" style="width: 15%"></div>
            </div>
            <span class="ml-2 text-sm text-gray-600">15%</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Liste des évaluations -->
    <div class="bg-white rounded-lg shadow-sm">
      <div class="p-6 border-b border-gray-200">
        <div class="flex justify-between items-center">
          <h2 class="text-lg font-semibold">Liste des Évaluations</h2>
          <div class="flex space-x-2">
            <button @click="openEvaluationForm" class="btn-primary">
              <i class="fas fa-plus mr-2"></i>Nouvelle Évaluation
            </button>
          </div>
        </div>
      </div>

      <!-- Tableau des évaluations -->
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stagiaire</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Structure</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date d'évaluation</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Note globale</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="evaluation in evaluations" :key="evaluation.id" class="hover:bg-gray-50">
              <td class="px-6 py-4">
                <div class="flex items-center">
                  <div>
                    <div class="text-sm font-medium text-gray-900">{{ evaluation.stagiaire }}</div>
                    <div class="text-sm text-gray-500">{{ evaluation.email }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 text-sm text-gray-500">{{ evaluation.structure }}</td>
              <td class="px-6 py-4 text-sm text-gray-500">{{ evaluation.date }}</td>
              <td class="px-6 py-4">
                <div class="flex items-center">
                  <span class="text-sm font-medium text-gray-900">{{ evaluation.note }}/5</span>
                  <div class="ml-2 flex text-yellow-400">
                    <i v-for="n in 5" :key="n" 
                       :class="['fas', n <= evaluation.note ? 'fa-star' : 'fa-star-o']"></i>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <span :class="getStatusClass(evaluation.status)"
                      class="px-2 py-1 text-xs font-semibold rounded-full">
                  {{ evaluation.status }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm font-medium space-x-2">
                <button @click="viewDetails(evaluation)" class="text-primary hover:text-primary-dark">
                  <i class="fas fa-eye"></i>
                </button>
                <button @click="editEvaluation(evaluation)" class="text-blue-600 hover:text-blue-800">
                  <i class="fas fa-edit"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'Evaluations',
  setup() {
    const evaluations = ref([
      {
        id: 1,
        stagiaire: 'Jean Dupont',
        email: 'jean.dupont@email.com',
        structure: "Direction des Systèmes d'Information",
        date: '2024-03-15',
        note: 4.5,
        status: 'Complété'
      },
      {
        id: 2,
        stagiaire: 'Marie Martin',
        email: 'marie.martin@email.com',
        structure: 'Direction Générale du Budget',
        date: '2024-03-14',
        note: 3.8,
        status: 'En cours'
      }
    ])

    const getStatusClass = (status) => {
      return {
        'Complété': 'bg-green-100 text-green-800',
        'En cours': 'bg-yellow-100 text-yellow-800',
        'En attente': 'bg-gray-100 text-gray-800'
      }[status] || 'bg-gray-100 text-gray-800'
    }

    const openEvaluationForm = () => {
      // Implémenter l'ouverture du formulaire
      console.log('Ouvrir le formulaire d\'évaluation')
    }

    const viewDetails = (evaluation) => {
      console.log('Voir les détails:', evaluation)
    }

    const editEvaluation = (evaluation) => {
      console.log('Modifier l\'évaluation:', evaluation)
    }

    return {
      evaluations,
      getStatusClass,
      openEvaluationForm,
      viewDetails,
      editEvaluation
    }
  }
}
</script>
