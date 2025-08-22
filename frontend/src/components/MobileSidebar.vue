<template>
  <div>
    <!-- Overlay -->
    <div class="fixed inset-0 bg-black bg-opacity-40 z-40" @click="$emit('close')"></div>
    <!-- Drawer -->
    <aside class="fixed top-0 right-0 h-full w-4/5 max-w-xs bg-white shadow-lg z-50 rounded-l-2xl transform translate-x-0 transition-transform duration-300">
      <button @click="$emit('close')" class="absolute top-4 right-4 text-gray-600 hover:text-primary text-2xl focus:outline-none">
        <i class="fas fa-times"></i>
      </button>
      <div class="mt-12 mb-6 flex justify-center">
        <h1 class="font-bold text-lg text-gray-800 text-center">Tableau de bord administratif</h1>
      </div>
      <nav class="flex flex-col space-y-2 px-6">
        <router-link to="/dashboard" class="py-2 px-3 rounded hover:bg-gray-100 text-gray-800 font-semibold"><i class="fas fa-chart-line mr-2"></i> Tableau de bord</router-link>
        <router-link to="/dashboard/demandes/en-attente" class="py-2 px-3 rounded hover:bg-gray-100 text-gray-800"><i class="fas fa-clock mr-2"></i> En attente</router-link>
        <router-link to="/dashboard/demandes/en-cours" class="py-2 px-3 rounded hover:bg-gray-100 text-gray-800"><i class="fas fa-spinner mr-2"></i> En cours</router-link>
        <router-link to="/dashboard/demandes/historique" class="py-2 px-3 rounded hover:bg-gray-100 text-gray-800"><i class="fas fa-history mr-2"></i> Historique</router-link>
        <router-link to="/dashboard/structures" class="py-2 px-3 rounded hover:bg-gray-100 text-gray-800"><i class="fas fa-building mr-2"></i> Structures</router-link>
        <router-link to="/dashboard/tuteurs" class="py-2 px-3 rounded hover:bg-gray-100 text-gray-800"><i class="fas fa-user-tie mr-2"></i> Agents</router-link>
        <router-link to="/dashboard/stagiaires" class="py-2 px-3 rounded hover:bg-gray-100 text-gray-800"><i class="fas fa-user-graduate mr-2"></i> Stagiaires</router-link>
        <router-link to="/dashboard/parametres" class="py-2 px-3 rounded hover:bg-gray-100 text-gray-800"><i class="fas fa-cog mr-2"></i> Paramètres</router-link>
        <router-link to="/dashboard/notifications" class="py-2 px-3 rounded hover:bg-gray-100 text-gray-800"><i class="fas fa-bell mr-2"></i> Notifications</router-link>
        <button @click="$emit('close'); $emit('logout')" class="py-2 px-3 rounded hover:bg-red-100 text-red-600 font-semibold flex items-center"><i class="fas fa-sign-out-alt mr-2"></i> Déconnexion</button>
        <slot />
      </nav>
    </aside>
  </div>
</template>

<script>
export default {
  name: 'MobileSidebar'
}
</script>

<style scoped>
/* Animation pour coulisser de la droite */
.fixed[style*="translate-x-0"] {
  transform: translateX(0);
}
</style> 