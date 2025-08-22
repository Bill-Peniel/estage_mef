
<template>
  <footer class="bg-primary text-white py-4 px-6">
    <div class="flex justify-between items-center">
      <div>
        <p class="text-sm">&copy; {{ currentYear }} MEF Bénin - Administration</p>
      </div>
      <div class="flex space-x-4 text-sm">
        <a href="#" class="hover:text-accent-yellow">Aide</a>
        <a href="#" class="hover:text-accent-yellow">Documentation</a>
        <a href="#" class="hover:text-accent-yellow">Support</a>
      </div>
    </div>
  </footer>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'FooterAdmin',
  setup() {
    const currentYear = computed(() => new Date().getFullYear())
    return {
      currentYear
    }
  }
}
</script>
