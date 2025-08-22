<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Toast Notification -->
    <div v-if="showToast" 
         class="fixed top-4 right-4 z-[9999] transform transition-all duration-300 ease-in-out"
         :class="{'translate-x-0 opacity-100': showToast, 'translate-x-full opacity-0': !showToast}">
      <div class="bg-white rounded-lg shadow-lg p-4 border-l-4 border-yellow-500">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <i class="fas fa-exclamation-circle text-yellow-500 text-xl"></i>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-gray-900">Accès restreint</p>
            <p class="text-sm text-gray-500">Vous devez avoir des stagiaires affectés pour accéder à cette fonctionnalité.</p>
          </div>
          <div class="ml-auto pl-3">
            <button @click="showToast = false" class="text-gray-400 hover:text-gray-500">
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <header class="bg-white border-b fixed top-0 left-0 right-0 z-50">
      <div class="px-4 py-4 flex justify-between items-center">
        <div class="flex items-center gap-4">
          <img src="@/assets/finance-logo.png" alt="Logo" class="h-12 w-auto" />
          
        </div>
        <div class="flex items-center space-x-4">
          <div class="relative">
            <button @click="toggleNotifications" class="p-2 text-gray-600 hover:text-gray-800 inline-block">
              <i class="fas fa-bell"></i>
              <span class="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>

            <!-- Menu déroulant des notifications -->
            <div v-if="showNotifications" class="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-1 z-50">
              <div class="px-4 py-2 border-b border-gray-200">
                <div class="flex justify-between items-center">
                  <h3 class="font-semibold text-gray-800">Notifications</h3>
                  <router-link to="/dashboard/tuteur/notifications" class="text-sm text-primary hover:text-primary-dark">
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
          <button @click="logout" class="flex items-center text-gray-600 hover:text-gray-800">
            <i class="fas fa-sign-out-alt mr-2"></i>
            <span>Déconnexion</span>
          </button>
        </div>
      </div>
    </header>

    <div class="flex pt-20">
      <!-- Sidebar -->
      <aside class="w-64 bg-white shadow-lg fixed left-0 top-20 bottom-0 flex flex-col">
        <div class="p-4 border-b">
          <div class="flex items-center">
            <div class="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
              <template v-if="store.state.user?.avatar">
                <img
                  :src="getAvatarUrl(store.state.user?.avatar)"
                  alt="Profile"
                  class="h-12 w-12 rounded-full object-cover"
                  @error="onAvatarError"
                />
              </template>
              <template v-else>
                <i class="fas fa-user text-gray-400 text-3xl"></i>
              </template>
            </div>
            <div class="ml-3">
              <p class="font-medium">{{ store.state.user?.name }}</p>
              <p class="text-sm text-gray-500">Tuteur de Stage</p>
            </div>
          </div>
        </div>
        <div class="flex-1 overflow-y-auto h-[calc(100vh-8rem)]">
          <nav class="space-y-2 p-4">
            <router-link to="/dashboard/tuteur" class="flex items-center px-4 py-2 text-primary bg-blue-50 rounded-lg">
              <i class="fas fa-home mr-3"></i> Tableau de bord
            </router-link>

            <!-- Section Agents -->
            <h3 class="px-4 py-2 text-sm font-semibold text-slate-500 uppercase">Agents</h3>
            <router-link to="/dashboard/tuteur/sous-structure" class="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              <i class="fas fa-sitemap mr-3"></i> Sous-structure
            </router-link>
            <router-link to="/dashboard/tuteur/affectation" class="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              <i class="fas fa-user-plus mr-3"></i> Affectation
            </router-link>
            <router-link to="/dashboard/tuteur/organigramme" class="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              <i class="fas fa-project-diagram mr-3"></i> Organigramme
            </router-link>

            <!-- Section Tuteurs -->
            <h3 class="px-4 py-2 text-sm font-semibold text-slate-500 uppercase mt-4">Tuteurs</h3>
            <div 
              @click="handleTutorMenuClick('/dashboard/tuteur/stagiaires')"
              :class="[
                'flex items-center px-4 py-2 rounded-lg cursor-pointer',
                hasAssignedInterns ? 'text-gray-600 hover:bg-gray-100' : 'text-gray-400 cursor-not-allowed opacity-50'
              ]"
            >
              <i class="fas fa-users mr-3"></i> Mes Stagiaires
            </div>
            <div 
              @click="handleTutorMenuClick('/dashboard/tuteur/messages')"
              :class="[
                'flex items-center px-4 py-2 rounded-lg cursor-pointer',
                hasAssignedInterns ? 'text-gray-600 hover:bg-gray-100' : 'text-gray-400 cursor-not-allowed opacity-50'
              ]"
            >
              <i class="fas fa-envelope mr-3"></i> Messages
            </div>
            <div 
              @click="handleTutorMenuClick('/dashboard/tuteur/themes')"
              :class="[
                'flex items-center px-4 py-2 rounded-lg cursor-pointer',
                hasAssignedInterns ? 'text-gray-600 hover:bg-gray-100' : 'text-gray-400 cursor-not-allowed opacity-50'
              ]"
            >
              <i class="fas fa-bookmark mr-3"></i> Thèmes
            </div>
            <div 
              @click="handleTutorMenuClick('/dashboard/tuteur/evaluation')"
              :class="[
                'flex items-center px-4 py-2 rounded-lg cursor-pointer',
                hasAssignedInterns ? 'text-gray-600 hover:bg-gray-100' : 'text-gray-400 cursor-not-allowed opacity-50'
              ]"
            >
              <i class="fas fa-star mr-3"></i> Évaluation
            </div>

            <!-- Section Configurations -->
            <h3 class="px-4 py-2 text-sm font-semibold text-slate-500 uppercase mt-4">Configurations</h3>
            <router-link to="/dashboard/tuteur/notifications" class="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              <i class="fas fa-bell mr-3"></i> Notifications
            </router-link>
            <router-link to="/dashboard/tuteur/parametres" class="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              <i class="fas fa-cog mr-3"></i> Paramètres
            </router-link>
          </nav>
        </div>
      </aside>

      <!-- Main Content -->
      <div class="flex-1 ml-64">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed, watch } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const defaultAvatar = 'https://ui-avatars.com/api/?name=Utilisateur&background=7e3af2&color=fff&size=128'

