<template>
  <div class="space-y-6">
    <!-- En-tête -->
    <div class="bg-white rounded-lg shadow p-6">
      <div class="flex justify-between items-center">
        <div>
          <h2 class="text-2xl font-bold text-gray-900">Notifications</h2>
          <p class="text-gray-600 mt-2">
            Gérez vos notifications et restez informé des activités de votre structure
          </p>
        </div>
        <div class="flex space-x-2">
          <button
            @click="markAllAsRead"
            class="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg"
          >
            Tout marquer comme lu
          </button>
          <button
            @click="refreshNotifications"
            class="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg"
          >
            <i class="fas fa-sync-alt mr-2"></i>
            Actualiser
          </button>
        </div>
      </div>
    </div>

    <!-- Filtres -->
    <div class="bg-white rounded-lg shadow p-6">
      <div class="flex flex-wrap gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Type de notification</label>
          <select v-model="filters.type" class="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary focus:border-primary">
            <option value="">Tous les types</option>
            <option value="info">Information</option>
            <option value="success">Succès</option>
            <option value="warning">Avertissement</option>
            <option value="error">Erreur</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Statut</label>
          <select v-model="filters.status" class="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary focus:border-primary">
            <option value="">Tous les statuts</option>
            <option value="unread">Non lues</option>
            <option value="read">Lues</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Période</label>
          <select v-model="filters.period" class="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary focus:border-primary">
            <option value="all">Toute la période</option>
            <option value="today">Aujourd'hui</option>
            <option value="week">Cette semaine</option>
            <option value="month">Ce mois</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Liste des notifications -->
    <div class="bg-white rounded-lg shadow">
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900">
          Notifications ({{ filteredNotifications.length }})
        </h3>
      </div>
      <div class="divide-y divide-gray-200">
        <div
          v-for="notification in filteredNotifications"
          :key="notification.id"
          :class="[
            'px-6 py-4 hover:bg-gray-50 transition-colors',
            !notification.read ? 'bg-blue-50' : ''
          ]"
        >
          <div class="flex items-start justify-between">
            <div class="flex items-start space-x-3">
              <div class="flex-shrink-0">
                <div
                  :class="[
                    'w-8 h-8 rounded-full flex items-center justify-center',
                    getNotificationIconClass(notification.type)
                  ]"
                >
                  <i :class="getNotificationIcon(notification.type)"></i>
                </div>
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center space-x-2">
                  <p class="text-sm font-medium text-gray-900">
                    {{ notification.title }}
                  </p>
                  <span
                    v-if="!notification.read"
                    class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    Nouveau
                  </span>
                </div>
                <p class="text-sm text-gray-600 mt-1">
                  {{ notification.message }}
                </p>
                <div class="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                  <span>{{ formatDate(notification.createdAt) }}</span>
                  <span v-if="notification.category">{{ notification.category }}</span>
                </div>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <button
                v-if="!notification.read"
                @click="markAsRead(notification.id)"
                class="text-blue-600 hover:text-blue-800 text-sm"
              >
                Marquer comme lu
              </button>
              <button
                @click="deleteNotification(notification.id)"
                class="text-red-600 hover:text-red-800 text-sm"
              >
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Message si aucune notification -->
      <div v-if="filteredNotifications.length === 0" class="px-6 py-8 text-center">
        <i class="fas fa-bell text-gray-400 text-4xl mb-4"></i>
        <p class="text-gray-500">Aucune notification trouvée</p>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="bg-white rounded-lg shadow p-6">
      <div class="flex items-center justify-between">
        <div class="text-sm text-gray-700">
          Affichage de {{ (currentPage - 1) * pageSize + 1 }} à {{ Math.min(currentPage * pageSize, totalNotifications) }} sur {{ totalNotifications }} notifications
        </div>
        <div class="flex space-x-2">
          <button
            @click="previousPage"
            :disabled="currentPage === 1"
            :class="[
              'px-3 py-2 border border-gray-300 rounded-md text-sm font-medium',
              currentPage === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            ]"
          >
            Précédent
          </button>
          <span class="px-3 py-2 text-sm text-gray-700">
            Page {{ currentPage }} sur {{ totalPages }}
          </span>
          <button
            @click="nextPage"
            :disabled="currentPage === totalPages"
            :class="[
              'px-3 py-2 border border-gray-300 rounded-md text-sm font-medium',
              currentPage === totalPages
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            ]"
          >
            Suivant
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'StructureDirectionnelleNotifications',
  setup() {
    const store = useStore()
    const notifications = ref([])
    const currentPage = ref(1)
    const pageSize = ref(20)
    const totalNotifications = ref(0)

    const filters = reactive({
      type: '',
      status: '',
      period: 'all'
    })

    const filteredNotifications = computed(() => {
      let filtered = notifications.value

      // Filtre par type
      if (filters.type) {
        filtered = filtered.filter(n => n.type === filters.type)
      }

      // Filtre par statut
      if (filters.status === 'read') {
        filtered = filtered.filter(n => n.read)
      } else if (filters.status === 'unread') {
        filtered = filtered.filter(n => !n.read)
      }

      // Filtre par période
      if (filters.period !== 'all') {
        const now = new Date()
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        
        filtered = filtered.filter(n => {
          const notificationDate = new Date(n.createdAt)
          switch (filters.period) {
            case 'today':
              return notificationDate >= today
            case 'week':
              const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
              return notificationDate >= weekAgo
            case 'month':
              const monthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate())
              return notificationDate >= monthAgo
            default:
              return true
          }
        })
      }

      return filtered
    })

    const totalPages = computed(() => {
      return Math.ceil(filteredNotifications.value.length / pageSize)
    })

    const loadNotifications = async () => {
      try {
        // Ici vous pouvez charger les notifications depuis l'API
        // Pour l'instant, on utilise des données d'exemple
        notifications.value = [
          {
            id: 1,
            title: 'Nouvelle sous-structure créée',
            message: 'La sous-structure "Service Informatique" a été créée avec succès.',
            type: 'success',
            category: 'Structure',
            read: false,
            createdAt: new Date()
          },
          {
            id: 2,
            title: 'Agent ajouté',
            message: 'Un nouvel agent a été ajouté à la sous-structure "Service Informatique".',
            type: 'info',
            category: 'Personnel',
            read: true,
            createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
          },
          {
            id: 3,
            title: 'Stagiaire affecté',
            message: 'Un stagiaire a été affecté à la sous-structure "Service Informatique".',
            type: 'info',
            category: 'Affectation',
            read: false,
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
          }
        ]
        totalNotifications.value = notifications.value.length
      } catch (error) {
        console.error('Erreur lors du chargement des notifications:', error)
        store.dispatch('setNotification', {
          type: 'error',
          message: 'Erreur lors du chargement des notifications'
        })
      }
    }

    const markAsRead = async (notificationId) => {
      try {
        // Ici vous pouvez marquer la notification comme lue via l'API
        const notification = notifications.value.find(n => n.id === notificationId)
        if (notification) {
          notification.read = true
        }
        
        store.dispatch('setNotification', {
          type: 'success',
          message: 'Notification marquée comme lue'
        })
      } catch (error) {
        console.error('Erreur lors du marquage comme lu:', error)
        store.dispatch('setNotification', {
          type: 'error',
          message: 'Erreur lors du marquage comme lu'
        })
      }
    }

    const markAllAsRead = async () => {
      try {
        // Ici vous pouvez marquer toutes les notifications comme lues via l'API
        notifications.value.forEach(n => n.read = true)
        
        store.dispatch('setNotification', {
          type: 'success',
          message: 'Toutes les notifications ont été marquées comme lues'
        })
      } catch (error) {
        console.error('Erreur lors du marquage comme lu:', error)
        store.dispatch('setNotification', {
          type: 'error',
          message: 'Erreur lors du marquage comme lu'
        })
      }
    }

    const deleteNotification = async (notificationId) => {
      if (!confirm('Êtes-vous sûr de vouloir supprimer cette notification ?')) {
        return
      }

      try {
        // Ici vous pouvez supprimer la notification via l'API
        notifications.value = notifications.value.filter(n => n.id !== notificationId)
        totalNotifications.value = notifications.value.length
        
        store.dispatch('setNotification', {
          type: 'success',
          message: 'Notification supprimée avec succès'
        })
      } catch (error) {
        console.error('Erreur lors de la suppression:', error)
        store.dispatch('setNotification', {
          type: 'error',
          message: 'Erreur lors de la suppression'
        })
      }
    }

    const refreshNotifications = () => {
      loadNotifications()
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

    const getNotificationIcon = (type) => {
      const icons = {
        info: 'fas fa-info',
        success: 'fas fa-check',
        warning: 'fas fa-exclamation-triangle',
        error: 'fas fa-times-circle'
      }
      return icons[type] || 'fas fa-bell'
    }

    const getNotificationIconClass = (type) => {
      const classes = {
        info: 'bg-blue-100 text-blue-600',
        success: 'bg-green-100 text-green-600',
        warning: 'bg-yellow-100 text-yellow-600',
        error: 'bg-red-100 text-red-600'
      }
      return classes[type] || 'bg-gray-100 text-gray-600'
    }

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    onMounted(() => {
      loadNotifications()
    })

    return {
      notifications,
      currentPage,
      pageSize,
      totalNotifications,
      filters,
      filteredNotifications,
      totalPages,
      markAsRead,
      markAllAsRead,
      deleteNotification,
      refreshNotifications,
      previousPage,
      nextPage,
      getNotificationIcon,
      getNotificationIconClass,
      formatDate
    }
  }
}
</script>

