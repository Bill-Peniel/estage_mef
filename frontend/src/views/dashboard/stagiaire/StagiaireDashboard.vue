<template>
  <div class="min-h-screen bg-gray-100">
    <nav class="bg-white shadow-sm fixed top-0 w-full z-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <div class="flex-shrink-0 flex items-center">
              <img class="h-12 w-auto" src="@/assets/finance-logo.png" alt="Logo MEF" />
            </div>
            <!-- Ajout des menus de navigation -->
            <div class="hidden md:flex items-center space-x-4 ml-8">
              <router-link to="/" class="text-gray-600 hover:text-gray-800 px-3 py-2 rounded-md text-md">
                Accueil
              </router-link>
              <router-link to="/application" class="text-gray-600 hover:text-gray-800 px-3 py-2 rounded-md text-md">
                Faire une demande
              </router-link>
              <router-link to="/status" class="text-gray-700 hover:text-green-800 transition duration-150">
                Statut de la demande
              </router-link>
            </div>
          </div>
          <div class="flex items-center">
            <div class="relative notifications-dropdown">
              <button @click="toggleNotifications" class="p-2 text-gray-600 hover:text-gray-800 relative">
                <i class="fas fa-bell"></i>
                <span v-if="hasNotifications" class="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>
              
            <!-- Menu déroulant des notifications -->
              <div v-if="showNotifications" class="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-1 z-[100]">
                <div class="px-4 py-2 border-b border-gray-200">
                  <div class="flex justify-between items-center">
                    <h3 class="font-semibold text-gray-800">Notifications</h3>
                    <router-link to="/dashboard/stagiaire/notifications" class="text-sm text-primary hover:text-primary-dark">
                      Voir tout
                    </router-link>
                  </div>
                </div>

                <div class="max-h-96 overflow-y-auto">
                  <div v-for="(notification, index) in recentNotifications" :key="index" class="px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0">
                    <div class="flex items-start">
                      <div class="flex-shrink-0">
                        <span :class="['w-8 h-8 rounded-full flex items-center justify-center', notification.iconBg, notification.iconColor]">
                          <i :class="notification.icon"></i>
                        </span>
                      </div>
                      <div class="ml-3">
                        <p class="text-sm font-medium text-gray-900">{{ notification.title }}</p>
                        <p class="text-sm text-gray-500">{{ notification.message }}</p>
                        <span class="text-xs text-gray-400">{{ notification.time }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="ml-4">
              <button @click="logout" class="flex items-center text-gray-600 hover:text-gray-800">
                <i class="fas fa-sign-out-alt mr-2"></i>
                <span>Déconnexion</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <div class="flex">
      <!-- Sidebar -->
      <aside class="w-64 bg-white shadow-lg min-h-screen fixed top-16">
        <div class="p-4">
          <div class="flex items-center mb-8">
            <div class="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
              <i class="fas fa-user text-gray-600"></i>
            </div>
            <div class="ml-3">
              <p class="font-medium text-gray-900">{{ userName }}</p>
              <p class="text-sm text-gray-500">Stagiaire</p>
            </div>
          </div>
          <nav class="space-y-2">
            <router-link to="/dashboard/stagiaire" class="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              <i class="fas fa-home mr-3"></i> Tableau de bord
            </router-link>
            <router-link to="/dashboard/stagiaire/suivi" class="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              <i class="fas fa-tasks mr-3"></i> Suivi de stage
            </router-link>
            <router-link to="/dashboard/stagiaire/documents" class="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              <i class="fas fa-file-alt mr-3"></i> Documents
            </router-link>
            <router-link to="/dashboard/stagiaire/messages" class="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              <i class="fas fa-envelope mr-3"></i> Messages
            </router-link>
            <router-link to="/dashboard/stagiaire/notifications" class="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              <i class="fas fa-bell mr-3"></i> Notifications
            </router-link>
            <router-link to="/dashboard/stagiaire/parametres" class="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              <i class="fas fa-cog mr-3"></i> Paramètres
            </router-link>
          </nav>
        </div>
      </aside>

      <!-- Main content -->
      <div class="flex-1 ml-64 w-full">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
  name: 'StagiaireDashboard',
  setup() {
    const store = useStore()
    const router = useRouter()
    const hasNotifications = ref(true)
    const showNotifications = ref(false)
    const recentNotifications = ref([
      { message: 'Votre rapport hebdomadaire est en attente', time: 'Il y a 2 heures' },
      { message: 'Nouveau message de votre tuteur', time: 'Il y a 3 heures' },
      { message: 'Rappel: Réunion demain à 10h', time: 'Il y a 5 heures' }
    ])

    const userName = computed(() => store.state.user?.name || 'Stagiaire')

    const toggleNotifications = () => {
      showNotifications.value = !showNotifications.value
    }

    // Fermer le dropdown quand on clique ailleurs
    const closeNotifications = (e) => {
      if (!e.target.closest('.notifications-dropdown')) {
        showNotifications.value = false
      }
    }

    onMounted(() => {
      document.addEventListener('click', closeNotifications)
    })

    onUnmounted(() => {
      document.removeEventListener('click', closeNotifications)
    })

    const logout = async () => {
      await store.dispatch('logout')
      router.push('/login')
    }

    return {
      userName,
      hasNotifications,
      showNotifications,
      recentNotifications,
      toggleNotifications,
      logout
    }
  }
}
</script>