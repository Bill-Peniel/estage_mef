<template>
  <div class="p-4 sm:p-6 relative top-10 md:top-16 lg:top-16">
    <h1 class="text-2xl font-bold mb-6 text-primary">Demandes en attente</h1>

    <!-- Barre de recherche -->
    <div class="mb-4 flex items-center gap-2">
      <input
        v-model="search"
        type="text"
        placeholder="Rechercher un stagiaire, une structure, une date, un statut..."
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
              <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer" @click="sortBy('date')">
                Date de demande
                <span v-if="sortKey === 'date'">
                  <svg v-if="!sortDesc" class="inline w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7"/></svg>
                  <svg v-else class="inline w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
                </span>
              </th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer" @click="sortBy('status')">
                Statut
                <span v-if="sortKey === 'status'">
                  <svg v-if="!sortDesc" class="inline w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7"/></svg>
                  <svg v-else class="inline w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
                </span>
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="(demande, index) in filteredAndSortedDemandes" :key="index" class="hover:bg-gray-50 transition">
              <td class="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{{ demande.stagiaire }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-gray-700">{{ demande.structure }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-gray-700">{{ demande.date }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 py-1 text-xs rounded-full font-semibold" :class="getStatusClass(demande.status)">
                  {{ demande.status }}
                </span>
              </td>
            </tr>
            <tr v-if="!filteredAndSortedDemandes.length">
              <td colspan="4" class="text-center text-gray-400 py-8">Aucune demande en attente</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Mobile Cards -->
    <div class="md:hidden space-y-4">
      <div v-for="(demande, index) in filteredAndSortedDemandes" :key="index" class="bg-white rounded-lg shadow p-4 flex flex-col gap-2">
        <div class="flex items-center justify-between">
          <span class="font-semibold text-gray-900">{{ demande.stagiaire }}</span>
          <span class="px-2 py-1 text-xs rounded-full font-semibold" :class="getStatusClass(demande.status)">
            {{ demande.status }}
          </span>
        </div>
        <div class="flex items-center text-gray-700 text-sm">
          <svg class="w-4 h-4 mr-1 text-primary" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 01-8 0M12 15v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          <span>{{ demande.structure }}</span>
        </div>
        <div class="flex items-center text-gray-500 text-xs">
          <svg class="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
          <span>{{ demande.date }}</span>
        </div>
      </div>
      <div v-if="!filteredAndSortedDemandes.length" class="text-center text-gray-400 py-8">Aucune demande en attente</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DemandesEnAttente',
  data() {
    return {
      search: '',
      sortKey: '',
      sortDesc: false,
      demandes: [
        {
          stagiaire: 'Jean Dupont',
          structure: 'Direction des Impôts',
          date: '23/02/2024',
          status: 'En attente'
        },
        {
          stagiaire: 'Marie Martin',
          structure: 'Service Informatique',
          date: '22/02/2024',
          status: 'En attente'
        }
      ]
    }
  },
  computed: {
    filteredAndSortedDemandes() {
      let result = this.demandes.filter(demande => {
        const q = this.search.toLowerCase();
        return (
          demande.stagiaire.toLowerCase().includes(q) ||
          demande.structure.toLowerCase().includes(q) ||
          demande.date.toLowerCase().includes(q) ||
          (demande.status && demande.status.toLowerCase().includes(q))
        );
      });
      if (this.sortKey) {
        result = result.slice().sort((a, b) => {
          let aVal = a[this.sortKey];
          let bVal = b[this.sortKey];
          if (this.sortKey === 'date') {
            // Optionnel : trier les dates au format JJ/MM/AAAA
            const parse = d => d.split('/').reverse().join('-');
            aVal = parse(aVal);
            bVal = parse(bVal);
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
    getStatusClass(status) {
      return {
        'En attente': 'bg-yellow-100 text-yellow-800',
        'Validé': 'bg-green-100 text-green-800',
        'Refusé': 'bg-red-100 text-red-800'
      }[status] || 'bg-gray-100 text-gray-600';
    },
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
/* Améliorations visuelles supplémentaires */
@media (max-width: 767px) {
  h1 {
    font-size: 1.25rem;
    margin-bottom: 1.5rem;
  }
}
</style>