<template>
  <div class="min-h-screen bg-gray-100 flex flex-col">
    <header class="bg-slate-800 shadow-md shadow-[0_4px_6px_-1px_rgba(0,0,0,0.6)] fixed top-0 w-full z-20">
      <div class="px-4 py-4 flex justify-between items-center">
        <div class="flex items-center gap-4">
          <img src="@/assets/finance-logo1.png" alt="Logo du ministère" class="h-12 w-auto" />
          <h1 class="text-2xl font-bold text-white">
            <span v-if="structureSigle" class="text-accent-yellow">{{ structureSigle }}</span>
            <span v-else>Structure</span>
            <span class="ml-2">- e-Stage</span>
          </h1>
        </div>

        <div class="flex items-center space-x-4">
          <span class="text-white">{{ store.getters.roleDisplay }}</span>

          <!-- Notification Dropdown dynamique -->
          <NotificationDropdown />

          <div class="relative" ref="userMenu">
            <button @click="toggleUserMenu" class="flex items-center space-x-3 focus:outline-none">
              <div class="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition">
                <span class="text-sm font-medium">{{ userInitials }}</span>
              </div>
            </button>
            <div v-show="showUserMenu" class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
              <router-link to="/dashboard/structure/profil" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                <i class="fas fa-user mr-2"></i> Mon profil
              </router-link>
              <router-link to="/dashboard/structure/parametres" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                <i class="fas fa-cog mr-2"></i> Paramètres
              </router-link>
              <button @click="logout" class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                <i class="fas fa-sign-out-alt mr-2"></i> Déconnexion
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>

    <div class="flex pt-20">
      <SidebarStructure class="fixed left-0 top-20 h-[calc(100vh-4rem)] z-10" />
      
      <div class="flex-1 md:ml-64 p-6 bg-gray-50">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import SidebarStructure from '@/components/SidebarStructure.vue'
import NotificationDropdown from '@/components/NotificationDropdown.vue'
import { structureService } from '@/services/api'

export default {
  name: 'StructureDashboard',
  components: {
    SidebarStructure,
    NotificationDropdown
  },
  setup() {
    const store = useStore()
    const router = useRouter()
    const showUserMenu = ref(false)
    const userMenu = ref(null)
    const structureSigle = ref('')

    const stats = ref({
      stagiairesActifs: 5,
      evaluationsEnAttente: 2,
      stagesTermines: 8
    })

    const stagiaires = ref([
      {
        id: 1,
        nom: 'Jean Dupont',
        email: 'jean.dupont@email.com',
        typeStage: 'Stage académique',
        dateDebut: '2024-02-01',
        dateFin: '2024-04-30',
        tuteur: 'Marie Martin'
      },
      {
        id: 2,
        nom: 'Alice Bernard',
        email: 'alice.bernard@email.com',
        typeStage: 'Stage professionnel',
        dateDebut: '2024-03-01',
        dateFin: '2024-05-31',
        tuteur: 'Paul Dubois'
      }
    ])

    const userInitials = computed(() => {
      const user = store.state.user
      return user?.name?.charAt(0).toUpperCase() || 'U'
    })

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('fr-FR')
    }

    const logout = async () => {
      await store.dispatch('logout')
      router.push('/login')
    }

    // Close menus when clicking outside
    const closeMenus = (e) => {
      if (userMenu.value && !userMenu.value.contains(e.target)) {
        showUserMenu.value = false
      }
    }

    // Récupérer le sigle de la structure
    const loadStructureData = async () => {
      try {
        // Vérifier si l'utilisateur est connecté et a des données
        const user = store.state.user
        console.log('Données utilisateur dans le store:', user)

        // Récupérer les données de l'utilisateur depuis le localStorage
        const localUser = JSON.parse(localStorage.getItem('user'))
        console.log('Données utilisateur dans le localStorage:', localUser)

        // Utiliser les données du localStorage si le store est vide
        if (!user && localUser) {
          await store.dispatch('setUser', localUser)
        }

        // Récupérer toutes les structures
        const response = await structureService.getStructures()
        console.log('Structures reçues:', response)
        
        // Trouver la structure de l'utilisateur en cherchant dans les tuteurs
        const userStructure = response.find(structure => 
          structure.tuteurs?.some(tuteur => tuteur.userId === (user?.id || localUser?.id))
        )
        console.log('Structure trouvée:', userStructure)
        
        if (userStructure) {
          // Si la structure a un parent, utiliser le sigle du parent
          if (userStructure.parentId) {
            const parentStructure = response.find(s => s.id === userStructure.parentId)
            if (parentStructure) {
              structureSigle.value = parentStructure.sigle
              console.log('Sigle de la structure parente:', parentStructure.sigle)
            }
          } else {
            // Sinon utiliser le sigle de la structure elle-même
          structureSigle.value = userStructure.sigle
            console.log('Sigle de la structure:', userStructure.sigle)
          }
        } else {
          console.error('Structure non trouvée pour l\'utilisateur')
          store.dispatch('setNotification', {
            type: 'error',
            message: 'Aucune structure trouvée pour votre compte'
          })
        }
      } catch (error) {
        console.error('Erreur lors de la récupération du sigle de la structure:', error)
        store.dispatch('setNotification', {
          type: 'error',
          message: 'Erreur lors de la récupération des données de la structure'
        })
      }
    }

    const toggleUserMenu = () => {
      showUserMenu.value = !showUserMenu.value
    }

    onMounted(() => {
      document.addEventListener('click', closeMenus)
      loadStructureData()
    })

    // Ajouter un watcher pour les données de l'utilisateur
    watch(() => store.state.user, (newUser) => {
      console.log('Données utilisateur mises à jour:', newUser)
      if (newUser && newUser.role === 'structure') {
        loadStructureData()
      }
    }, { deep: true, immediate: true })

    onBeforeUnmount(() => {
      document.removeEventListener('click', closeMenus)
    })

    return {
      store,
      stats,
      stagiaires,
      showUserMenu,
      userMenu,
      userInitials,
      toggleUserMenu,
      formatDate,
      logout,
      structureSigle
    }
  }
}
</script>
