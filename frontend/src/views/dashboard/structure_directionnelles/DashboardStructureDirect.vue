<template>
  <div class="min-h-screen bg-gray-100 flex flex-col">
    <header class="bg-slate-800 shadow-md shadow-[0_4px_6px_-1px_rgba(0,0,0,0.6)] fixed top-0 w-full z-20">
      <div class="px-4 py-4 flex justify-between items-center">
        <div class="flex items-center gap-4">
          <img src="@/assets/finance-logo1.png" alt="Logo du ministère" class="h-12 w-auto" />
          <h1 class="text-2xl font-bold text-white">
            <span v-if="structureSigle" class="text-accent-yellow">{{ structureSigle }}</span>
            <span v-else>Directionnelle</span>
            <span class="ml-2">- e-Stage</span>
          </h1>
        </div>

        <div class="flex items-center space-x-4">
          <span class="text-white">{{ store.getters.roleDisplay }}</span>
          <NotificationDropdown />
          <div class="relative" ref="userMenu">
            <button @click="toggleUserMenu" class="flex items-center space-x-3 focus:outline-none">
              <div class="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition">
                <span class="text-sm font-medium">{{ userInitials }}</span>
              </div>
            </button>
            <div v-show="showUserMenu" class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
              <router-link to="/dashboard/structure_directionnelles/profil" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                <i class="fas fa-user mr-2"></i> Mon profil
              </router-link>
              <router-link to="/dashboard/structure_directionnelles/parametres" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
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
      <SidebarStructureDirect class="fixed left-0 top-20 h-[calc(100vh-4rem)] z-10" />
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
import SidebarStructureDirect from '@/components/SidebarStructureDirect.vue'
import NotificationDropdown from '@/components/NotificationDropdown.vue'
import { structureService } from '@/services/api'

export default {
  name: 'DashboardStructureDirect',
  components: {
    SidebarStructureDirect,
    NotificationDropdown
  },
  setup() {
    const store = useStore()
    const router = useRouter()
    const showUserMenu = ref(false)
    const userMenu = ref(null)
    const structureSigle = ref('')

    const userInitials = computed(() => {
      const user = store.state.user
      return user?.name?.charAt(0).toUpperCase() || 'U'
    })

    const logout = async () => {
      await store.dispatch('logout')
      router.push('/login')
    }

    const closeMenus = (e) => {
      if (userMenu.value && !userMenu.value.contains(e.target)) {
        showUserMenu.value = false
      }
    }

    const loadStructureData = async () => {
      try {
        const user = store.state.user
        const localUser = JSON.parse(localStorage.getItem('user'))
        if (!user && localUser) {
          await store.dispatch('setUser', localUser)
        }
        const response = await structureService.getStructures()
        const userStructure = response.find(structure => 
          structure.tuteurs?.some(tuteur => tuteur.userId === (user?.id || localUser?.id))
        )
        if (userStructure) {
          if (userStructure.parentId) {
            const parentStructure = response.find(s => s.id === userStructure.parentId)
            if (parentStructure) {
              structureSigle.value = parentStructure.sigle
            }
          } else {
            structureSigle.value = userStructure.sigle
          }
        }
      } catch (error) {
        // Gestion d'erreur simplifiée
      }
    }

    const toggleUserMenu = () => {
      showUserMenu.value = !showUserMenu.value
    }

    onMounted(() => {
      document.addEventListener('click', closeMenus)
      loadStructureData()
    })

    watch(() => store.state.user, (newUser) => {
      if (newUser && newUser.role === 'structure_directionnelle') {
        loadStructureData()
      }
    }, { deep: true, immediate: true })

    onBeforeUnmount(() => {
      document.removeEventListener('click', closeMenus)
    })

    return {
      store,
      showUserMenu,
      userMenu,
      userInitials,
      toggleUserMenu,
      logout,
      structureSigle
    }
  }
}
</script>