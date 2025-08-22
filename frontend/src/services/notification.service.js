import api from './api';
import { ref } from 'vue'

const API_URL = '/notifications';

const notifications = ref([])

export const useNotification = () => {
  const addNotification = (type, message) => {
    const id = Date.now()
    notifications.value.push({
      id,
      type,
      message,
      timeout: setTimeout(() => {
        removeNotification(id)
      }, 5000)
    })
  }

  const removeNotification = (id) => {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index !== -1) {
      clearTimeout(notifications.value[index].timeout)
      notifications.value.splice(index, 1)
    }
  }

  return {
    notifications,
    success: (message) => addNotification('success', message),
    error: (message) => addNotification('error', message),
    warning: (message) => addNotification('warning', message),
    info: (message) => addNotification('info', message),
    remove: removeNotification
  }
}

export const notificationService = {
  async getNotifications() {
    console.log('Appel API getNotifications...');
    try {
      console.log('URL de la requête:', API_URL);
      const response = await api.get(API_URL);
      console.log('=== CONTENU DES NOTIFICATIONS ===');
      console.log('Status:', response.status);
      console.log('Headers:', response.headers);
      console.log('Données brutes:', JSON.stringify(response.data, null, 2));
      console.log('Première notification:', JSON.stringify(response.data?.[0], null, 2));
      console.log('Nombre de notifications:', response.data?.length);
      console.log('===============================');
      
      if (!response.data) {
        console.error('Pas de données dans la réponse:', response);
        return [];
      }
      return response.data;
    } catch (error) {
      console.error('Erreur API getNotifications:', error.response || error);
      throw error;
    }
  },

  async markAsRead(notificationId) {
    console.log('Appel API markAsRead pour id:', notificationId);
    try {
      const response = await api.post(`${API_URL}/${notificationId}/read`);
      console.log('Réponse API markAsRead:', response);
      return response.data;
    } catch (error) {
      console.error('Erreur API markAsRead:', error.response || error);
      throw error;
    }
  },

  async markAllAsRead() {
    console.log('Appel API markAllAsRead...');
    try {
      const response = await api.post(`${API_URL}/read-all`);
      console.log('Réponse API markAllAsRead:', response);
      return response.data;
    } catch (error) {
      console.error('Erreur API markAllAsRead:', error.response || error);
      throw error;
    }
  },

  async deleteNotification(notificationId) {
    console.log('Appel API deleteNotification pour id:', notificationId);
    try {
      const response = await api.delete(`${API_URL}/${notificationId}`);
      console.log('Réponse API deleteNotification:', response);
      return response.data;
    } catch (error) {
      console.error('Erreur API deleteNotification:', error.response || error);
      throw error;
    }
  }
}; 