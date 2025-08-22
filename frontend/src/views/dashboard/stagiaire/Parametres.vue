
<template>
  <div class="min-h-screen settings-bg flex flex-col items-center p-6 justify-center py-10 ">
    <div class="bg-white rounded-2xl shadow-lg border border-gray-200 w-full max-w-2xl mx-auto px-6 sm:px-10 py-6 top-10 mb-4 relative">
      <!-- Avatar -->
      <div class="flex flex-col items-center mb-8">
        <div class="relative group">
          <img :src="avatarPreview || settings.avatar || defaultAvatar" alt="Avatar" class="w-32 h-32 rounded-full object-cover border-4 border-indigo-200 shadow-lg transition group-hover:brightness-90" />
          <label class="absolute bottom-2 right-2 bg-indigo-600 text-white rounded-full p-3 cursor-pointer shadow-lg hover:bg-indigo-700 transition flex items-center justify-center group-hover:scale-110" title="Changer l'avatar">
            <input type="file" accept="image/*" class="hidden" @change="onAvatarChange" />
            <i class="fas fa-camera"></i>
          </label>
          <div v-if="avatarPreview" class="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-indigo-600 bg-indigo-50 px-2 py-1 rounded shadow">Aperçu de la nouvelle image</div>
        </div>
      </div>
      <h2 class="text-2xl font-extrabold text-gray-800 text-center mb-10 tracking-tight">Paramètres du compte</h2>
        <!-- Informations personnelles -->
      <div class="mb-10">
        <h3 class="text-lg font-semibold text-indigo-700 mb-6 tracking-wide border-l-4 border-indigo-400 pl-3">Informations personnelles</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
            <input type="text" v-model="settings.firstName" class="input-field w-full" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nom</label>
            <input type="text" v-model="settings.lastName" class="input-field w-full" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" v-model="settings.email" class="input-field w-full" />
          </div>
            <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
            <input type="tel" v-model="settings.telephone" class="input-field w-full" />
            </div>
            <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Date de naissance</label>
            <input type="date" v-model="settings.birthDate" class="input-field w-full" />
            </div>
            <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">École / Université de provenance</label>
            <input type="text" v-model="settings.school" class="input-field w-full" />
            </div>
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">Filière</label>
            <input type="text" v-model="settings.major" class="input-field w-full" />
          </div>
        </div>
      </div>
        <!-- Préférences de notification -->
      <div class="mb-10">
        <h3 class="text-lg font-semibold text-indigo-700 mb-6 tracking-wide border-l-4 border-indigo-400 pl-3">Préférences de notification</h3>
        <div class="flex flex-wrap gap-6">
          <label class="flex items-center gap-2">
            <input type="checkbox" v-model="settings.notifMessages" class="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
            <span class="text-sm">Nouveaux messages</span>
          </label>
          <label class="flex items-center gap-2">
            <input type="checkbox" v-model="settings.notifEvaluation" class="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
            <span class="text-sm">Évaluations</span>
          </label>
          <label class="flex items-center gap-2">
            <input type="checkbox" v-model="settings.notifRapports" class="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
            <span class="text-sm">Rapports</span>
          </label>
        </div>
            </div>
      <!-- Modification du mot de passe -->
      <div class="mb-10">
        <h3 class="text-lg font-semibold text-indigo-700 mb-6 tracking-wide border-l-4 border-indigo-400 pl-3">Modifier le mot de passe</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">Mot de passe actuel</label>
            <input :type="showPasswords ? 'text' : 'password'" v-model="settings.currentPassword" class="input-field w-full" autocomplete="current-password" />
            </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nouveau mot de passe</label>
            <input :type="showPasswords ? 'text' : 'password'" v-model="settings.newPassword" class="input-field w-full" autocomplete="new-password" />
            </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Confirmer le nouveau mot de passe</label>
            <input :type="showPasswords ? 'text' : 'password'" v-model="settings.confirmPassword" class="input-field w-full" autocomplete="new-password" />
          </div>
        </div>
        <div class="flex items-center gap-2 mt-2">
          <input type="checkbox" id="showPasswords" v-model="showPasswords" class="h-4 w-4" />
          <label for="showPasswords" class="text-sm text-gray-700 cursor-pointer">Afficher les mots de passe</label>
        </div>
        <div v-if="passwordError" class="text-red-600 bg-red-50 border border-red-200 rounded p-2 text-sm mt-2">{{ passwordError }}</div>
        <div v-if="passwordSuccess" class="text-green-700 bg-green-50 border border-green-200 rounded p-2 text-sm mt-2">{{ passwordSuccess }}</div>
        <div class="flex justify-end mt-4">
          <button @click="changePassword" class="btn-primary flex items-center gap-2 w-full md:w-auto" :disabled="isPasswordLoading || !settings.currentPassword || !settings.newPassword || !settings.confirmPassword || settings.newPassword !== settings.confirmPassword">
            <span v-if="isPasswordLoading">
              <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
            </span>
            <span>{{ isPasswordLoading ? 'Enregistrement...' : 'Enregistrer le nouveau mot de passe' }}</span>
          </button>
        </div>
      </div>
      <!-- Boutons d'action -->
      <div class="flex flex-col md:flex-row justify-end gap-3 mt-8">
        <button @click="resetSettings" class="btn-outline w-full md:w-auto">Réinitialiser</button>
        <button @click="saveSettings" class="btn-primary w-full md:w-auto" :disabled="isSaving">
          <span v-if="isSaving">
            <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
          </span>
          <span>{{ isSaving ? 'Enregistrement...' : 'Enregistrer les modifications' }}</span>
        </button>
      </div>
      <div v-if="saveError" class="text-red-600 bg-red-50 border border-red-200 rounded p-2 text-sm mt-2">{{ saveError }}</div>
      <div v-if="saveSuccess" class="text-green-700 bg-green-50 border border-green-200 rounded p-2 text-sm mt-2">{{ saveSuccess }}</div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const defaultAvatar = 'https://ui-avatars.com/api/?name=Stagiaire&background=E5E7EB&color=374151&size=128'

