<template>
  <div class="min-h-screen bg-gray-100 top-10 md:top-16 lg:top-16 relative z-0">
    <div class="flex-1">
      <header class="bg-white shadow sticky top-0 z-20">
        <div class="px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-2">
          <h1 class="text-2xl font-bold text-primary text-center sm:text-left">Gestion des structures</h1>
          <button @click="showAddModal = true" class="bg-primary text-white px-4 py-2 rounded hover:bg-green-900 w-full sm:w-auto">
            <i class="fas fa-plus mr-2"></i> Ajouter une structure
          </button>
        </div>
      </header>

      <main class="p-2 sm:p-6 overflow-x-hidden">
        <!-- Messages d'erreur et de succès -->
        <div v-if="error" class="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {{ error }}
        </div>
        <div v-if="success" class="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          {{ success }}
        </div>

        <!-- Barre de recherche -->
        <div class="mb-4">
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i class="fas fa-search text-gray-400"></i>
            </div>
            <input
              v-model="searchQuery"
              type="text"
              class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm"
              placeholder="Rechercher une structure par nom ou sigle..."
            >
            <div v-if="searchQuery" class="absolute inset-y-0 right-0 pr-3 flex items-center">
              <button
                @click="searchQuery = ''"
                class="text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <i class="fas fa-times"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- Desktop Table -->
        <div class="bg-white shadow rounded-lg hidden md:block">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sigle</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="structure in paginatedStructures" :key="structure.id">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">{{ structure.nomStructure }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{ structure.sigle }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">
                      <span :class="[
                        'px-2 py-1 text-xs font-semibold rounded-full',
                        structure.type === 'directionnelle' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                      ]">
                        {{ structure.type === 'directionnelle' ? 'Directionnelle' : (structure.type === 'technique' ? 'Technique' : (structure.parentId ? 'Sous-structure' : 'Structure')) }}
                      </span>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      @click="viewStructure(structure)"
                      class="text-primary hover:text-primary-dark mr-3"
                    >
                      <i class="fas fa-eye"></i>
                    </button>
                    <button
                      @click="editStructure(structure)"
                      class="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      <i class="fas fa-edit"></i>
                    </button>
                    <button
                      v-if="structure.type === 'directionnelle'"
                      @click="createAgent(structure)"
                      class="text-green-600 hover:text-green-900 mr-3"
                      title="Créer un agent pour cette structure"
                    >
                      <i class="fas fa-user-plus"></i>
                    </button>
                    <button
                      v-if="structure.type === 'technique'"
                      @click="createService(structure)"
                      class="text-purple-600 hover:text-purple-900 mr-3"
                      title="Créer un service pour cette structure"
                    >
                      <i class="fas fa-cogs"></i>
                    </button>
                    <button
                      @click="deleteStructure(structure.id)"
                      class="text-red-600 hover:text-red-900"
                    >
                      <i class="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <!-- Pagination (inchangée) -->
          <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div class="flex-1 flex justify-between sm:hidden">
              <button 
                @click="currentPage--" 
                :disabled="currentPage === 1"
                class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Précédent
              </button>
              <button 
                @click="currentPage++" 
                :disabled="currentPage === totalPages"
                class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Suivant
              </button>
            </div>
            <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p class="text-sm text-gray-700">
                  Affichage de <span class="font-medium">{{ startIndex + 1 }}</span> à 
                  <span class="font-medium">{{ endIndex }}</span> sur 
                  <span class="font-medium">{{ structures.length }}</span> structures
                </p>
              </div>
              <div>
                <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button 
                    @click="currentPage--" 
                    :disabled="currentPage === 1"
                    class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span class="sr-only">Précédent</span>
                    <i class="fas fa-chevron-left"></i>
                  </button>
                  <button 
                    v-for="page in displayedPages" 
                    :key="page"
                    @click="currentPage = page"
                    :class="[
                      'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                      currentPage === page 
                        ? 'z-10 bg-primary border-primary text-white' 
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    ]"
                  >
                    {{ page }}
                  </button>
                  <button 
                    @click="currentPage++" 
                    :disabled="currentPage === totalPages"
                    class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span class="sr-only">Suivant</span>
                    <i class="fas fa-chevron-right"></i>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>

        <!-- Mobile Cards -->
        <div class="md:hidden space-y-4">
          <div v-for="structure in paginatedStructures" :key="structure.id" class="bg-white rounded-lg shadow p-4 flex flex-col gap-2">
            <div class="flex items-center justify-between mb-2">
              <span class="font-semibold text-gray-900">{{ structure.nomStructure }}</span>
              <span :class="[
                'px-2 py-1 text-xs font-semibold rounded-full',
                structure.type === 'directionnelle' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
              ]">
                {{ structure.type === 'directionnelle' ? 'Directionnelle' : (structure.type === 'technique' ? 'Technique' : (structure.parentId ? 'Sous-structure' : 'Structure')) }}
              </span>
            </div>
            <div class="flex items-center text-gray-700 text-sm mb-1">
              <i class="fas fa-building mr-1 text-primary"></i>
              <span>{{ structure.sigle }}</span>
            </div>
            <div class="flex items-center gap-2 mt-2">
              <button @click="viewStructure(structure)" class="text-primary hover:text-primary-dark" title="Voir">
                <i class="fas fa-eye"></i>
              </button>
              <button @click="editStructure(structure)" class="text-primary hover:text-primary-dark" title="Modifier">
                <i class="fas fa-edit"></i>
              </button>
              <button @click="deleteStructure(structure.id)" class="text-danger hover:text-red-700" title="Supprimer">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
          <!-- Pagination mobile -->
          <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
            <button 
              @click="currentPage--" 
              :disabled="currentPage === 1"
              class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Précédent
            </button>
            <span class="text-sm text-gray-700">Page {{ currentPage }} / {{ totalPages }}</span>
            <button 
              @click="currentPage++" 
              :disabled="currentPage === totalPages"
              class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Suivant
            </button>
          </div>
        </div>
        <!-- FIN Mobile Cards -->
      </main>

      <!-- Modal d'ajout de structure -->
      <div v-if="showAddModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
        <div class="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
          <div class="p-6">
            <h2 class="text-xl font-bold mb-4">Ajouter une structure</h2>
            <form @submit.prevent="submitStructure">
              <div v-if="error" class="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                {{ error }}
              </div>
              <div class=" gap-4">
                <div class="w-full">
                  <label class="block text-sm font-medium text-gray-700 mb-2">Sigle</label>
                  <input v-model="newStructure.sigle" type="text" class="w-28 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary" required>
                </div>
                <div class="w-full">
                  <label class="block text-sm font-medium text-gray-700 mb-2">Nom de la structure</label>
                  <input v-model="newStructure.nomStructure" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary" required>
                </div>
              </div>
              <!-- Type de structure -->
              <div class="mt-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">Type de structure <span class="text-red-600">*</span></label>
                <div class="flex gap-4">
                  <label class="inline-flex items-center">
                    <input type="radio" v-model="newStructure.type" value="technique" class="form-radio text-primary" required>
                    <span class="ml-2">Structure technique</span>
                  </label>
                  <label class="inline-flex items-center">
                    <input type="radio" v-model="newStructure.type" value="directionnelle" class="form-radio text-primary" required>
                    <span class="ml-2">Structure directionnelle</span>
                  </label>
                </div>
                <div v-if="showAddModal && !newStructure.type && error" class="text-red-500 text-xs mt-1">Veuillez sélectionner un type de structure.</div>
              </div>
              <div class="mt-6 flex justify-end space-x-3">
                <button type="button" @click="showAddModal = false" class="btn-outline">
                  Annuler
                </button>
                <button type="submit" class="btn-primary">
                  Ajouter
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Modal pour les détails de la structure -->
      <div v-if="showDetailsModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div class="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-medium text-gray-900">Détails de la structure</h3>
            <button @click="showDetailsModal = false" class="text-gray-400 hover:text-gray-500">
              <i class="fas fa-times"></i>
            </button>
          </div>

          <!-- Informations générales -->
          <div class="mb-6">
            <h4 class="text-md font-medium text-gray-700 mb-2">Informations générales</h4>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-sm text-gray-600">Nom de la structure</p>
                <p class="text-sm font-medium">{{ selectedStructure?.nomStructure }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600">Sigle</p>
                <p class="text-sm font-medium">{{ selectedStructure?.sigle }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600">Date de création</p>
                <p class="text-sm font-medium">{{ formatDate(selectedStructure?.createdAt) }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600">Dernière mise à jour</p>
                <p class="text-sm font-medium">{{ formatDate(selectedStructure?.updatedAt) }}</p>
              </div>
            </div>
          </div>

          <!-- Sous-structures -->
          <div class="mb-6">
            <div class="flex justify-between items-center mb-2">
              <h4 class="text-md font-medium text-gray-700">Sous-structures</h4>
              <button @click="openAddSubStructureModal" class="text-primary hover:text-primary-dark">
                <i class="fas fa-plus"></i> Ajouter une sous-structure
              </button>
            </div>
            <!-- Barre de recherche sous-structures -->
            <div class="mb-4">
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i class="fas fa-search text-gray-400"></i>
                </div>
                <input
                  v-model="subStructuresSearch"
                  type="text"
                  class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm"
                  placeholder="Rechercher une sous-structure..."
                >
                <div v-if="subStructuresSearch" class="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    @click="subStructuresSearch = ''"
                    class="text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    <i class="fas fa-times"></i>
                  </button>
                </div>
              </div>
            </div>
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sigle</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="subStructure in paginatedSubStructures" :key="subStructure.id">
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ subStructure.nomStructure }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ subStructure.sigle }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button @click="viewStructure(subStructure)" class="text-primary hover:text-primary-dark mr-3">
                        <i class="fas fa-eye"></i>
                      </button>
                      <button @click="editStructure(subStructure)" class="text-primary hover:text-primary-dark mr-3">
                        <i class="fas fa-edit"></i>
                      </button>
                      <button @click="deleteStructure(subStructure.id)" class="text-danger hover:text-red-700">
                        <i class="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <!-- Pagination sous-structures -->
            <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div class="flex-1 flex justify-between sm:hidden">
                <button 
                  @click="subStructuresPage--" 
                  :disabled="subStructuresPage === 1"
                  class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Précédent
                </button>
                <button 
                  @click="subStructuresPage++" 
                  :disabled="subStructuresPage === totalSubStructuresPages"
                  class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Suivant
                </button>
              </div>
              <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p class="text-sm text-gray-700">
                    Affichage de <span class="font-medium">{{ subStructuresStartIndex + 1 }}</span> à 
                    <span class="font-medium">{{ subStructuresEndIndex }}</span> sur 
                    <span class="font-medium">{{ filteredSubStructures.length }}</span> sous-structures
                  </p>
                </div>
                <div>
                  <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button 
                      @click="subStructuresPage--" 
                      :disabled="subStructuresPage === 1"
                      class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    >
                      <span class="sr-only">Précédent</span>
                      <i class="fas fa-chevron-left"></i>
                    </button>
                    <button 
                      v-for="page in displayedSubStructuresPages" 
                      :key="page"
                      @click="subStructuresPage = page"
                      :class="[
                        'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                        subStructuresPage === page 
                          ? 'z-10 bg-primary border-primary text-white' 
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      ]"
                    >
                      {{ page }}
                    </button>
                    <button 
                      @click="subStructuresPage++" 
                      :disabled="subStructuresPage === totalSubStructuresPages"
                      class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    >
                      <span class="sr-only">Suivant</span>
                      <i class="fas fa-chevron-right"></i>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </div>

          <!-- Tuteurs -->
          <div class="mb-6">
            <h4 class="text-md font-medium text-gray-700 mb-2">Tuteurs</h4>
            <!-- Barre de recherche tuteurs -->
            <div class="mb-4">
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i class="fas fa-search text-gray-400"></i>
                </div>
                <input
                  v-model="tuteursSearch"
                  type="text"
                  class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm"
                  placeholder="Rechercher un tuteur..."
                >
                <div v-if="tuteursSearch" class="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    @click="tuteursSearch = ''"
                    class="text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    <i class="fas fa-times"></i>
                  </button>
                </div>
              </div>
            </div>
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prénom</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="tuteur in paginatedTuteurs" :key="tuteur.id">
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ tuteur.user.profile.nom }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ tuteur.user.profile.prenom }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ tuteur.user.email }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <!-- Pagination tuteurs -->
            <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div class="flex-1 flex justify-between sm:hidden">
                <button 
                  @click="tuteursPage--" 
                  :disabled="tuteursPage === 1"
                  class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Précédent
                </button>
                <button 
                  @click="tuteursPage++" 
                  :disabled="tuteursPage === totalTuteursPages"
                  class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Suivant
                </button>
              </div>
              <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p class="text-sm text-gray-700">
                    Affichage de <span class="font-medium">{{ tuteursStartIndex + 1 }}</span> à 
                    <span class="font-medium">{{ tuteursEndIndex }}</span> sur 
                    <span class="font-medium">{{ filteredTuteurs.length }}</span> tuteurs
                  </p>
                </div>
                <div>
                  <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button 
                      @click="tuteursPage--" 
                      :disabled="tuteursPage === 1"
                      class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    >
                      <span class="sr-only">Précédent</span>
                      <i class="fas fa-chevron-left"></i>
                    </button>
                    <button 
                      v-for="page in displayedTuteursPages" 
                      :key="page"
                      @click="tuteursPage = page"
                      :class="[
                        'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                        tuteursPage === page 
                          ? 'z-10 bg-primary border-primary text-white' 
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      ]"
                    >
                      {{ page }}
                    </button>
                    <button 
                      @click="tuteursPage++" 
                      :disabled="tuteursPage === totalTuteursPages"
                      class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    >
                      <span class="sr-only">Suivant</span>
                      <i class="fas fa-chevron-right"></i>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </div>

          <!-- Stagiaires -->
          <div class="mb-6">
            <h4 class="text-md font-medium text-gray-700 mb-2">Stagiaires</h4>
            <!-- Barre de recherche stagiaires -->
            <div class="mb-4">
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i class="fas fa-search text-gray-400"></i>
                </div>
                <input
                  v-model="stagiairesSearch"
                  type="text"
                  class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm"
                  placeholder="Rechercher un stagiaire..."
                >
                <div v-if="stagiairesSearch" class="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    @click="stagiairesSearch = ''"
                    class="text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    <i class="fas fa-times"></i>
                  </button>
                </div>
              </div>
            </div>
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prénom</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tuteur</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="stagiaire in paginatedStagiaires" :key="stagiaire.id">
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ stagiaire.user.profile.nom }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ stagiaire.user.profile.prenom }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ stagiaire.user.email }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {{ stagiaire.tuteur ? `${stagiaire.tuteur.user.profile.prenom} ${stagiaire.tuteur.user.profile.nom}` : '-' }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <!-- Pagination stagiaires -->
            <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div class="flex-1 flex justify-between sm:hidden">
                <button 
                  @click="stagiairesPage--" 
                  :disabled="stagiairesPage === 1"
                  class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Précédent
                </button>
                <button 
                  @click="stagiairesPage++" 
                  :disabled="stagiairesPage === totalStagiairesPages"
                  class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Suivant
                </button>
              </div>
              <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p class="text-sm text-gray-700">
                    Affichage de <span class="font-medium">{{ stagiairesStartIndex + 1 }}</span> à 
                    <span class="font-medium">{{ stagiairesEndIndex }}</span> sur 
                    <span class="font-medium">{{ filteredStagiaires.length }}</span> stagiaires
                  </p>
                </div>
                <div>
                  <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button 
                      @click="stagiairesPage--" 
                      :disabled="stagiairesPage === 1"
                      class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    >
                      <span class="sr-only">Précédent</span>
                      <i class="fas fa-chevron-left"></i>
                    </button>
                    <button 
                      v-for="page in displayedStagiairesPages" 
                      :key="page"
                      @click="stagiairesPage = page"
                      :class="[
                        'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                        stagiairesPage === page 
                          ? 'z-10 bg-primary border-primary text-white' 
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      ]"
                    >
                      {{ page }}
                    </button>
                    <button 
                      @click="stagiairesPage++" 
                      :disabled="stagiairesPage === totalStagiairesPages"
                      class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    >
                      <span class="sr-only">Suivant</span>
                      <i class="fas fa-chevron-right"></i>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal d'ajout de sous-structure -->
      <div v-if="showSubStructureModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
        <div class="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
          <div class="p-6">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-xl font-bold">Ajouter une sous-structure</h2>
              <button @click="showSubStructureModal = false" class="text-gray-400 hover:text-gray-500">
                <i class="fas fa-times"></i>
              </button>
            </div>
            <form @submit.prevent="submitSubStructure">
              <div v-if="error" class="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                {{ error }}
              </div>
              <div class="grid grid-cols-1 gap-4">
                <div class="w-full">
                  <label class="block text-sm font-medium text-gray-700 mb-2">Nom de la sous-structure</label>
                  <input v-model="newSubStructure.nomStructure" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary" required>
                </div>
                <div class="w-full">
                  <label class="block text-sm font-medium text-gray-700 mb-2">Sigle</label>
                  <input v-model="newSubStructure.sigle" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary" required>
                </div>
              </div>
              <div class="mt-6 flex justify-end space-x-3">
                <button type="button" @click="showSubStructureModal = false" class="btn-outline">
                  Annuler
                </button>
                <button type="submit" class="btn-primary">
                  Ajouter
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Modal de modification de structure -->
      <div v-if="showEditModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
        <div class="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
          <div class="p-6">
            <h2 class="text-xl font-bold mb-4">Modifier la structure</h2>
            <form @submit.prevent="updateStructure">
              <div v-if="error" class="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                {{ error }}
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div class="w-full">
                  <label class="block text-sm font-medium text-gray-700 mb-2">Nom de la structure</label>
                  <input v-model="editingStructure.nomStructure" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary" required>
                </div>
                <div class="w-full">
                  <label class="block text-sm font-medium text-gray-700 mb-2">Sigle</label>
                  <input v-model="editingStructure.sigle" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary" required>
                </div>
              </div>
              <!-- Type de structure (édition) -->
              <div class="mt-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">Type de structure <span class="text-red-600">*</span></label>
                <div class="flex gap-4">
                  <label class="inline-flex items-center">
                    <input type="radio" v-model="editingStructure.type" value="technique" class="form-radio text-primary" required>
                    <span class="ml-2">Structure technique</span>
                  </label>
                  <label class="inline-flex items-center">
                    <input type="radio" v-model="editingStructure.type" value="directionnelle" class="form-radio text-primary" required>
                    <span class="ml-2">Structure directionnelle</span>
                  </label>
                </div>
              </div>
              <div class="mt-6 flex justify-end space-x-3">
                <button type="button" @click="showEditModal = false" class="btn-outline">
                  Annuler
                </button>
                <button type="submit" class="btn-primary">
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Structures',
  data() {
    return {
      showAddModal: false,
      showEditModal: false,
      showSubStructureModal: false,
      structures: [],
      filteredStructures: [],
      searchQuery: '',
      newStructure: {
        nomStructure: '',
        sigle: '',
        type: ''
      },
      editingStructure: {
        id: null,
        nomStructure: '',
        sigle: '',
        type: ''
      },
      newSubStructure: {
        nomStructure: '',
        sigle: '',
        parentId: null
      },
      error: null,
      success: null,
      showDetailsModal: false,
      selectedStructure: null,
      formData: {
        nomStructure: '',
        sigle: '',
        parentId: null
      },
      isEditing: false,
      loading: false,
      currentPage: 1,
      itemsPerPage: 15,
      // Sous-structures
      subStructuresSearch: '',
      subStructuresPage: 1,
      // Tuteurs
      tuteursSearch: '',
      tuteursPage: 1,
      // Stagiaires
      stagiairesSearch: '',
      stagiairesPage: 1,
    }
  },
  computed: {
    totalPages() {
      return Math.ceil(this.filteredStructures.length / this.itemsPerPage);
    },
    startIndex() {
      return (this.currentPage - 1) * this.itemsPerPage;
    },
    endIndex() {
      return Math.min(this.startIndex + this.itemsPerPage, this.filteredStructures.length);
    },
    paginatedStructures() {
      return this.filteredStructures.slice(this.startIndex, this.endIndex);
    },
    displayedPages() {
      return this.getDisplayedPages(this.totalPages, this.currentPage);
    },
    // Sous-structures
    filteredSubStructures() {
      if (!this.subStructuresSearch) {
        return this.selectedStructure?.children || [];
      }
      const query = this.subStructuresSearch.toLowerCase();
      return (this.selectedStructure?.children || []).filter(structure => 
        structure.nomStructure.toLowerCase().includes(query) ||
        structure.sigle.toLowerCase().includes(query)
      );
    },
    totalSubStructuresPages() {
      return Math.ceil(this.filteredSubStructures.length / this.itemsPerPage);
    },
    subStructuresStartIndex() {
      return (this.subStructuresPage - 1) * this.itemsPerPage;
    },
    subStructuresEndIndex() {
      return Math.min(this.subStructuresStartIndex + this.itemsPerPage, this.filteredSubStructures.length);
    },
    paginatedSubStructures() {
      return this.filteredSubStructures.slice(this.subStructuresStartIndex, this.subStructuresEndIndex);
    },
    displayedSubStructuresPages() {
      return this.getDisplayedPages(this.totalSubStructuresPages, this.subStructuresPage);
    },
    // Tuteurs
    filteredTuteurs() {
      if (!this.tuteursSearch) {
        return this.selectedStructure?.tuteurs || [];
      }
      const query = this.tuteursSearch.toLowerCase();
      return (this.selectedStructure?.tuteurs || []).filter(tuteur => 
        tuteur.user.profile.nom.toLowerCase().includes(query) ||
        tuteur.user.profile.prenom.toLowerCase().includes(query) ||
        tuteur.user.email.toLowerCase().includes(query)
      );
    },
    totalTuteursPages() {
      return Math.ceil(this.filteredTuteurs.length / this.itemsPerPage);
    },
    tuteursStartIndex() {
      return (this.tuteursPage - 1) * this.itemsPerPage;
    },
    tuteursEndIndex() {
      return Math.min(this.tuteursStartIndex + this.itemsPerPage, this.filteredTuteurs.length);
    },
    paginatedTuteurs() {
      return this.filteredTuteurs.slice(this.tuteursStartIndex, this.tuteursEndIndex);
    },
    displayedTuteursPages() {
      return this.getDisplayedPages(this.totalTuteursPages, this.tuteursPage);
    },
    // Stagiaires
    filteredStagiaires() {
      if (!this.stagiairesSearch) {
        return this.selectedStructure?.stagiaires || [];
      }
      const query = this.stagiairesSearch.toLowerCase();
      return (this.selectedStructure?.stagiaires || []).filter(stagiaire => 
        stagiaire.user.profile.nom.toLowerCase().includes(query) ||
        stagiaire.user.profile.prenom.toLowerCase().includes(query) ||
        stagiaire.user.email.toLowerCase().includes(query)
      );
    },
    totalStagiairesPages() {
      return Math.ceil(this.filteredStagiaires.length / this.itemsPerPage);
    },
    stagiairesStartIndex() {
      return (this.stagiairesPage - 1) * this.itemsPerPage;
    },
    stagiairesEndIndex() {
      return Math.min(this.stagiairesStartIndex + this.itemsPerPage, this.filteredStagiaires.length);
    },
    paginatedStagiaires() {
      return this.filteredStagiaires.slice(this.stagiairesStartIndex, this.stagiairesEndIndex);
    },
    displayedStagiairesPages() {
      return this.getDisplayedPages(this.totalStagiairesPages, this.stagiairesPage);
    }
  },
  watch: {
    currentPage() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    searchQuery() {
      this.currentPage = 1;
      this.filterStructures();
    },
    structures: {
      immediate: true,
      handler() {
        this.filterStructures();
      }
    },
    subStructuresSearch() {
      this.subStructuresPage = 1;
    },
    tuteursSearch() {
      this.tuteursPage = 1;
    },
    stagiairesSearch() {
      this.stagiairesPage = 1;
    }
  },
  methods: {
    filterStructures() {
      if (!this.searchQuery) {
        this.filteredStructures = [...this.structures];
        return;
      }

      const query = this.searchQuery.toLowerCase();
      this.filteredStructures = this.structures.filter(structure => 
        structure.nomStructure.toLowerCase().includes(query) ||
        structure.sigle.toLowerCase().includes(query)
      );
    },
    async submitStructure() {
      try {
        this.error = null;
        this.success = null;
        if (!this.newStructure.type) {
          this.error = 'Veuillez sélectionner un type de structure.';
          return;
        }
        
        const response = await fetch('http://localhost:3002/api/structures', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(this.newStructure)
        });

        const data = await response.json();

        if (response.ok) {
          this.success = 'Structure ajoutée avec succès';
          await this.fetchStructures();
          this.showAddModal = false;
          this.newStructure = {
            nomStructure: '',
            sigle: '',
            type: ''
          };
        } else {
          this.error = data.message || 'Erreur lors de la création de la structure';
          console.error('Erreur lors de la création de la structure:', data);
        }
      } catch (error) {
        this.error = 'Erreur de connexion au serveur';
        console.error('Erreur lors de la création de la structure:', error);
      }
    },
    async fetchStructures() {
      try {
        console.log('Tentative de récupération des structures...');
        const response = await fetch('http://localhost:3002/api/structures', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          console.log('Structures reçues du backend:', data);
          this.structures = data;
          this.filterStructures();
        } else {
          console.error('Erreur lors de la récupération des structures:', response.status);
          const errorData = await response.json();
          console.error('Détails de l\'erreur:', errorData);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des structures:', error);
      }
    },
    editStructure(structure) {
      this.editingStructure = {
        id: structure.id,
        nomStructure: structure.nomStructure,
        sigle: structure.sigle,
        type: structure.type || ''
      };
      this.showEditModal = true;
    },
    async updateStructure() {
      try {
        this.error = null;
        this.success = null;
        if (!this.editingStructure.type) {
          this.error = 'Veuillez sélectionner un type de structure.';
          return;
        }
        
        const response = await fetch(`http://localhost:3002/api/structures/${this.editingStructure.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            nomStructure: this.editingStructure.nomStructure,
            sigle: this.editingStructure.sigle,
            type: this.editingStructure.type
          })
        });

        const data = await response.json();

        if (response.ok) {
          this.success = 'Structure modifiée avec succès';
          await this.fetchStructures();
          this.showEditModal = false;
          this.editingStructure = {
            id: null,
            nomStructure: '',
            sigle: '',
            type: ''
          };
        } else {
          this.error = data.message || 'Erreur lors de la modification de la structure';
        }
      } catch (error) {
        this.error = 'Erreur de connexion au serveur';
        console.error('Erreur lors de la modification de la structure:', error);
      }
    },
    createAgent(structure) {
      // Rediriger vers la page de création d'agents avec l'ID de la structure
      this.$router.push(`/dashboard/tuteurs?structureId=${structure.id}&type=agent`)
    },

    createService(structure) {
      // Rediriger vers la page de création de services avec l'ID de la structure
      this.$router.push(`/dashboard/services?structureId=${structure.id}`)
    },

    async deleteStructure(id) {
      if (confirm('Êtes-vous sûr de vouloir supprimer cette structure ?')) {
        try {
          const response = await fetch(`http://localhost:3002/api/structures/${id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });
          if (response.ok) {
            await this.fetchStructures();
          }
        } catch (error) {
          console.error('Erreur lors de la suppression de la structure:', error);
        }
      }
    },
    viewStructure(structure) {
      this.selectedStructure = structure;
      this.showDetailsModal = true;
    },
    formatDate(date) {
      if (!date) return '-';
      return new Date(date).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    },
    openAddSubStructureModal() {
      this.newSubStructure = {
        nomStructure: '',
        sigle: '',
        parentId: this.selectedStructure.id
      };
      this.showSubStructureModal = true;
    },
    async submitSubStructure() {
      try {
        this.error = null;
        this.success = null;
        
        const response = await fetch('http://localhost:3002/api/structures', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(this.newSubStructure)
        });

        const data = await response.json();

        if (response.ok) {
          this.success = 'Sous-structure ajoutée avec succès';
          await this.fetchStructures();
          this.showSubStructureModal = false;
          this.newSubStructure = {
            nomStructure: '',
            sigle: '',
            parentId: null
          };
        } else {
          this.error = data.message || 'Erreur lors de la création de la sous-structure';
          console.error('Erreur lors de la création de la sous-structure:', data);
        }
      } catch (error) {
        this.error = 'Erreur de connexion au serveur';
        console.error('Erreur lors de la création de la sous-structure:', error);
      }
    },
    getDisplayedPages(totalPages, currentPage) {
      const pages = [];
      const maxDisplayedPages = 5;
      
      if (totalPages <= maxDisplayedPages) {
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        if (currentPage <= 3) {
          for (let i = 1; i <= 5; i++) {
            pages.push(i);
          }
        } else if (currentPage >= totalPages - 2) {
          for (let i = totalPages - 4; i <= totalPages; i++) {
            pages.push(i);
          }
        } else {
          for (let i = currentPage - 2; i <= currentPage + 2; i++) {
            pages.push(i);
          }
        }
      }
      
      return pages;
    }
  },
  mounted() {
    this.fetchStructures();
  }
}
</script>