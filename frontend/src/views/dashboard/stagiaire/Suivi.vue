
<template>
  <div class="p-6">
    <h1 class="text-2xl font-semibold mb-6">Suivi de Stage</h1>
    
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-lg font-medium mb-4">Progression globale</h3>
        <div class="relative pt-1">
          <div class="overflow-hidden h-2 mb-4 text-xs flex rounded bg-green-100">
            <div class="w-2/3 shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"></div>
          </div>
          <div class="flex justify-between text-sm">
            <span>Début: 01/01/2024</span>
            <span>Fin: 31/03/2024</span>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-lg font-medium mb-4">Informations du stage</h3>
        <div class="space-y-3">
          <div class="flex justify-between">
            <span class="text-gray-600">Tuteur:</span>
            <span class="font-medium">M. John Doe</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Structure:</span>
            <span class="font-medium">Direction des Finances</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Thème:</span>
            <span class="font-medium">Gestion financière</span>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow lg:col-span-2">
        <h3 class="text-lg font-medium mb-4">Description du Thème</h3>
        <div class="space-y-4">
          <div class="prose max-w-none">
            <h4 class="font-medium text-primary mb-3">Gestion financière</h4>
            <p class="text-gray-600">
              Ce stage porte sur l'étude et l'analyse des processus de gestion financière au sein de la Direction des Finances. 
              Il comprend l'apprentissage des procédures budgétaires, l'analyse des flux financiers et la participation 
              à la planification financière des projets en cours.
            </p>
            <div class="mt-4">
              <h5 class="font-medium text-gray-700 mb-2">Objectifs principaux :</h5>
              <ul class="list-disc pl-5 space-y-2 text-gray-600">
                <li>Comprendre les processus de gestion budgétaire</li>
                <li>Maîtriser les outils d'analyse financière</li>
                <li>Participer à l'élaboration des rapports financiers</li>
                <li>Développer des compétences en planification financière</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Suivi',
  data() {
    return {
      weeks: [
        {
          number: 1,
          status: 'Validé',
          summary: 'Introduction aux procédures financières'
        },
        {
          number: 2,
          status: 'En cours',
          summary: 'Analyse des flux financiers'
        },
        {
          number: 3,
          status: 'À venir',
          summary: 'Planification budgétaire'
        }
      ]
    }
  },
  methods: {
    getStatusClass(status) {
      switch (status) {
        case 'Validé':
          return 'text-green-500'
        case 'En cours':
          return 'text-blue-500'
        default:
          return 'text-gray-500'
      }
    }
  }
}
</script>
