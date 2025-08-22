<template>
  <div class="p-6 relative top-16">
    <div class="bg-white shadow rounded-lg">
      <div class="px-6 py-4 border-b border-gray-200">
        <h2 class="text-xl font-semibold text-gray-800">Liste des stagiaires</h2>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Téléphone</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Structure</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="stagiaire in stagiaires" :key="stagiaire.id" class="hover:bg-gray-50">
              <td class="px-6 py-4">{{ stagiaire.nom }}</td>
              <td class="px-6 py-4">{{ stagiaire.email }}</td>
              <td class="px-6 py-4">{{ stagiaire.telephone }}</td>
              <td class="px-6 py-4 break-words">{{ stagiaire.structure }}</td>
              <td class="px-6 py-4">
                <span :class="getStatusClass(stagiaire.statut)" class="px-2 py-1 text-xs rounded-full">
                  {{ stagiaire.statut }}
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
import { ref } from 'vue'

export default {
  name: 'Stagiaires',
  setup() {
    const stagiaires = ref([
      {
        id: 1,
        nom: 'Jean Dupont',
        email: 'jean@example.com',
        telephone: '+229 97000000',
        structure: 'Direction des Systèmes d\'Information',
        statut: 'Actif'
      }
    ])

    const getStatusClass = (statut) => {
      return {
        'Actif': 'bg-green-100 text-green-800',
        'Inactif': 'bg-red-100 text-red-800'
      }[statut] || 'bg-gray-100 text-gray-800'
    }

    return {
      stagiaires,
      getStatusClass
    }
  }
}
</script>