
<template>
  <div class="p-6">
    <h1 class="text-2xl font-semibold mb-6">Tableau de bord</h1>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-lg font-medium mb-2">Progression du stage</h3>
        <div class="relative pt-1">
          <div class="overflow-hidden h-2 mb-4 text-xs flex rounded bg-green-100">
            <div class="w-1/2 shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"></div>
          </div>
          <div class="text-right">
            <span class="text-sm font-semibold inline-block text-green-600">50%</span>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-lg font-medium mb-2">Documents</h3>
        <p class="text-gray-600">2 documents en attente de validation</p>
        <router-link to="/dashboard/stagiaire/documents" class="text-primary hover:text-primary-dark mt-2 inline-block">Voir les documents →</router-link>
      </div>

      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-lg font-medium mb-2">Prochaine évaluation</h3>
        <p class="text-gray-600">Dans 2 semaines</p>
      </div>
    </div>

    <div class="mt-8 bg-white rounded-lg shadow">
      <div class="p-6">
        <h3 class="text-lg font-medium mb-4">Activités récentes</h3>
        <div class="space-y-4">
          <div v-for="(activity, index) in activities" :key="index" class="flex items-start">
            <span :class="['w-8 h-8 rounded-full flex items-center justify-center', activity.iconBg]">
              <i :class="[activity.icon, activity.iconColor]"></i>
            </span>
            <div class="ml-3">
              <p class="text-sm font-medium text-gray-900">{{ activity.title }}</p>
              <p class="text-sm text-gray-500">{{ activity.time }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Overview',
  data() {
    return {
      activities: [
        {
          title: 'Rapport hebdomadaire soumis',
          time: 'Il y a 2 heures',
          icon: 'fas fa-file-alt',
          iconBg: 'bg-blue-100',
          iconColor: 'text-blue-500'
        },
        {
          title: 'Réunion avec le tuteur',
          time: 'Il y a 1 jour',
          icon: 'fas fa-users',
          iconBg: 'bg-green-100',
          iconColor: 'text-green-500'
        },
        {
          title: 'Document validé',
          time: 'Il y a 2 jours',
          icon: 'fas fa-check-circle',
          iconBg: 'bg-yellow-100',
          iconColor: 'text-yellow-500'
        }
      ]
    }
  }
}
</script>
