<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">Mon Profil</h1>

    <div v-if="successMessage" class="mb-4 p-3 rounded bg-green-100 text-green-800 border border-green-300">{{ successMessage }}</div>
    <div v-if="errorMessage" class="mb-4 p-3 rounded bg-red-100 text-red-800 border border-red-300">{{ errorMessage }}</div>

    <div class="bg-white rounded-lg shadow-sm p-6 max-w-2xl">
      <form @submit.prevent="saveProfile" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Nom
            </label>
            <input type="text" v-model="profile.nom" class="input-field" required />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Prénom
            </label>
            <input type="text" v-model="profile.prenom" class="input-field" required />
          </div>

          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input type="email" v-model="profile.email" class="input-field" required />
          </div>

          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Téléphone
            </label>
            <input type="tel" v-model="profile.telephone" class="input-field" />
          </div>
        </div>

        <div class="space-y-4">
          <h3 class="text-lg font-semibold">Changer le mot de passe</h3>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Ancien mot de passe
            </label>
            <input type="password" v-model="passwords.old" class="input-field" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Nouveau mot de passe
            </label>
            <input type="password" v-model="passwords.new" class="input-field" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Confirmer le nouveau mot de passe
            </label>
            <input type="password" v-model="passwords.confirm" class="input-field" />
          </div>
        </div>

        <div class="flex justify-end space-x-3">
          <button type="button" @click="resetForm" class="btn-outline">
            Annuler
          </button>
          <button type="submit" class="btn-primary">
            Enregistrer les modifications
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useStore } from 'vuex'
import { userService, authService } from '@/services/api.js'

export default {
  name: 'StructureProfil',
  setup() {
    const store = useStore()
    const profile = ref({
      nom: '',
      prenom: '',
      email: '',
      telephone: ''
    })

    const passwords = ref({
      old: '',
      new: '',
      confirm: ''
    })

    const successMessage = ref('')
    const errorMessage = ref('')

    // Charger les infos utilisateur au montage
    const loadProfile = () => {
      const user = authService.getCurrentUser()
      if (user) {
        profile.value.nom = user.name?.split(' ')[1] || ''
        profile.value.prenom = user.name?.split(' ')[0] || ''
        profile.value.email = user.email || ''
        profile.value.telephone = user.telephone || ''
      }
    }

    loadProfile()

    const saveProfile = async () => {
      successMessage.value = ''
      errorMessage.value = ''
      try {
        await userService.updateProfile({
          nom: profile.value.nom,
          prenom: profile.value.prenom,
          telephone: profile.value.telephone
        })
        if (profile.value.email) {
          await userService.updateEmail(profile.value.email)
        }
        if (passwords.value.new && passwords.value.new === passwords.value.confirm) {
          await userService.updatePassword({
            oldPassword: passwords.value.old,
            newPassword: passwords.value.new
          })
        }
        successMessage.value = 'Profil mis à jour avec succès.'
        setTimeout(() => { successMessage.value = '' }, 4000)
      } catch (error) {
        errorMessage.value = error?.message || 'Erreur lors de la sauvegarde.'
        setTimeout(() => { errorMessage.value = '' }, 6000)
        console.error('Erreur lors de la sauvegarde:', error)
      }
    }

    const resetForm = () => {
      loadProfile()
      passwords.value = {
        old: '',
        new: '',
        confirm: ''
      }
    }

    return {
      profile,
      passwords,
      saveProfile,
      resetForm,
      successMessage,
      errorMessage
    }
  }
}
</script>
