<template>
  <div class="page-container py-12 px-4 sm:px-6">
    <div class="max-w-6xl mx-auto">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <!-- Register Form -->
        <div class="order-1" data-aos="fade-right" data-aos-duration="1000">
          <div class="max-w-xl mx-auto">
            <div class="text-center mb-8">
              <h1 class="text-3xl font-bold text-primary-dark relative inline-block">
                Créer un compte
                <span class="absolute bottom-0 left-0 w-full h-1 bg-primary-light transform scale-x-50"></span>
              </h1>
              <p class="text-gray-600 mt-3 max-w-xs mx-auto">
                Inscrivez-vous pour soumettre votre demande de stage
              </p>
            </div>
            
            <div class="bg-white rounded-lg shadow-lg p-8 border-t-4 border-secondary">
              <div v-if="error" class="bg-red-50 border border-red-200 text-red-800 rounded-md p-4 mb-6">
                <div class="flex">
                  <div class="flex-shrink-0">
                    <i class="fas fa-exclamation-circle text-red-600"></i>
                  </div>
                  <div class="ml-3">
                    <p>{{ error }}</p>
                  </div>
                </div>
              </div>
              
              <form @submit.prevent="register">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <!-- First Name -->
                  <div class="form-group">
                    <label for="firstName" class="form-label flex items-center">
                      <i class="fas fa-user text-secondary-light mr-2"></i>
                      Prénom <span class="text-red-600 ml-1">*</span>
                    </label>
                    <input
                      id="firstName"
                      v-model="form.firstName"
                      type="text"
                      class="input-field focus:border-secondary focus:ring focus:ring-secondary-light focus:ring-opacity-30"
                      :class="{ 'border-red-500 bg-red-50': v$.firstName.$error }"
                      @blur="v$.firstName.$touch()"
                      placeholder="Entrez votre prénom"
                    />
                    <p v-if="v$.firstName.$error" class="error-message">
                      <i class="fas fa-exclamation-circle mr-1"></i> {{ v$.firstName.$errors[0].$message }}
                    </p>
                  </div>
                  
                  <!-- Last Name -->
                  <div class="form-group">
                    <label for="lastName" class="form-label flex items-center">
                      <i class="fas fa-user text-secondary-light mr-2"></i>
                      Nom <span class="text-red-600 ml-1">*</span>
                    </label>
                    <input
                      id="lastName"
                      v-model="form.lastName"
                      type="text"
                      class="input-field focus:border-secondary focus:ring focus:ring-secondary-light focus:ring-opacity-30"
                      :class="{ 'border-red-500 bg-red-50': v$.lastName.$error }"
                      @blur="v$.lastName.$touch()"
                      placeholder="Entrez votre nom"
                    />
                    <p v-if="v$.lastName.$error" class="error-message">
                      <i class="fas fa-exclamation-circle mr-1"></i> {{ v$.lastName.$errors[0].$message }}
                    </p>
                  </div>
                  
                  <!-- Email -->
                  <div class="form-group md:col-span-2">
                    <label for="email" class="form-label flex items-center">
                      <i class="fas fa-envelope text-secondary-light mr-2"></i>
                      Email <span class="text-red-600 ml-1">*</span>
                    </label>
                    <input
                      id="email"
                      v-model="form.email"
                      type="email"
                      class="input-field focus:border-secondary focus:ring focus:ring-secondary-light focus:ring-opacity-30"
                      :class="{ 'border-red-500 bg-red-50': v$.email.$error }"
                      @blur="v$.email.$touch()"
                      placeholder="Entrez votre adresse email"
                      autocomplete="email"
                    />
                    <p v-if="v$.email.$error" class="error-message">
                      <i class="fas fa-exclamation-circle mr-1"></i> {{ v$.email.$errors[0].$message }}
                    </p>
                  </div>
                  
                  <!-- Phone -->
                  <div class="form-group md:col-span-2">
                    <label for="phone" class="form-label flex items-center">
                      <i class="fas fa-phone-alt text-secondary-light mr-2"></i>
                      Téléphone <span class="text-red-600 ml-1">*</span>
                    </label>
                    <input
                      id="phone"
                      v-model="form.phone"
                      type="tel"
                      class="input-field focus:border-secondary focus:ring focus:ring-secondary-light focus:ring-opacity-30"
                      :class="{ 'border-red-500 bg-red-50': v$.phone.$error }"
                      @blur="v$.phone.$touch()"
                      placeholder="Entrez votre numéro de téléphone"
                      autocomplete="tel"
                    />
                    <p v-if="v$.phone.$error" class="error-message">
                      <i class="fas fa-exclamation-circle mr-1"></i> {{ v$.phone.$errors[0].$message }}
                    </p>
                  </div>
                  
                  <!-- Password -->
                  <div class="form-group">
                    <label for="password" class="form-label flex items-center">
                      <i class="fas fa-lock text-secondary-light mr-2"></i>
                      Mot de passe <span class="text-red-600 ml-1">*</span>
                    </label>
                    <div class="relative">
                      <input
                        id="password"
                        v-model="form.password"
                        :type="showPassword ? 'text' : 'password'"
                        class="input-field pr-10 focus:border-secondary focus:ring focus:ring-secondary-light focus:ring-opacity-30"
                        :class="{ 'border-red-500 bg-red-50': v$.password.$error }"
                        @blur="v$.password.$touch()"
                        placeholder="Créez un mot de passe"
                        autocomplete="new-password"
                      />
                      <button 
                        type="button" 
                        class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
                        @click="togglePassword('password')"
                      >
                        <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                      </button>
                    </div>
                    <p v-if="v$.password.$error" class="error-message">
                      <i class="fas fa-exclamation-circle mr-1"></i> {{ v$.password.$errors[0].$message }}
                    </p>
                    <p class="text-xs text-gray-500 mt-1">
                      <i class="fas fa-info-circle mr-1"></i> Le mot de passe doit contenir au moins 8 caractères, incluant une lettre majuscule, une lettre minuscule et un chiffre.
                    </p>
                  </div>
                  
                  <!-- Confirm Password -->
                  <div class="form-group">
                    <label for="confirmPassword" class="form-label flex items-center">
                      <i class="fas fa-lock text-secondary-light mr-2"></i>
                      Confirmer mot de passe <span class="text-red-600 ml-1">*</span>
                    </label>
                    <div class="relative">
                      <input
                        id="confirmPassword"
                        v-model="form.confirmPassword"
                        :type="showConfirmPassword ? 'text' : 'password'"
                        class="input-field pr-10 focus:border-secondary focus:ring focus:ring-secondary-light focus:ring-opacity-30"
                        :class="{ 'border-red-500 bg-red-50': v$.confirmPassword.$error }"
                        @blur="v$.confirmPassword.$touch()"
                        placeholder="Confirmez votre mot de passe"
                        autocomplete="new-password"
                      />
                      <button 
                        type="button" 
                        class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
                        @click="togglePassword('confirm')"
                      >
                        <i :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                      </button>
                    </div>
                    <p v-if="v$.confirmPassword.$error" class="error-message">
                      <i class="fas fa-exclamation-circle mr-1"></i> {{ v$.confirmPassword.$errors[0].$message }}
                    </p>
                  </div>
                </div>
                
                <!-- Terms and Conditions -->
                <div class="form-group mt-6">
                  <div class="flex items-start">
                    <div class="flex items-center h-5">
                      <input
                        id="terms"
                        v-model="form.terms"
                        type="checkbox"
                        class="h-4 w-4 text-secondary focus:ring-secondary-light border-gray-300 rounded cursor-pointer"
                        @change="v$.terms.$touch()"
                      />
                    </div>
                    <div class="ml-3 text-sm">
                      <label for="terms" class="font-medium text-gray-700 cursor-pointer">J'accepte les conditions</label>
                      <p class="text-gray-500">
                        En créant un compte, j'accepte les 
                        <a href="#" class="text-secondary hover:text-secondary-dark underline">termes et conditions</a>
                        et la <a href="#" class="text-secondary hover:text-secondary-dark underline">politique de confidentialité</a>.
                      </p>
                    </div>
                  </div>
                  <p v-if="v$.terms.$error" class="error-message ml-7">
                    <i class="fas fa-exclamation-circle mr-1"></i> {{ v$.terms.$errors[0].$message }}
                  </p>
                </div>
                
                <div class="mt-8">
                  <button 
                    type="submit" 
                    class="btn-secondary w-full relative group overflow-hidden"
                    :disabled="isSubmitting"
                    :class="{ 'opacity-70 cursor-not-allowed': isSubmitting }"
                  >
                    <span class="relative z-10">
                      <span v-if="isSubmitting">
                        <i class="fas fa-spinner fa-spin mr-2"></i> Inscription en cours...
                      </span>
                      <span v-else>
                        <i class="fas fa-user-plus mr-2"></i> Créer un compte
                      </span>
                    </span>
                    <span class="absolute inset-0 h-full w-0 bg-white bg-opacity-20 transition-all duration-300 group-hover:w-full"></span>
                  </button>
                </div>
              </form>
              
              <div class="mt-6 text-center">
                <p class="text-gray-600">
                  Vous avez déjà un compte?
                  <router-link to="/login" class="text-secondary hover:text-secondary-dark font-medium">
                    Se connecter
                  </router-link>
                </p>
              </div>
              
              <div class="mt-8">
                <div class="relative">
                  <div class="absolute inset-0 flex items-center">
                    <div class="w-full border-t border-gray-300"></div>
                  </div>
                  <div class="relative flex justify-center text-sm">
                    <span class="px-4 bg-white text-gray-500">Ou s'inscrire avec</span>
                  </div>
                </div>
                
                <div class="mt-6 grid grid-cols-2 gap-4">
                  <button 
                    type="button" 
                    class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary transition-all duration-200"
                    @click="loginWithGoogle"
                  >
                    <i class="fab fa-google text-red-600 mr-2"></i> Google
                  </button>
                  <button 
                    type="button" 
                    class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary transition-all duration-200"
                  >
                    <i class="fab fa-facebook-f text-blue-600 mr-2"></i> Facebook
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- SVG Illustration -->
        <div class="hidden lg:block order-2" data-aos="fade-left" data-aos-duration="1000">
          <div class="relative">
            <img src="../assets/register-illustration.svg" alt="Inscription" class="w-full max-w-xl mx-auto register-illustration-animated">
            <div class="absolute -top-4 -right-4 w-16 h-16 bg-secondary rounded-full flex items-center justify-center animate-float shadow-lg z-10">
              <i class="fas fa-user-plus text-white text-xl"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, ref, watch, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import { useVuelidate } from '@vuelidate/core'
