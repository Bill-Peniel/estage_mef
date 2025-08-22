<template>
  <header class="bg-white shadow-md">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center py-3">
        <!-- Logo and title -->
        <div class="flex items-center">
          <router-link to="/" class="flex items-center">
            <img src="../assets/finance-logo.png" alt="Logo du Ministère" class="h-12 w-auto" />
          </router-link>
        </div>
        
        <!-- Desktop navigation -->
        <nav class="hidden md:flex items-center space-x-6">
          <router-link 
            to="/" 
            class="nav-link text-gray-700 hover:text-green-800 transition duration-150"
          >
            Accueil
          </router-link>
          <template v-if="isAuthenticated && isStagiaire">
            <router-link 
              to="/application" 
              class="nav-link text-gray-700 hover:text-green-800 transition duration-150"
            >
              Faire une demande
            </router-link>
            <router-link 
              to="/status" 
              class="nav-link text-gray-700 hover:text-green-800 transition duration-150"
            >
              Statut de la demande
            </router-link>
            <router-link 
              to="/dashboard/stagiaire" 
              class="nav-link text-gray-700 hover:text-green-800 transition duration-150"
            >
              Dashboard
            </router-link>
          </template>
          <template v-else-if="isAuthenticated && isDpaf">
            <router-link 
              to="/dashboard/dpaf" 
              class="nav-link text-gray-700 hover:text-green-800 transition duration-150"
            >
              Dashboard DPAF
            </router-link>
          </template>
          <template v-else-if="isAuthenticated && isAdmin">
            <router-link 
              to="/dashboard/" 
              class="nav-link text-gray-700 hover:text-green-800 transition duration-150"
            >
              Dashboard Admin
            </router-link>
          </template>
          <template v-else-if="isAuthenticated && isTuteur">
            <router-link 
              to="/dashboard/tuteur" 
              class="nav-link text-gray-700 hover:text-green-800 transition duration-150"
            >
              Dashboard Tuteur
            </router-link>
          </template>
          <template v-else-if="isAuthenticated && isStructure">
            <router-link 
              to="/dashboard/structure" 
              class="nav-link text-gray-700 hover:text-green-800 transition duration-150"
            >
              Dashboard Responsable Structure
            </router-link>
          </template>
          <template v-else-if="!isAuthenticated">
            <router-link 
              to="/application" 
              class="nav-link text-gray-700 hover:text-green-800 transition duration-150"
            >
              Faire une demande
            </router-link>
          </template>
          <router-link 
            to="/contact" 
            class="nav-link text-gray-700 hover:text-green-800 transition duration-150"
          >
            Contact
          </router-link>
          <template v-if="!isAuthenticated">
            <router-link to="/login" class="btn-outline py-1.5 px-4">
              Se connecter
            </router-link>
            <router-link to="/register" class="btn-primary py-1.5 px-4">
              S'inscrire
            </router-link>
          </template>
          <div v-else class="flex items-center space-x-4">
            <div class="relative" ref="profileMenu">
              <button 
                @click="toggleProfileMenu" 
                class="flex items-center text-gray-700 hover:text-green-800 focus:outline-none"
              >
                <span class="mr-1">{{ currentUser.name }}</span>
                <i class="fas fa-chevron-down text-xs"></i>
              </button>
              <div 
                v-show="showProfileMenu" 
                class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10"
              >
                <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Mon profil
                </a>
                <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Mes demandes
                </a>
                <button 
                  @click="logout" 
                  class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Se déconnecter
                </button>
              </div>
            </div>
          </div>
        </nav>
        
        <!-- Mobile menu button -->
        <button @click="toggleMobileMenu" class="md:hidden flex items-center p-2 rounded-md text-gray-600 hover:text-green-800 hover:bg-gray-100 focus:outline-none">
          <span class="sr-only">Open main menu</span>
          <i :class="[mobileMenuOpen ? 'fa-times' : 'fa-bars', 'fas text-xl']"></i>
        </button>
      </div>
      
      <!-- Mobile menu -->
      <div class="md:hidden" v-show="mobileMenuOpen">
        <div class="pt-2 pb-4 space-y-1">
          <router-link to="/" class="block py-2 px-3 text-base font-medium rounded-md hover:bg-gray-50 hover:text-green-800">
            Accueil
          </router-link>
          
          <!-- ADMIN -->
          <template v-if="isAuthenticated && isAdmin">
            <router-link to="/dashboard" class="block py-2 px-3 text-base font-medium rounded-md hover:bg-gray-50 hover:text-green-800">
              Dashboard Admin
            </router-link>
          </template>

          <!-- STRUCTURE -->
          <template v-else-if="isAuthenticated && isStructure">
            <router-link to="/dashboard/structure" class="block py-2 px-3 text-base font-medium rounded-md hover:bg-gray-50 hover:text-green-800">
              Dashboard Structure
            </router-link>
            
          </template>

          <!-- TUTEUR -->
          <template v-else-if="isAuthenticated && isTuteur">
            <router-link to="/dashboard/tuteur" class="block py-2 px-3 text-base font-medium rounded-md hover:bg-gray-50 hover:text-green-800">
              Dashboard Tuteur
            </router-link>
            
          </template>

          <!-- STAGIAIRE -->
          <template v-else-if="isAuthenticated && isStagiaire">
            <router-link to="/dashboard/stagiaire" class="block py-2 px-3 text-base font-medium rounded-md hover:bg-gray-50 hover:text-green-800">
              Dashboard
            </router-link>
            <router-link to="/application" class="block py-2 px-3 text-base font-medium rounded-md hover:bg-gray-50 hover:text-green-800">
              Faire une demande
            </router-link>
          </template>

          <!-- DPAF -->
          <template v-else-if="isAuthenticated && isDpaf">
            <router-link to="/dashboard/dpaf" class="block py-2 px-3 text-base font-medium rounded-md hover:bg-gray-50 hover:text-green-800">
              Dashboard DPAF
            </router-link>
            
          </template>

          <!-- NON CONNECTÉ -->
          <template v-else-if="!isAuthenticated">
            <router-link to="/application" class="block py-2 px-3 text-base font-medium rounded-md hover:bg-gray-50 hover:text-green-800">
              Faire une demande
            </router-link>
          </template>

          <!-- LIENS COMMUNS -->
          <router-link to="/contact" class="block py-2 px-3 text-base font-medium rounded-md hover:bg-gray-50 hover:text-green-800">
            Contact
          </router-link>

          <!-- AUTHENTIFICATION -->
          <template v-if="!isAuthenticated">
            <router-link to="/login" class="block py-2 px-3 text-base font-medium rounded-md hover:bg-gray-50 hover:text-green-800">
              Se connecter
            </router-link>
            <router-link to="/register" class="block py-2 px-3 text-base font-medium rounded-md hover:bg-gray-50 hover:text-green-800">
              S'inscrire
            </router-link>
          </template>

          <!-- PROFIL ET DÉCONNEXION (utilisateurs connectés) -->
          <div v-else class="border-t border-gray-200 pt-2">
            <div class="px-3 py-1 text-sm font-medium text-gray-500">
              {{ currentUser.name }}
            </div>
            <router-link :to="currentRole === 'admin' ? '/dashboard/parametres' : `/dashboard/${currentRole}/parametres`" class="block py-2 px-3 text-base font-medium rounded-md hover:bg-gray-50 hover:text-green-800">
              Paramètres
            </router-link>
            <button 
              @click="logout" 
              class="block w-full text-left py-2 px-3 text-base font-medium rounded-md hover:bg-gray-50 hover:text-green-800"
            >
              Se déconnecter
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
  name: 'Header',
  setup() {
    const store = useStore()
    const router = useRouter()
    const mobileMenuOpen = ref(false)
    const showProfileMenu = ref(false)
    const profileMenu = ref(null)
    
    const isAuthenticated = computed(() => store.getters.isAuthenticated)
    const currentUser = computed(() => store.getters.currentUser)
    const isStructure = computed(() => store.getters.isStructure)
    const isStagiaire = computed(() => store.getters.isStagiaire)
    const isDpaf = computed(() => store.getters.isDpaf)
    const isAdmin = computed(() => store.getters.isAdmin)
    const isTuteur = computed(() => store.getters.isTuteur)
    
    // Déterminer le rôle actuel pour le lien profil
    const currentRole = computed(() => {
      if (isAdmin.value) return 'admin'
      if (isStructure.value) return 'structure'
      if (isTuteur.value) return 'tuteur'
      if (isStagiaire.value) return 'stagiaire'
      if (isDpaf.value) return 'dpaf'
      return null
    })
    
    const toggleMobileMenu = () => {
      mobileMenuOpen.value = !mobileMenuOpen.value
    }
    
    const toggleProfileMenu = () => {
      showProfileMenu.value = !showProfileMenu.value
    }
    
    const logout = async () => {
      await store.dispatch('logout')
      showProfileMenu.value = false
      router.push('/login')
    }
    
    const closeProfileMenu = (e) => {
      if (profileMenu.value && !profileMenu.value.contains(e.target)) {
        showProfileMenu.value = false
      }
    }
    
    onMounted(() => {
      document.addEventListener('click', closeProfileMenu)
    })
    
    onBeforeUnmount(() => {
      document.removeEventListener('click', closeProfileMenu)
    })
    
    return {
      mobileMenuOpen,
      toggleMobileMenu,
      showProfileMenu,
      toggleProfileMenu,
      profileMenu,
      isAuthenticated,
      currentUser,
      logout,
      isStructure,
      isStagiaire,
      isDpaf,
      isAdmin,
      isTuteur,
      currentRole
    }
  }
}
</script>

<style scoped>
/* Animation de la barre glissante sous les liens de navigation */
.nav-link {
  position: relative;
  display: inline-block;
  padding: 0.5rem 0;
  overflow: hidden;
}

.nav-link::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, #166534, #22c55e);
  transition: width 0.3s ease-in-out;
}

.nav-link:hover::before {
  width: 100%;
}

/* Animation pour le lien actif (optionnel) */
.nav-link.router-link-active::before {
  width: 100%;
  background: linear-gradient(90deg, #166534, #22c55e);
}

/* Variante avec animation depuis le centre (optionnel) */
.nav-link-center {
  position: relative;
  display: inline-block;
  padding: 0.5rem 0;
  overflow: hidden;
}

.nav-link-center::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, #166534, #22c55e);
  transition: all 0.3s ease-in-out;
  transform: translateX(-50%);
}

.nav-link-center:hover::before {
  width: 100%;
}

/* Animation avec effet de rebond (optionnel) */
.nav-link-bounce {
  position: relative;
  display: inline-block;
  padding: 0.5rem 0;
  overflow: hidden;
}

.nav-link-bounce::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, #166534, #22c55e);
  transition: width 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.nav-link-bounce:hover::before {
  width: 100%;
}
</style>