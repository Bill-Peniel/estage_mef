<template>
  <div class="mb-8">
    <!-- Step indicators for desktop -->
    <div class="hidden md:flex justify-between relative">
      <div v-for="(step, index) in steps" :key="index" class="relative flex flex-col items-center w-1/4">
        <div 
          class="w-12 h-12 flex items-center justify-center rounded-full border-2 z-10 transition-all duration-300 shadow-md"
          :class="getStepClasses(index + 1)"
        >
          <span v-if="currentStep > index + 1"><i class="fas fa-check"></i></span>
          <span v-else>{{ index + 1 }}</span>
        </div>
        <p 
          class="mt-3 font-medium text-center max-w-[120px] transition-colors duration-300"
          :class="currentStep >= index + 1 ? 'text-primary-dark' : 'text-gray-500'"
        >
          {{ step }}
        </p>
      </div>
      
      <!-- Progress line -->
      <div class="absolute top-6 left-0 h-1 w-full bg-gray-200 -z-10"></div>
      <div 
        class="absolute top-6 left-0 h-1 bg-primary transition-all duration-500 -z-10"
        :style="{ width: `${progressPercentage}%` }"
      ></div>
    </div>
    
    <!-- Step indicators for mobile -->
    <div class="md:hidden mb-6">
      <div class="flex items-center justify-between px-4 mb-3">
        <span class="text-sm text-gray-500">Étape {{ currentStep }} / {{ steps.length }}</span>
        <span class="text-sm font-medium text-primary-dark">{{ steps[currentStep - 1] }}</span>
      </div>
      
      <!-- Progress bar -->
      <div class="relative h-2 w-full bg-gray-200 rounded-full overflow-hidden">
        <div 
          class="absolute top-0 left-0 h-full bg-primary rounded-full transition-all duration-500"
          :style="{ width: `${progressPercentage}%` }"
        ></div>
      </div>
      
      <!-- Steps dots for mobile -->
      <div class="flex justify-between mt-3 px-1">
        <div 
          v-for="(step, index) in steps" 
          :key="index" 
          class="w-6 h-6 rounded-full flex items-center justify-center text-xs transition-all duration-300"
          :class="getStepClasses(index + 1)"
          @click="goToStep(index + 1)"
        >
          <span v-if="currentStep > index + 1"><i class="fas fa-check text-xs"></i></span>
          <span v-else>{{ index + 1 }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'StepIndicator',
  props: {
    steps: {
      type: Array,
      default: () => ['Informations personnelles', 'Informations sur le stage', 'Documents', 'Résumé']
    }
  },
  setup(props) {
    const store = useStore()
    
    const currentStep = computed(() => store.state.applicationForm.currentStep)
    
    const progressPercentage = computed(() => {
      return ((currentStep.value - 1) / (props.steps.length - 1)) * 100
    })
    
    const getStepClasses = (step) => {
      if (step < currentStep.value) {
        return 'border-primary bg-primary text-white'
      } else if (step === currentStep.value) {
        return 'border-primary text-primary'
      } else {
        return 'border-gray-300 text-gray-500'
      }
    }
    
    // Function to navigate to a specific step
    // Only allowing to go to completed steps or the current step
    const goToStep = (step) => {
      if (step <= currentStep.value) {
        store.commit('setCurrentStep', step)
      }
    }
    
    return {
      currentStep,
      progressPercentage,
      getStepClasses,
      goToStep
    }
  }
}
</script>
