<template>
  <div class="page-container py-12 px-4 sm:px-6">
    <div class="max-w-6xl mx-auto">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <!-- SVG Illustration -->
        <div class="hidden lg:block order-2 lg:order-1">
          <div class="relative" data-aos="fade-right" data-aos-duration="1000">
            <img src="../assets/login-illustration.svg" alt="Connexion" class="w-full max-w-xl mx-auto login-illustration-animated">
            <div class="absolute -top-4 -left-4 w-16 h-16 bg-primary rounded-full flex items-center justify-center animate-bounce-slow shadow-lg z-10">
              <i class="fas fa-user-lock text-white text-xl"></i>
            </div>
          </div>
        </div>
        
        <!-- Login Form -->
        <div class="order-1 lg:order-2" data-aos="fade-left" data-aos-duration="1000">
          <div class="max-w-md mx-auto">
            <div class="text-center mb-8">
              <h1 class="text-3xl font-bold text-primary-dark relative inline-block">
                Connexion
                <span class="absolute bottom-0 left-0 w-full h-1 bg-primary-light transform scale-x-50"></span>
              </h1>
              <p class="text-gray-600 mt-3 max-w-xs mx-auto">
                Accédez à votre compte pour gérer vos demandes de stage
              </p>
            </div>
            
            <div class="bg-white rounded-lg shadow-lg p-8 border-t-4 border-primary">
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
              
              <form @submit.prevent="login">
                <!-- Email -->
                <div class="form-group">
                  <label for="email" class="form-label flex items-center">
                    <i class="fas fa-envelope text-primary-light mr-2"></i>
                    Email <span class="text-red-600 ml-1">*</span>
                  </label>
                  <input
                    id="email"
                    v-model="form.email"
                    type="email"
                    class="input-field focus:border-primary focus:ring focus:ring-primary-light focus:ring-opacity-30"
                    :class="{ 'border-red-500 bg-red-50': v$.email.$error }"
                    @blur="v$.email.$touch()"
                    placeholder="Entrez votre adresse email"
                    autocomplete="email"
                  />
                  <p v-if="v$.email.$error" class="error-message">
                    <i class="fas fa-exclamation-circle mr-1"></i> {{ v$.email.$errors[0].$message }}
                  </p>
                </div>
                
                <!-- Password -->
                <div class="form-group">
                  <div class="flex justify-between">
                    <label for="password" class="form-label flex items-center">
                      <i class="fas fa-lock text-primary-light mr-2"></i>
                      Mot de passe <span class="text-red-600 ml-1">*</span>
                    </label>
                    <a href="#" class="text-sm text-primary hover:text-primary-light">Mot de passe oublié?</a>
                  </div>
                  <div class="relative">
                    <input
                      id="password"
                      v-model="form.password"
                      :type="showPassword ? 'text' : 'password'"
                      class="input-field pr-10 focus:border-primary focus:ring focus:ring-primary-light focus:ring-opacity-30"
                      :class="{ 'border-red-500 bg-red-50': v$.password.$error }"
                      @blur="v$.password.$touch()"
                      placeholder="Entrez votre mot de passe"
                      autocomplete="current-password"
                    />
                    <button 
                      type="button" 
                      class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
                      @click="togglePassword"
                    >
                      <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                    </button>
                  </div>
                  <p v-if="v$.password.$error" class="error-message">
                    <i class="fas fa-exclamation-circle mr-1"></i> {{ v$.password.$errors[0].$message }}
                  </p>
                </div>
                
                <!-- Remember me -->
                <div class="flex items-center mb-6">
                  <input
                    id="remember"
                    v-model="form.remember"
                    type="checkbox"
                    class="h-4 w-4 text-primary focus:ring-primary-light border-gray-300 rounded cursor-pointer"
                  />
                  <label for="remember" class="ml-2 block text-sm text-gray-700 cursor-pointer">
                    Se souvenir de moi
                  </label>
                </div>
                
                <button 
                  type="submit" 
                  class="btn-primary w-full relative group overflow-hidden"
                  :disabled="isSubmitting"
                  :class="{ 'opacity-70 cursor-not-allowed': isSubmitting }"
                >
                  <span class="relative z-10">
                    <span v-if="isSubmitting">
                      <i class="fas fa-spinner fa-spin mr-2"></i> Connexion en cours...
                    </span>
                    <span v-else>
                      <i class="fas fa-sign-in-alt mr-2"></i> Se connecter
                    </span>
                  </span>
                  <span class="absolute inset-0 h-full w-0 bg-white bg-opacity-20 transition-all duration-300 group-hover:w-full"></span>
                </button>
              </form>
              
              <div class="mt-6 text-center">
                <p class="text-gray-600">
                  Vous n'avez pas de compte?
                  <router-link to="/register" class="text-primary hover:text-primary-light font-medium">
                    S'inscrire
                  </router-link>
                </p>
              </div>
              
              <div class="mt-8">
                <div class="relative">
                  <div class="absolute inset-0 flex items-center">
                    <div class="w-full border-t border-gray-300"></div>
                  </div>
                  <div class="relative flex justify-center text-sm">
                    <span class="px-4 bg-white text-gray-500">Ou continuer avec</span>
                  </div>
                </div>
                
                <div class="mt-6 grid grid-cols-2 gap-4">
                  <button 
                    type="button" 
                    class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200"
                    @click="loginWithGoogle"
                  >
                    <i class="fab fa-google text-red-600 mr-2"></i> Google
                  </button>
                  <button 
                    type="button" 
                    class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200"
                    @click="loginWithFacebook"
                  >
                    <i class="fab fa-facebook-f text-blue-600 mr-2"></i> Facebook
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <RoleSelector
      :roles="userRoles"
      :visible="showRoleSelector"
      @select="handleRoleSelect"
    />
  </div>