export default {
  name: 'StagiaireParametres',
  setup() {
    const settings = ref({
      avatar: '',
      firstName: '',
      lastName: '',
      email: '',
      telephone: '',
      birthDate: '',
      school: '',
      major: '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      notifMessages: true,
      notifEvaluation: true,
      notifRapports: true
    })
    const avatarPreview = ref('')
    const showPasswords = ref(false)
    const passwordError = ref('')
    const passwordSuccess = ref('')
    const isPasswordLoading = ref(false)
    const isLoading = ref(true)
    const saveError = ref('')
    const saveSuccess = ref('')
    const isSaving = ref(false)

    // Charger les infos utilisateur au mounted
    onMounted(async () => {
      isLoading.value = true
      try {
        const token = localStorage.getItem('token')
        const res = await axios.get('/api/users/me', {
          headers: { Authorization: `Bearer ${token}` }
        })
        const user = res.data
        settings.value = {
          avatar: user.avatar || '',
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          email: user.email || '',
          telephone: user.telephone || '',
          birthDate: user.birthDate ? user.birthDate.substr(0, 10) : '',
          school: user.school || '',
          major: user.major || '',
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
          notifMessages: user.notifMessages ?? true,
          notifEvaluation: user.notifEvaluation ?? true,
          notifRapports: user.notifRapports ?? true
        }
        avatarPreview.value = ''
      } catch (e) {
        saveError.value = "Erreur lors du chargement du profil."
      } finally {
        isLoading.value = false
      }
    })

    const onAvatarChange = (e) => {
      const file = e.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (ev) => {
          avatarPreview.value = ev.target.result
        }
        reader.readAsDataURL(file)
        settings.value.avatarFile = file
      }
    }

    const saveSettings = async () => {
      saveError.value = ''
      saveSuccess.value = ''
      isSaving.value = true
      try {
        const token = localStorage.getItem('token')
        let data, headers
        if (settings.value.avatarFile) {
          data = new FormData()
          data.append('firstName', settings.value.firstName)
          data.append('lastName', settings.value.lastName)
          data.append('email', settings.value.email)
          data.append('telephone', settings.value.telephone)
          data.append('birthDate', settings.value.birthDate)
          data.append('school', settings.value.school)
          data.append('major', settings.value.major)
          data.append('notifMessages', settings.value.notifMessages)
          data.append('notifEvaluation', settings.value.notifEvaluation)
          data.append('notifRapports', settings.value.notifRapports)
          data.append('avatar', settings.value.avatarFile)
          headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
        } else {
          data = {
            firstName: settings.value.firstName,
            lastName: settings.value.lastName,
            email: settings.value.email,
            telephone: settings.value.telephone,
            birthDate: settings.value.birthDate,
            school: settings.value.school,
            major: settings.value.major,
            notifMessages: settings.value.notifMessages,
            notifEvaluation: settings.value.notifEvaluation,
            notifRapports: settings.value.notifRapports
          }
          headers = { Authorization: `Bearer ${token}` }
        }
        await axios.put('/api/users/me', data, { headers })
        saveSuccess.value = 'Profil mis à jour avec succès.'
        // Recharger l'avatar si modifié
        if (settings.value.avatarFile) {
          settings.value.avatar = avatarPreview.value
          settings.value.avatarFile = undefined
          avatarPreview.value = ''
        }
      } catch (e) {
        saveError.value = e.response?.data?.message || "Erreur lors de la sauvegarde."
      } finally {
        isSaving.value = false
      }
    }

    const resetSettings = () => {
      // Recharge les infos depuis l'API
      window.location.reload()
    }

    const changePassword = async () => {
      passwordError.value = ''
      passwordSuccess.value = ''
      if (!settings.value.currentPassword || !settings.value.newPassword || !settings.value.confirmPassword) {
        passwordError.value = 'Veuillez remplir tous les champs de mot de passe.'
        return;
      }
      if (settings.value.newPassword !== settings.value.confirmPassword) {
        passwordError.value = 'Les nouveaux mots de passe ne correspondent pas.'
        return;
      }
      isPasswordLoading.value = true
      try {
        const token = localStorage.getItem('token')
        await axios.post('/api/users/me/password', {
          currentPassword: settings.value.currentPassword,
          newPassword: settings.value.newPassword
        }, {
          headers: { Authorization: `Bearer ${token}` }
        })
        passwordSuccess.value = 'Mot de passe modifié avec succès.'
        settings.value.currentPassword = ''
        settings.value.newPassword = ''
        settings.value.confirmPassword = ''
      } catch (e) {
        passwordError.value = e.response?.data?.message || 'Erreur lors de la modification du mot de passe.'
      } finally {
        isPasswordLoading.value = false
      }
    }

    return {
      settings,
      avatarPreview,
      defaultAvatar,
      saveSettings,
      resetSettings,
      changePassword,
      showPasswords,
      passwordError,
      passwordSuccess,
      isPasswordLoading,
      isLoading,
      saveError,
      saveSuccess,
      isSaving,
      onAvatarChange
    }
  }
}
</script>

<style scoped>
.settings-bg {
  background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 40%, #a5b4fc 80%, #7e3af2 100%);
}
.input-field {
  @apply border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition w-full bg-gray-50 hover:bg-indigo-50;
}
.btn-primary {
  @apply bg-indigo-600 text-white font-semibold rounded-lg px-6 py-2 shadow hover:bg-indigo-700 transition disabled:opacity-60 disabled:cursor-not-allowed;
}
.btn-outline {
  @apply border border-indigo-600 text-indigo-700 font-semibold rounded-lg px-6 py-2 bg-white shadow hover:bg-indigo-50 transition;
}
</style>
