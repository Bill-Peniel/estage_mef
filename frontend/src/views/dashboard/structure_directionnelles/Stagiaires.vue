<template>
  <div class="space-y-6">
    <!-- En-tête -->
    <div class="bg-white rounded-lg shadow p-6">
      <h2 class="text-2xl font-bold text-gray-900">Gestion des Stagiaires</h2>
      <p class="text-gray-600 mt-2">
        Consultez les stagiaires affectés à vos sous-structures techniques
      </p>
    </div>

    <!-- Liste des stagiaires -->
    <div class="bg-white rounded-lg shadow">
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900">Stagiaires par sous-structure</h3>
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
                Sous-structure
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tuteur
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="stagiaire in stagiaires" :key="stagiaire.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">
                  {{ stagiaire.user?.profile?.prenom }} {{ stagiaire.user?.profile?.nom }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ stagiaire.user?.email }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ stagiaire.structure?.nomStructure }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">
                  {{ stagiaire.tuteur?.user?.profile?.prenom }} {{ stagiaire.tuteur?.user?.profile?.nom }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                  En cours
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import { structureService } from '@/services/api'

export default {
  name: 'StructureDirectionnelleStagiaires',
  setup() {
    const store = useStore()
    const stagiaires = ref([])

    const loadStagiaires = async () => {
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
          
          // Récupérer tous les stagiaires des sous-structures
          const allStagiaires = []
          for (const sousStructure of sousStructures) {
            if (sousStructure.stagiaires) {
              allStagiaires.push(...sousStructure.stagiaires)
            }
          }
          stagiaires.value = allStagiaires
        }
      } catch (error) {
        console.error('Erreur lors du chargement des stagiaires:', error)
        store.dispatch('setNotification', {
          type: 'error',
          message: 'Erreur lors du chargement des stagiaires'
        })
      }
    }

    onMounted(() => {
      loadStagiaires()
    })

    return {
      stagiaires
    }
  }
}
</script>

