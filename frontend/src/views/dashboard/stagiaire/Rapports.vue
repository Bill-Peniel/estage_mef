
<template>
  <div class="p-6">
    <h1 class="text-2xl font-semibold mb-6">Mes Rapports</h1>
    
    <div class="grid gap-6">
      <!-- Rapport de mi-stage -->
      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-lg font-medium mb-4">Rapport de mi-stage</h3>
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <span class="text-gray-600">Date limite: 15/02/2024</span>
            <span class="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">En attente</span>
          </div>
          <div class="flex items-center space-x-4">
            <button class="btn-primary">
              <i class="fas fa-upload mr-2"></i>
              Téléverser le rapport
            </button>
            <button class="btn-outline">
              <i class="fas fa-download mr-2"></i>
              Modèle
            </button>
          </div>
        </div>
      </div>

      <!-- Rapport final -->
      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-lg font-medium mb-4">Rapport final</h3>
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <span class="text-gray-600">Date limite: 31/03/2024</span>
            <span class="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">À venir</span>
          </div>
          <div class="flex items-center space-x-4">
            <button class="btn-primary" disabled>
              <i class="fas fa-upload mr-2"></i>
              Téléverser le rapport
            </button>
            <button class="btn-outline">
              <i class="fas fa-download mr-2"></i>
              Modèle
            </button>
          </div>
        </div>
      </div>

      <!-- Historique des rapports -->
      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-lg font-medium mb-4">Historique des rapports</h3>
        <div class="overflow-x-auto">
          <table class="min-w-full">
            <thead>
              <tr class="border-b">
                <th class="text-left py-3 px-4">Type</th>
                <th class="text-left py-3 px-4">Date de soumission</th>
                <th class="text-left py-3 px-4">Statut</th>
                <th class="text-left py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="rapport in rapports" :key="rapport.id" class="border-b">
                <td class="py-3 px-4">{{ rapport.type }}</td>
                <td class="py-3 px-4">{{ rapport.date }}</td>
                <td class="py-3 px-4">
                  <span :class="getStatusClass(rapport.status)">
                    {{ rapport.status }}
                  </span>
                </td>
                <td class="py-3 px-4">
                  <button class="text-primary hover:text-primary-dark">
                    <i class="fas fa-download"></i>
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
export default {
  name: 'Rapports',
  data() {
    return {
      rapports: [
        {
          id: 1,
          type: 'Rapport initial',
          date: '15/01/2024',
          status: 'Validé'
        }
      ]
    }
  },
  methods: {
    getStatusClass(status) {
      switch (status) {
        case 'Validé':
          return 'text-green-500'
        case 'En attente':
          return 'text-yellow-500'
        case 'Rejeté':
          return 'text-red-500'
        default:
          return 'text-gray-500'
      }
    }
  }
}
</script>
