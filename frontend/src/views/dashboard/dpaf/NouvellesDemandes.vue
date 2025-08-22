<template>
  <div class="p-4">
    <h1 class="text-2xl text-green-800 font-bold mb-6">Demandes Classées</h1>

    <div class="bg-white rounded-lg shadow">
      <div class="p-4 border-b">
        <div class="flex justify-between items-center">
          <div class="flex items-center space-x-4">
            <input 
              type="text" 
              placeholder="Rechercher une demande..." 
              class="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              v-model="searchQuery"
            >
            <select 
              v-model="filterStatus" 
              class="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Tous les statuts</option>
              <option value="nouveau">Nouveau</option>
            </select>
          </div>
          <button class="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-700">
            <i class="fas fa-download mr-2"></i>Exporter
          </button>
        </div>
      </div>

      <div class="overflow-x-auto">
        <div v-for="(demandes, structure) in demandesParStructure" :key="structure" class="mb-8">
          <h2 class="text-xl font-semibold mb-4 px-6 text-primary">{{ structure }}</h2>
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stagiaire</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type de Stage</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  <span class="relative group cursor-help">
                    Score IA
                    <span class="absolute left-1/2 -translate-x-1/2 mt-2 w-64 p-2 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      Le score IA classe les demandes selon la date de soumission (plus récent = mieux), le type de stage (académique priorisé), la formation (informatique priorisée) et le statut (nouveau priorisé).
                    </span>
                  </span>
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="demande in demandes" :key="demande.id" class="hover:bg-gray-50">
                <td class="px-6 py-4">
                  <div class="text-sm font-medium text-gray-900">{{ demande.nom }}</div>
                  <div class="text-sm text-gray-500">{{ demande.email }}</div>
                </td>
                <td class="px-6 py-4 text-sm text-gray-500">{{ demande.typeStage }}</td>
                <td class="px-6 py-4 text-sm text-gray-500">{{ formatDate(demande.dateSoumission) }}</td>
                <td class="px-6 py-4">
                  <span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                        :class="getStatusClass(demande.status)">
                    {{ getStatusLabel(demande.status) }}
                  </span>
                </td>
                <td class="px-6 py-4 text-sm text-gray-500 font-mono">{{ scoreDemande(demande).toFixed(2) }}</td>
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
    </div>

    <DemandeDetails 
      v-if="selectedDemande" 
      :demande="selectedDemande" 
      @close="closeDetails"
    />
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import DemandeDetails from '@/components/demandes/DemandeDetails.vue'
import { stageRequestService } from '@/services/api'

export default {
  name: 'NouvellesDemandes',
  components: {
    DemandeDetails
  },
  setup() {
    const searchQuery = ref('')
    const filterStatus = ref('')
    const selectedDemande = ref(null)

    const demandes = ref([
    ]) // Initialisé vide, rempli par l'API

    // Charger les demandes depuis l'API au montage
    onMounted(async () => {
      try {
        const data = await stageRequestService.getStageRequestsForDPAF();
        // Adapter les champs pour correspondre à l'affichage attendu
        demandes.value = data.map(demande => ({
          id: demande.id,
          nom: demande.stagiaire?.profile ? `${demande.stagiaire.profile.prenom} ${demande.stagiaire.profile.nom}`.trim() : '',
          email: demande.stagiaire?.email || '',
          structure: demande.stagiaire?.stagiaire?.structure?.nomStructure || 'Non renseignée',
          typeStage: demande.type || '',
          dateSoumission: demande.createdAt,
          status: demande.status || '',
          telephone: demande.stagiaire?.profile?.telephone || '',
          formation: demande.anneeEtude || '',
          dateDebut: demande.dateDebut,
          dateFin: demande.dateFin,
          documents: demande.autresDocuments || [],
          // Ajoute d'autres champs si besoin
        }));
      } catch (e) {
        // Gérer l'erreur (affichage, toast, etc.)
        demandes.value = [];
      }
    });

    // Fonction de scoring IA pour classer les demandes
    const scoreDemande = (demande) => {
      let score = 0;
      // Priorité aux demandes les plus récentes
      if (demande.dateSoumission) {
        const daysAgo = (new Date() - new Date(demande.dateSoumission)) / (1000 * 60 * 60 * 24);
        score -= daysAgo; // Plus c'est récent, plus le score est élevé
      }
      // Priorité aux stages académiques
      if (demande.typeStage && demande.typeStage.toLowerCase().includes('académique')) {
        score += 5;
      }
      // Bonus si la formation est en informatique
      if (demande.formation && demande.formation.toLowerCase().includes('informatique')) {
        score += 3;
      }
      // Bonus si statut = 'nouveau'
      if (demande.status === 'nouveau') {
        score += 2;
      }
      // Tu peux ajouter d'autres critères ici...
      return score;
    };

    const demandesParStructure = computed(() => {
      const demandesGrouped = {};
      demandes.value.forEach(demande => {
        if (!demandesGrouped[demande.structure]) {
          demandesGrouped[demande.structure] = [];
        }
        demandesGrouped[demande.structure].push(demande);
      });
      // Trie chaque groupe par score décroissant (IA)
      Object.keys(demandesGrouped).forEach(structure => {
        demandesGrouped[structure].sort((a, b) => scoreDemande(b) - scoreDemande(a));
      });
      return demandesGrouped;
    });


    const filteredDemandes = computed(() => {
      let filtered = demandes.value;
      if (searchQuery.value) {
        filtered = filtered.filter(demande => {
          return demande.nom.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                 demande.email.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                 demande.structure.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                 demande.typeStage.toLowerCase().includes(searchQuery.value.toLowerCase());
        })
      }
      if (filterStatus.value) {
        filtered = filtered.filter(demande => demande.status === filterStatus.value);
      }
      return filtered;
    })

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('fr-FR')
    }

    const getStatusClass = (status) => {
      const classes = {
        nouveau: 'bg-blue-100 text-blue-800',
        en_cours: 'bg-yellow-100 text-yellow-800',
        confirme: 'bg-green-100 text-green-800',
        refuse: 'bg-red-100 text-red-800'
      }
      return classes[status] || ''
    }

    const getStatusLabel = (status) => {
      const labels = {
        nouveau: 'Nouveau',
        en_cours: 'En cours',
        confirme: 'Confirmé',
        refuse: 'Refusé'
      }
      return labels[status] || status
    }

    const viewDetails = (demande) => {
      selectedDemande.value = demande
    }

    const closeDetails = () => {
      selectedDemande.value = null
    }

    return {
      searchQuery,
      filterStatus,
      filteredDemandes,
      demandesParStructure,
      formatDate,
      getStatusClass,
      getStatusLabel,
      viewDetails,
      selectedDemande,
      closeDetails,
      scoreDemande // Pour debug ou affichage si besoin
    }
  }
}
</script>