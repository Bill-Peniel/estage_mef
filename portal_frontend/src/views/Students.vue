<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Header -->
    <header class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-4">
          <div class="flex items-center">
            <h1 class="text-2xl font-bold text-indigo-600">Portail Universitaire</h1>
          </div>
          <div class="flex items-center space-x-4">
            <div class="text-sm text-gray-600">
              {{ user?.name || 'Université' }}
            </div>
            <button
              @click="logout"
              class="text-gray-600 hover:text-indigo-600 transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>

    <div class="flex">
      <!-- Sidebar -->
      <aside class="w-64 bg-white shadow-sm min-h-screen">
        <nav class="mt-8">
          <div class="px-4 space-y-2">
            <router-link
              to="/dashboard"
              class="flex items-center px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-md transition-colors"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z"></path>
              </svg>
              Tableau de bord
            </router-link>

            <router-link
              to="/dashboard/students"
              class="flex items-center px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-md transition-colors bg-indigo-50 text-indigo-600"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
              </svg>
              Mes étudiants
            </router-link>

            <router-link
              to="/dashboard/evaluations"
              class="flex items-center px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-md transition-colors"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              Évaluations
            </router-link>

            <router-link
              to="/dashboard/reports"
              class="flex items-center px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-md transition-colors"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
              Rapports
            </router-link>

            <router-link
              to="/dashboard/settings"
              class="flex items-center px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-md transition-colors"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              Paramètres
            </router-link>
          </div>
        </nav>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 p-8">
        <div class="max-w-7xl mx-auto">
          <!-- Page Header -->
          <div class="mb-8">
            <h1 class="text-3xl font-bold text-gray-900">Mes étudiants</h1>
            <p class="text-gray-600 mt-2">Gérez et suivez vos étudiants en stage</p>
          </div>

          <!-- Filters -->
          <div class="bg-white rounded-lg shadow p-6 mb-6">
            <div class="flex flex-wrap gap-4">
              <div class="flex-1 min-w-0">
                <label for="search" class="sr-only">Rechercher</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                  </div>
                  <input
                    id="search"
                    v-model="filters.search"
                    type="text"
                    class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Rechercher un étudiant..."
                  />
                </div>
              </div>

              <div class="flex items-center space-x-4">
                <select
                  v-model="filters.status"
                  class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="">Tous les statuts</option>
                  <option value="active">En cours</option>
                  <option value="pending">En attente</option>
                  <option value="completed">Terminé</option>
                </select>

                <select
                  v-model="filters.year"
                  class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="">Toutes les années</option>
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                  <option value="2022">2022</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Students Table -->
          <div class="bg-white rounded-lg shadow">
            <div class="px-6 py-4 border-b border-gray-200">
              <div class="flex justify-between items-center">
                <h2 class="text-lg font-semibold text-gray-900">
                  Liste des étudiants ({{ filteredStudents.length }})
                </h2>
                <button
                  @click="exportData"
                  class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Exporter
                </button>
              </div>
            </div>
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Étudiant
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stage
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Entreprise
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dernière évaluation
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="student in filteredStudents" :key="student.id">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div class="flex-shrink-0 h-10 w-10">
                          <div class="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                            <span class="text-sm font-medium text-indigo-600">
                              {{ student.name.charAt(0) }}
                            </span>
                          </div>
                        </div>
                        <div class="ml-4">
                          <div class="text-sm font-medium text-gray-900">{{ student.name }}</div>
                          <div class="text-sm text-gray-500">{{ student.email }}</div>
                          <div class="text-sm text-gray-500">{{ student.studentId }}</div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-900">{{ student.internship }}</div>
                      <div class="text-sm text-gray-500">{{ student.duration }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-900">{{ student.company }}</div>
                      <div class="text-sm text-gray-500">{{ student.location }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span :class="getStatusClass(student.status)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                        {{ getStatusText(student.status) }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {{ student.lastEvaluation || 'Aucune' }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div class="flex space-x-2">
                        <router-link :to="`/dashboard/students/${student.id}`" class="text-indigo-600 hover:text-indigo-900">
                          Voir détails
                        </router-link>
                        <button @click="viewEvaluations(student.id)" class="text-green-600 hover:text-green-900">
                          Évaluations
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'Students',
  setup() {
    const router = useRouter()
    const user = ref(null)
    const students = ref([])
    const filters = reactive({
      search: '',
      status: '',
      year: ''
    })

    const loadUser = () => {
      const userData = localStorage.getItem('university_user')
      if (userData) {
        user.value = JSON.parse(userData)
      }
    }

    const loadStudents = () => {
      // Simulation de données - à remplacer par votre API
      students.value = [
        {
          id: 1,
          name: 'Marie Dupont',
          email: 'marie.dupont@email.com',
          studentId: '2024-001',
          internship: 'Développeur Full Stack',
          company: 'TechCorp',
          location: 'Paris',
          duration: '6 mois',
          status: 'active',
          lastEvaluation: '15/01/2024'
        },
        {
          id: 2,
          name: 'Jean Martin',
          email: 'jean.martin@email.com',
          studentId: '2024-002',
          internship: 'Data Analyst',
          company: 'DataSoft',
          location: 'Lyon',
          duration: '4 mois',
          status: 'pending',
          lastEvaluation: null
        },
        {
          id: 3,
          name: 'Sophie Bernard',
          email: 'sophie.bernard@email.com',
          studentId: '2024-003',
          internship: 'UX Designer',
          company: 'DesignLab',
          location: 'Marseille',
          duration: '5 mois',
          status: 'active',
          lastEvaluation: '10/01/2024'
        },
        {
          id: 4,
          name: 'Pierre Dubois',
          email: 'pierre.dubois@email.com',
          studentId: '2024-004',
          internship: 'DevOps Engineer',
          company: 'CloudTech',
          location: 'Toulouse',
          duration: '6 mois',
          status: 'completed',
          lastEvaluation: '20/12/2023'
        }
      ]
    }

    const filteredStudents = computed(() => {
      return students.value.filter(student => {
        const matchesSearch = !filters.search || 
          student.name.toLowerCase().includes(filters.search.toLowerCase()) ||
          student.email.toLowerCase().includes(filters.search.toLowerCase()) ||
          student.studentId.toLowerCase().includes(filters.search.toLowerCase())
        
        const matchesStatus = !filters.status || student.status === filters.status
        
        return matchesSearch && matchesStatus
      })
    })

    const getStatusClass = (status) => {
      const classes = {
        active: 'bg-green-100 text-green-800',
        pending: 'bg-yellow-100 text-yellow-800',
        completed: 'bg-blue-100 text-blue-800'
      }
      return classes[status] || 'bg-gray-100 text-gray-800'
    }

    const getStatusText = (status) => {
      const texts = {
        active: 'En cours',
        pending: 'En attente',
        completed: 'Terminé'
      }
      return texts[status] || status
    }

    const viewEvaluations = (studentId) => {
      router.push(`/dashboard/evaluations?student=${studentId}`)
    }

    const exportData = () => {
      // Simulation d'export - à implémenter selon vos besoins
      console.log('Export des données...')
    }

    const logout = () => {
      localStorage.removeItem('university_token')
      localStorage.removeItem('university_user')
      router.push('/login')
    }

    onMounted(() => {
      loadUser()
      loadStudents()
    })

    return {
      user,
      students,
      filters,
      filteredStudents,
      getStatusClass,
      getStatusText,
      viewEvaluations,
      exportData,
      logout
    }
  }
}
</script>
