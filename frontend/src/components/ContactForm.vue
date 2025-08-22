<template>
  <div class="bg-white rounded-lg shadow-md p-4 sm:p-6">
    <h2 class="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6">Formulaire de Contact</h2>
    
    <p v-if="formSubmitted" class="bg-green-50 text-green-800 p-3 sm:p-4 rounded-md mb-4 sm:mb-6 text-sm sm:text-base">
      <i class="fas fa-check-circle mr-2"></i>
      Votre message a été envoyé avec succès. Nous vous contacterons dans les plus brefs délais.
    </p>
    
    <form v-else @submit.prevent="submitForm" class="space-y-4 sm:space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <!-- Name -->
        <div class="form-group">
          <label for="name" class="form-label text-sm sm:text-base">Nom <span class="text-red-600">*</span></label>
          <input
            id="name"
            v-model="form.name"
            type="text"
            class="input-field text-sm sm:text-base h-10 sm:h-12"
            :class="{ 'border-red-500': v$.name.$error }"
            @blur="v$.name.$touch()"
          />
          <p v-if="v$.name.$error" class="error-message text-xs sm:text-sm">
            {{ v$.name.$errors[0].$message }}
          </p>
        </div>
        
        <!-- Email -->
        <div class="form-group">
          <label for="email" class="form-label text-sm sm:text-base">Email <span class="text-red-600">*</span></label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            class="input-field text-sm sm:text-base h-10 sm:h-12"
            :class="{ 'border-red-500': v$.email.$error }"
            @blur="v$.email.$touch()"
          />
          <p v-if="v$.email.$error" class="error-message text-xs sm:text-sm">
            {{ v$.email.$errors[0].$message }}
          </p>
        </div>
        
        <!-- Phone -->
        <div class="form-group">
          <label for="phone" class="form-label text-sm sm:text-base">Téléphone</label>
          <input
            id="phone"
            v-model="form.phone"
            type="tel"
            class="input-field text-sm sm:text-base h-10 sm:h-12"
          />
        </div>
        
        <!-- Subject -->
        <div class="form-group">
          <label for="subject" class="form-label text-sm sm:text-base">Sujet <span class="text-red-600">*</span></label>
          <select
            id="subject"
            v-model="form.subject"
            class="input-field text-sm sm:text-base h-10 sm:h-12"
            :class="{ 'border-red-500': v$.subject.$error }"
            @blur="v$.subject.$touch()"
          >
            <option value="" disabled selected>Choisissez un sujet</option>
            <option value="internship">Demande de stage</option>
            <option value="information">Demande d'information</option>
            <option value="problem">Problème technique</option>
            <option value="other">Autre</option>
          </select>
          <p v-if="v$.subject.$error" class="error-message text-xs sm:text-sm">
            {{ v$.subject.$errors[0].$message }}
          </p>
        </div>
        
        <!-- Message -->
        <div class="form-group md:col-span-2">
          <label for="message" class="form-label text-sm sm:text-base">Message <span class="text-red-600">*</span></label>
          <textarea
            id="message"
            v-model="form.message"
            rows="4"
            class="input-field text-sm sm:text-base min-h-[100px] sm:min-h-[120px]"
            :class="{ 'border-red-500': v$.message.$error }"
            @blur="v$.message.$touch()"
          ></textarea>
          <p v-if="v$.message.$error" class="error-message text-xs sm:text-sm">
            {{ v$.message.$errors[0].$message }}
          </p>
        </div>
      </div>
      
      <div class="mt-4 sm:mt-6">
        <button 
          type="submit" 
          class="btn-primary w-full sm:w-auto text-sm sm:text-base py-2.5 sm:py-3"
          :disabled="isSubmitting"
          :class="{ 'opacity-70 cursor-not-allowed': isSubmitting }"
        >
          <span v-if="isSubmitting" class="inline-flex items-center">
            <i class="fas fa-spinner fa-spin mr-2"></i> Envoi en cours...
          </span>
          <span v-else class="inline-flex items-center">
            <i class="fas fa-paper-plane mr-2"></i> Envoyer le message
          </span>
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { reactive, ref } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { required, email, helpers } from '@vuelidate/validators'

export default {
  name: 'ContactForm',
  setup() {
    const form = reactive({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    })
    
    const isSubmitting = ref(false)
    const formSubmitted = ref(false)
    
    const rules = {
      name: { required: helpers.withMessage('Veuillez entrer votre nom', required) },
      email: { 
        required: helpers.withMessage('Veuillez entrer votre email', required),
        email: helpers.withMessage('Veuillez entrer un email valide', email)
      },
      subject: { required: helpers.withMessage('Veuillez sélectionner un sujet', required) },
      message: { required: helpers.withMessage('Veuillez entrer votre message', required) }
    }
    
    const v$ = useVuelidate(rules, form)
    
    const submitForm = async () => {
      const result = await v$.value.$validate()
      
      if (result) {
        isSubmitting.value = true
        
        // Simulate API call
        setTimeout(() => {
          // Reset form
          Object.keys(form).forEach(key => {
            form[key] = ''
          })
          
          v$.value.$reset()
          isSubmitting.value = false
          formSubmitted.value = true
        }, 1500)
      }
    }
    
    return {
      form,
      v$,
      isSubmitting,
      formSubmitted,
      submitForm
    }
  }
}
</script>
