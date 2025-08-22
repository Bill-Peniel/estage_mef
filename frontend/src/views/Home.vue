<template>
  <div class="page-container px-4 sm:px-6">
    <!-- Hero Section -->
    <section class="relative bg-accent rounded-xl overflow-hidden mb-8 sm:mb-12">
      <div class="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-primary to-secondary"></div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 py-8 sm:py-12 px-4 sm:px-6 md:px-12">
        <div class="flex flex-col justify-center space-y-4 sm:space-y-6" data-aos="fade-right" data-aos-duration="1000">
          <h1 class="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 animate-fade-in leading-tight">
            Programme de Stages du Ministère de l'Économie et des Finances
          </h1>
          <p class="text-base sm:text-lg text-gray-600">
            Découvrez les opportunités de stage au sein du Ministère de l'Économie et des Finances du Bénin 
            et développez vos compétences professionnelles dans un environnement d'excellence.
          </p>
          <div class="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <router-link to="/application" class="btn-primary text-center transform transition hover:scale-105 w-full sm:w-auto">
              Faire une demande
            </router-link>
            <a href="#about" class="btn-outline text-center transform transition hover:scale-105 w-full sm:w-auto">
              En savoir plus
            </a>
          </div>
        </div>
        <div class="flex justify-center items-center" data-aos="fade-left" data-aos-duration="1000" data-aos-delay="300">
          <div class="relative h-[300px] sm:h-64 md:h-80 w-full overflow-hidden rounded-lg shadow-lg transform transition hover:scale-102 hover:shadow-xl">
            <div class="absolute inset-0 bg-gradient-to-r from-primary-dark to-secondary-dark opacity-90"></div>
            <div class="relative z-10 h-full flex flex-col justify-center items-center text-white text-center p-6">
              <div class="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-6 animate-pulse">
                <i class="fas fa-graduation-cap text-4xl sm:text-5xl text-white"></i>
              </div>
              <h2 class="text-2xl sm:text-3xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-accent-yellow to-accent-teal">
                Investissez dans votre avenir
              </h2>
              <p class="mb-6 text-base sm:text-lg font-medium">Rejoignez une institution gouvernementale de premier plan</p>
              <div class="grid grid-cols-3 gap-4 sm:gap-6 w-full max-w-xs">
                <div class="text-center transform transition hover:scale-110" data-aos="zoom-in" data-aos-delay="600">
                  <div class="text-2xl sm:text-3xl font-bold text-accent-yellow mb-1">+50</div>
                  <div class="text-sm font-medium">Stages</div>
                </div>
                <div class="text-center transform transition hover:scale-110" data-aos="zoom-in" data-aos-delay="800">
                  <div class="text-2xl sm:text-3xl font-bold text-accent-teal mb-1">8</div>
                  <div class="text-sm font-medium">Départements</div>
                </div>
                <div class="text-center transform transition hover:scale-110" data-aos="zoom-in" data-aos-delay="1000">
                  <div class="text-2xl sm:text-3xl font-bold text-accent-orange mb-1">+500</div>
                  <div class="text-sm font-medium">Stagiaires</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- About Section -->
    <section id="about" class="mb-8 sm:mb-12 px-4 sm:px-6" data-aos="fade-up" data-aos-duration="1000">
      <h2 class="section-title text-primary-dark relative pb-2 mb-6 text-xl sm:text-2xl font-bold">
        À propos du programme de stages
        <span class="absolute bottom-0 left-0 w-16 h-1 bg-accent-orange"></span>
      </h2>
      
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-center">
        <!-- SVG Animation -->
        <div class="order-2 lg:order-1 mt-8 lg:mt-0" data-aos="fade-right" data-aos-delay="300">
          <div class="relative">
            <img src="../assets/internship-illustration.svg" alt="Illustration du ministère" class="w-full max-w-[250px] sm:max-w-xl mx-auto ministry-building-animated">
            <div class="absolute -top-4 sm:-top-6 -right-4 sm:-right-6 w-12 sm:w-16 h-12 sm:h-16 bg-accent-teal rounded-full flex items-center justify-center animate-float shadow-lg z-10">
              <i class="fas fa-briefcase text-xl sm:text-2xl text-white"></i>
            </div>
          </div>
        </div>
        
        <!-- Content -->
        <div class="order-1 lg:order-2" data-aos="fade-left" data-aos-delay="300">
          <div class="bg-white rounded-lg shadow-lg p-6 border-l-4 border-primary-light">
            <p class="text-gray-700 mb-4 text-lg">
              Le programme de stages du Ministère de l'Économie et des Finances du Bénin offre aux étudiants 
              et jeunes diplômés l'opportunité d'acquérir une expérience professionnelle enrichissante 
              au sein d'une institution gouvernementale de premier plan.
            </p>
            <p class="text-gray-700 mb-4 font-medium text-lg">
              Nos stages sont conçus pour vous permettre de:
            </p>
            <ul class="space-y-3 mb-6 text-gray-700">
              <li class="flex items-start transform transition hover:-translate-x-1">
                <div class="h-6 w-6 rounded-full bg-primary-light flex items-center justify-center mr-3 mt-0.5">
                  <i class="fas fa-check text-white text-sm"></i>
                </div>
                <span>Mettre en pratique vos connaissances théoriques dans un environnement professionnel</span>
              </li>
              <li class="flex items-start transform transition hover:-translate-x-1">
                <div class="h-6 w-6 rounded-full bg-primary-light flex items-center justify-center mr-3 mt-0.5">
                  <i class="fas fa-check text-white text-sm"></i>
                </div>
                <span>Développer de nouvelles compétences techniques et transversales</span>
              </li>
              <li class="flex items-start transform transition hover:-translate-x-1">
                <div class="h-6 w-6 rounded-full bg-primary-light flex items-center justify-center mr-3 mt-0.5">
                  <i class="fas fa-check text-white text-sm"></i>
                </div>
                <span>Comprendre le fonctionnement des finances publiques et de l'économie nationale</span>
              </li>
              <li class="flex items-start transform transition hover:-translate-x-1">
                <div class="h-6 w-6 rounded-full bg-primary-light flex items-center justify-center mr-3 mt-0.5">
                  <i class="fas fa-check text-white text-sm"></i>
                </div>
                <span>Travailler sur des projets concrets et impactants pour le développement du Bénin</span>
              </li>
              <li class="flex items-start transform transition hover:-translate-x-1">
                <div class="h-6 w-6 rounded-full bg-primary-light flex items-center justify-center mr-3 mt-0.5">
                  <i class="fas fa-check text-white text-sm"></i>
                </div>
                <span>Créer un réseau professionnel dans le secteur public</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      <!-- Types of Internships and Departments -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mt-8 sm:mt-10">
        <div class="bg-white rounded-lg shadow-lg p-4 sm:p-6 border-t-4 border-primary" data-aos="fade-up" data-aos-delay="200">
          <h3 class="text-lg sm:text-xl font-bold text-primary-dark mb-4 flex items-center">
            <i class="fas fa-graduation-cap text-primary-light mr-3 text-xl sm:text-2xl"></i>
            Types de stages proposés
          </h3>
          <ul class="space-y-3 sm:space-y-4 text-gray-700">
            <li class="flex items-start bg-accent rounded-lg p-3 transform transition hover:scale-102 hover:shadow-md">
              <div class="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary flex items-center justify-center text-white mr-3">
                <i class="fas fa-university text-sm sm:text-base"></i>
              </div>
              <div>
                <span class="font-bold text-primary-dark text-sm sm:text-base">Stage académique</span>
                <p class="text-xs sm:text-sm mt-1">Pour les étudiants dans le cadre de leur cursus universitaire</p>
              </div>
            </li>
            <li class="flex items-start bg-accent rounded-lg p-3 transform transition hover:scale-102 hover:shadow-md">
              <div class="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary-light flex items-center justify-center text-white mr-3">
                <i class="fas fa-briefcase text-sm sm:text-base"></i>
              </div>
              <div>
                <span class="font-bold text-primary-dark text-sm sm:text-base">Stage professionnel</span>
                <p class="text-xs sm:text-sm mt-1">Pour les jeunes diplômés souhaitant acquérir de l'expérience</p>
              </div>
            </li>
            <li class="flex items-start bg-accent rounded-lg p-3 transform transition hover:scale-102 hover:shadow-md">
              <div class="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-secondary flex items-center justify-center text-white mr-3">
                <i class="fas fa-search text-sm sm:text-base"></i>
              </div>
              <div>
                <span class="font-bold text-primary-dark text-sm sm:text-base">Stage de recherche</span>
                <p class="text-xs sm:text-sm mt-1">Pour les étudiants en master ou doctorat</p>
              </div>
            </li>
            <li class="flex items-start bg-accent rounded-lg p-3 transform transition hover:scale-102 hover:shadow-md">
              <div class="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-secondary-light flex items-center justify-center text-white mr-3">
                <i class="fas fa-eye text-sm sm:text-base"></i>
              </div>
              <div>
                <span class="font-bold text-primary-dark text-sm sm:text-base">Stage d'observation</span>
                <p class="text-xs sm:text-sm mt-1">Stages courts de découverte du ministère</p>
              </div>
            </li>
          </ul>
        </div>
        
        <div class="bg-white rounded-lg shadow-lg p-4 sm:p-6 border-t-4 border-secondary" data-aos="fade-up" data-aos-delay="400">
          <h3 class="text-lg sm:text-xl font-bold text-secondary-dark mb-4 flex items-center">
            <i class="fas fa-building text-secondary-light mr-3 text-xl sm:text-2xl"></i>
            Départements d'accueil
          </h3>
          <div v-if="loadingSuggestions" class="text-gray-500 py-4">Chargement...</div>
          <div v-else-if="errorSuggestions" class="text-red-500 py-4">{{ errorSuggestions }}</div>
          <div v-else-if="suggestedDepartments.length > 0" class="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
            <div v-for="dep in suggestedDepartments" :key="dep" class="bg-accent rounded-lg p-2 sm:p-3 transform transition hover:scale-102 hover:shadow-md flex items-center">
              <i class="fas fa-building text-secondary text-lg sm:text-xl mb-2 mr-2"></i>
              <div class="font-medium text-sm sm:text-base">{{ dep }}</div>
            </div>
          </div>
          <div v-else class="text-gray-500 py-4">Aucune suggestion pour votre filière.</div>
          <div class="mt-4 flex justify-center">
            <router-link to="/application" class="btn-secondary inline-flex items-center mt-2 px-3 sm:px-4 py-2 text-sm transform transition hover:scale-105 w-full sm:w-auto text-center">
              <i class="fas fa-arrow-right mr-2"></i> Postuler maintenant
            </router-link>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Process Section -->
    <section class="mb-12" data-aos="fade-up" data-aos-duration="800">
      <h2 class="section-title text-primary-dark relative pb-2 mb-6">
        Processus de candidature
        <span class="absolute bottom-0 left-0 w-16 h-1 bg-accent-teal"></span>
      </h2>
      <div class="bg-white rounded-lg shadow-lg p-6 border-t-4 border-primary">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div class="bg-accent rounded-lg p-6 text-center transform transition-all duration-300 hover:shadow-xl hover:-translate-y-2" data-aos="fade-right" data-aos-delay="200">
            <div class="w-16 h-16 bg-gradient-to-r from-primary to-primary-light text-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
              <i class="fas fa-user-edit text-xl"></i>
            </div>
            <h3 class="font-bold text-lg mb-3 text-primary">1. Inscription</h3>
            <p class="text-gray-700">
              Créez un compte et remplissez vos informations personnelles
            </p>
          </div>
          <div class="bg-accent rounded-lg p-6 text-center transform transition-all duration-300 hover:shadow-xl hover:-translate-y-2" data-aos="fade-right" data-aos-delay="400">
            <div class="w-16 h-16 bg-gradient-to-r from-primary-light to-secondary-light text-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
              <i class="fas fa-file-alt text-xl"></i>
            </div>
            <h3 class="font-bold text-lg mb-3 text-primary-light">2. Demande</h3>
            <p class="text-gray-700">
              Soumettez votre demande avec tous les documents requis
            </p>
          </div>
          <div class="bg-accent rounded-lg p-6 text-center transform transition-all duration-300 hover:shadow-xl hover:-translate-y-2" data-aos="fade-right" data-aos-delay="600">
            <div class="w-16 h-16 bg-gradient-to-r from-secondary-light to-secondary text-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
              <i class="fas fa-clipboard-check text-xl"></i>
            </div>
            <h3 class="font-bold text-lg mb-3 text-secondary-light">3. Examen</h3>
            <p class="text-gray-700">
              Votre dossier est examiné par les services compétents
            </p>
          </div>
          <div class="bg-accent rounded-lg p-6 text-center transform transition-all duration-300 hover:shadow-xl hover:-translate-y-2" data-aos="fade-right" data-aos-delay="800">
            <div class="w-16 h-16 bg-gradient-to-r from-secondary to-secondary-dark text-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
              <i class="fas fa-envelope-open-text text-xl"></i>
            </div>
            <h3 class="font-bold text-lg mb-3 text-secondary">4. Réponse</h3>
            <p class="text-gray-700">
              Vous recevez une réponse par email dans les meilleurs délais
            </p>
          </div>
        </div>
        <div class="mt-10 text-center" data-aos="zoom-in" data-aos-delay="1000">
          <router-link to="/application" class="btn-primary px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transform transition hover:scale-105">
            <span class="hidden sm:inline">Commencer ma demande</span>
            <span class="sm:hidden">Commencer</span>
            <i class="fas fa-arrow-right ml-2"></i>
          </router-link>
        </div>
      </div>
    </section>
    
    <!-- Testimonials Section -->
    <section class="mb-12" data-aos="fade-up" data-aos-duration="800">
      <h2 class="section-title text-secondary-dark relative pb-2 mb-6">
        Témoignages d'anciens stagiaires
        <span class="absolute bottom-0 left-0 w-16 h-1 bg-accent-orange"></span>
      </h2>
      
      <div class="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center mb-8">
        <div class="lg:col-span-2 order-2 lg:order-1">
          <div class="relative mx-auto max-w-[200px] sm:max-w-md" data-aos="fade-right" data-aos-delay="300">
            <img src="../assets/studying-student.svg" alt="Étudiant concentré" class="w-full studying-student-animated">
            <div class="absolute -bottom-3 sm:-bottom-4 -left-3 sm:-left-4 w-10 sm:w-12 h-10 sm:h-12 bg-accent-teal rounded-full flex items-center justify-center animate-pulse shadow-lg">
              <i class="fas fa-lightbulb text-white text-base sm:text-lg"></i>
            </div>
          </div>
        </div>
        
        <div class="lg:col-span-3 order-1 lg:order-2" data-aos="fade-left" data-aos-delay="300">
          <div class="bg-white rounded-lg shadow-lg p-6 border-l-4 border-secondary-light">
            <h3 class="text-xl font-bold text-secondary-dark mb-4">Ce que disent nos stagiaires</h3>
            <p class="text-gray-700 mb-6">
              Découvrez les témoignages d'anciens stagiaires qui ont bénéficié de notre programme pour développer 
              leurs compétences et lancer leur carrière dans l'administration publique. Leurs expériences 
              enrichissantes vous donneront un aperçu de ce qui vous attend au sein du Ministère.
            </p>
          </div>
        </div>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white rounded-lg shadow-lg p-6 border-l-4 border-primary transform transition-all duration-300 hover:shadow-xl hover:-translate-y-2" data-aos="fade-up" data-aos-delay="200">
          <div class="absolute -top-3 -left-3 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center shadow-md">
            <i class="fas fa-quote-left"></i>
          </div>
          <div class="flex items-center mb-4 pt-2">
            <div class="w-14 h-14 rounded-full bg-primary bg-opacity-20 flex items-center justify-center shadow">
              <i class="fas fa-user text-primary text-xl"></i>
            </div>
            <div class="ml-4">
              <h3 class="font-bold text-primary">Kofi Mensah</h3>
              <p class="text-sm text-gray-600">Stage à la Direction Générale du Budget</p>
            </div>
          </div>
          <div class="relative">
            <i class="fas fa-quote-left absolute -left-2 -top-2 text-primary text-opacity-10 text-4xl"></i>
            <p class="text-gray-700 italic relative z-10">
              "Mon stage au sein de la Direction Générale du Budget a été une expérience très enrichissante. 
              J'ai pu mettre en pratique mes connaissances en finances publiques et comprendre les mécanismes 
              d'élaboration du budget national."
            </p>
          </div>
          <div class="flex mt-4">
            <i class="fas fa-star text-accent-yellow"></i>
            <i class="fas fa-star text-accent-yellow"></i>
            <i class="fas fa-star text-accent-yellow"></i>
            <i class="fas fa-star text-accent-yellow"></i>
            <i class="fas fa-star text-accent-yellow"></i>
          </div>
        </div>
        <div class="bg-white rounded-lg shadow-lg p-6 border-l-4 border-secondary transform transition-all duration-300 hover:shadow-xl hover:-translate-y-2" data-aos="fade-up" data-aos-delay="400">
          <div class="absolute -top-3 -left-3 w-8 h-8 bg-secondary text-white rounded-full flex items-center justify-center shadow-md">
            <i class="fas fa-quote-left"></i>
          </div>
          <div class="flex items-center mb-4 pt-2">
            <div class="w-14 h-14 rounded-full bg-secondary bg-opacity-20 flex items-center justify-center shadow">
              <i class="fas fa-user text-secondary text-xl"></i>
            </div>
            <div class="ml-4">
              <h3 class="font-bold text-secondary">Aminata Diallo</h3>
              <p class="text-sm text-gray-600">Stage à la Direction des Systèmes d'Information</p>
            </div>
          </div>
          <div class="relative">
            <i class="fas fa-quote-left absolute -left-2 -top-2 text-secondary text-opacity-10 text-4xl"></i>
            <p class="text-gray-700 italic relative z-10">
              "J'ai eu l'opportunité de participer à la digitalisation des services du ministère. 
              Ce stage m'a permis d'acquérir des compétences techniques et de comprendre les enjeux 
              de la transformation numérique dans l'administration publique."
            </p>
          </div>
          <div class="flex mt-4">
            <i class="fas fa-star text-accent-yellow"></i>
            <i class="fas fa-star text-accent-yellow"></i>
            <i class="fas fa-star text-accent-yellow"></i>
            <i class="fas fa-star text-accent-yellow"></i>
            <i class="fas fa-star-half-alt text-accent-yellow"></i>
          </div>
        </div>
        <div class="bg-white rounded-lg shadow-lg p-6 border-l-4 border-accent-teal transform transition-all duration-300 hover:shadow-xl hover:-translate-y-2" data-aos="fade-up" data-aos-delay="600">
          <div class="absolute -top-3 -left-3 w-8 h-8 bg-accent-teal text-white rounded-full flex items-center justify-center shadow-md">
            <i class="fas fa-quote-left"></i>
          </div>
          <div class="flex items-center mb-4 pt-2">
            <div class="w-14 h-14 rounded-full bg-accent-teal bg-opacity-20 flex items-center justify-center shadow">
              <i class="fas fa-user text-accent-teal text-xl"></i>
            </div>
            <div class="ml-4">
              <h3 class="font-bold text-accent-teal">David Adjovi</h3>
              <p class="text-sm text-gray-600">Stage à la Direction Générale des Impôts</p>
            </div>
          </div>
          <div class="relative">
            <i class="fas fa-quote-left absolute -left-2 -top-2 text-accent-teal text-opacity-10 text-4xl"></i>
            <p class="text-gray-700 italic relative z-10">
              "Ce stage m'a ouvert les portes du monde professionnel. J'ai approfondi mes connaissances 
              en fiscalité et j'ai pu travailler sur des dossiers concrets. Cette expérience a été 
              déterminante pour mon orientation professionnelle."
            </p>
          </div>
          <div class="flex mt-4">
            <i class="fas fa-star text-accent-yellow"></i>
            <i class="fas fa-star text-accent-yellow"></i>
            <i class="fas fa-star text-accent-yellow"></i>
            <i class="fas fa-star text-accent-yellow"></i>
            <i class="fas fa-star text-accent-yellow"></i>
          </div>
        </div>
      </div>
    </section>
    
    <!-- FAQ Section -->
    <section class="mb-12" data-aos="fade-up" data-aos-duration="800">
      <h2 class="section-title text-primary-dark relative pb-2 mb-6">
        Questions fréquentes
        <span class="absolute bottom-0 left-0 w-16 h-1 bg-accent-yellow"></span>
      </h2>
      <div class="bg-white rounded-lg shadow-lg p-6 border-t-4 border-accent-yellow">
        <div class="space-y-4">
          <div class="border-b border-gray-200 pb-4" data-aos="fade-up" data-aos-delay="100">
            <button 
              @click="toggleFaq(1)" 
              class="flex justify-between items-center w-full text-left font-bold text-primary hover:text-primary-light transition-colors duration-300"
            >
              <span class="flex items-center">
                <i class="fas fa-question-circle mr-3 text-accent-yellow text-xl"></i>
                Quelles sont les conditions pour postuler à un stage ?
              </span>
              <i :class="[openFaq === 1 ? 'fa-chevron-up' : 'fa-chevron-down', 'fas transition-transform duration-300']"></i>
            </button>
            <div v-show="openFaq === 1" class="mt-3 text-gray-700 pl-8 pr-4 animate-fade-in">
              <p>
                Pour postuler à un stage au Ministère de l'Économie et des Finances, vous devez :
              </p>
              <ul class="list-disc pl-5 mt-2 space-y-1">
                <li>Être étudiant ou jeune diplômé</li>
                <li>Avoir un niveau minimum de baccalauréat</li>
                <li>Fournir tous les documents demandés</li>
                <li>Pour les stages académiques, être inscrit dans un établissement d'enseignement</li>
              </ul>
            </div>
          </div>
          
          <div class="border-b border-gray-200 pb-4" data-aos="fade-up" data-aos-delay="200">
            <button 
              @click="toggleFaq(2)" 
              class="flex justify-between items-center w-full text-left font-bold text-primary hover:text-primary-light transition-colors duration-300"
            >
              <span class="flex items-center">
                <i class="fas fa-clock mr-3 text-accent-yellow text-xl"></i>
                Quelle est la durée des stages ?
              </span>
              <i :class="[openFaq === 2 ? 'fa-chevron-up' : 'fa-chevron-down', 'fas transition-transform duration-300']"></i>
            </button>
            <div v-show="openFaq === 2" class="mt-3 text-gray-700 pl-8 pr-4 animate-fade-in">
              <p>
                La durée des stages varie selon le type :
              </p>
              <ul class="list-disc pl-5 mt-2 space-y-1">
                <li>Stage académique : 1 à 6 mois</li>
                <li>Stage professionnel : 3 à 12 mois</li>
                <li>Stage de recherche : 3 à 6 mois</li>
                <li>Stage d'observation : 2 semaines à 1 mois</li>
              </ul>
            </div>
          </div>
          
          <div class="border-b border-gray-200 pb-4" data-aos="fade-up" data-aos-delay="300">
            <button 
              @click="toggleFaq(3)" 
              class="flex justify-between items-center w-full text-left font-bold text-primary hover:text-primary-light transition-colors duration-300"
            >
              <span class="flex items-center">
                <i class="fas fa-money-bill-wave mr-3 text-accent-yellow text-xl"></i>
                Les stages sont-ils rémunérés ?
              </span>
              <i :class="[openFaq === 3 ? 'fa-chevron-up' : 'fa-chevron-down', 'fas transition-transform duration-300']"></i>
            </button>
            <div v-show="openFaq === 3" class="mt-3 text-gray-700 pl-8 pr-4 animate-fade-in">
              <p>
                La rémunération dépend du type et de la durée du stage :
              </p>
              <ul class="list-disc pl-5 mt-2 space-y-1">
                <li>Les stages académiques obligatoires de moins de 2 mois ne sont généralement pas rémunérés</li>
                <li>Les stages de plus de 2 mois peuvent bénéficier d'une gratification</li>
                <li>Les stages professionnels de longue durée sont généralement rémunérés</li>
                <li>Les conditions exactes sont précisées dans la convention de stage</li>
              </ul>
            </div>
          </div>
          
          <div class="border-b border-gray-200 pb-4" data-aos="fade-up" data-aos-delay="400">
            <button 
              @click="toggleFaq(4)" 
              class="flex justify-between items-center w-full text-left font-bold text-primary hover:text-primary-light transition-colors duration-300"
            >
              <span class="flex items-center">
                <i class="fas fa-search-location mr-3 text-accent-yellow text-xl"></i>
                Comment puis-je suivre l'état de ma demande ?
              </span>
              <i :class="[openFaq === 4 ? 'fa-chevron-up' : 'fa-chevron-down', 'fas transition-transform duration-300']"></i>
            </button>
            <div v-show="openFaq === 4" class="mt-3 text-gray-700 pl-8 pr-4 animate-fade-in">
              <p>
                Après avoir soumis votre demande, vous recevrez un email de confirmation avec un numéro de référence.
                Vous pourrez suivre l'état de votre demande en vous connectant à votre compte sur la plateforme.
                Vous serez également notifié par email à chaque étape importante du processus.
              </p>
            </div>
          </div>
          
          <div class="border-b border-gray-200 pb-4" data-aos="fade-up" data-aos-delay="500">
            <button 
              @click="toggleFaq(5)" 
              class="flex justify-between items-center w-full text-left font-bold text-primary hover:text-primary-light transition-colors duration-300"
            >
              <span class="flex items-center">
                <i class="fas fa-file-alt mr-3 text-accent-yellow text-xl"></i>
                Quels sont les documents requis pour postuler ?
              </span>
              <i :class="[openFaq === 5 ? 'fa-chevron-up' : 'fa-chevron-down', 'fas transition-transform duration-300']"></i>
            </button>
            <div v-show="openFaq === 5" class="mt-3 text-gray-700 pl-8 pr-4 animate-fade-in">
              <p>
                Les documents à fournir dépendent du type de stage, mais généralement vous devrez préparer :
              </p>
              <ul class="list-disc pl-5 mt-2 space-y-1">
                <li>Un CV à jour</li>
                <li>Une lettre de motivation</li>
                <li>Une pièce d'identité</li>
                <li>Pour les stages académiques : une attestation d'inscription universitaire</li>
                <li>Pour les stages professionnels et de recherche : une lettre de recommandation</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- CTA Section -->
    <section class="mb-12" data-aos="fade-up" data-aos-duration="1000">
      <div class="bg-gradient-to-r from-primary-dark via-primary to-secondary rounded-lg shadow-xl p-8 text-white overflow-hidden">
        <div class="absolute top-0 left-0 w-full h-full bg-white opacity-5 rounded-lg" style="background-image: url('data:image/svg+xml,%3Csvg width=%22100%22 height=%22100%22 viewBox=%220 0 100 100%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cpath d=%22M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z%22 fill=%22%23fff%22 fill-opacity=%221%22 fill-rule=%22evenodd%22/%3E%3C/svg%3E')"></div>
        
        <div class="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center relative z-10">
          <div class="lg:col-span-3 text-center lg:text-left">
            <h2 class="text-3xl font-bold mb-4" data-aos="fade-down" data-aos-delay="200">Prêt à lancer votre carrière ?</h2>
            <p class="text-xl mb-8 max-w-2xl mx-auto lg:mx-0" data-aos="fade-up" data-aos-delay="400">
              Rejoignez le Ministère de l'Économie et des Finances pour une expérience enrichissante et développez vos compétences professionnelles
            </p>
            <div class="flex flex-wrap justify-center lg:justify-start gap-6">
              <router-link to="/application" class="relative group bg-white text-primary hover:bg-gray-100 py-3 px-8 rounded-md font-bold transition duration-300 shadow-md hover:shadow-lg transform hover:scale-105 overflow-hidden" data-aos="fade-up" data-aos-delay="600">
                <span class="relative z-10 flex items-center">
                  <i class="fas fa-file-signature mr-2"></i> Postuler maintenant
                </span>
                <span class="absolute inset-0 h-full w-0 bg-gradient-to-r from-accent-yellow to-accent-teal opacity-20 transition-all duration-300 group-hover:w-full"></span>
                <span class="cta-badge absolute -top-2 -right-2 w-6 h-6 bg-accent-orange rounded-full text-xs flex items-center justify-center text-white">
                  <i class="fas fa-star"></i>
                </span>
              </router-link>
              <router-link to="/contact" class="border-2 border-white text-white hover:bg-white hover:text-primary py-3 px-8 rounded-md font-bold transition duration-300 shadow-md hover:shadow-lg transform hover:scale-105" data-aos="fade-up" data-aos-delay="800">
                <i class="fas fa-envelope mr-2"></i> Nous contacter
              </router-link>
            </div>
          </div>
          
          <div class="lg:col-span-2 hidden lg:block" data-aos="fade-left" data-aos-delay="600">
            <div class="relative">
              <img src="../assets/student-group.svg" alt="Groupe d'étudiants" class="w-full max-w-[280px] sm:max-w-full student-group-animated">
              <div class="absolute -top-3 sm:-top-4 -left-3 sm:-left-4 w-10 sm:w-12 h-10 sm:h-12 bg-accent-orange rounded-full flex items-center justify-center animate-bounce-slow shadow-lg z-10">
                <i class="fas fa-graduation-cap text-white text-base sm:text-lg"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { fetchSuggestedDepartments } from '@/services/api/suggestions.service';

export default {
  name: 'Home',
  setup() {
    const openFaq = ref(null)
    
    const toggleFaq = (index) => {
      if (openFaq.value === index) {
        openFaq.value = null
      } else {
        openFaq.value = index
      }
    }

    const suggestedDepartments = ref([]);
    const loadingSuggestions = ref(true);
    const errorSuggestions = ref('');

    onMounted(async () => {
      loadingSuggestions.value = true;
      try {
        suggestedDepartments.value = await fetchSuggestedDepartments();
      } catch (e) {
        errorSuggestions.value = "Impossible de charger les suggestions. Veuillez vous connectez et enregistrer vos informations afin de pouvoir charger les suggestions.";
      } finally {
        loadingSuggestions.value = false;
      }
    });
    
    return {
      openFaq,
      toggleFaq,
      suggestedDepartments,
      loadingSuggestions,
      errorSuggestions
    }
  }
}
</script>
