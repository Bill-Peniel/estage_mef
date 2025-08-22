<template>
  <div class="page-container px-4 sm:px-6 py-6 sm:py-8">
    <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">Contactez-nous</h1>
    
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
      <!-- Contact Form -->
      <div class="lg:col-span-2">
        <ContactForm />
      </div>
      
      <!-- Contact Information -->
      <div class="lg:col-span-1 space-y-6">
        <div class="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <h2 class="text-lg sm:text-xl font-semibold text-gray-800 mb-4">Informations de contact</h2>
          
          <div class="space-y-4">
            <div class="flex items-start">
              <div class="flex-shrink-0 bg-green-100 rounded-full p-2">
                <i class="fas fa-map-marker-alt text-green-800 text-sm sm:text-base"></i>
              </div>
              <div class="ml-3 sm:ml-4">
                <p class="font-medium text-sm sm:text-base">Adresse</p>
                <p class="text-gray-600 text-sm sm:text-base">
                  Ministère de l'Économie et des Finances<br>
                  Route de l'Aéroport<br>
                  01 BP 302 Cotonou, Bénin
                </p>
              </div>
            </div>
            
            <div class="flex items-start">
              <div class="flex-shrink-0 bg-green-100 rounded-full p-2">
                <i class="fas fa-phone text-green-800 text-sm sm:text-base"></i>
              </div>
              <div class="ml-3 sm:ml-4">
                <p class="font-medium text-sm sm:text-base">Téléphone</p>
                <p class="text-gray-600 text-sm sm:text-base">+229 21 30 10 20</p>
                <p class="text-gray-600 text-sm sm:text-base">+229 21 30 14 24</p>
              </div>
            </div>
            
            <div class="flex items-start">
              <div class="flex-shrink-0 bg-green-100 rounded-full p-2">
                <i class="fas fa-envelope text-green-800 text-sm sm:text-base"></i>
              </div>
              <div class="ml-3 sm:ml-4">
                <p class="font-medium text-sm sm:text-base">Email</p>
                <p class="text-gray-600 text-sm sm:text-base">contact@finances.bj</p>
                <p class="text-gray-600 text-sm sm:text-base">stages@finances.bj</p>
              </div>
            </div>
            
            <div class="flex items-start">
              <div class="flex-shrink-0 bg-green-100 rounded-full p-2">
                <i class="fas fa-clock text-green-800 text-sm sm:text-base"></i>
              </div>
              <div class="ml-3 sm:ml-4">
                <p class="font-medium text-sm sm:text-base">Heures d'ouverture</p>
                <p class="text-gray-600 text-sm sm:text-base">Lundi - Vendredi: 8h00 - 17h00</p>
                <p class="text-gray-600 text-sm sm:text-base">Fermé le week-end et les jours fériés</p>
              </div>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <h2 class="text-lg sm:text-xl font-semibold text-gray-800 mb-4">Nous suivre</h2>
          
          <div class="flex space-x-3 sm:space-x-4">
            <a href="#" class="bg-blue-900 text-white h-8 w-8 sm:h-10 sm:w-10 rounded-full flex items-center justify-center hover:bg-blue-800 transition duration-200">
              <i class="fab fa-facebook-f text-sm sm:text-base"></i>
            </a>
            <a href="#" class="bg-blue-500 text-white h-8 w-8 sm:h-10 sm:w-10 rounded-full flex items-center justify-center hover:bg-blue-400 transition duration-200">
              <i class="fab fa-twitter text-sm sm:text-base"></i>
            </a>
            <a href="#" class="bg-red-600 text-white h-8 w-8 sm:h-10 sm:w-10 rounded-full flex items-center justify-center hover:bg-red-500 transition duration-200">
              <i class="fab fa-youtube text-sm sm:text-base"></i>
            </a>
            <a href="#" class="bg-gradient-to-r from-purple-600 to-pink-500 text-white h-8 w-8 sm:h-10 sm:w-10 rounded-full flex items-center justify-center hover:from-purple-500 hover:to-pink-400 transition duration-200">
              <i class="fab fa-instagram text-sm sm:text-base"></i>
            </a>
          </div>
          
          <div class="mt-6">
            <h3 class="text-base sm:text-lg font-medium text-gray-800 mb-3">Liens utiles</h3>
            <ul class="space-y-2">
              <li>
                <a href="https://www.finances.bj" target="_blank" class="text-green-800 hover:underline flex items-center text-sm sm:text-base">
                  <i class="fas fa-external-link-alt mr-2"></i> Site officiel du Ministère
                </a>
              </li>
              <li>
                <a href="#" class="text-green-800 hover:underline flex items-center text-sm sm:text-base">
                  <i class="fas fa-question-circle mr-2"></i> Foire aux questions
                </a>
              </li>
              <li>
                <a href="#" class="text-green-800 hover:underline flex items-center text-sm sm:text-base">
                  <i class="fas fa-file-alt mr-2"></i> Guide du stagiaire
                </a>
              </li>
              <li>
                <a href="#" class="text-green-800 hover:underline flex items-center text-sm sm:text-base">
                  <i class="fas fa-users mr-2"></i> Témoignages
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Map Section -->
    <div class="mt-8 sm:mt-10">
      <h2 class="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Nous localiser</h2>
      <div class="bg-white rounded-lg shadow-md p-4 sm:p-6">
        <div class="h-64 sm:h-96 bg-gray-200 rounded-md overflow-hidden">
          <!-- Placeholder for a map, in a real application this would be an actual map -->
          <div class="h-full flex items-center justify-center bg-gradient-to-r from-green-50 to-blue-50">
            <div class="text-center px-4">
              <i class="fas fa-map-marked-alt text-4xl sm:text-6xl text-green-800 mb-4"></i>
              <h3 class="text-lg sm:text-xl font-semibold mb-2">Ministère de l'Économie et des Finances</h3>
              <p class="text-gray-600 text-sm sm:text-base">Route de l'Aéroport, Cotonou, Bénin</p>
              <a 
                href="https://maps.google.com/?q=Ministère+de+l'Économie+et+des+Finances+Bénin"
                target="_blank"
                class="inline-block mt-4 bg-green-800 text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-200 text-sm sm:text-base w-full sm:w-auto"
              >
                <i class="fas fa-directions mr-2"></i> Obtenir l'itinéraire
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ContactForm from '../components/ContactForm.vue'

export default {
  name: 'Contact',
  components: {
    ContactForm
  }
}
</script>
