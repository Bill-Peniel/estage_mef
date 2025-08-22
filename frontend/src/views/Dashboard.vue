<template>
  <div class="min-h-screen bg-gray-100 flex flex-col">
    <!-- Header responsive -->
    <header class="bg-slate-800 shadow fixed top-0 w-full z-20">
      <div class="flex flex-col md:flex-row md:justify-between md:items-center px-2 py-2 md:px-4 md:py-4">
        <div class="flex items-center gap-2 md:gap-4 w-full md:w-auto">
          <img src="@/assets/finance-logo1.png" alt="Logo du ministère" class="h-8 w-auto md:h-12" />
          <h1 class="font-bold text-lg md:text-2xl text-white text-center w-full md:w-auto md:text-left hidden md:block">Tableau de bord administratif</h1>
        </div>
        <div class="hidden sm:flex items-center space-x-4 mt-2 md:mt-0">
          <span class="text-white">{{ store.getters.roleDisplay }}</span>
          <button @click="logout" class="text-white hover:text-accent-yellow">
            <i class="fas fa-sign-out-alt"></i> Déconnexion
          </button>
        </div>
        <!-- Menu burger mobile -->
        <button @click="isMobileSidebarOpen = true" class="flex sm:hidden text-white text-2xl absolute right-4 top-3 focus:outline-none">
          <i class="fas fa-bars"></i>
        </button>
      </div>
    </header>

    <!-- Sidebar desktop -->
    <Sidebar v-if="!isMobile" class="fixed left-0 top-20 h-[calc(100vh-4rem)] z-10" />
    <!-- Sidebar mobile (drawer à droite) -->
    <MobileSidebar v-if="isMobileSidebarOpen" @close="isMobileSidebarOpen = false" @logout="logout" />
      <!-- Contenu principal -->
    <div :class="['flex-1', !isMobile ? 'ml-64' : 'w-full']">
      <div class="p-6 pb-24 bg-gray-50 min-h-screen">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import Sidebar from '../components/Sidebar.vue'
import MobileSidebar from '../components/MobileSidebar.vue'

export default {
  name: 'Dashboard',
  components: { Sidebar, MobileSidebar },
  setup() {
    const store = useStore()
    const router = useRouter()
    const isMobile = ref(false)
    const isMobileSidebarOpen = ref(false)

    const checkMobile = () => {
      isMobile.value = window.innerWidth < 1024 // lg: breakpoint
    }

    onMounted(() => {
      checkMobile()
      window.addEventListener('resize', checkMobile)
    })
    onBeforeUnmount(() => {
      window.removeEventListener('resize', checkMobile)
    })

    const logout = async () => {
      await store.dispatch('logout')
      router.push('/login')
    }

    return { store, logout, isMobile, isMobileSidebarOpen }
  }
}
</script>