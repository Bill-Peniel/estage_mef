<template>
  <div class="page-container px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto py-8 md:py-12">
    <div class="text-center mb-6">
      <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary-dark mb-2 relative inline-block">
        Faire une demande de stage
        <span class="absolute bottom-0 left-0 w-full h-1 bg-primary-light transform scale-x-75"></span>
      </h1>
      <p class="text-gray-600 max-w-2xl mx-auto">
        Complétez le formulaire ci-dessous pour soumettre votre candidature au programme de stage du Ministère
      </p>
    </div>
    
    <StepIndicator />
    
    <transition 
      name="fade" 
      mode="out-in"
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 transform scale-95"
      enter-to-class="opacity-100 transform scale-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 transform scale-100"
      leave-to-class="opacity-0 transform scale-95"
    >
      <PersonalInfo v-if="currentStep === 1" />
      <InternshipInfo v-else-if="currentStep === 2" />
      <DocumentUpload v-else-if="currentStep === 3" />
      <Summary v-else-if="currentStep === 4" />
    </transition>
    
    <div class="mt-12 text-center text-sm text-gray-500">
      <p>
        Pour toute assistance, veuillez 
        <router-link to="/contact" class="text-primary-light hover:text-primary font-medium">
          contacter le service des stages
        </router-link>
      </p>
    </div>
  </div>
</template>

<script>
import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import StepIndicator from '../components/application/StepIndicator.vue'
import PersonalInfo from '../components/application/PersonalInfo.vue'
import InternshipInfo from '../components/application/InternshipInfo.vue'
import DocumentUpload from '../components/application/DocumentUpload.vue'
import Summary from '../components/application/Summary.vue'

export default {
  name: 'Application',
  components: {
    StepIndicator,
    PersonalInfo,
    InternshipInfo,
    DocumentUpload,
    Summary
  },
  setup() {
    const store = useStore()
    
    const currentStep = computed(() => store.state.applicationForm.currentStep)
    
    onMounted(() => {
      // Set the current step to 1 when the component is mounted
      // This ensures that the form always starts at the beginning when navigating to this page
      store.commit('setCurrentStep', 1)
      
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' })
    })
    
    return {
      currentStep
    }
  }
}
</script>
