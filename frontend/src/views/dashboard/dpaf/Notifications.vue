<template>
  <div class="bg-white shadow rounded-lg">
    <div class="px-6 py-4 border-b border-gray-200">
      <div class="flex justify-between items-center">
        <h2 class="text-xl font-semibold text-slate-800">Notifications DPAF</h2>
        <div class="flex space-x-3">
          <button @click="markAllAsRead" 
                  class="btn-outline flex items-center"
                  :disabled="isLoading || notifications.length === 0">
            <i class="fas fa-check-double mr-2"></i> Tout marquer comme lu
          </button>
        </div>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="isLoading" class="p-6 text-center">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
      <p class="mt-2 text-sm text-gray-500">Chargement des notifications...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="p-6 text-center">
      <span class="inline-flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
        <i class="fas fa-exclamation-circle text-red-500 text-xl"></i>
      </span>
      <h3 class="text-sm font-medium text-gray-900">Erreur de chargement</h3>
      <p class="mt-1 text-sm text-gray-500">{{ error }}</p>
      <button @click="fetchNotifications" class="mt-4 btn-primary">
        Réessayer
      </button>
    </div>

    <!-- Notifications list -->
    <div v-else class="divide-y divide-gray-200">
      <template v-if="notifications.length === 0">
        <div class="p-6 text-center">
          <span class="inline-flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 mb-4">
            <i class="fas fa-bell text-gray-400 text-xl"></i>
          </span>
          <h3 class="text-sm font-medium text-gray-900">Aucune notification</h3>
          <p class="mt-1 text-sm text-gray-500">Vous n'avez pas de nouvelles notifications.</p>
        </div>
      </template>
      <template v-else>
        <div v-for="notification in notifications" 
             :key="notification.id" 
             class="p-6 hover:bg-gray-50 transition-colors duration-200"
             :class="{ 'bg-blue-50': !notification.read }">
          <div class="flex items-start justify-between">
            <div class="flex items-start space-x-4">
              <div class="flex-shrink-0">
                <span class="inline-flex items-center justify-center h-10 w-10 rounded-full" 
                      :class="getNotificationTypeClass(notification.type)">
                  <i class="fas" :class="getNotificationIcon(notification.type)"></i>
                </span>
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between">
                  <p class="text-base font-medium text-gray-900" :class="{ 'font-bold': !notification.read }">
                    {{ notification.title }}
                  </p>
                  <div class="flex items-center space-x-2 ml-4">
                    <button v-if="!notification.read" 
                            @click="markAsRead(notification.id)" 
                            class="text-primary hover:text-primary-dark p-1 rounded-full hover:bg-gray-100"
                            :disabled="isLoading">
                      <i class="fas fa-check"></i>
                    </button>
                    <button @click="deleteNotification(notification.id)" 
                            class="text-gray-400 hover:text-red-600 p-1 rounded-full hover:bg-gray-100"
                            :disabled="isLoading">
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
                <p class="mt-1 text-sm text-gray-600">{{ notification.message }}</p>
                <p class="mt-2 text-xs text-gray-500">{{ formatDate(notification.createdAt) }}</p>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>

    <!-- Pagination -->
    <div v-if="notifications.length > 0" class="px-6 py-4 border-t border-gray-200 bg-gray-50">
      <div class="flex items-center justify-between">
        <div class="text-sm text-gray-700">
          Affichage de {{ startIndex + 1 }} à {{ endIndex }} sur {{ totalNotifications }} notifications
        </div>
        <div class="flex space-x-2">
          <button 
            @click="previousPage" 
            :disabled="currentPage === 1 || isLoading"
            class="btn-outline py-1 px-3 disabled:opacity-50"
          >
            Précédent
          </button>
          <button 
            @click="nextPage" 
            :disabled="currentPage === totalPages || isLoading"
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
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useStore } from 'vuex'
import { notificationService } from '../../../services/notification.service'

