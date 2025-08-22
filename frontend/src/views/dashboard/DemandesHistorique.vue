<template>
  <div class="p-4 sm:p-6 relative top-10 md:top-16 lg:top-16">
    <h1 class="text-2xl font-bold mb-6 text-primary">Historique des stages</h1>

    <!-- Barre de recherche et actions -->
    <div class="mb-4 flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
      <input
        v-model="search"
        type="text"
        placeholder="Rechercher une référence, un stagiaire, une structure, une période, un statut..."
        class="input-field w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
      />
          <div class="flex gap-2">
        <button class="btn-outline flex items-center gap-2">
          <i class="fas fa-filter"></i>Filtrer
            </button>
        <button class="btn-outline flex items-center gap-2">
          <i class="fas fa-download"></i>Exporter
            </button>
        </div>
      </div>

    <!-- Desktop Data Table -->
    <div class="hidden md:block bg-white rounded-lg shadow-lg p-4 sm:p-6">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer" @click="sortBy('reference')">
                Référence
                <span v-if="sortKey === 'reference'">
                  <svg v-if="!sortDesc" class="inline w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7"/></svg>
                  <svg v-else class="inline w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
                </span>
              </th>
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
              <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer" @click="sortBy('periode')">
                Période
                <span v-if="sortKey === 'periode'">
                  <svg v-if="!sortDesc" class="inline w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7"/></svg>
                  <svg v-else class="inline w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
                </span>
              </th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer" @click="sortBy('statut')">
                Statut
                <span v-if="sortKey === 'statut'">
                  <svg v-if="!sortDesc" class="inline w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7"/></svg>
                  <svg v-else class="inline w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
                </span>
              </th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="(stage, index) in paginatedHistorique" :key="index" class="hover:bg-gray-50 transition">
              <td class="px-6 py-4 whitespace-nowrap font-medium">{{ stage.reference }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ stage.stagiaire }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ stage.structure }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ stage.periode }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 py-1 text-xs rounded-full font-semibold" :class="getStatusClass(stage.statut)">
                  {{ stage.statut }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <button class="text-primary hover:text-primary-dark transition" title="Voir le détail">
                  <i class="fas fa-file-alt"></i>
                </button>
              </td>
            </tr>
            <tr v-if="!paginatedHistorique.length">
              <td colspan="6" class="text-center text-gray-400 py-8">Aucun stage trouvé</td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- Pagination -->
      <div class="flex justify-end mt-4" v-if="totalPages > 1">
        <button @click="prevPage" :disabled="page === 1" class="px-3 py-1 rounded-l bg-gray-100 border border-gray-300 text-gray-600 hover:bg-primary hover:text-white transition disabled:opacity-50">&lt;</button>
        <span class="px-4 py-1 bg-gray-50 border-t border-b border-gray-300 text-gray-700">Page {{ page }} / {{ totalPages }}</span>
        <button @click="nextPage" :disabled="page === totalPages" class="px-3 py-1 rounded-r bg-gray-100 border border-gray-300 text-gray-600 hover:bg-primary hover:text-white transition disabled:opacity-50">&gt;</button>
      </div>
    </div>

    <!-- Mobile Cards -->
    <div class="md:hidden space-y-4">
      <div v-for="(stage, index) in paginatedHistorique" :key="index" class="bg-white rounded-lg shadow p-4 flex flex-col gap-2">
        <div class="flex items-center justify-between mb-1">
          <span class="font-semibold text-gray-900">{{ stage.stagiaire }}</span>
          <span class="px-2 py-1 text-xs rounded-full font-semibold" :class="getStatusClass(stage.statut)">
            {{ stage.statut }}
          </span>
        </div>
        <div class="flex items-center text-gray-700 text-sm mb-1">
          <i class="fas fa-hashtag mr-1 text-primary"></i>
          <span>{{ stage.reference }}</span>
        </div>
        <div class="flex items-center text-gray-700 text-sm mb-1">
          <i class="fas fa-building mr-1 text-primary"></i>
          <span>{{ stage.structure }}</span>
        </div>
        <div class="flex items-center text-gray-500 text-xs mb-1">
          <i class="fas fa-calendar-alt mr-1 text-gray-400"></i>
          <span>{{ stage.periode }}</span>
        </div>
        <div class="flex items-center justify-end">
          <button class="text-primary hover:text-primary-dark transition" title="Voir le détail">
            <i class="fas fa-file-alt"></i>
          </button>
        </div>
      </div>
      <div v-if="!paginatedHistorique.length" class="text-center text-gray-400 py-8">Aucun stage trouvé</div>
      <!-- Pagination mobile -->
      <div class="flex justify-end mt-4" v-if="totalPages > 1">
        <button @click="prevPage" :disabled="page === 1" class="px-3 py-1 rounded-l bg-gray-100 border border-gray-300 text-gray-600 hover:bg-primary hover:text-white transition disabled:opacity-50">&lt;</button>
        <span class="px-4 py-1 bg-gray-50 border-t border-b border-gray-300 text-gray-700">Page {{ page }} / {{ totalPages }}</span>
        <button @click="nextPage" :disabled="page === totalPages" class="px-3 py-1 rounded-r bg-gray-100 border border-gray-300 text-gray-600 hover:bg-primary hover:text-white transition disabled:opacity-50">&gt;</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DemandesHistorique',
  data() {
    return {
      search: '',
      sortKey: '',
      sortDesc: false,
      page: 1,
      pageSize: 10,
      historique: [
        {
          reference: 'STG-2023-001',
          stagiaire: 'Lucas Bernard',
          structure: 'Direction des Impôts',
          periode: 'Jan - Mar 2023',
          statut: 'Terminé'
        },
        {
          reference: 'STG-2023-002',
          stagiaire: 'Emma Petit',
          structure: 'Service Informatique',
          periode: 'Avr - Juin 2023',
          statut: 'Terminé'
        }
      ]
    }
  },
  computed: {
    filteredHistorique() {
      const q = this.search.toLowerCase();
      return this.historique.filter(stage =>
        stage.reference.toLowerCase().includes(q) ||
        stage.stagiaire.toLowerCase().includes(q) ||
        stage.structure.toLowerCase().includes(q) ||
        stage.periode.toLowerCase().includes(q) ||
        (stage.statut && stage.statut.toLowerCase().includes(q))
      );
    },
    sortedHistorique() {
      let result = this.filteredHistorique;
      if (this.sortKey) {
        result = result.slice().sort((a, b) => {
          let aVal = a[this.sortKey];
          let bVal = b[this.sortKey];
          if (aVal < bVal) return this.sortDesc ? 1 : -1;
          if (aVal > bVal) return this.sortDesc ? -1 : 1;
          return 0;
        });
      }
      return result;
    },
    paginatedHistorique() {
      const start = (this.page - 1) * this.pageSize;
      return this.sortedHistorique.slice(start, start + this.pageSize);
    },
    totalPages() {
      return Math.ceil(this.sortedHistorique.length / this.pageSize) || 1;
    }
  },
  watch: {
    search() {
      this.page = 1;
    },
    sortKey() {
      this.page = 1;
    }
  },
  methods: {
    getStatusClass(statut) {
      return {
        'Terminé': 'bg-green-100 text-green-800',
        'Annulé': 'bg-red-100 text-red-800',
        'Interrompu': 'bg-yellow-100 text-yellow-800'
      }[statut] || 'bg-gray-100 text-gray-600';
    },
    sortBy(key) {
      if (this.sortKey === key) {
        this.sortDesc = !this.sortDesc;
      } else {
        this.sortKey = key;
        this.sortDesc = false;
      }
    },
    nextPage() {
      if (this.page < this.totalPages) this.page++;
    },
    prevPage() {
      if (this.page > 1) this.page--;
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