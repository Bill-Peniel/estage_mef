<template>
  <div class="p-4">
    <h1 class="text-2xl text-slate-800 font-bold mb-6">Mes Notifications</h1>

    <!-- Message d'erreur -->
    <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      {{ error }}
    </div>

    <!-- Indicateur de chargement -->
    <div v-if="loading" class="flex justify-center items-center py-4">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>

    <div v-else class="bg-white rounded-lg shadow">
      <div class="p-4 border-b">
      <div class="flex justify-between items-center">
          <div class="flex items-center space-x-4">
            <input 
              type="text" 
              placeholder="Rechercher dans les notifications..." 
              class="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              v-model="searchQuery"
            >
            <select 
              v-model="filterType" 
              class="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Tous les types</option>
              <option value="DEMANDE">Demandes</option>
              <option value="AFFECTATION">Affectations</option>
              <option value="SYSTEME">Système</option>
            </select>
          </div>
          <div class="flex items-center space-x-2">
            <button 
              @click="markAllAsRead" 
              class="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200"
              :disabled="!hasUnreadNotifications"
            >
              <i class="fas fa-check-double mr-2"></i>Tout marquer comme lu
          </button>
        </div>
      </div>
    </div>

    <div class="divide-y divide-gray-200">
        <div 
          v-for="notification in paginatedNotifications" 
          :key="notification.id"
          class="p-4 hover:bg-gray-50 transition-colors duration-150"
          :class="{ 'bg-blue-50': !notification.lu }"
        >
        <div class="flex items-start justify-between">
          <div class="flex items-start space-x-3">
            <div class="flex-shrink-0">
                <div class="w-10 h-10 rounded-full flex items-center justify-center"
                     :class="getNotificationIconClass(notification.type)">
                  <i :class="getNotificationIcon(notification.type)" class="text-white"></i>
                </div>
              </div>
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-900">{{ notification.titre }}</p>
                <p class="text-sm text-gray-500 mt-1">{{ notification.message }}</p>
                <div class="mt-2 flex items-center text-xs text-gray-500">
                  <i class="far fa-clock mr-1"></i>
                  {{ formatDate(notification.dateCreation) }}
                  <span v-if="!notification.lu" class="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full">
                    Non lu
              </span>
            </div>
            </div>
          </div>
          <div class="flex items-center space-x-2">
              <button 
                v-if="!notification.lu"
                @click="markAsRead(notification)"
                class="text-gray-400 hover:text-gray-600"
                title="Marquer comme lu"
              >
              <i class="fas fa-check"></i>
            </button>
              <button 
                @click="deleteNotification(notification)"
                class="text-gray-400 hover:text-red-600"
                title="Supprimer"
              >
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
      <div class="px-4 py-3 border-t border-gray-200 sm:px-6">
      <div class="flex items-center justify-between">
          <div class="flex-1 flex justify-between sm:hidden">
          <button 
              @click="currentPage--" 
            :disabled="currentPage === 1"
              class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Précédent
          </button>
          <button 
              @click="currentPage++" 
              :disabled="currentPage >= totalPages"
              class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Suivant
          </button>
          </div>
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700">
                Affichage de <span class="font-medium">{{ startIndex + 1 }}</span> à 
                <span class="font-medium">{{ endIndex }}</span> sur 
                <span class="font-medium">{{ filteredNotifications.length }}</span> notifications
              </p>
            </div>
            <div>
              <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button 
                  @click="currentPage--" 
                  :disabled="currentPage === 1"
                  class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span class="sr-only">Précédent</span>
                  <i class="fas fa-chevron-left"></i>
                </button>
                <button 
                  v-for="page in displayedPages" 
                  :key="page"
                  @click="currentPage = page"
                  :class="[
                    currentPage === page ? 'z-10 bg-primary-50 border-primary-500 text-primary-600' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50',
                    'relative inline-flex items-center px-4 py-2 border text-sm font-medium'
                  ]"
                >
                  {{ page }}
                </button>
                <button 
                  @click="currentPage++" 
                  :disabled="currentPage >= totalPages"
                  class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span class="sr-only">Suivant</span>
                  <i class="fas fa-chevron-right"></i>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { notificationService } from '@/services/api'

