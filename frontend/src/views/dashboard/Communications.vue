<template>
  <div class="p-6">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-800">Communications</h1>
      <p class="text-gray-600">Gestion des communications avec les structures partenaires</p>
    </div>

    <!-- Actions rapides -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <button @click="nouveauMessage" class="bg-primary text-white p-6 rounded-lg shadow hover:bg-primary-700 transition-colors duration-200">
        <i class="fas fa-pen-to-square text-2xl mb-2"></i>
        <h3 class="text-lg font-semibold">Nouveau message</h3>
        <p class="text-sm opacity-90">Créer un nouveau message</p>
      </button>

      <button @click="envoyerDemandes" class="bg-green-600 text-white p-6 rounded-lg shadow hover:bg-green-700 transition-colors duration-200">
        <i class="fas fa-paper-plane text-2xl mb-2"></i>
        <h3 class="text-lg font-semibold">Envoyer les demandes</h3>
        <p class="text-sm opacity-90">Transmettre les demandes acceptées</p>
      </button>

      <button @click="relancerStructures" class="bg-yellow-500 text-white p-6 rounded-lg shadow hover:bg-yellow-600 transition-colors duration-200">
        <i class="fas fa-bell text-2xl mb-2"></i>
        <h3 class="text-lg font-semibold">Relancer</h3>
        <p class="text-sm opacity-90">Relancer les structures</p>
      </button>

      <button @click="exporterCommunications" class="bg-purple-600 text-white p-6 rounded-lg shadow hover:bg-purple-700 transition-colors duration-200">
        <i class="fas fa-download text-2xl mb-2"></i>
        <h3 class="text-lg font-semibold">Exporter</h3>
        <p class="text-sm opacity-90">Exporter les communications</p>
      </button>
    </div>

    <!-- Liste des communications -->
    <div class="bg-white rounded-lg shadow mb-8">
      <div class="p-6 border-b border-gray-200">
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-semibold text-gray-800">Historique des communications</h3>
          <div class="flex space-x-2">
            <input 
              type="text" 
              v-model="recherche" 
              placeholder="Rechercher..." 
              class="rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
            >
            <select 
              v-model="filtreType" 
              class="rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
            >
              <option value="">Tous les types</option>
              <option value="demande">Demande</option>
              <option value="relance">Relance</option>
              <option value="information">Information</option>
            </select>
          </div>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Structure</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Objet</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="comm in communicationsFiltrees" :key="comm.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ formatDate(comm.date) }}</div>
                <div class="text-sm text-gray-500">{{ formatTime(comm.date) }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getTypeClass(comm.type)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                  {{ comm.type }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ comm.structure.nom }}</div>
                <div class="text-sm text-gray-500">{{ comm.structure.email }}</div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-900">{{ comm.objet }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getStatusClass(comm.statut)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                  {{ comm.statut }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button @click="voirDetails(comm)" class="text-primary hover:text-primary-dark mr-3">
                  <i class="fas fa-eye"></i>
                </button>
                <button @click="renvoyerMessage(comm)" class="text-blue-600 hover:text-blue-900 mr-3">
                  <i class="fas fa-redo"></i>
                </button>
                <button @click="supprimerMessage(comm)" class="text-red-600 hover:text-red-900">
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="px-6 py-4 border-t border-gray-200">
        <div class="flex justify-between items-center">
          <div class="text-sm text-gray-700">
            Affichage de {{ pagination.debut }} à {{ pagination.fin }} sur {{ pagination.total }} communications
          </div>
          <div class="flex space-x-2">
            <button 
              class="px-3 py-1 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50"
              :disabled="pagination.page === 1"
              @click="changerPage(pagination.page - 1)"
            >
              Précédent
            </button>
            <button 
              class="px-3 py-1 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50"
              :disabled="pagination.page === pagination.totalPages"
              @click="changerPage(pagination.page + 1)"
            >
              Suivant
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Nouveau Message -->
    <div v-if="showMessageModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Nouveau message</h3>
        
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">Type</label>
          <select v-model="messageForm.type" class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50">
            <option value="demande">Demande de stage</option>
            <option value="relance">Relance</option>
            <option value="information">Information</option>
          </select>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">Structure</label>
          <select v-model="messageForm.structure" class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50">
            <option v-for="structure in structures" :key="structure.id" :value="structure.id">
              {{ structure.nom }}
            </option>
          </select>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">Objet</label>
          <input type="text" v-model="messageForm.objet" class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50">
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">Message</label>
          <textarea v-model="messageForm.message" rows="5" class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"></textarea>
        </div>

        <div class="flex justify-end space-x-2">
          <button @click="showMessageModal = false" class="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
            Annuler
          </button>
          <button @click="envoyerMessage" class="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-700">
            Envoyer
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  name: 'Communications',
  setup() {
    // États
    const recherche = ref('')
    const filtreType = ref('')
    const showMessageModal = ref(false)
    
    const messageForm = ref({
      type: 'demande',
      structure: '',
      objet: '',
      message: ''
    })

    const structures = ref([
      { id: 1, nom: 'Enterprise A' },
      { id: 2, nom: 'Enterprise B' },
      // Ajouter plus de structures
    ])

    const communications = ref([
      {
        id: 1,
        date: new Date(),
        type: 'demande',
        structure: {
          nom: 'Enterprise A',
          email: 'contact@entreprisea.com'
        },
        objet: 'Demande de stage - John Doe',
        statut: 'envoyé',
        message: 'Contenu du message...'
      },
      // Ajouter plus de communications
    ])

    const pagination = ref({
      page: 1,
      parPage: 10,
      total: 0,
      totalPages: 1,
      debut: 1,
      fin: 10
    })

    // Computed
    const communicationsFiltrees = computed(() => {
      let resultat = [...communications.value]

      if (recherche.value) {
        const searchTerm = recherche.value.toLowerCase()
        resultat = resultat.filter(c => 
          c.structure.nom.toLowerCase().includes(searchTerm) ||
          c.objet.toLowerCase().includes(searchTerm)
        )
      }

      if (filtreType.value) {
        resultat = resultat.filter(c => c.type === filtreType.value)
      }

      return resultat
    })

    // Méthodes
    const formatDate = (date) => {
      return new Intl.DateTimeFormat('fr-FR').format(new Date(date))
    }

    const formatTime = (date) => {
      return new Intl.DateTimeFormat('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
      }).format(new Date(date))
    }

    const getTypeClass = (type) => {
      const classes = {
        'demande': 'bg-blue-100 text-blue-800',
        'relance': 'bg-yellow-100 text-yellow-800',
        'information': 'bg-green-100 text-green-800'
      }
      return classes[type] || 'bg-gray-100 text-gray-800'
    }

    const getStatusClass = (statut) => {
      const classes = {
        'envoyé': 'bg-green-100 text-green-800',
        'échec': 'bg-red-100 text-red-800',
        'en_attente': 'bg-yellow-100 text-yellow-800'
      }
      return classes[statut] || 'bg-gray-100 text-gray-800'
    }

    const nouveauMessage = () => {
      showMessageModal.value = true
    }

    const envoyerMessage = () => {
      // Implémenter l'envoi du message
      console.log('Envoi du message:', messageForm.value)
      showMessageModal.value = false
      messageForm.value = {
        type: 'demande',
        structure: '',
        objet: '',
        message: ''
      }
    }

    const envoyerDemandes = () => {
      // Implémenter l'envoi des demandes acceptées
      console.log('Envoi des demandes acceptées')
    }

    const relancerStructures = () => {
      // Implémenter la relance des structures
      console.log('Relance des structures')
    }

    const exporterCommunications = () => {
      // Implémenter l'export des communications
      console.log('Export des communications')
    }

    const voirDetails = (comm) => {
      // Implémenter l'affichage des détails
      console.log('Voir détails:', comm.id)
    }

    const renvoyerMessage = (comm) => {
      // Implémenter le renvoi du message
      console.log('Renvoyer message:', comm.id)
    }

    const supprimerMessage = (comm) => {
      // Implémenter la suppression du message
      console.log('Supprimer message:', comm.id)
    }

    const changerPage = (nouvellePage) => {
      pagination.value.page = nouvellePage
      // Implémenter la logique de pagination
    }

    return {
      recherche,
      filtreType,
      showMessageModal,
      messageForm,
      structures,
      communications,
      pagination,
      communicationsFiltrees,
      formatDate,
      formatTime,
      getTypeClass,
      getStatusClass,
      nouveauMessage,
      envoyerMessage,
      envoyerDemandes,
      relancerStructures,
      exporterCommunications,
      voirDetails,
      renvoyerMessage,
      supprimerMessage,
      changerPage
    }
  }
}
</script> 