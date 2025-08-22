<template>
  <div class="p-4">
    <h1 class="text-2xl text-slate-800 font-bold mb-6">Historique des demandes</h1>

    <!-- Message d'erreur -->
    <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      {{ error }}
    </div>

    <!-- Indicateur de chargement -->
    <div v-if="loading" class="flex justify-center items-center py-4">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>

    <div v-else class="bg-white rounded-lg shadow">
      <div class="p-4 border-b">
        <div class="flex justify-between items-center">
          <div class="flex items-center space-x-4">
            <input 
              type="text" 
              placeholder="Rechercher une demande..." 
              class="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              v-model="searchQuery"
            >
            <select 
              v-model="filterStatus" 
              class="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Tous les statuts</option>
              <option value="APPROUVE">Approuvé</option>
              <option value="REFUSE">Refusé</option>
              <option value="EN_COURS">En cours</option>
              <option value="TERMINE">Terminé</option>
            </select>
          </div>
          <button class="bg-[#E1AD01] text-white px-4 py-2 rounded-lg hover:bg-[#F5BC00]"
            @click="exportToPDF"
          >
            <i class="fas fa-download mr-2"></i>Exporter
          </button>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-slate-500">
            <tr>
              <th class="px-6 py-3 text-left text-white text-xs font-medium text-gray-500 uppercase">Stagiaire</th>
              <th class="px-6 py-3 text-left bg-slate-700 text-white text-xs font-medium text-gray-500 uppercase">Structure</th>
              <th class="px-6 py-3 text-left text-white text-xs font-medium text-gray-500 uppercase">Type de Stage</th>
              <th class="px-6 py-3 text-left bg-slate-700 text-white text-xs font-medium text-gray-500 uppercase">Date</th>
              <th class="px-6 py-3 text-left text-white text-xs font-medium text-gray-500 uppercase">Statut</th>
              <th class="px-6 py-3 text-left bg-slate-700 text-white text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="filteredDemandes.length === 0" class="hover:bg-gray-50">
              <td colspan="6" class="px-6 py-4 text-center text-sm text-gray-500">
                Aucune demande approuvée ou refusée trouvée
              </td>
            </tr>
            <tr v-for="demande in filteredDemandes" :key="demande.id" class="hover:bg-gray-50">
              <td class="px-6 py-4">
                <div class="text-sm font-medium text-gray-900">
                  {{ demande.stagiaire.profile.nom }} {{ demande.stagiaire.profile.prenom }}
                </div>
                <div class="text-sm text-gray-500">
                  {{ demande.stagiaire.email }}
                </div>
              </td>
              <td class="px-6 py-4 text-sm text-gray-500">
                {{ demande.stagiaire.stagiaire?.structure?.nomStructure || 'Non assigné' }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-500">
                {{ demande.type }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-500">
                {{ formatDate(demande.createdAt) }}
              </td>
              <td class="px-6 py-4">
                <span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                      :class="getStatusClass(demande.status)">
                  {{ getStatusLabel(demande.status) }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm font-medium">
                <button @click="viewDetails(demande)" class="text-primary hover:text-primary-dark">
                  <i class="fas fa-eye"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal de détails -->
    <div v-if="selectedDemande" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        <div class="p-6">
          <div class="flex justify-between items-start">
            <h3 class="text-lg font-medium text-gray-900">Détails de la demande</h3>
            <button @click="closeDetails" class="text-gray-400 hover:text-gray-500">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="mt-4 space-y-4">
            <div>
              <h4 class="text-sm font-medium text-gray-500">Informations personnelles</h4>
              <div class="mt-2 grid grid-cols-2 gap-4">
                <div>
                  <p class="text-sm text-gray-900">Nom complet</p>
                  <p class="mt-1 text-sm text-gray-500">{{ selectedDemande.stagiaire.profile.nom }} {{ selectedDemande.stagiaire.profile.prenom }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-900">Email</p>
                  <p class="mt-1 text-sm text-gray-500">{{ selectedDemande.stagiaire.email }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-900">Téléphone</p>
                  <p class="mt-1 text-sm text-gray-500">{{ selectedDemande.stagiaire.profile.telephone || 'Non renseigné' }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-900">Université</p>
                  <p class="mt-1 text-sm text-gray-500">{{ selectedDemande.universite }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-900">Domaine d'études</p>
                  <p class="mt-1 text-sm text-gray-500">{{ selectedDemande.domaineEtude }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-900">Année d'études</p>
                  <p class="mt-1 text-sm text-gray-500">{{ selectedDemande.anneeEtude }}</p>
                </div>
              </div>
            </div>
            <div>
              <h4 class="text-sm font-medium text-gray-500">Informations du stage</h4>
              <div class="mt-2 grid grid-cols-2 gap-4">
                <div>
                  <p class="text-sm text-gray-900">Structure</p>
                  <p class="mt-1 text-sm text-gray-500">{{ selectedDemande.stagiaire.stagiaire?.structure?.nomStructure || 'Non assigné' }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-900">Tuteur</p>
                  <p class="mt-1 text-sm text-gray-500">{{ selectedDemande.stagiaire.stagiaire?.tuteur?.user?.profile ? `${selectedDemande.stagiaire.stagiaire.tuteur.user.profile.nom} ${selectedDemande.stagiaire.stagiaire.tuteur.user.profile.prenom}` : 'Non assigné' }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-900">Département</p>
                  <p class="mt-1 text-sm text-gray-500">{{ selectedDemande.departement }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-900">Type de stage</p>
                  <p class="mt-1 text-sm text-gray-500">{{ selectedDemande.type }}</p>
                </div>
              </div>
            </div>
            <div>
              <h4 class="text-sm font-medium text-gray-500">Dates</h4>
              <div class="mt-2 grid grid-cols-2 gap-4">
                <div>
                  <p class="text-sm text-gray-900">Date de début</p>
                  <p class="mt-1 text-sm text-gray-500">{{ formatDate(selectedDemande.dateDebut) }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-900">Date de fin</p>
                  <p class="mt-1 text-sm text-gray-500">{{ formatDate(selectedDemande.dateFin) }}</p>
                </div>
              </div>
            </div>
            <div>
              <h4 class="text-sm font-medium text-gray-500">Motivation et compétences</h4>
              <div class="mt-2 space-y-4">
                <div>
                  <p class="text-sm text-gray-900">Motivation</p>
                  <p class="mt-1 text-sm text-gray-500 whitespace-pre-wrap">{{ selectedDemande.motivation }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-900">Compétences</p>
                  <p class="mt-1 text-sm text-gray-500 whitespace-pre-wrap">{{ selectedDemande.competences }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-900">Expérience</p>
                  <p class="mt-1 text-sm text-gray-500 whitespace-pre-wrap">{{ selectedDemande.experience }}</p>
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
import { ref, computed, onMounted } from 'vue'
import { stageRequestService } from '@/services/api'

export default {
  name: 'Historique',
  setup() {
    const searchQuery = ref('')
    const filterStatus = ref('')
    const demandes = ref([])
    const loading = ref(false)
    const error = ref(null)
    const selectedDemande = ref(null)

    // Charger les demandes depuis l'API
    const loadDemandes = async () => {
      try {
        loading.value = true
        error.value = null
        const response = await stageRequestService.getHistoriqueStagiaires()
        console.log('Données brutes reçues:', response)
        demandes.value = response
      } catch (err) {
        console.error('Erreur lors du chargement des demandes:', err)
        if (err.message?.includes('CONNECTION_REFUSED') || err.message?.includes('Network Error')) {
          error.value = 'Impossible de se connecter au serveur. Veuillez vérifier que le serveur backend est en cours d\'exécution.'
        } else {
          error.value = 'Erreur lors du chargement des demandes: ' + (err.message || 'Erreur inconnue')
        }
      } finally {
        loading.value = false
      }
    }

    // Charger les demandes au montage du composant
    onMounted(() => {
      loadDemandes()
    })

    const filteredDemandes = computed(() => {
      let filtered = demandes.value
      if (searchQuery.value) {
        filtered = filtered.filter(demande => {
          const nom = demande.stagiaire.profile.nom || ''
          const prenom = demande.stagiaire.profile.prenom || ''
          const email = demande.stagiaire.email || ''
          const structure = demande.stagiaire.stagiaire?.structure?.nomStructure || ''
          
          const searchLower = searchQuery.value.toLowerCase()
          return nom.toLowerCase().includes(searchLower) ||
                 prenom.toLowerCase().includes(searchLower) ||
                 email.toLowerCase().includes(searchLower) ||
                 structure.toLowerCase().includes(searchLower)
        })
      }
      if (filterStatus.value) {
        filtered = filtered.filter(demande => demande.status === filterStatus.value)
      }
      return filtered
    })

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('fr-FR')
    }

    const getStatusClass = (status) => {
      const classes = {
        APPROUVE: 'bg-green-100 text-green-800',
        REFUSE: 'bg-red-100 text-red-800',
        EN_COURS: 'bg-blue-100 text-blue-800',
        TERMINE: 'bg-gray-100 text-gray-800'
      }
      return classes[status] || 'bg-gray-100 text-gray-800'
    }

    const getStatusLabel = (status) => {
      const labels = {
        APPROUVE: 'Approuvé',
        REFUSE: 'Refusé',
        EN_COURS: 'En cours',
        TERMINE: 'Terminé'
      }
      return labels[status] || status
    }

    const viewDetails = (demande) => {
      selectedDemande.value = demande
    }

    const closeDetails = () => {
      selectedDemande.value = null
    }

    // Exporter l'historique au format PDF
    const exportToPDF = () => {
      const jsPDF = window.jspdf?.jsPDF || window.jsPDF;
      if (!jsPDF) {
        alert("jsPDF n'est pas chargé !");
        return;
      }
      const doc = new jsPDF({ orientation: 'landscape' });
      doc.setFontSize(16);
      doc.text('Historique des demandes de stage', 14, 14);
      const tableColumn = [
        'Stagiaire',
        'Email',
        'Structure',
        'Type de stage',
        'Date',
        'Statut'
      ];
      const tableRows = filteredDemandes.value.map(demande => [
        `${demande.stagiaire.profile.nom} ${demande.stagiaire.profile.prenom}`,
        demande.stagiaire.email,
        demande.stagiaire.stagiaire?.structure?.nomStructure || 'Non assigné',
        demande.type,
        formatDate(demande.createdAt),
        getStatusLabel(demande.status)
      ]);
      // Utilise la méthode autoTable directement sur l'instance doc
      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 22,
        styles: { fontSize: 10 },
        headStyles: { fillColor: [33, 150, 243] },
        margin: { left: 14, right: 14 }
      });
      doc.save('historique-demandes.pdf');
    };

    return {
      searchQuery,
      filterStatus,
      filteredDemandes,
      formatDate,
      getStatusClass,
      getStatusLabel,
      viewDetails,
      closeDetails,
      selectedDemande,
      loading,
      error,
      exportToPDF
    }
  }
}
</script>
