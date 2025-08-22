<template>
  <footer class="bg-gray-100 border-t border-gray-200">
    <div class="flex h-2">
      <div class="bg-green-700 flex-1 h-full"></div>
      <div class="bg-yellow-500 flex-1 h-full"></div>
      <div class="bg-red-600 flex-1 h-full"></div>
    </div>
    <div class="max-w-7xl mx-auto px-4 sm:px-4 lg:px-8 py-8">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Ministry Information -->
        <div>
          <div class="flex items-center mb-4">
            <img src="../assets/finance-logo.png" alt="Logo du Ministère" class="h-10 w-auto" />
            <h3 class="ml-2 text-lg font-semibold text-gray-900">MEF Bénin</h3>
          </div>
          <p class="text-gray-600 text-sm">
            Ministère de l'Économie et des Finances<br>
            République du Bénin<br>
            01 BP 302 Cotonou<br>
            Tél: +229 21 30 10 20
          </p>
        </div>
        
        <!-- Quick Links -->
        <div>
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Liens Rapides</h3>
          <ul class="space-y-2 text-sm">
            <li>
              <router-link to="/" class="text-gray-600 hover:text-green-800 transition duration-150">
                Accueil
              </router-link>
            </li>
            <li>
              <router-link to="/application" class="text-gray-600 hover:text-green-800 transition duration-150">
                Faire une demande
              </router-link>
            </li>
            <li>
              <router-link to="/contact" class="text-gray-600 hover:text-green-800 transition duration-150">
                Contact
              </router-link>
            </li>
            <li>
              <a href="#" class="text-gray-600 hover:text-green-800 transition duration-150">
                À propos du ministère
              </a>
            </li>
            <li>
              <a href="#" class="text-gray-600 hover:text-green-800 transition duration-150">
                FAQ
              </a>
            </li>
          </ul>
        </div>
        
        <!-- Connect with us -->
        <div>
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Suivez-nous</h3>
          <div class="flex space-x-4 mb-4">
            <a href="#" class="text-gray-600 hover:text-blue-600 transition duration-150">
              <i class="fab fa-facebook-f text-xl"></i>
              <span class="sr-only">Facebook</span>
            </a>
            <a href="#" class="text-gray-600 hover:text-blue-400 transition duration-150">
              <i class="fab fa-twitter text-xl"></i>
              <span class="sr-only">Twitter</span>
            </a>
            <a href="#" class="text-gray-600 hover:text-red-600 transition duration-150">
              <i class="fab fa-youtube text-xl"></i>
              <span class="sr-only">YouTube</span>
            </a>
            <a href="#" class="text-gray-600 hover:text-purple-600 transition duration-150">
              <i class="fab fa-instagram text-xl"></i>
              <span class="sr-only">Instagram</span>
            </a>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Newsletter</h3>
          <form @submit.prevent="subscribeNewsletter" class="flex flex-col sm:flex-row w-full max-w-md gap-2 sm:gap-0">
            <div class="flex-grow">
              <input 
                type="email" 
                placeholder="Votre email" 
                v-model="newsletterEmail"
                class="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md sm:rounded-r-none focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                :class="{ 'rounded-r-md': isMobile, 'rounded-r-none': !isMobile }"
              >
            </div>
            <button 
              type="submit"
              class="w-full sm:w-auto bg-green-800 text-white px-4 py-2 text-sm sm:text-base rounded-md sm:rounded-l-none hover:bg-green-700 focus:outline-none flex items-center justify-center transition duration-150"
              :class="{ 'rounded-l-md': isMobile, 'rounded-l-none': !isMobile }"
            >
              <i class="fas fa-paper-plane mr-2 sm:mr-0"></i>
              <span class="sm:hidden">S'abonner</span>
            </button>
          </form>
          <p v-if="subscriptionStatus" class="mt-2 text-xs sm:text-sm" :class="subscriptionStatus.color">
            {{ subscriptionStatus.message }}
          </p>
        </div>
      </div>
      
      <div class="border-t border-gray-200 mt-8 pt-6">
        <div class="flex flex-col md:flex-row justify-between items-center">
          <p class="text-gray-600 text-sm">
            © {{ currentYear }} Ministère de l'Économie et des Finances du Bénin. Tous droits réservés.
          </p>
          <div class="mt-4 md:mt-0">
            <ul class="flex space-x-4 text-sm">
              <li>
                <a href="#" class="text-gray-600 hover:text-green-800 transition duration-150">
                  Politique de confidentialité
                </a>
              </li>
              <li>
                <a href="#" class="text-gray-600 hover:text-green-800 transition duration-150">
                  Conditions d'utilisation
                </a>
              </li>
              <li>
                <a href="#" class="text-gray-600 hover:text-green-800 transition duration-150">
                  Accessibilité
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
import { computed, ref } from 'vue'

export default {
  name: 'Footer',
  setup() {
    const currentYear = computed(() => new Date().getFullYear())
    const newsletterEmail = ref('')
    const subscriptionStatus = ref(null)
    const isMobile = ref(window.innerWidth < 640)

    // Détecter les changements de taille d'écran
    window.addEventListener('resize', () => {
      isMobile.value = window.innerWidth < 640
    })

    const subscribeNewsletter = () => {
      if (!newsletterEmail.value) {
        subscriptionStatus.value = {
          message: 'Veuillez entrer votre adresse email',
          color: 'text-red-600'
        }
        return
      }

      // Simuler l'envoi à l'API
      subscriptionStatus.value = {
        message: 'Inscription en cours...',
        color: 'text-gray-600'
      }

      setTimeout(() => {
        subscriptionStatus.value = {
          message: 'Merci de votre inscription à notre newsletter !',
          color: 'text-green-600'
        }
        newsletterEmail.value = ''

        // Effacer le message après 3 secondes
        setTimeout(() => {
          subscriptionStatus.value = null
        }, 3000)
      }, 1500)
    }
    
    return {
      currentYear,
      newsletterEmail,
      subscriptionStatus,
      isMobile,
      subscribeNewsletter
    }
  }
}
</script>
