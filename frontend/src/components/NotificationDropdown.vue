<template>
  <div class="relative" ref="notifMenu">
    <button @click="toggleNotifMenu" class="text-white hover:text-accent-yellow relative">
      <i class="fas fa-bell text-xl"></i>
      <span v-if="unreadCount > 0" class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
        {{ unreadCount }}
      </span>
    </button>

    <!-- Dropdown menu -->
    <div v-if="showNotifMenu" class="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg overflow-hidden z-50">
      <div class="p-4 border-b border-gray-200 flex justify-between items-center">
        <h3 class="text-lg font-semibold text-gray-900">Notifications</h3>
        <div class="flex items-center space-x-2">
          <button 
            v-if="unreadCount > 0"
            @click="markAllAsRead" 
            class="text-sm text-blue-600 hover:text-blue-800"
          >
            Tout marquer comme lu
          </button>
          <router-link 
            to="/dashboard/dpaf/notifications" 
            class="text-sm text-blue-600 hover:text-blue-800"
            @click="showNotifMenu = false"
          >
            Voir tout
          </router-link>
        </div>
      </div>

      <div class="max-h-96 overflow-y-auto">
        <div v-if="notifications.length === 0" class="p-4 text-center text-gray-500">
          Aucune notification
        </div>
        
        <div v-else class="divide-y divide-gray-200">
          <div 
            v-for="notification in notifications" 
            :key="notification.id"
            class="p-4 hover:bg-gray-50 transition-colors duration-200"
            :class="{ 'bg-blue-50': !notification.read }"
          >
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <span :class="getNotificationIconClass(notification.type)" class="inline-flex items-center justify-center h-8 w-8 rounded-full">
                  <i :class="getNotificationIcon(notification.type)" class="text-white"></i>
                </span>
              </div>
              <div class="ml-3 flex-1">
                <p class="text-sm font-medium text-gray-900">{{ notification.title }}</p>
                <p class="text-sm text-gray-500 mt-1">{{ notification.message }}</p>
                <p class="text-xs text-gray-400 mt-1">{{ formatDate(notification.createdAt) }}</p>
              </div>
              <button 
                v-if="!notification.read"
                @click="markAsRead(notification.id)"
                class="ml-2 text-gray-400 hover:text-gray-600"
              >
                <i class="fas fa-check"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useStore } from 'vuex';
import { notificationService } from '../services/notification.service';

export default {
  name: 'NotificationDropdown',
  setup() {
    const store = useStore();
    const showNotifMenu = ref(false);
    const notifMenu = ref(null);
    const notifications = ref([]);
    const unreadCount = computed(() => notifications.value.filter(n => !n.read).length);

    const getNotificationIconClass = (type) => {
      const classes = {
        info: 'bg-blue-500',
        success: 'bg-green-500',
        warning: 'bg-yellow-500',
        error: 'bg-red-500'
      };
      return classes[type] || classes.info;
    };

    const getNotificationIcon = (type) => {
      const icons = {
        info: 'fas fa-info',
        success: 'fas fa-check',
        warning: 'fas fa-exclamation',
        error: 'fas fa-times'
      };
      return icons[type] || icons.info;
    };

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
      });
    };

    const toggleNotifMenu = () => {
      showNotifMenu.value = !showNotifMenu.value;
    };

    const fetchNotifications = async () => {
      try {
        const data = await notificationService.getNotifications();
        notifications.value = data;
      } catch (error) {
        console.error('Erreur lors de la récupération des notifications:', error);
      }
    };

    const markAsRead = async (id) => {
      try {
        await notificationService.markAsRead(id);
        await fetchNotifications();
      } catch (error) {
        console.error('Erreur lors du marquage de la notification comme lue:', error);
      }
    };

    const markAllAsRead = async () => {
      try {
        await notificationService.markAllAsRead();
        await fetchNotifications();
      } catch (error) {
        console.error('Erreur lors du marquage de toutes les notifications comme lues:', error);
      }
    };

    // Fermer le menu quand on clique en dehors
    const handleClickOutside = (event) => {
      if (notifMenu.value && !notifMenu.value.contains(event.target)) {
        showNotifMenu.value = false;
      }
    };

    onMounted(() => {
      fetchNotifications();
      document.addEventListener('click', handleClickOutside);
      // Rafraîchir les notifications toutes les 30 secondes
      const interval = setInterval(fetchNotifications, 30000);
      onBeforeUnmount(() => {
        document.removeEventListener('click', handleClickOutside);
        clearInterval(interval);
      });
    });

    return {
      showNotifMenu,
      notifMenu,
      notifications,
      unreadCount,
      toggleNotifMenu,
      markAsRead,
      markAllAsRead,
      getNotificationIconClass,
      getNotificationIcon,
      formatDate
    };
  }
};
</script>

<style scoped>
.notification-dropdown {
  max-height: 400px;
  overflow-y: auto;
}

/* Style pour la barre de défilement */
.notification-dropdown::-webkit-scrollbar {
  width: 6px;
}

.notification-dropdown::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.notification-dropdown::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
}

.notification-dropdown::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style> 