export default {
  name: 'Notifications',
  setup() {
    const searchQuery = ref('')
    const filterType = ref('')
    const notifications = ref([])
    const loading = ref(false)
    const error = ref(null)
    const currentPage = ref(1)
    const itemsPerPage = 10

    // Charger les notifications depuis l'API
    const loadNotifications = async () => {
      try {
        loading.value = true
        error.value = null
        console.log('Chargement des notifications...')
        
        // Vérifier si l'utilisateur est authentifié
        const token = localStorage.getItem('token')
        if (!token) {
          throw new Error('Vous devez être connecté pour voir vos notifications')
        }

        const response = await notificationService.getNotifications()
        console.log('Réponse brute des notifications:', JSON.stringify(response, null, 2))
        
        if (Array.isArray(response)) {
          // Transformer les données pour assurer la cohérence
          notifications.value = response.map(notification => {
            console.log('Notification individuelle:', {
              id: notification.id,
              dateCreation: notification.dateCreation,
              createdAt: notification.createdAt,
              date: notification.date,
              read: notification.read,
              raw: notification
            })
            return {
              ...notification,
              dateCreation: notification.createdAt || notification.dateCreation || notification.date,
              lu: Boolean(notification.read) // Convertir read en lu
            }
          })
          console.log('Notifications transformées:', notifications.value)
        } else {
          console.error('Format de réponse invalide:', response)
          throw new Error('Format de données invalide')
        }
      } catch (err) {
        console.error('Erreur détaillée:', {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status
        })
        
        if (err.response?.status === 401) {
          error.value = 'Session expirée. Veuillez vous reconnecter.'
        } else if (err.response?.status === 403) {
          error.value = 'Vous n\'avez pas les droits pour accéder aux notifications.'
        } else if (err.message?.includes('Network Error')) {
          error.value = 'Impossible de se connecter au serveur. Veuillez vérifier votre connexion.'
        } else {
          error.value = err.message || 'Erreur lors du chargement des notifications'
        }
      } finally {
        loading.value = false
      }
    }

    // Charger les notifications au montage du composant
    onMounted(async () => {
      console.log('Composant monté, chargement des notifications...')
      await loadNotifications()
    })

    // Ajouter un watcher pour recharger les notifications quand l'utilisateur se reconnecte
    watch(() => localStorage.getItem('token'), async (newToken) => {
      if (newToken) {
        console.log('Token détecté, rechargement des notifications...')
        await loadNotifications()
      }
    })

    const filteredNotifications = computed(() => {
      const searchLower = searchQuery.value.toLowerCase()
      return notifications.value.filter(notification => {
        const matchQuery = 
          (notification.titre?.toLowerCase() || '').includes(searchLower) ||
          (notification.message?.toLowerCase() || '').includes(searchLower)

        const matchType = !filterType.value || notification.type === filterType.value

        return matchQuery && matchType
      })
    })

    const hasUnreadNotifications = computed(() => {
      return notifications.value.some(notification => !notification.lu)
    })

    const totalPages = computed(() => {
      return Math.ceil(filteredNotifications.value.length / itemsPerPage)
    })

    const startIndex = computed(() => {
      return (currentPage.value - 1) * itemsPerPage
    })

    const endIndex = computed(() => {
      return Math.min(startIndex.value + itemsPerPage, filteredNotifications.value.length)
    })

    const paginatedNotifications = computed(() => {
      return filteredNotifications.value.slice(startIndex.value, endIndex.value)
    })

    const displayedPages = computed(() => {
      const pages = []
      const maxDisplayedPages = 5
      
      if (totalPages.value <= maxDisplayedPages) {
        for (let i = 1; i <= totalPages.value; i++) {
          pages.push(i)
        }
      } else {
        let start = Math.max(1, currentPage.value - Math.floor(maxDisplayedPages / 2))
        let end = start + maxDisplayedPages - 1
        
        if (end > totalPages.value) {
          end = totalPages.value
          start = Math.max(1, end - maxDisplayedPages + 1)
        }
        
        for (let i = start; i <= end; i++) {
          pages.push(i)
        }
      }
      
      return pages
    })

    const formatDate = (date) => {
      console.log('Tentative de formatage de la date:', date)
      
      if (!date) {
        console.log('Date manquante')
        return 'Date inconnue'
      }

      try {
        // Si la date est une chaîne ISO, la convertir en objet Date
        const dateObj = new Date(date)
        
        // Vérifier si la date est valide
        if (isNaN(dateObj.getTime())) {
          console.error('Date invalide:', date)
          return 'Date invalide'
        }

        const formattedDate = dateObj.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
        
        console.log('Date formatée avec succès:', {
          original: date,
          formatted: formattedDate
        })
        
        return formattedDate
      } catch (error) {
        console.error('Erreur lors du formatage de la date:', error, 'Date originale:', date)
        return 'Date invalide'
      }
    }

    const getNotificationIcon = (type) => {
      switch (type) {
        case 'DEMANDE':
          return 'fas fa-file-alt'
        case 'AFFECTATION':
          return 'fas fa-user-check'
        case 'SYSTEME':
          return 'fas fa-cog'
        default:
          return 'fas fa-bell'
      }
    }

    const getNotificationIconClass = (type) => {
      switch (type) {
        case 'DEMANDE':
          return 'bg-blue-500'
        case 'AFFECTATION':
          return 'bg-green-500'
        case 'SYSTEME':
          return 'bg-purple-500'
        default:
          return 'bg-gray-500'
      }
    }

    const markAllAsRead = async () => {
      try {
        loading.value = true
        error.value = null
        console.log('Marquage de toutes les notifications comme lues...')
        
        // Vérifier si l'utilisateur est authentifié
        const token = localStorage.getItem('token')
        if (!token) {
          throw new Error('Vous devez être connecté pour marquer les notifications comme lues')
        }

        await notificationService.markAllAsRead()
        console.log('Toutes les notifications ont été marquées comme lues')
        
        // Mettre à jour l'état local des notifications
        notifications.value = notifications.value.map(notification => ({
          ...notification,
          lu: true
        }))
      } catch (err) {
        console.error('Erreur détaillée:', {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status
        })
        
        if (err.response?.status === 401) {
          error.value = 'Session expirée. Veuillez vous reconnecter.'
        } else if (err.response?.status === 403) {
          error.value = 'Vous n\'avez pas les droits pour modifier les notifications.'
        } else if (err.message?.includes('Network Error')) {
          error.value = 'Impossible de se connecter au serveur. Veuillez vérifier votre connexion.'
        } else {
          error.value = err.message || 'Erreur lors du marquage des notifications comme lues'
        }
      } finally {
        loading.value = false
      }
    }

    const markAsRead = async (notification) => {
      try {
        loading.value = true
        error.value = null
        await notificationService.markAsRead(notification.id)
        // Mettre à jour l'état local de la notification
        const index = notifications.value.findIndex(n => n.id === notification.id)
        if (index !== -1) {
          notifications.value[index] = {
            ...notifications.value[index],
            lu: true
          }
        }
      } catch (err) {
        console.error('Erreur lors du marquage de la notification comme lue:', err)
        error.value = 'Erreur lors du marquage de la notification comme lue'
      } finally {
        loading.value = false
      }
    }

    const deleteNotification = async (notification) => {
      try {
        loading.value = true
        error.value = null
        await notificationService.deleteNotification(notification.id)
        // Supprimer la notification de la liste locale
        notifications.value = notifications.value.filter(n => n.id !== notification.id)
      } catch (err) {
        console.error('Erreur lors de la suppression de la notification:', err)
        error.value = 'Erreur lors de la suppression de la notification'
      } finally {
        loading.value = false
      }
    }

    return {
      searchQuery,
      filterType,
      notifications,
      loading,
      error,
      currentPage,
      itemsPerPage,
      filteredNotifications,
      hasUnreadNotifications,
      totalPages,
      startIndex,
      endIndex,
      paginatedNotifications,
      displayedPages,
      markAllAsRead,
      markAsRead,
      deleteNotification,
      formatDate,
      getNotificationIcon,
      getNotificationIconClass
    }
  }
}
</script> 

<style scoped>
.fixed {
  position: fixed;
  z-index: 9999;
}

/* Styles pour la pagination */
.relative.z-0 {
  z-index: 0;
}

.relative.z-10 {
  z-index: 10;
}
</style> 