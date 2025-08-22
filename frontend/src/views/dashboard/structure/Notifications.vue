<template>
  <div class="bg-white shadow rounded-lg">
    <div class="px-6 py-4 border-b border-gray-200">
      <div class="flex justify-between items-center">
        <h2 class="text-xl font-semibold text-gray-800">Notifications Structure</h2>
        <div class="flex space-x-3">
          <button @click="markAllAsRead" class="btn-outline flex items-center">
            <i class="fas fa-check-double mr-2"></i> Tout marquer comme lu
          </button>
        </div>
      </div>
    </div>

    <div v-if="successMessage" class="m-4 p-3 rounded bg-green-100 text-green-800 border border-green-300">{{ successMessage }}</div>
    <div v-if="errorMessage" class="m-4 p-3 rounded bg-red-100 text-red-800 border border-red-300">{{ errorMessage }}</div>
    <div v-if="loading" class="p-6 text-center text-gray-500">Chargement...</div>

    <div v-else class="divide-y divide-gray-200">
      <div v-for="notification in notifications" :key="notification.id" 
           class="p-6 hover:bg-gray-50 transition-colors duration-200"
           :class="{ 'bg-blue-50': !notification.read }">
        <div class="flex items-start justify-between">
          <div class="flex items-start space-x-3">
            <div class="flex-shrink-0">
              <span class="inline-flex items-center justify-center h-10 w-10 rounded-full" 
                    :class="getNotificationTypeClass(notification.type)">
                <i class="fas" :class="getNotificationIcon(notification.type)"></i>
              </span>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-900" :class="{ 'font-bold': !notification.read }">
                {{ notification.title }}
              </p>
              <p class="mt-1 text-sm text-gray-500">{{ notification.message }}</p>
              <p class="mt-2 text-xs text-gray-400">{{ formatDate(notification.date) }}</p>
            </div>
          </div>
          <div class="flex items-center space-x-2">
            <button v-if="!notification.read" 
                    @click="markAsRead(notification.id)" 
                    class="text-primary hover:text-primary-dark">
              <i class="fas fa-check"></i>
            </button>
            <button @click="deleteNotification(notification.id)" 
                    class="text-gray-400 hover:text-red-600">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      </div>

      <div v-if="notifications.length === 0 && !loading" class="p-6 text-center">
        <span class="inline-flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 mb-4">
          <i class="fas fa-bell text-gray-400 text-xl"></i>
        </span>
        <h3 class="text-sm font-medium text-gray-900">Aucune notification</h3>
        <p class="mt-1 text-sm text-gray-500">Vous n'avez pas de nouvelles notifications.</p>
      </div>
    </div>

    <div v-if="notifications.length > 0" class="px-6 py-4 border-t border-gray-200">
      <div class="flex items-center justify-between">
        <div class="text-sm text-gray-700">
          Affichage de {{ startIndex + 1 }} à {{ endIndex }} sur {{ totalNotifications }} notifications
        </div>
        <div class="flex space-x-2">
          <button 
            @click="previousPage" 
            :disabled="currentPage === 1"
            class="btn-outline py-1 px-3 disabled:opacity-50"
          >
            Précédent
          </button>
          <button 
            @click="nextPage" 
            :disabled="currentPage === totalPages"
            class="btn-outline py-1 px-3 disabled:opacity-50"
          >
            Suivant
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { notificationService } from '@/services/api.js'

export default {
  name: 'StructureNotifications',
  setup() {
    const itemsPerPage = 10
    const currentPage = ref(1)
    const notifications = ref([])
    const loading = ref(false)
    const successMessage = ref('')
    const errorMessage = ref('')

    const totalNotifications = computed(() => notifications.value.length)
    const totalPages = computed(() => Math.ceil(totalNotifications.value / itemsPerPage))
    const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage)
    const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage, totalNotifications.value))

    const paginatedNotifications = computed(() =>
      notifications.value.slice(startIndex.value, endIndex.value)
    )

    const getNotificationTypeClass = (type) => {
      const classes = {
        info: 'bg-blue-100 text-blue-600',
        success: 'bg-green-100 text-green-600',
        warning: 'bg-yellow-100 text-yellow-600',
        error: 'bg-red-100 text-red-600'
      }
      return classes[type] || classes.info
    }

    const getNotificationIcon = (type) => {
      const icons = {
        info: 'fa-info',
        success: 'fa-check',
        warning: 'fa-exclamation',
        error: 'fa-times'
      }
      return icons[type] || icons.info
    }

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    const loadNotifications = async () => {
      loading.value = true
      errorMessage.value = ''
      try {
        const data = await notificationService.getNotifications()
        // Adapter si besoin le format des dates
        notifications.value = (data || []).map(n => ({
          ...n,
          date: n.createdAt || n.date || new Date()
        }))
      } catch (error) {
        errorMessage.value = error?.message || 'Erreur lors du chargement des notifications.'
      } finally {
        loading.value = false
      }
    }

    onMounted(loadNotifications)

    const markAsRead = async (id) => {
      try {
        await notificationService.markAsRead(id)
        successMessage.value = 'Notification marquée comme lue.'
        setTimeout(() => { successMessage.value = '' }, 3000)
        await loadNotifications()
      } catch (error) {
        errorMessage.value = error?.message || 'Erreur lors du marquage comme lu.'
        setTimeout(() => { errorMessage.value = '' }, 5000)
      }
    }

    const markAllAsRead = async () => {
      try {
        await notificationService.markAllAsRead()
        successMessage.value = 'Toutes les notifications ont été marquées comme lues.'
        setTimeout(() => { successMessage.value = '' }, 3000)
        await loadNotifications()
      } catch (error) {
        errorMessage.value = error?.message || 'Erreur lors du marquage de toutes les notifications.'
        setTimeout(() => { errorMessage.value = '' }, 5000)
      }
    }

    const deleteNotification = async (id) => {
      try {
        await notificationService.deleteNotification(id)
        successMessage.value = 'Notification supprimée.'
        setTimeout(() => { successMessage.value = '' }, 3000)
        await loadNotifications()
      } catch (error) {
        errorMessage.value = error?.message || 'Erreur lors de la suppression de la notification.'
        setTimeout(() => { errorMessage.value = '' }, 5000)
      }
    }

    const previousPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--
      }
    }

    const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value++
      }
    }

    return {
      notifications: paginatedNotifications,
      currentPage,
      totalNotifications,
      totalPages,
      startIndex,
      endIndex,
      getNotificationTypeClass,
      getNotificationIcon,
      formatDate,
      markAsRead,
      markAllAsRead,
      deleteNotification,
      previousPage,
      nextPage,
      loading,
      successMessage,
      errorMessage
    }
  }
}
</script>
