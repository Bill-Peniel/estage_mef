<template>
  <div class="p-6">
    <h1 class="text-2xl text-slate-800 font-bold mb-6">Mon Profil</h1>

    <div class="bg-white rounded-lg shadow-sm p-6 max-w-2xl">
      <form @submit.prevent="saveProfile" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input type="email" v-model="profile.email" class="input-field" required />
        </div>

        <div class="space-y-4">
          <h3 class="text-lg font-semibold">Changer le mot de passe</h3>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Ancien mot de passe
            </label>
            <div class="relative">
              <input :type="showPasswords.old ? 'text' : 'password'" v-model="passwords.old" class="input-field pr-10" />
              <button type="button" @click="togglePasswordVisibility('old')" class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600">
                <i :class="showPasswords.old ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </button>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Nouveau mot de passe
            </label>
            <div class="relative">
              <input :type="showPasswords.new ? 'text' : 'password'" v-model="passwords.new" class="input-field pr-10" minlength="8" />
              <button type="button" @click="togglePasswordVisibility('new')" class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600">
                <i :class="showPasswords.new ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </button>
            </div>
            <p class="mt-1 text-sm text-gray-500">Le mot de passe doit contenir au moins 8 caractères</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Confirmer le nouveau mot de passe
            </label>
            <div class="relative">
              <input :type="showPasswords.confirm ? 'text' : 'password'" v-model="passwords.confirm" class="input-field pr-10" />
              <button type="button" @click="togglePasswordVisibility('confirm')" class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600">
                <i :class="showPasswords.confirm ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </button>
            </div>
          </div>
        </div>

        <div class="flex justify-end space-x-3">
          <button type="button" @click="resetForm" class="btn-outline">
            Annuler
          </button>
          <button type="submit" class="btn-primary" :disabled="loading">
            {{ loading ? 'Enregistrement...' : 'Enregistrer les modifications' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useStore } from 'vuex'
import { useToast } from 'vue-toastification'
import { userService } from '@/services/api'

export default {
  name: 'Profil',
  setup() {
    const store = useStore()
    const toast = useToast()
    const loading = ref(false)

    const profile = ref({
      email: store.state.user?.email || ''
    })

    const passwords = ref({
      old: '',
      new: '',
      confirm: ''
    })

    const showPasswords = ref({
      old: false,
      new: false,
      confirm: false
    })

    const togglePasswordVisibility = (field) => {
      showPasswords.value[field] = !showPasswords.value[field]
    }

    const validateForm = () => {
      if (passwords.value.new && !passwords.value.old) {
        toast.error('Veuillez entrer votre ancien mot de passe')
        return false
      }

      if (passwords.value.new && passwords.value.new !== passwords.value.confirm) {
        toast.error('Les mots de passe ne correspondent pas')
        return false
      }

      if (passwords.value.new && passwords.value.new.length < 8) {
        toast.error('Le mot de passe doit contenir au moins 8 caractères')
        return false
      }

      return true
    }

    const saveProfile = async () => {
      if (!validateForm()) return

      try {
        loading.value = true

        // Si l'email a changé
        if (profile.value.email !== store.state.user?.email) {
          await userService.updateEmail(profile.value.email)
          await store.dispatch('updateUserEmail', profile.value.email)
          toast.success('Email mis à jour avec succès')
        }

        // Si un nouveau mot de passe est fourni
      if (passwords.value.new) {
          await userService.updatePassword({
            oldPassword: passwords.value.old,
            newPassword: passwords.value.new
          })
          toast.success('Mot de passe mis à jour avec succès')
          
          // Réinitialiser les champs de mot de passe
          passwords.value = {
            old: '',
            new: '',
            confirm: ''
          }
        }

        toast.success('Profil mis à jour avec succès')
      } catch (error) {
        console.error('Erreur lors de la mise à jour du profil:', error)
        toast.error(error.response?.data?.message || 'Erreur lors de la mise à jour du profil')
      } finally {
        loading.value = false
      }
    }

    const resetForm = () => {
      profile.value = {
        email: store.state.user?.email || ''
      }
      passwords.value = {
        old: '',
        new: '',
        confirm: ''
      }
    }

    return {
      profile,
      passwords,
      loading,
      showPasswords,
      togglePasswordVisibility,
      saveProfile,
      resetForm
    }
  }
}
</script>

<style scoped>
.input-field {
  @apply w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500;
}

.btn-primary {
  @apply px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed;
}

.btn-outline {
  @apply px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed;
}
</style>