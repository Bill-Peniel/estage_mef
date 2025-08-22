<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">Affectation des Tuteurs</h1>
    
    <div class="bg-white rounded-lg shadow p-6">
      <div class="mb-6">
        <h2 class="text-lg font-semibold mb-4">Nouvelle Affectation</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Stagiaire</label>
            <select v-model="selectedStagiaire" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="">Sélectionner un stagiaire</option>
              <option v-for="stagiaire in stagiairesNonAffectes" :key="stagiaire.id" :value="stagiaire.id">
                {{ stagiaire.nom }} {{ stagiaire.prenom }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Tuteur</label>
            <select v-model="selectedTuteur" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="">Sélectionner un tuteur</option>
              <option v-for="tuteur in tuteurs" :key="tuteur.id" :value="tuteur.id">
                {{ tuteur.nom }} {{ tuteur.prenom }} - {{ tuteur.fonction }} ({{ tuteur.structure.nomStructure }})
              </option>
            </select>
          </div>
        </div>
        <button @click="affecter" class="mt-4 bg-primary text-white px-4 py-2 rounded hover:bg-primary-700">
          Affecter
        </button>
      </div>

      <div class="mt-8">
        <h2 class="text-lg font-semibold mb-4">Affectations en cours</h2>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stagiaire</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tuteur</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Structure du tuteur</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date d'affectation</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="affectation in affectations" :key="affectation.id">
                <td class="px-6 py-4 whitespace-nowrap">{{ affectation.stagiaire }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      <img class="h-10 w-10 rounded-full" :src="affectation.tuteur.photo || '/default-avatar.png'" alt="" />
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">
                        {{ affectation.tuteur.nom }} {{ affectation.tuteur.prenom }}
                      </div>
                      <div class="text-sm text-gray-500">
                        {{ affectation.tuteur.fonction }}
                      </div>
                      <div class="text-xs text-gray-400">
                        {{ affectation.tuteur.structure?.nom }}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">{{ affectation.tuteur.structure.nomStructure }}</td>
                <td class="px-6 py-4 whitespace-nowrap">{{ formatDate(affectation.dateAffectation) }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <button @click="supprimerAffectation(affectation.id)" class="text-red-600 hover:text-red-800">
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
import { api } from '@/services/api'
import { useNotification } from '@/services/notification.service'
import Notification from '@/components/Notification.vue'

export default {
  name: 'Affectations',
  components: {
    Notification
  },
  setup() {
    const notification = useNotification()
    return { notification }
  },
  data() {
    return {
      selectedStagiaire: '',
      selectedTuteur: '',
      stagiaires: [],
      tuteurs: [],
      affectations: [],
      loading: false
    }
  },
  computed: {
    stagiairesNonAffectes() {
      const stagiairesAffectes = this.affectations.map(a => a.userId)
      return this.stagiaires.filter(stagiaire => !stagiairesAffectes.includes(stagiaire.userId))
    }
  },
  methods: {
    async fetchData() {
      try {
        this.loading = true
        // Récupérer les stagiaires
        const stagiairesResponse = await api.get('/affectations/stagiaires')
        this.stagiaires = stagiairesResponse.data.map(stagiaire => ({
          id: stagiaire.userId,
          nom: stagiaire.user.profile.nom,
          prenom: stagiaire.user.profile.prenom
        }))

        // Récupérer les tuteurs
        const tuteursResponse = await api.get('/affectations/tuteurs')
        this.tuteurs = tuteursResponse.data.map(tuteur => ({
          id: tuteur.userId,
          nom: tuteur.user.profile.nom,
          prenom: tuteur.user.profile.prenom,
          fonction: tuteur.user.profile.fonction || 'Tuteur',
          structure: tuteur.structure
        }))

        // Récupérer les affectations
        const affectationsResponse = await api.get('/affectations')
        this.affectations = affectationsResponse.data.map(affectation => ({
          id: affectation.userId,
          stagiaire: `${affectation.user.profile.prenom} ${affectation.user.profile.nom}`,
          tuteur: {
            nom: `${affectation.tuteur.user.profile.prenom} ${affectation.tuteur.user.profile.nom}`,
            structure: affectation.tuteur.structure
          },
          dateAffectation: affectation.user.createdAt
        }))
      } catch (error) {
        this.notification.error('Erreur lors du chargement des données')
        console.error('Erreur:', error)
      } finally {
        this.loading = false
      }
    },
    async affecter() {
      if (!this.selectedStagiaire || !this.selectedTuteur) {
        this.notification.warning('Veuillez sélectionner un stagiaire et un tuteur')
        return
      }

      try {
        this.loading = true
        await api.post('/affectations', {
          stagiaireId: this.selectedStagiaire,
          tuteurId: this.selectedTuteur
        })

        this.notification.success('Affectation créée avec succès')
        
        // Réinitialiser les sélections
        this.selectedStagiaire = ''
        this.selectedTuteur = ''
        
        // Recharger les données
      await this.fetchData()
      } catch (error) {
        this.notification.error('Erreur lors de la création de l\'affectation')
        console.error('Erreur:', error)
      } finally {
        this.loading = false
      }
    },
    async supprimerAffectation(id) {
      if (!confirm('Êtes-vous sûr de vouloir supprimer cette affectation ?')) {
        return
      }

      try {
        this.loading = true
        await api.delete(`/affectations/${id}`)
        this.notification.success('Affectation supprimée avec succès')
        await this.fetchData()
      } catch (error) {
        this.notification.error('Erreur lors de la suppression de l\'affectation')
        console.error('Erreur:', error)
      } finally {
        this.loading = false
      }
    },
    formatDate(date) {
      if (!date) return 'Non définie';
      try {
        const dateObj = new Date(date);
        if (isNaN(dateObj.getTime())) return 'Date invalide';
        return dateObj.toLocaleDateString('fr-FR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      } catch (error) {
        return 'Date invalide';
      }
    }
  },
  mounted() {
    this.fetchData()
  }
}
</script>

<style scoped>
.loading {
  opacity: 0.7;
  pointer-events: none;
}
</style>