</template>

<script>
import { reactive, ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useVuelidate } from '@vuelidate/core'
import { required, email, helpers, minLength } from '@vuelidate/validators'
import { authService } from '../services/api'
import { useStore } from 'vuex'
import RoleSelector from '../components/RoleSelector.vue'
import { jwtDecode } from 'jwt-decode'

export default {
  name: 'Login',
  components: { RoleSelector },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const store = useStore()
    
    const form = reactive({
      email: '',
      password: '',
      remember: false
    })
    
    const isSubmitting = ref(false)
    const error = ref('')
    const showPassword = ref(false)
    const showRoleSelector = ref(false)
    const userRoles = ref([])
    
    const rules = {
      email: { 
        required: helpers.withMessage('Veuillez entrer votre adresse email', required),
        email: helpers.withMessage('Veuillez entrer une adresse email valide', email)
      },
      password: { 
        required: helpers.withMessage('Veuillez entrer votre mot de passe', required),
        minLength: helpers.withMessage('Le mot de passe doit contenir au moins 6 caractères', minLength(6))
      }
    }
    
    const v$ = useVuelidate(rules, form)
    
    const togglePassword = () => {
      showPassword.value = !showPassword.value
    }
    
    const handleRoleSelect = (role) => {
      showRoleSelector.value = false
      store.commit('setUserRole', role)
      const redirect = route.query.redirect
      if (redirect) {
        router.push(redirect)
      } else {
        router.push('/dashboard/' + role)
      }
    }
    
    const login = async () => {
      const result = await v$.value.$validate()
      
      if (result) {
        isSubmitting.value = true
        error.value = ''
        
        try {
          const user = await store.dispatch('login', {
            email: form.email,
            password: form.password
          })
          
          const redirect = route.query.redirect
          if (redirect) {
            router.push(redirect)
            return
          }

          if (user.roles && user.roles.length > 1) {
            userRoles.value = user.roles
            showRoleSelector.value = true
          } else if (user.roles && user.roles.length === 1) {
            store.commit('setUserRole', user.roles[0])
            router.push('/dashboard/' + user.roles[0])
          } else {
            router.push('/')
          }
        } catch (err) {
          error.value = err.message || 'Une erreur est survenue lors de la connexion'
        } finally {
          isSubmitting.value = false
        }
      }
    }
    
    const loginWithGoogle = () => {
      const redirect = route.query.redirect
      if (redirect) localStorage.setItem('redirectAfterLogin', redirect)
      window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:3002'}/api/auth/google`;
    }
    const loginWithFacebook = () => {
      const redirect = route.query.redirect
      if (redirect) localStorage.setItem('redirectAfterLogin', redirect)
      window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:3002'}/api/auth/facebook`;
    }

    // Gestion du token Google OAuth dans l'URL
    onMounted(() => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
      if (token) {
        localStorage.setItem('token', token);
        // Décoder le token JWT pour récupérer les infos utilisateur
        const userData = jwtDecode(token);
        store.commit('setUser', {
          id: userData.sub,
          email: userData.email,
          name: (userData.prenom || '') + ' ' + (userData.nom || ''), // à adapter selon le payload
          role: userData.role,
          structureId: userData.structureId || null
        });
        const storedRedirect = localStorage.getItem('redirectAfterLogin')
        const redirect = route.query.redirect
        localStorage.removeItem('redirectAfterLogin')
        router.push(storedRedirect || redirect || '/dashboard');
      }
    });
    
    return {
      form,
      v$,
      isSubmitting,
      error,
      showPassword,
      togglePassword,
      login,
      showRoleSelector,
      userRoles,
      handleRoleSelect,
      loginWithGoogle,
      loginWithFacebook
    }
  }
}
</script>