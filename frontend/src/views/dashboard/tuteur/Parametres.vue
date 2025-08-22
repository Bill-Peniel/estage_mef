<template>
  <div class="p-6 min-h-screen settings-bg">
    <h1 class="text-2xl font-bold text-gray-800 mb-6">Paramètres</h1>

    <!-- Snackbar notification -->
    <transition name="snackbar-fade">
      <div v-if="snackbar.message" :class="['snackbar', snackbar.success ? 'snackbar-success' : 'snackbar-error']">
        <i :class="snackbar.success ? 'fas fa-check-circle' : 'fas fa-exclamation-triangle'" class="mr-2"></i>
        {{ snackbar.message }}
      </div>
    </transition>

    <div class="bg-white rounded-lg shadow-sm p-6">
      <!-- Avatar -->
      <div class="mb-8 flex items-center gap-6">
        <div class="relative">
          <template v-if="avatarPreview || profile.avatar">
            <img
              :src="avatarPreview || getAvatarUrl(profile.avatar)"
              alt="Avatar"
              class="w-24 h-24 rounded-full object-cover border-4 border-primary shadow"
            />
          </template>
          <template v-else>
            <div class="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center border-4 border-primary shadow">
              <i class="fas fa-user text-gray-400 text-5xl"></i>
            </div>
          </template>
          <label class="absolute bottom-0 right-0 bg-primary text-white rounded-full p-2 cursor-pointer shadow-lg hover:bg-primary-dark transition" title="Changer la photo">
            <i class="fas fa-camera"></i>
            <input type="file" accept="image/*" class="hidden" @change="onAvatarChange" />
          </label>
        </div>
        <div>
          <p class="font-semibold text-gray-700">Photo de profil</p>
          <p class="text-xs text-gray-500">Formats acceptés : JPG, PNG, GIF. Max 2Mo.</p>
          <button v-if="avatarFile" @click="uploadAvatar" class="btn-primary mt-2" :disabled="loading.avatar">
            <span v-if="loading.avatar" class="loader mr-2"></span>
            Enregistrer la nouvelle photo
          </button>
        </div>
      </div>

      <!-- Informations personnelles -->
      <div class="mb-8">
        <h2 class="text-lg font-semibold text-gray-700 mb-4">Informations personnelles</h2>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Prénom</label>
            <input type="text" v-model="profile.prenom" class="mt-1 input-field" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Nom</label>
            <input type="text" v-model="profile.nom" class="mt-1 input-field" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" v-model="profile.email" class="mt-1 input-field" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Téléphone</label>
            <input type="tel" v-model="profile.telephone" class="mt-1 input-field" />
          </div>
        </div>
        <button @click="saveProfile" class="btn-primary mt-4" :disabled="loading.profile">
          <span v-if="loading.profile" class="loader mr-2"></span>
          Enregistrer les modifications
        </button>
      </div>

      <!-- Sécurité -->
      <div class="border-t pt-8 mb-8">
        <h2 class="text-lg font-semibold text-gray-700 mb-4">Sécurité</h2>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Ancien mot de passe</label>
            <input type="password" v-model="security.oldPassword" class="mt-1 input-field" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Nouveau mot de passe</label>
            <input type="password" v-model="security.newPassword" class="mt-1 input-field" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Confirmer le mot de passe</label>
            <input type="password" v-model="security.confirmPassword" class="mt-1 input-field" />
          </div>
        </div>
        <button @click="changePassword" class="btn-primary mt-4" :disabled="loading.password">
          <span v-if="loading.password" class="loader mr-2"></span>
          Changer le mot de passe
        </button>
      </div>

      <!-- Notifications -->
      <div class="border-t pt-8">
        <h2 class="text-lg font-semibold text-gray-700 mb-4">Préférences de notification</h2>
        <div class="space-y-4">
          <div class="flex items-center">
            <input 
              type="checkbox" 
              v-model="notifications.email" 
              id="email-notif"
              class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label for="email-notif" class="ml-2 block text-sm text-gray-700">
              Recevoir les notifications par email
            </label>
          </div>
          <div class="flex items-center">
            <input 
              type="checkbox" 
              v-model="notifications.site" 
              id="site-notif"
              class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label for="site-notif" class="ml-2 block text-sm text-gray-700">
              Recevoir les notifications sur le site
            </label>
          </div>
        </div>
        <button @click="saveNotificationPreferences" class="btn-primary mt-4" :disabled="loading.notifications">
          <span v-if="loading.notifications" class="loader mr-2"></span>
          Enregistrer les préférences
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { userService } from '@/services/api'
import { useStore } from 'vuex'

const defaultAvatar = 'https://ui-avatars.com/api/?name=Utilisateur&background=7e3af2&color=fff&size=128'

