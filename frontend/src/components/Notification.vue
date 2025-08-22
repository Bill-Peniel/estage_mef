<template>
  <div class="fixed top-4 right-4 z-50">
    <TransitionGroup name="notification">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        class="mb-4 p-4 rounded-lg shadow-lg max-w-md"
        :class="{
          'bg-green-100 text-green-800': notification.type === 'success',
          'bg-red-100 text-red-800': notification.type === 'error',
          'bg-yellow-100 text-yellow-800': notification.type === 'warning',
          'bg-blue-100 text-blue-800': notification.type === 'info'
        }"
      >
        <div class="flex justify-between items-center">
          <p>{{ notification.message }}</p>
          <button
            @click="remove(notification.id)"
            class="ml-4 text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<script>
import { useNotification } from '@/services/notification.service'

export default {
  name: 'Notification',
  setup() {
    const { notifications, remove } = useNotification()
    return {
      notifications,
      remove
    }
  }
}
</script>

<style scoped>
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style> 