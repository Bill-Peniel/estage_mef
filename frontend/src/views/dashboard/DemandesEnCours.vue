<template>
  <div class="p-4 sm:p-6 top-10 md:top-16 lg:top-16 relative">
    <h1 class="text-2xl font-bold mb-6 text-primary">Stages en cours</h1>

    <!-- Barre de recherche -->
    <div class="mb-4 flex items-center gap-2">
      <input
        v-model="search"
        type="text"
        placeholder="Rechercher un stagiaire, une structure, une date..."
        class="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
      />
      <button v-if="search" @click="search = ''" class="ml-2 text-gray-400 hover:text-primary transition" title="Effacer">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
      </button>
    </div>

    <!-- Desktop Data Table -->
    <div class="hidden md:block bg-white rounded-lg shadow-lg p-4 sm:p-6">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer" @click="sortBy('stagiaire')">
                Stagiaire
                <span v-if="sortKey === 'stagiaire'">
                  <svg v-if="!sortDesc" class="inline w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7"/></svg>
                  <svg v-else class="inline w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
                </span>
              </th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer" @click="sortBy('structure')">
                Structure
                <span v-if="sortKey === 'structure'">
                  <svg v-if="!sortDesc" class="inline w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7"/></svg>
                  <svg v-else class="inline w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
                </span>
              </th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer" @click="sortBy('dateDebut')">
                Date de début
                <span v-if="sortKey === 'dateDebut'">
                  <svg v-if="!sortDesc" class="inline w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7"/></svg>
                  <svg v-else class="inline w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
                </span>
              </th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer" @click="sortBy('dateFin')">
                Date de fin
                <span v-if="sortKey === 'dateFin'">
                  <svg v-if="!sortDesc" class="inline w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7"/></svg>
                  <svg v-else class="inline w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
                </span>
              </th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Progression</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="(stage, index) in filteredAndSortedStages" :key="index" class="hover:bg-gray-50 transition">
              <td class="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{{ stage.stagiaire }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-gray-700">{{ stage.structure }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-gray-700">{{ stage.dateDebut }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-gray-700">{{ stage.dateFin }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div class="bg-primary h-2 rounded-full transition-all duration-500" :style="{ width: stage.progression + '%' }"></div>
                </div>
                <span class="text-xs text-gray-600 mt-1 block">{{ stage.progression }}%</span>
              </td>
            </tr>
            <tr v-if="!filteredAndSortedStages.length">
              <td colspan="5" class="text-center text-gray-400 py-8">Aucun stage en cours</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Mobile Cards -->
    <div class="md:hidden space-y-4">
      <div v-for="(stage, index) in filteredAndSortedStages" :key="index" class="bg-white rounded-lg shadow p-4 flex flex-col gap-2">
        <div class="flex items-center justify-between mb-1">
          <span class="font-semibold text-gray-900">{{ stage.stagiaire }}</span>
          <span class="text-xs text-gray-500">{{ stage.structure }}</span>
        </div>
        <div class="flex items-center text-gray-700 text-sm mb-1">
          <svg class="w-4 h-4 mr-1 text-primary" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
          <span>{{ stage.dateDebut }} → {{ stage.dateFin }}</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="flex-1 bg-gray-200 rounded-full h-2">
            <div class="bg-primary h-2 rounded-full transition-all duration-500" :style="{ width: stage.progression + '%' }"></div>
          </div>
          <span class="text-xs text-gray-600">{{ stage.progression }}%</span>
        </div>
      </div>
      <div v-if="!filteredAndSortedStages.length" class="text-center text-gray-400 py-8">Aucun stage en cours</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DemandesEnCours',
  data() {
    return {
      search: '',
      sortKey: '',
      sortDesc: false,
      stages: [
        {
          stagiaire: 'Paul Dubois',
          structure: 'Direction des Impôts',
          dateDebut: '01/02/2024',
          dateFin: '01/05/2024',
          progression: 45
        },
        {
          stagiaire: 'Sophie Martin',
          structure: 'Service Informatique',
          dateDebut: '15/01/2024',
          dateFin: '15/04/2024',
          progression: 70
        }
      ]
    }
  },
  computed: {
    filteredAndSortedStages() {
      let result = this.stages.filter(stage => {
        const q = this.search.toLowerCase();
        return (
          stage.stagiaire.toLowerCase().includes(q) ||
          stage.structure.toLowerCase().includes(q) ||
          stage.dateDebut.toLowerCase().includes(q) ||
          stage.dateFin.toLowerCase().includes(q)
        );
      });
      if (this.sortKey) {
        result = result.slice().sort((a, b) => {
          let aVal = a[this.sortKey];
          let bVal = b[this.sortKey];
          if (this.sortKey === 'progression') {
            aVal = Number(aVal);
            bVal = Number(bVal);
          }
          if (aVal < bVal) return this.sortDesc ? 1 : -1;
          if (aVal > bVal) return this.sortDesc ? -1 : 1;
          return 0;
        });
      }
      return result;
    }
  },
  methods: {
    sortBy(key) {
      if (this.sortKey === key) {
        this.sortDesc = !this.sortDesc;
      } else {
        this.sortKey = key;
        this.sortDesc = false;
      }
    }
  }
}
</script>

<style scoped>
@media (max-width: 767px) {
  h1 {
    font-size: 1.25rem;
    margin-bottom: 1.5rem;
  }
}
</style>