export default {
  name: 'Parametres',
  setup() {
    const store = useStore()
    const profile = ref({ prenom: '', nom: '', email: '', telephone: '', avatar: '' })
    const security = ref({ oldPassword: '', newPassword: '', confirmPassword: '' })
    const notifications = ref({ email: true, site: true })
    const loading = ref({ profile: false, password: false, notifications: false, avatar: false })
    const snackbar = ref({ message: '', success: true })
    const avatarFile = ref(null)
    const avatarPreview = ref('')
    let snackbarTimeout = null

    // Ajout: fonction utilitaire pour obtenir l'URL complète de l'avatar
    const getAvatarUrl = (avatar) => {
      if (!avatar) return defaultAvatar
      // Si c'est déjà une URL complète (ex: social login), retourne-la
      if (avatar.startsWith('http://') || avatar.startsWith('https://')) return avatar
      // Sinon, construit l'URL backend
      return `http://localhost:3002/uploads/${avatar}`
    }

    const fetchProfile = async () => {
      try {
        const data = await userService.getProfile()
        profile.value = {
          prenom: data.prenom || '',
          nom: data.nom || '',
          email: data.email || '',
          telephone: data.telephone || '',
          avatar: data.avatar || ''
        }
        notifications.value = {
          email: data.notifications?.email ?? true,
          site: data.notifications?.site ?? true
        }
      } catch (e) {
        showSnackbar('Erreur lors du chargement du profil', false)
      }
    }

    const onAvatarChange = (e) => {
      const file = e.target.files[0]
      if (!file) return
      if (!file.type.startsWith('image/')) {
        showSnackbar('Le fichier doit être une image', false)
        return
      }
      if (file.size > 2 * 1024 * 1024) {
        showSnackbar('Image trop volumineuse (max 2Mo)', false)
        return
      }
      avatarFile.value = file
      avatarPreview.value = URL.createObjectURL(file)
    }

    const uploadAvatar = async () => {
      if (!avatarFile.value) return
      loading.value.avatar = true
      try {
        const formData = new FormData()
        formData.append('avatar', avatarFile.value)
        const data = await userService.uploadAvatar(formData)
        // Recharge le profil pour synchroniser l'avatar (et éviter les problèmes de cache)
        await fetchProfile()
        // Synchroniser le store Vuex pour que la sidebar affiche la nouvelle photo
        store.commit('setUser', {
          ...store.state.user,
          avatar: profile.value.avatar
        })
        avatarFile.value = null
        avatarPreview.value = ''
        showSnackbar('Photo de profil mise à jour !', true)
      } catch (e) {
        showSnackbar(e.message || 'Erreur lors de l\'upload de la photo', false)
      }
      loading.value.avatar = false
    }

    const saveProfile = async () => {
      loading.value.profile = true
      try {
        await userService.updateProfile({
          prenom: profile.value.prenom,
          nom: profile.value.nom,
          email: profile.value.email,
          telephone: profile.value.telephone
        })
        showSnackbar('Profil mis à jour avec succès', true)
      } catch (e) {
        showSnackbar(e.message || 'Erreur lors de la mise à jour du profil', false)
      }
      loading.value.profile = false
    }

    const changePassword = async () => {
      if (security.value.newPassword !== security.value.confirmPassword) {
        showSnackbar('Les mots de passe ne correspondent pas', false)
        return
      }
      loading.value.password = true
      try {
        await userService.changePassword({
          oldPassword: security.value.oldPassword,
          newPassword: security.value.newPassword
        })
        showSnackbar('Mot de passe changé avec succès', true)
        security.value = { oldPassword: '', newPassword: '', confirmPassword: '' }
      } catch (e) {
        showSnackbar(e.message || 'Erreur lors du changement de mot de passe', false)
      }
      loading.value.password = false
    }

    const saveNotificationPreferences = async () => {
      loading.value.notifications = true
      try {
        await userService.updateNotificationPreferences(notifications.value)
        showSnackbar('Préférences de notification mises à jour', true)
      } catch (e) {
        showSnackbar(e.message || 'Erreur lors de la mise à jour des préférences', false)
      }
      loading.value.notifications = false
    }

    const showSnackbar = (msg, success = true) => {
      snackbar.value = { message: msg, success }
      if (snackbarTimeout) clearTimeout(snackbarTimeout)
      snackbarTimeout = setTimeout(() => { snackbar.value.message = '' }, 3500)
    }

    onMounted(() => {
      fetchProfile()
    })

    return {
      profile,
      security,
      notifications,
      loading,
      snackbar,
      avatarFile,
      avatarPreview,
      defaultAvatar,
      getAvatarUrl,
      onAvatarChange,
      uploadAvatar,
      saveProfile,
      changePassword,
      saveNotificationPreferences
    }
  }
}
</script>

<style scoped>
.settings-bg {
  background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 40%, #a5b4fc 80%, #7e3af2 100%);
}
.snackbar {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  min-width: 260px;
  max-width: 350px;
  z-index: 9999;
  display: flex;
  align-items: center;
  padding: 1rem 1.5rem;
  border-radius: 0.75rem;
  font-weight: 500;
  box-shadow: 0 4px 24px 0 rgba(30,66,159,0.12);
  font-size: 1rem;
  opacity: 0.98;
}
.snackbar-success {
  background: #e6f9f0;
  color: #0e9f6e;
  border-left: 5px solid #0e9f6e;
}
.snackbar-error {
  background: #fef2f2;
  color: #e02424;
  border-left: 5px solid #e02424;
}
.snackbar-fade-enter-active, .snackbar-fade-leave-active {
  transition: all 0.4s cubic-bezier(.4,0,.2,1);
}
.snackbar-fade-enter-from, .snackbar-fade-leave-to {
  opacity: 0;
  transform: translateY(40px);
}
.loader {
  border: 2px solid #f3f3f3;
  border-top: 2px solid #3498db;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  animation: spin 1s linear infinite;
  display: inline-block;
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
