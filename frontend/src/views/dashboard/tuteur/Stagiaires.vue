<template>
  <div class="p-6">
    <div class="mb-6 flex justify-between items-center">
      <h1 class="text-2xl font-bold text-gray-800">Mes Stagiaires</h1>
      <div class="flex gap-2">
        <button 
          v-for="filter in statusFilters" 
          :key="filter.value"
          @click="currentFilter = filter.value"
          :class="[
            'px-4 py-2 rounded-lg text-sm font-medium',
            currentFilter === filter.value 
              ? 'bg-primary text-white' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          ]"
        >
          {{ filter.label }}
        </button>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow">
      <div class="p-6">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Téléphone</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="stagiaire in filteredStagiaires" :key="stagiaire.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="h-10 w-10 flex-shrink-0">
                      <img class="h-10 w-10 rounded-full" :src="`https://ui-avatars.com/api/?name=${stagiaire.nom}&background=random`" alt="" />
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">{{ stagiaire.nom }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ stagiaire.email }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ stagiaire.telephone }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getStatusClass(stagiaire.status)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                    {{ stagiaire.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button class="text-primary hover:text-primary-dark mr-3">
                    <i class="fas fa-eye"></i>
                  </button>
                  <button class="text-blue-600 hover:text-blue-800 mr-3">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button class="text-red-600 hover:text-red-800">
                    <i class="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { api } from '@/services/api'
import { useNotification } from '@/services/notification.service'

export default {
  name: 'Stagiaires',
  setup() {
    const notification = useNotification()
    const currentFilter = ref('tous')
    const loading = ref(false)
    const stagiaires = ref([])
    
    const statusFilters = [
      { label: 'Tous', value: 'tous' },
      { label: 'Nouveau', value: 'nouveau' },
      { label: 'En cours', value: 'en_cours' },
      { label: 'Fini', value: 'fini' }
    ]

    const fetchStagiaires = async () => {
      try {
        loading.value = true
        console.log('Récupération des stagiaires...')
        const response = await api.get('/tuteurs/assigned-interns')
        console.log('Réponse de l\'API:', response.data)
        stagiaires.value = response.data.data.map(stagiaire => ({
          id: stagiaire.id,
          nom: stagiaire.name,
          email: stagiaire.email,
          telephone: stagiaire.telephone,
          status: stagiaire.status || 'En attente',
          department: stagiaire.department,
          startDate: stagiaire.startDate,
          endDate: stagiaire.endDate
        }))
        console.log('Stagiaires transformés:', stagiaires.value)
      } catch (error) {
        console.error('Erreur lors de la récupération des stagiaires:', error)
        notification.error('Erreur lors de la récupération des stagiaires')
      } finally {
        loading.value = false
      }
    }

    const filteredStagiaires = computed(() => {
      if (currentFilter.value === 'tous') {
        return stagiaires.value
      }
      return stagiaires.value.filter(s => s.status === currentFilter.value)
    })

    const getStatusClass = (status) => {
      const classes = {
        'nouveau': 'bg-yellow-100 text-yellow-800',
        'en cours': 'bg-blue-100 text-blue-800',
        'finit': 'bg-green-100 text-green-800'
      }
      return classes[status] || 'bg-gray-100 text-gray-800'
    }

    onMounted(fetchStagiaires)

    return {
      currentFilter,
      statusFilters,
      stagiaires,
      filteredStagiaires,
      getStatusClass,
      loading
    }
  }
}
</script>
