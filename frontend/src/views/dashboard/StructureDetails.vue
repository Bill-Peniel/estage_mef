<template>
  <div class="min-h-screen bg-gray-100">
    <div class="flex-1">
      <header class="bg-primary shadow">
        <div class="px-4 py-4 flex justify-between items-center">
          <h1 class="text-2xl font-bold text-white">Détails de la structure</h1>
          <button @click="$router.push('/structures')" class="bg-white text-primary px-4 py-2 rounded hover:bg-gray-100">
            <i class="fas fa-arrow-left mr-2"></i> Retour
          </button>
        </div>
      </header>

      <main class="p-6">
        <!-- Messages d'erreur et de succès -->
        <div v-if="error" class="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {{ error }}
        </div>
        <div v-if="success" class="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          {{ success }}
        </div>

        <!-- Informations de la structure -->
        <div class="bg-white shadow rounded-lg p-6 mb-6">
          <h2 class="text-xl font-bold mb-4">Informations générales</h2>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-sm text-gray-600">Nom de la structure</p>
              <p class="text-lg font-medium">{{ structure.nomStructure }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600">Sigle</p>
              <p class="text-lg font-medium">{{ structure.sigle }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600">Date de création</p>
              <p class="text-lg font-medium">{{ new Date(structure.createdAt).toLocaleDateString() }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600">Dernière mise à jour</p>
              <p class="text-lg font-medium">{{ new Date(structure.updatedAt).toLocaleDateString() }}</p>
            </div>
          </div>
        </div>

        <!-- Sous-structures -->
        <div class="bg-white shadow rounded-lg p-6 mb-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-bold">Sous-structures</h2>
            <button @click="showAddSubStructureModal = true" class="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark">
              <i class="fas fa-plus mr-2"></i> Ajouter une sous-structure
            </button>
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
                <tr v-for="subStructure in structure.children" :key="subStructure.id">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">{{ subStructure.nomStructure }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{ subStructure.sigle }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button @click="viewSubStructure(subStructure)" class="text-primary hover:text-primary-dark mr-3" title="Voir">
                      <i class="fas fa-eye"></i>
                    </button>
                    <button @click="editSubStructure(subStructure)" class="text-primary hover:text-primary-dark mr-3" title="Modifier">
                      <i class="fas fa-edit"></i>
                    </button>
                    <button @click="deleteSubStructure(subStructure.id)" class="text-danger hover:text-red-700" title="Supprimer">
                      <i class="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Tuteurs -->
        <div class="bg-white shadow rounded-lg p-6 mb-6">
          <h2 class="text-xl font-bold mb-4">Tuteurs</h2>
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
                <tr v-for="tuteur in structure.tuteurs" :key="tuteur.id">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">{{ tuteur.user.profile.nom }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{ tuteur.user.profile.prenom }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{ tuteur.user.email }}</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Stagiaires -->
        <div class="bg-white shadow rounded-lg p-6">
          <h2 class="text-xl font-bold mb-4">Stagiaires</h2>
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
                <tr v-for="stagiaire in structure.stagiaires" :key="stagiaire.id">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">{{ stagiaire.user.profile.nom }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{ stagiaire.user.profile.prenom }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{ stagiaire.user.email }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">
                      {{ stagiaire.tuteur ? `${stagiaire.tuteur.user.profile.nom} ${stagiaire.tuteur.user.profile.prenom}` : '-' }}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <!-- Modal d'ajout de sous-structure -->
      <div v-if="showAddSubStructureModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
        <div class="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
          <div class="p-6">
            <h2 class="text-xl font-bold mb-4">Ajouter une sous-structure</h2>
            <form @submit.prevent="submitSubStructure">
              <div v-if="error" class="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                {{ error }}
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div class="w-full">
                  <label class="block text-sm font-medium text-gray-700 mb-2">Nom de la structure</label>
                  <input v-model="newSubStructure.nomStructure" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary" required>
                </div>
                <div class="w-full">
                  <label class="block text-sm font-medium text-gray-700 mb-2">Sigle</label>
                  <input v-model="newSubStructure.sigle" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary" required>
                </div>
              </div>
              <div class="mt-6 flex justify-end space-x-3">
                <button type="button" @click="showAddSubStructureModal = false" class="btn-outline">
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

      <!-- Modal de modification de sous-structure -->
      <div v-if="showEditSubStructureModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
        <div class="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
          <div class="p-6">
            <h2 class="text-xl font-bold mb-4">Modifier la sous-structure</h2>
            <form @submit.prevent="updateSubStructure">
              <div v-if="error" class="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                {{ error }}
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div class="w-full">
                  <label class="block text-sm font-medium text-gray-700 mb-2">Nom de la sous-structure</label>
                  <input v-model="editingSubStructure.nomStructure" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary" required>
                </div>
                <div class="w-full">
                  <label class="block text-sm font-medium text-gray-700 mb-2">Sigle</label>
                  <input v-model="editingSubStructure.sigle" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary" required>
                </div>
              </div>
              <div class="mt-6 flex justify-end space-x-3">
                <button type="button" @click="showEditSubStructureModal = false" class="btn-outline">
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
  name: 'StructureDetails',
  data() {
    return {
      structure: {
        children: [],
        tuteurs: [],
        stagiaires: []
      },
      showAddSubStructureModal: false,
      showEditSubStructureModal: false,
      newSubStructure: {
        nomStructure: '',
        sigle: '',
        parentId: null
      },
      editingSubStructure: {
        id: null,
        nomStructure: '',
        sigle: '',
        parentId: null
      },
      error: null,
      success: null
    }
  },
  methods: {
    async fetchStructureDetails() {
      try {
        const response = await fetch(`http://localhost:3002/api/structures/${this.$route.params.id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (response.ok) {
          this.structure = await response.json();
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des détails de la structure:', error);
      }
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
          body: JSON.stringify({
            ...this.newSubStructure,
            parentId: this.structure.id
          })
        });

        const data = await response.json();

        if (response.ok) {
          this.success = 'Sous-structure ajoutée avec succès';
          await this.fetchStructureDetails();
          this.showAddSubStructureModal = false;
          this.newSubStructure = {
            nomStructure: '',
            sigle: '',
            parentId: null
          };
        } else {
          this.error = data.message || 'Erreur lors de la création de la sous-structure';
        }
      } catch (error) {
        this.error = 'Erreur de connexion au serveur';
        console.error('Erreur lors de la création de la sous-structure:', error);
      }
    },
    viewSubStructure(structure) {
      this.$router.push(`/structures/${structure.id}`);
    },
    editSubStructure(structure) {
      this.editingSubStructure = {
        id: structure.id,
        nomStructure: structure.nomStructure,
        sigle: structure.sigle,
        parentId: this.structure.id
      };
      this.showEditSubStructureModal = true;
    },
    async updateSubStructure() {
      try {
        this.error = null;
        this.success = null;
        
        const response = await fetch(`http://localhost:3002/api/structures/${this.editingSubStructure.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            nomStructure: this.editingSubStructure.nomStructure,
            sigle: this.editingSubStructure.sigle,
            parentId: this.editingSubStructure.parentId
          })
        });

        const data = await response.json();

        if (response.ok) {
          this.success = 'Sous-structure modifiée avec succès';
          await this.fetchStructureDetails();
          this.showEditSubStructureModal = false;
          this.editingSubStructure = {
            id: null,
            nomStructure: '',
            sigle: '',
            parentId: null
          };
        } else {
          this.error = data.message || 'Erreur lors de la modification de la sous-structure';
        }
      } catch (error) {
        this.error = 'Erreur de connexion au serveur';
        console.error('Erreur lors de la modification de la sous-structure:', error);
      }
    },
    async deleteSubStructure(id) {
      if (confirm('Êtes-vous sûr de vouloir supprimer cette sous-structure ?')) {
        try {
          const response = await fetch(`http://localhost:3002/api/structures/${id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });
          if (response.ok) {
            await this.fetchStructureDetails();
          }
        } catch (error) {
          console.error('Erreur lors de la suppression de la sous-structure:', error);
        }
      }
    }
  },
  mounted() {
    this.fetchStructureDetails();
  }
}
</script> 