export default {
  name: 'TuteurDashboard',
  setup() {
    const store = useStore()
    const router = useRouter()
    const showNotifications = ref(false)
    const hasAssignedInterns = ref(false)
    const showToast = ref(false)
    
    const recentNotifications = ref([
      {
        title: 'Nouveau stagiaire assigné',
        message: 'Un nouveau stagiaire a été assigné à votre supervision',
        time: 'Il y a 2 heures',
        icon: 'fas fa-user-graduate',
        iconBg: 'bg-blue-100',
        iconColor: 'text-blue-500'
      },
      {
        title: 'Thème approuvé',
        message: 'Votre thème proposé a été approuvé par la structure',
        time: 'Il y a 1 jour',
        icon: 'fas fa-check-circle',
        iconBg: 'bg-green-100',
        iconColor: 'text-green-500'
      },
      {
        title: "Rappel d'évaluation",
        message: "N'oubliez pas d'évaluer vos stagiaires avant la fin de la semaine",
        time: 'Il y a 2 jours',
        icon: 'fas fa-bell',
        iconBg: 'bg-yellow-100',
        iconColor: 'text-yellow-500'
      }
    ])

    const toggleNotifications = () => {
      showNotifications.value = !showNotifications.value
    }

    // Fermer le menu au clic en dehors
    onMounted(() => {
      document.addEventListener('click', (e) => {
        const target = e.target
        if (!target.closest('.relative')) {
          showNotifications.value = false
        }
      })
    })

    const patients = ref([
      {
        id: 1,
        nom: 'Michel Wilson',
        avatar: 'https://ui-avatars.com/api/?name=Michel+Wilson',
        date: '5 novembre 2024',
        type: 'Généraliste',
        statut: 'Nouveau patient',
        montant: '150 DH'
      },
      {
        id: 2,
        nom: 'Charlotte Reed',
        avatar: 'https://ui-avatars.com/api/?name=Charlotte+Reed',
        date: '3 novembre 2024',
        type: 'Généraliste',
        statut: 'Vieux patient',
        montant: '200 DH'
      },
      {
        id: 3,
        nom: 'Steve Moore',
        avatar: 'https://ui-avatars.com/api/?name=Steve+Moore',
        date: '2 novembre 2024',
        type: 'Urgence',
        statut: 'En attente',
        montant: '250 DH'
      }
    ])

    const getStatusClass = (statut) => {
      const classes = {
        'Nouveau patient': 'bg-green-100 text-green-800',
        'Vieux patient': 'bg-blue-100 text-blue-800',
        'En attente': 'bg-yellow-100 text-yellow-800'
      }
      return classes[statut] || 'bg-gray-100 text-gray-800'
    }

    const logout = async () => {
      await store.dispatch('logout')
      router.push('/login')
    }

    // Simuler la vérification des stagiaires affectés
    onMounted(async () => {
      await fetchAssignedInterns()
    })

    const fetchAssignedInterns = async () => {
      try {
        const response = await store.dispatch('tutor/getAssignedInterns')
        console.log('Stagiaires affectés:', response)
        hasAssignedInterns.value = Array.isArray(response) && response.length > 0
      } catch (error) {
        console.error('Erreur lors de la récupération des stagiaires affectés:', error)
        hasAssignedInterns.value = false
      }
    }

    // Ajouter un watcher pour surveiller les changements dans le store
    watch(
      () => store.state.tutor.assignedInterns,
      async (newValue) => {
        await fetchAssignedInterns()
      },
      { deep: true }
    )

    const handleTutorMenuClick = (route) => {
      if (!hasAssignedInterns.value) {
        showToast.value = true
        setTimeout(() => {
          showToast.value = false
        }, 5000)
        return
      }
      router.push(route)
    }

    // Fonction utilitaire pour obtenir l'URL complète de l'avatar
    const getAvatarUrl = (avatar) => {
      if (!avatar) return defaultAvatar
      if (avatar.startsWith('http://') || avatar.startsWith('https://')) return avatar
      return `http://localhost:3002/uploads/${avatar}`
    }
    // Gestion du fallback si l'image ne charge pas
    const onAvatarError = (e) => {
      e.target.src = defaultAvatar
    }

    return {
      store,
      patients,
      getStatusClass,
      logout,
      showNotifications,
      recentNotifications,
      toggleNotifications,
      hasAssignedInterns,
      handleTutorMenuClick,
      showToast,
      fetchAssignedInterns,
      getAvatarUrl,
      onAvatarError
    }
  }
}
</script>

<style scoped>
/* Animation for the toast */
@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideOut {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
}

.toast-enter-active {
  animation: slideIn 0.3s ease-out;
}

.toast-leave-active {
  animation: slideOut 0.3s ease-in;
}
</style>
