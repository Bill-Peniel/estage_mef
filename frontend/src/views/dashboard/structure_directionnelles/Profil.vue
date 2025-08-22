<template>
  <div class="space-y-6">
    <!-- En-tête -->
    <div class="bg-white rounded-lg shadow p-6">
      <h2 class="text-2xl font-bold text-gray-900">Mon Profil</h2>
      <p class="text-gray-600 mt-2">
        Gérez vos informations personnelles et les paramètres de votre compte
      </p>
    </div>

    <!-- Informations du profil -->
    <div class="bg-white rounded-lg shadow p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Informations personnelles</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-medium text-gray-700">Prénom</label>
          <p class="mt-1 text-sm text-gray-900">{{ userProfile?.prenom || 'Non renseigné' }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Nom</label>
          <p class="mt-1 text-sm text-gray-900">{{ userProfile?.nom || 'Non renseigné' }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Email</label>
          <p class="mt-1 text-sm text-gray-900">{{ user?.email || 'Non renseigné' }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Téléphone</label>
          <p class="mt-1 text-sm text-gray-900">{{ userProfile?.telephone || 'Non renseigné' }}</p>
        </div>
      </div>
    </div>

    <!-- Informations de la structure -->
    <div class="bg-white rounded-lg shadow p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Informations de la structure</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-medium text-gray-700">Nom de la structure</label>
          <p class="mt-1 text-sm text-gray-900">{{ structureInfo?.nomStructure || 'Non renseigné' }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Sigle</label>
          <p class="mt-1 text-sm text-gray-900">{{ structureInfo?.sigle || 'Non renseigné' }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Type</label>
          <p class="mt-1 text-sm text-gray-900">
            <span class="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
              Structure Directionnelle
            </span>
          </p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Rôle</label>
          <p class="mt-1 text-sm text-gray-900">Responsable de Structure Directionnelle</p>
        </div>
      </div>
    </div>

    <!-- Statistiques de la structure -->
    <div class="bg-white rounded-lg shadow p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Statistiques de la structure</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="text-center">
          <div class="text-2xl font-bold text-blue-600">{{ stats.sousStructures }}</div>
          <div class="text-sm text-gray-600">Sous-structures</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-green-600">{{ stats.agents }}</div>
          <div class="text-sm text-gray-600">Agents</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-purple-600">{{ stats.stagiaires }}</div>
          <div class="text-sm text-gray-600">Stagiaires</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { useStore } from 'vuex'
import { structureService } from '@/services/api'

export default {
  name: 'StructureDirectionnelleProfil',
  setup() {
    const store = useStore()
    const structureInfo = ref(null)
    const stats = ref({
      sousStructures: 0,
      agents: 0,
      stagiaires: 0
    })

    const user = computed(() => store.state.user)
    const userProfile = computed(() => user.value?.profile)

    const loadStructureInfo = async () => {
      try {
        const user = store.state.user
        const response = await structureService.getStructures()
        const userStructure = response.find(structure => 
          structure.users?.some(u => u.id === user?.id) ||
          structure.tuteurs?.some(t => t.userId === user?.id)
        )
        
        if (userStructure) {
          structureInfo.value = userStructure
          
          // Récupérer les sous-structures
          const sousStructures = response.filter(structure => 
            structure.parentId === userStructure.id && structure.type === 'technique'
          )
          
          // Calculer les statistiques
          stats.value.sousStructures = sousStructures.length
          
          let totalAgents = 0
          let totalStagiaires = 0
          
          for (const sousStructure of sousStructures) {
            if (sousStructure.tuteurs) {
              totalAgents += sousStructure.tuteurs.length
            }
            if (sousStructure.stagiaires) {
              totalStagiaires += sousStructure.stagiaires.length
            }
          }
          
          stats.value.agents = totalAgents
          stats.value.stagiaires = totalStagiaires
        }
      } catch (error) {
        console.error('Erreur lors du chargement des informations de la structure:', error)
        store.dispatch('setNotification', {
          type: 'error',
          message: 'Erreur lors du chargement des informations de la structure'
        })
      }
    }

    onMounted(() => {
      loadStructureInfo()
    })

    return {
      user,
      userProfile,
      structureInfo,
      stats
    }
  }
}
</script>