import { required, email, helpers, minLength, sameAs } from '@vuelidate/validators'

export default {
  name: 'Register',
  setup() {
    const store = useStore()
    const router = useRouter()
    const route = useRoute()
    
    const form = reactive({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      terms: false
    })
    
    const isSubmitting = ref(false)
    const error = ref('')
    const showPassword = ref(false)
    const showConfirmPassword = ref(false)
    
    // Custom password validator to check for complexity
    const passwordValidator = (value) => {
      const hasUpperCase = /[A-Z]/.test(value)
      const hasLowerCase = /[a-z]/.test(value)
      const hasNumbers = /\d/.test(value)
      return hasUpperCase && hasLowerCase && hasNumbers
    }

    // Custom password match validator
    const passwordMatchValidator = (value) => {
      console.log('Validating password match:', {
        password: form.password,
        confirmPassword: value,
        areEqual: form.password === value
      })
      return form.password === value
    }
    
    const rules = {
      firstName: { 
        required: helpers.withMessage('Veuillez entrer votre prénom', required)
      },
      lastName: { 
        required: helpers.withMessage('Veuillez entrer votre nom', required)
      },
      email: { 
        required: helpers.withMessage('Veuillez entrer votre adresse email', required),
        email: helpers.withMessage('Veuillez entrer une adresse email valide', email)
      },
      phone: { 
        required: helpers.withMessage('Veuillez entrer votre numéro de téléphone', required)
      },
      password: { 
        required: helpers.withMessage('Veuillez créer un mot de passe', required),
        minLength: helpers.withMessage('Le mot de passe doit contenir au moins 8 caractères', minLength(8)),
        complex: helpers.withMessage('Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre', passwordValidator)
      },
      confirmPassword: { 
        required: helpers.withMessage('Veuillez confirmer votre mot de passe', required),
        sameAsPassword: helpers.withMessage('Les mots de passe ne correspondent pas', passwordMatchValidator)
      },
      terms: { 
        sameAs: helpers.withMessage('Vous devez accepter les termes et conditions', sameAs(true))
      }
    }
    
    const v$ = useVuelidate(rules, form)
    
    // Watch for password changes to trigger validation
    watch(() => form.password, (newVal) => {
      console.log('Password changed:', newVal)
      if (form.confirmPassword) {
        v$.value.confirmPassword.$touch()
      }
    })
    
    // Watch for confirmPassword changes to trigger validation
    watch(() => form.confirmPassword, (newVal) => {
      console.log('Confirm password changed:', newVal)
      if (form.password) {
        v$.value.confirmPassword.$touch()
      }
    })
    
    const togglePassword = (field) => {
      if (field === 'password') {
        showPassword.value = !showPassword.value
      } else {
        showConfirmPassword.value = !showConfirmPassword.value
      }
    }
    
    const register = async () => {
      const result = await v$.value.$validate()
      
      if (result) {
        isSubmitting.value = true
        error.value = ''
        
        try {
          console.log('Attempting to register with data:', {
            firstName: form.firstName,
            lastName: form.lastName,
            email: form.email,
            phone: form.phone,
            password: form.password
          })

          // Création d'un nouveau compte stagiaire
          const user = await store.dispatch('register', {
            firstName: form.firstName,
            lastName: form.lastName,
            email: form.email,
            phone: form.phone,
            password: form.password
          })
          
          console.log('Registration successful, user:', user)
          
          // Afficher un message de succès
          const successMessage = `Félicitations ${user.name} ! Votre compte a été créé avec succès.`
          
          // Rediriger vers la page de connexion
          const redirect = route.query.redirect
          setTimeout(() => {
            router.push({
              path: '/login',
              query: { newUser: 'true', message: successMessage, ...(redirect ? { redirect } : {}) }
            })
          }, 800)
          
        } catch (err) {
          console.error('Registration error:', err)
          error.value = err.response?.data?.message || 'Une erreur est survenue lors de l\'inscription. Veuillez réessayer.'
        } finally {
          isSubmitting.value = false
        }
      }
    }
    
    const loginWithGoogle = () => {
      const redirect = route.query.redirect
      if (redirect) localStorage.setItem('redirectAfterLogin', redirect)
      window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:3002'}/api/auth/google`;
    };

    onMounted(() => {
      const redirect = route.query.redirect
      if (redirect) {
        localStorage.setItem('redirectAfterLogin', redirect)
      }
    })
    
    return {
      form,
      v$,
      isSubmitting,
      error,
      showPassword,
      showConfirmPassword,
      togglePassword,
      register,
      loginWithGoogle
    }
  }
}
</script>

<style scoped>
.btn-secondary {
  @apply bg-secondary text-white py-2 px-6 rounded-md hover:bg-secondary-dark focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-opacity-50 transition duration-200;
}
</style>