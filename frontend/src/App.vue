<template>
  <div class="flex flex-col min-h-screen">
    <Header v-if="!isDashboardRoute" />
    <main class="flex-grow">
      <router-view />
    </main>
    <Footer v-if="!isDashboardRoute" />
    <Notification />
    <ChatbotWidget />
  </div>
</template>

<script>
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
import Notification from './components/Notification.vue'
import ChatbotWidget from './components/ChatbotWidget.vue'

export default {
  name: 'App',
  components: {
    Header,
    Footer,
    Notification,
    ChatbotWidget
  },
  computed: {
    isDashboardRoute() {
      return this.$route.path.startsWith('/dashboard')
    }
  }
}
</script>

<style lang="postcss">
@import './assets/tailwind.css';

body {
  font-family: 'Poppins', sans-serif;
  @apply bg-gray-50;
}

.btn-primary {
  @apply bg-green-800 text-white py-2 px-6 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-opacity-50 transition duration-200;
}

.btn-secondary {
  @apply bg-blue-900 text-white py-2 px-6 rounded-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-800 focus:ring-opacity-50 transition duration-200;
}

.btn-outline {
  @apply border border-green-800 text-green-800 py-2 px-6 rounded-md hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-opacity-50 transition duration-200;
}

.input-field {
  @apply w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent;
}

.form-group {
  @apply mb-4;
}

.form-label {
  @apply block text-gray-700 font-medium mb-2;
}

.error-message {
  @apply text-red-600 text-sm mt-1;
}
</style>