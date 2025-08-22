<template>
  <div class="space-y-6">
    <!-- En-tête -->
    <div class="bg-white rounded-lg shadow p-6">
      <h2 class="text-2xl font-bold text-gray-900 mb-4">Vue d'ensemble - Structure Directionnelle</h2>
      <p class="text-gray-600">
        Bienvenue dans votre tableau de bord de structure directionnelle. 
        Vous pouvez gérer vos sous-structures et les agents qui y sont assignés.
      </p>
    </div>

    <!-- Statistiques -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-blue-100 text-blue-600">
            <i class="fas fa-sitemap text-2xl"></i>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Sous-structures</p>
            <p class="text-2xl font-semibold text-gray-900">{{ stats.sousStructures }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-green-100 text-green-600">
            <i class="fas fa-users text-2xl"></i>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Agents</p>
            <p class="text-2xl font-semibold text-gray-900">{{ stats.agents }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-purple-100 text-purple-600">
            <i class="fas fa-user-graduate text-2xl"></i>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Stagiaires</p>
            <p class="text-2xl font-semibold text-gray-900">{{ stats.stagiaires }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Actions rapides -->
    <div class="bg-white rounded-lg shadow p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <router-link 
          to="/dashboard/structure_directionnelles/sousStructures"
          class="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div class="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
            <i class="fas fa-plus text-xl"></i>
          </div>
          <div>
            <h4 class="font-medium text-gray-900">Créer une sous-structure</h4>
            <p class="text-sm text-gray-600">Ajouter une nouvelle sous-structure technique</p>
          </div>
        </router-link>

        <router-link 
          to="/dashboard/structure_directionnelles/tuteurs"
          class="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div class="p-3 rounded-full bg-green-100 text-green-600 mr-4">
            <i class="fas fa-user-plus text-xl"></i>
          </div>
          <div>
            <h4 class="font-medium text-gray-900">Ajouter un agent</h4>
            <p class="text-sm text-gray-600">Créer un nouvel agent pour une sous-structure</p>
          </div>
        </router-link>
      </div>
    </div>

    <!-- Dernières activités -->
    <div class="bg-white rounded-lg shadow p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Dernières activités</h3>
      <div class="space-y-4">
        <div v-for="activity in recentActivities" :key="activity.id" class="flex items-center p-3 border border-gray-100 rounded-lg">
          <div class="p-2 rounded-full bg-gray-100 text-gray-600 mr-3">
            <i :class="activity.icon"></i>
          </div>
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-900">{{ activity.title }}</p>
            <p class="text-xs text-gray-500">{{ activity.time }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'StructureDirectionnelleOverview',
  setup() {
    const store = useStore()
    const stats = ref({
      sousStructures: 0,
      agents: 0,
      stagiaires: 0
    })

    const recentActivities = ref([
      {
        id: 1,
        title: 'Nouvelle sous-structure créée',
        time: 'Il y a 2 heures',
        icon: 'fas fa-sitemap'
      },
      {
        id: 2,
        title: 'Agent ajouté à la sous-structure',
        time: 'Il y a 1 jour',
        icon: 'fas fa-user-plus'
      },
      {
        id: 3,
        title: 'Stagiaire affecté',
        time: 'Il y a 2 jours',
        icon: 'fas fa-user-graduate'
      }
    ])

    const loadStats = async () => {
      try {
        // Ici vous pouvez charger les vraies statistiques depuis l'API
        // Pour l'instant, on utilise des valeurs par défaut
        stats.value = {
          sousStructures: 3,
          agents: 8,
          stagiaires: 12
        }
      } catch (error) {
        console.error('Erreur lors du chargement des statistiques:', error)
      }
    }

    onMounted(() => {
      loadStats()
    })

    return {
      stats,
      recentActivities
    }
  }
}
</script>

