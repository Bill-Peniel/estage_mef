
<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">Évaluations des stagiaires</h1>
    
    <div class="bg-white shadow rounded-lg">
      <div class="px-4 py-5 border-b border-gray-200 sm:px-6">
        <h2 class="text-lg font-medium text-gray-900">Liste des évaluations</h2>
      </div>
      
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stagiaire</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type de Stage</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Période</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="evaluation in evaluations" :key="evaluation.id" class="hover:bg-gray-50">
              <td class="px-6 py-4">
                <div class="text-sm font-medium text-gray-900">{{ evaluation.stagiaire }}</div>
              </td>
              <td class="px-6 py-4 text-sm text-gray-500">{{ evaluation.typeStage }}</td>
              <td class="px-6 py-4 text-sm text-gray-500">{{ evaluation.periode }}</td>
              <td class="px-6 py-4">
                <span :class="getStatusClass(evaluation.statut)" class="px-2 py-1 text-xs rounded-full">
                  {{ evaluation.statut }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm font-medium space-x-2">
                <button @click="evaluer(evaluation.id)" class="text-primary hover:text-primary-dark">
                  <i class="fas fa-clipboard-check"></i>
                </button>
                <button @click="voirDetails(evaluation.id)" class="text-gray-600 hover:text-gray-900">
                  <i class="fas fa-eye"></i>
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
        typeStage: 'Stage académique',
        periode: 'Fév 2024 - Avr 2024',
        statut: 'En attente'
      },
      {
        id: 2,
        stagiaire: 'Marie Martin',
        typeStage: 'Stage professionnel',
        periode: 'Mar 2024 - Mai 2024',
        statut: 'Évalué'
      }
    ])

    const getStatusClass = (statut) => {
      return {
        'En attente': 'bg-yellow-100 text-yellow-800',
        'Évalué': 'bg-green-100 text-green-800',
        'En cours': 'bg-blue-100 text-blue-800'
      }[statut] || 'bg-gray-100 text-gray-800'
    }

    const evaluer = (id) => {
      // Implémenter la logique d'évaluation
      console.log('Évaluer stagiaire:', id)
    }

    const voirDetails = (id) => {
      // Implémenter la logique d'affichage des détails
      console.log('Voir détails:', id)
    }

    return {
      evaluations,
      getStatusClass,
      evaluer,
      voirDetails
    }
  }
}
</script>
