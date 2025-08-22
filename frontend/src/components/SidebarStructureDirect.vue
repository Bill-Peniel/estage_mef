<template>
  <aside class="bg-gradient-to-t from-slate-400 to-white w-64 text-white shadow-lg overflow-y-auto transform transition-all duration-300 ease-in-out fixed md:translate-x-0 z-50 sidebar-custom-scroll" :class="{ '-translate-x-full': !isSidebarOpen }">
    <nav class="p-4">
      <!-- Vue d'ensemble -->
      <router-link 
        to="/dashboard/structure_directionnelles" 
        class="text-slate-900 block px-4 py-2 rounded hover:bg-slate-400 hover:text-slate-700 transition-colors duration-200"
        :class="{ 'bg-slate-500 text-white': $route.path === '/dashboard/structure_directionnelles' }"
      >
        <i class="fas fa-chart-line mr-2"></i> Vue d'ensemble
      </router-link>

      <!-- Gestion des stagiaires -->
      <div class="mt-6">
        <h3 class="px-4 py-2 text-sm font-semibold text-slate-500 uppercase">Stagiaires</h3>
        <router-link 
          to="/dashboard/structure_directionnelles/stagiaires"
          class="text-slate-900 block px-4 py-2 rounded hover:bg-slate-400 hover:text-slate-700 transition-colors duration-200"
          :class="{ 'bg-slate-500 text-white': $route.path === '/dashboard/structure_directionnelles/stagiaires' }"
        >
          <i class="fas fa-users mr-2"></i> Stagiaires
        </router-link>
        <router-link 
          to="/dashboard/structure_directionnelles/evaluations"
          class="text-slate-900 block px-4 py-2 rounded hover:bg-slate-400 hover:text-slate-700 transition-colors duration-200"
          :class="{ 'bg-slate-500 text-white': $route.path === '/dashboard/structure_directionnelles/evaluations' }"
        >
          <i class="fas fa-star mr-2"></i> Évaluations
        </router-link>
      </div>

      <!-- Sous-structures -->
      <div class="mt-6">
        <h3 class="px-4 py-2 text-sm font-semibold text-slate-500 uppercase">Sous-structures</h3>
        <router-link 
          to="/dashboard/structure_directionnelles/sousStructures"
          class="text-slate-900 block px-4 py-2 rounded hover:bg-slate-400 hover:text-slate-700 transition-colors duration-200"
          :class="{ 'bg-slate-500 text-white': $route.path === '/dashboard/structure_directionnelles/sousStructures' }"
        >
          <i class="fas fa-building mr-2"></i> Sous-structures
        </router-link>
      </div>

      <!-- Services -->
      <div class="mt-6">
        <h3 class="px-4 py-2 text-sm font-semibold text-slate-500 uppercase">Services</h3>
        <router-link 
          to="/dashboard/structure_directionnelles/services"
          class="text-slate-900 block px-4 py-2 rounded hover:bg-slate-400 hover:text-slate-700 transition-colors duration-200"
          :class="{ 'bg-slate-500 text-white': $route.path === '/dashboard/structure_directionnelles/services' }"
        >
          <i class="fas fa-cogs mr-2"></i> Services
        </router-link>
        <router-link 
          to="/dashboard/structure_directionnelles/rapports"
          class="text-slate-900 block px-4 py-2 rounded hover:bg-slate-400 hover:text-slate-700 transition-colors duration-200"
          :class="{ 'bg-slate-500 text-white': $route.path === '/dashboard/structure_directionnelles/rapports' }"
        >
          <i class="fas fa-file-alt mr-2"></i> Rapports
        </router-link>
        <router-link 
          to="/dashboard/structure_directionnelles/statistiques"
          class="text-slate-900 block px-4 py-2 rounded hover:bg-slate-400 hover:text-slate-700 transition-colors duration-200"
          :class="{ 'bg-slate-500 text-white': $route.path === '/dashboard/structure_directionnelles/statistiques' }"
        >
          <i class="fas fa-chart-bar mr-2"></i> Statistiques
        </router-link>
      </div>

      <!-- Agents -->
      <div class="mt-6">
        <h3 class="px-4 py-2 text-sm font-semibold text-slate-500 uppercase">Agents</h3>
        <router-link 
          to="/dashboard/structure_directionnelles/tuteurs"
          class="text-slate-900 block px-4 py-2 rounded hover:bg-slate-400 hover:text-slate-700 transition-colors duration-200"
          :class="{ 'bg-slate-500 text-white': $route.path === '/dashboard/structure_directionnelles/tuteurs' }"
        >
          <i class="fas fa-chalkboard-teacher mr-2"></i> Agents
        </router-link>
        <router-link 
          to="/dashboard/structure_directionnelles/affectations"
          class="text-slate-900 block px-4 py-2 rounded hover:bg-slate-400 hover:text-slate-700 transition-colors duration-200"
          :class="{ 'bg-slate-500 text-white': $route.path === '/dashboard/structure_directionnelles/affectations' }"
        >
          <i class="fas fa-user-plus mr-2"></i> Affectations
        </router-link>
      </div>

      <!-- Paramètres -->
      <div class="mt-6">
        <h3 class="px-4 py-2 text-sm font-semibold text-slate-500 uppercase">Paramètres</h3>
        <router-link 
          to="/dashboard/structure_directionnelles/profil"
          class="text-slate-900 block px-4 py-2 rounded hover:bg-slate-400 hover:text-slate-700 transition-colors duration-200"
          :class="{ 'bg-slate-500 text-white': $route.path === '/dashboard/structure_directionnelles/profil' }"
        >
          <i class="fas fa-user mr-2"></i> Profil
        </router-link>
        <router-link 
          to="/dashboard/structure_directionnelles/notifications"
          class="text-slate-900 block px-4 py-2 rounded hover:bg-slate-400 hover:text-slate-700 transition-colors duration-200"
          :class="{ 'bg-slate-500 text-white': $route.path === '/dashboard/structure_directionnelles/notifications' }"
        >
          <i class="fas fa-bell mr-2"></i> Notifications
        </router-link>
      </div>
    </nav>
  </aside>
</template>

<script>
export default {
  name: 'SidebarStructureDirect',
  data() {
    return {
      isSidebarOpen: true
    }
  }
}
</script>

<style scoped>
.sidebar-custom-scroll {
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
}

.sidebar-custom-scroll::-webkit-scrollbar {
  width: 6px;
}

.sidebar-custom-scroll::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar-custom-scroll::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}
</style> 