export default {
  name: 'DpafNotifications',
  setup() {
    const store = useStore()
    const itemsPerPage = 10
    const currentPage = ref(1)
    const notifications = ref([])
    const isLoading = ref(false)
    const error = ref(null)

    const fetchNotifications = async () => {
      isLoading.value = true;
      error.value = null;
      console.log('Début du chargement des notifications...');
      try {
        const data = await notificationService.getNotifications();
        console.log('=== DONNÉES NOTIFICATIONS ===');
        console.log('Données brutes:', JSON.stringify(data, null, 2));
        console.log('Première notification:', JSON.stringify(data?.[0], null, 2));
        console.log('Nombre de notifications:', data?.length);
        console.log('===========================');
        
        if (Array.isArray(data)) {
          notifications.value = data;
          console.log('=== NOTIFICATIONS MISE À JOUR ===');
          console.log('Nombre de notifications:', notifications.value.length);
          console.log('Première notification:', JSON.stringify(notifications.value[0], null, 2));
          console.log('===============================');
        } else {
          console.error('Les données reçues ne sont pas un tableau:', data);
          error.value = 'Format de données invalide';
        }
      } catch (err) {
        console.error('Erreur détaillée:', err);
        error.value = err.message || 'Erreur lors du chargement des notifications';
      } finally {
        isLoading.value = false;
        console.log('=== ÉTAT FINAL ===');
        console.log('Notifications:', JSON.stringify(notifications.value, null, 2));
        console.log('Loading:', isLoading.value);
        console.log('Erreur:', error.value);
        console.log('=================');
      }
    }

    const totalNotifications = computed(() => notifications.value.length)
    const totalPages = computed(() => Math.ceil(totalNotifications.value / itemsPerPage))
    const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage)
    const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage, totalNotifications.value))

    const getNotificationTypeClass = (type) => {
      const classes = {
        info: 'bg-blue-500',
        success: 'bg-green-500',
        warning: 'bg-yellow-500',
        error: 'bg-red-500'
      }
      return classes[type] || classes.info
    }

    const getNotificationIcon = (type) => {
      const icons = {
        info: 'fas fa-info',
        success: 'fas fa-check',
        warning: 'fas fa-exclamation',
        error: 'fas fa-times'
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

    const markAsRead = async (id) => {
      isLoading.value = true
      try {
        await notificationService.markAsRead(id)
        await fetchNotifications()
      } catch (err) {
        console.error('Erreur lors du marquage de la notification comme lue:', err)
      } finally {
        isLoading.value = false
      }
    }

    const markAllAsRead = async () => {
      isLoading.value = true
      try {
        await notificationService.markAllAsRead()
        await fetchNotifications()
      } catch (err) {
        console.error('Erreur lors du marquage de toutes les notifications comme lues:', err)
      } finally {
        isLoading.value = false
      }
    }

    const deleteNotification = async (id) => {
      isLoading.value = true
      try {
        await notificationService.deleteNotification(id)
        await fetchNotifications()
      } catch (err) {
        console.error('Erreur lors de la suppression de la notification:', err)
      } finally {
        isLoading.value = false
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

    // Charger les notifications au montage du composant
    onMounted(() => {
      console.log('Composant monté, chargement des notifications...');
      fetchNotifications();
    });

    // Rafraîchir les notifications toutes les 30 secondes
    let refreshInterval;
    onMounted(() => {
      refreshInterval = setInterval(fetchNotifications, 30000);
    });

    onBeforeUnmount(() => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    });

    // Ajouter un watcher pour surveiller les changements de notifications
    watch(notifications, (newVal) => {
      console.log('=== WATCHER NOTIFICATIONS ===');
      console.log('Nouvelles notifications:', JSON.stringify(newVal, null, 2));
      console.log('Nombre de notifications:', newVal.length);
      console.log('Première notification:', JSON.stringify(newVal[0], null, 2));
      console.log('===========================');
    }, { deep: true });

    return {
      notifications,
      currentPage,
      totalNotifications,
      totalPages,
      startIndex,
      endIndex,
      isLoading,
      error,
      getNotificationTypeClass,
      getNotificationIcon,
      formatDate,
      markAsRead,
      markAllAsRead,
      deleteNotification,
      previousPage,
      nextPage,
      fetchNotifications
    }
  }
}
</script>
