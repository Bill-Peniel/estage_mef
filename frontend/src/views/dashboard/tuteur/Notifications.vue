<template>
  <div class="p-6 min-h-screen notifications-bg">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Notifications</h1>
      <p class="text-gray-600">Gérez vos notifications</p>
    </div>

    <!-- Snackbar notification -->
    <transition name="snackbar-fade">
      <div v-if="snackbar.message" :class="['snackbar', snackbar.success ? 'snackbar-success' : 'snackbar-error']">
        <i :class="snackbar.success ? 'fas fa-check-circle' : 'fas fa-exclamation-triangle'" class="mr-2"></i>
        {{ snackbar.message }}
      </div>
    </transition>

    <div class="bg-white rounded-lg shadow">
      <div class="p-4 border-b flex items-center justify-between">
          <h2 class="text-lg font-semibold">Toutes les notifications</h2>
        <button class="text-primary hover:text-primary-dark flex items-center" @click="markAllAsRead" :disabled="loadingAll">
            <i class="fas fa-check-double mr-2"></i>Tout marquer comme lu
          </button>
      </div>

      <div class="divide-y">
        <div v-if="loading" class="p-8 text-center text-gray-400">
          <i class="fas fa-spinner fa-spin mr-2"></i>Chargement des notifications...
            </div>
        <template v-else>
          <div v-if="notifications.length === 0" class="p-8 text-center text-gray-400">
            <i class="fas fa-inbox mr-2"></i>Aucune notification à afficher
          </div>
          <div v-for="notif in notifications" :key="notif.id" class="p-4 hover:bg-blue-50 transition-colors cursor-pointer flex items-start group relative" :class="{'opacity-60': notif.read}">
            <div class="flex-shrink-0">
              <span :class="['w-8 h-8 rounded-full flex items-center justify-center', notif.iconBg || 'bg-blue-100', notif.iconColor || 'text-blue-500']">
                <i :class="notif.icon || 'fas fa-bell'" />
              </span>
            </div>
            <div class="ml-3 flex-1">
              <p class="text-sm font-medium text-gray-900">{{ notif.title }}</p>
              <p class="text-sm text-gray-500">{{ notif.message }}</p>
              <span class="text-xs text-gray-400">{{ notif.time || notif.createdAt ? formatTime(notif.time || notif.createdAt) : '' }}</span>
            </div>
            <div class="ml-4 flex flex-col items-center gap-2">
              <button v-if="!notif.read" @click.stop="markAsRead(notif.id)" class="text-xs text-primary hover:underline">Marquer comme lu</button>
              <button @click.stop="deleteNotif(notif.id)" class="text-xs text-red-400 hover:text-red-600"><i class="fas fa-trash"></i></button>
              <div v-if="!notif.read" class="h-2 w-2 bg-blue-500 rounded-full mt-2"></div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { notificationService } from '@/services/notification.service'

export default {
  name: 'TuteurNotifications',
  setup() {
    const notifications = ref([])
    const loading = ref(true)
    const loadingAll = ref(false)
    const snackbar = ref({ message: '', success: true })
    let snackbarTimeout = null

    const fetchNotifications = async () => {
      loading.value = true
      try {
        notifications.value = await notificationService.getNotifications()
      } catch (e) {
        showSnackbar('Erreur lors du chargement des notifications', false)
      }
      loading.value = false
    }

    const markAsRead = async (id) => {
      try {
        await notificationService.markAsRead(id)
        showSnackbar('Notification marquée comme lue !', true)
        await fetchNotifications()
      } catch (e) {
        showSnackbar('Erreur lors de la mise à jour', false)
      }
    }

    const markAllAsRead = async () => {
      loadingAll.value = true
      try {
        await notificationService.markAllAsRead()
        showSnackbar('Toutes les notifications sont lues !', true)
        await fetchNotifications()
      } catch (e) {
        showSnackbar('Erreur lors de la mise à jour', false)
      }
      loadingAll.value = false
    }

    const deleteNotif = async (id) => {
      if (!window.confirm('Supprimer cette notification ?')) return
      try {
        await notificationService.deleteNotification(id)
        showSnackbar('Notification supprimée', true)
        await fetchNotifications()
      } catch (e) {
        showSnackbar('Erreur lors de la suppression', false)
      }
    }

    const showSnackbar = (msg, success = true) => {
      snackbar.value = { message: msg, success }
      if (snackbarTimeout) clearTimeout(snackbarTimeout)
      snackbarTimeout = setTimeout(() => { snackbar.value.message = '' }, 3500)
    }

    const formatTime = (dateStr) => {
      if (!dateStr) return ''
      const date = new Date(dateStr)
      const now = new Date()
      const diff = (now - date) / 1000
      if (diff < 60) return 'À l’instant'
      if (diff < 3600) return `Il y a ${Math.floor(diff/60)} min`
      if (diff < 86400) return `Il y a ${Math.floor(diff/3600)}h`
      return date.toLocaleDateString()
    }

    onMounted(() => {
      fetchNotifications()
    })

    return {
      notifications,
      loading,
      loadingAll,
      markAsRead,
      markAllAsRead,
      deleteNotif,
      snackbar,
      formatTime
    }
  }
}
</script>

<style scoped>
.notifications-bg {
  background: gray-300;
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
</style>
