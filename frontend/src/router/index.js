import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Application from '../views/Application.vue'
import Contact from '../views/Contact.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Status from '../views/Status.vue'

import Dashboard from '../views/Dashboard.vue'
import store from '../store'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/validate/:id',
    name: 'ValidateBinome',
    component: () => import('../views/ValidateBinome.vue')
  },
  {
    path: '/application',
    name: 'Application',
    component: Application
  },
  {
    path: '/status',
    name: 'Status',
    component: Status
  },
  {
    path: '/contact',
    name: 'Contact',
    component: Contact
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/dashboard',
    component: Dashboard,
    meta: { requiresAuth: true },
    beforeEnter: async (to, from, next) => {
      if (!store.getters.isAuthenticated) {
        next('/login')
      } else if (store.getters.isDpaf) {
        next('/dashboard/dpaf')
      } else if (store.getters.isStructure) {
        // Récupérer le type de structure de l'utilisateur
        let user = store.state.user || JSON.parse(localStorage.getItem('user'))
        
        // Si l'utilisateur a déjà les informations de structure dans le store
        if (user?.structure?.type) {
          if (user.structure.type === 'directionnelle') {
            next('/dashboard/structure_directionnelles')
          } else {
            next('/dashboard/structure')
          }
          return
        }
        
        // Sinon, récupérer depuis l'API
        let structures = []
        try {
          structures = await import('@/services/api').then(m => m.structureService.getStructures())
        } catch (e) {}
        
        let userStructure = structures.find(structure =>
          structure.users?.some(user => user.id === user?.id) ||
          structure.tuteurs?.some(tuteur => tuteur.userId === user?.id)
        )
        
        if (userStructure && userStructure.type === 'directionnelle') {
          next('/dashboard/structure_directionnelles')
        } else {
          next('/dashboard/structure')
        }
      } else if (store.getters.isTuteur) {
        next('/dashboard/tuteur')
      } else if (store.getters.isStagiaire) {
        next('/dashboard/stagiaire')
      } else if (store.getters.isAdmin) {
        next()
      } else {
        next('/login')
      }
    },
    children: [
      {
        path: '',
        name: 'DashboardOverview', 
        component: () => import('../views/dashboard/AdminDashboard.vue')
      },
      {
        path: 'demandes/en-attente',
        name: 'DemandesEnAttente',
        component: () => import('../views/dashboard/DemandesEnAttente.vue')
      },
      {
        path: 'demandes/en-cours',
        name: 'DemandesEnCours',
        component: () => import('../views/dashboard/DemandesEnCours.vue')
      },
      {
        path: 'demandes/historique',
        name: 'DemandesHistorique',
        component: () => import('../views/dashboard/DemandesHistorique.vue')
      },
      {
        path: 'structures',
        name: 'Structures',
        component: () => import('../views/dashboard/Structures.vue')
      },
      {
        path: 'services',
        name: 'Services',
        component: () => import('../views/dashboard/Services.vue')
      },
      {
        path: 'structures/:id',
        name: 'StructureDetails',
        component: () => import('../views/dashboard/StructureDetails.vue')
      },
      {
        path: 'tuteurs',
        name: 'Tuteurs',
        component: () => import('../views/dashboard/Tuteurs.vue')
      },
      {
        path: 'stagiaires',
        name: 'Stagiaires',
        component: () => import('../views/dashboard/Stagiaires.vue')
      },
      {
        path: 'parametres',
        name: 'Parametres',
        component: () => import('../views/dashboard/Parametres.vue')
      },
      {
        path: 'notifications',
        name: 'Notifications',
        component: () => import('../views/dashboard/Notifications.vue')
      }
    ]
  },
  {
    path: '/dashboard/stagiaire',
    component: () => import('../views/dashboard/stagiaire/StagiaireDashboard.vue'),
    meta: { requiresAuth: true },
    beforeEnter: (to, from, next) => {
      if (!store.getters.isAuthenticated) {
        next('/login')
      } else if (store.getters.isStagiaire) {
        next()
      } else {
        next('/login')
      }
    },
    children: [
      {
        path: '',
        name: 'StagiaireDashboard',
        component: () => import('../views/dashboard/stagiaire/Overview.vue')
      },
      {
        path: 'suivi',
        name: 'StagiaireSuivi',
        component: () => import('../views/dashboard/stagiaire/Suivi.vue')
      },
      {
        path: 'documents',
        name: 'StagiaireDocuments',
        component: () => import('../views/dashboard/stagiaire/Documents.vue')
      },
      
      {
        path: 'messages',
        name: 'StagiaireMessages',
        component: () => import('../views/dashboard/stagiaire/Messages.vue')
      },
      {
        path: 'notifications',
        name: 'StagiaireNotifications',
        component: () => import('../views/dashboard/stagiaire/Notifications.vue')
      },
      {
        path: 'parametres',
        name: 'StagiaireParametres',
        component: () => import('../views/dashboard/stagiaire/Parametres.vue')
      }
    ]
  },
  {
    path: '/dashboard/tuteur',
    component: () => import('@/views/dashboard/tuteur/TuteurDashboard.vue'),
    meta: { requiresAuth: true, role: 'tuteur' },
    children: [
      {
        path: '',
        name: 'TuteurHome',
        component: () => import('@/views/dashboard/tuteur/Overview.vue')
      },
      {
        path: 'stagiaires',
        name: 'TuteurStagiaires',
        component: () => import('@/views/dashboard/tuteur/Stagiaires.vue')
      },
      {
        path: 'sous-structure',
        name: 'TuteurSousStructure',
        component: () => import('@/views/dashboard/tuteur/SousStructure.vue')
      },
      {
        path: 'themes',
        name: 'TuteurThemes',
        component: () => import('@/views/dashboard/tuteur/Themes.vue')
      },
      {
        path: 'evaluation',
        name: 'TuteurEvaluation',
        component: () => import('@/views/dashboard/tuteur/Evaluation.vue')
      },
      {
        path: 'affectation',
        name: 'TuteurAffectation',
        component: () => import('@/views/dashboard/tuteur/Affectation.vue')
      },
      {
        path: 'notifications',
        name: 'TuteurNotifications',
        component: () => import('@/views/dashboard/tuteur/Notifications.vue')
      },
      {
        path: 'parametres',
        name: 'TuteurParametres',
        component: () => import('@/views/dashboard/tuteur/Parametres.vue')
      },
      // Ajout de la route messages
      {
        path: 'messages',
        name: 'TuteurMessages',
        component: () => import('@/views/dashboard/tuteur/Messages.vue')
      }
    ]
  },
  {
    path: '/dashboard/structure',
    component: () => import('../views/dashboard/structure/StructureDashboard.vue'),
    meta: { requiresAuth: true, requiresStructure: true },
    beforeEnter: (to, from, next) => {
      if (!store.getters.isStructure) {
        next('/login')
      } else {
        next()
      }
    },
    children: [
      {
        path: '',
        name: 'StructureOverview',
        component: () => import('../views/dashboard/structure/Overview.vue')
      },
      {
        path: 'stagiaires',
        name: 'StructureStagiaires',
        component: () => import('../views/dashboard/structure/Stagiaires.vue'),
        meta: {
          requiresAuth: true,
          role: 'structure'
        }
      },
      {
        path: 'tuteurs',
        name: 'StructureTuteurs',
        component: () => import('../views/dashboard/structure/Tuteurs.vue')
      },
      {
        path: 'sousStructures',
        name: 'StructureSousStructures',
        component: () => import('../views/dashboard/structure/SousStructures.vue')
      },
      {
        path: 'evaluations',
        name: 'StructureEvaluations',
        component: () => import('../views/dashboard/structure/Evaluations.vue')
      },
      {
        path: 'profil',
        name: 'StructureProfil',
        component: () => import('../views/dashboard/structure/Profil.vue')
      },
      {
        path: 'affectations',
        name: 'StructureAffectations',
        component: () => import('../views/dashboard/structure/Affectations.vue')
      },
      {
        path: 'parametres',
        name: 'StructureParametres',
        component: () => import('../views/dashboard/structure/Parametres.vue')
      },
      {
        path: 'notifications',
        name: 'StructureNotifications',
        component: () => import('../views/dashboard/structure/Notifications.vue')
      }
    ]
  },
  {
    path: '/dashboard/dpaf',
    component: () => import('../views/dashboard/DpafDashboard.vue'),
    meta: { requiresAuth: true, requiresDpaf: true },
    beforeEnter: (to, from, next) => {
      if (!store.getters.isDpaf) {
        next('/login')
      } else {
        next()
      }
    },
    children: [
      {
        path: '',
        name: 'DpafOverview',
        component: () => import('../views/dashboard/DpafDashboard.vue')
      },
      {
        path: 'toutes-demandes',
        name: 'ToutesDemandes',
        component: () => import('../views/dashboard/dpaf/ToutesDemandes.vue')
      },
      {
        path: 'nouvelles-demandes',
        name: 'NouvellesDemandes',
        component: () => import('../views/dashboard/dpaf/NouvellesDemandes.vue')
      },
      {
        path: 'affectations',
        name: 'Affectations', 
        component: () => import('../views/dashboard/dpaf/Affectations.vue')
      },
      {
        path: 'historique',
        name: 'DpafHistorique',
        component: () => import('../views/dashboard/dpaf/Historique.vue')
      },
      {
        path: 'statistiques',
        name: 'DpafStatistiques',
        component: () => import('../views/dashboard/dpaf/Statistiques.vue')
      },
      {
        path: 'evaluations',
        name: 'DpafEvaluations',
        component: () => import('../views/dashboard/dpaf/Evaluations.vue')
      },
      {
        path: 'parametres',
        name: 'DpafParametres',
        component: () => import('../views/dashboard/dpaf/Parametres.vue')
      },
      {
        path: 'notifications',
        name: 'DpafNotifications',
        component: () => import('../views/dashboard/Notifications.vue')
      },
      {
        path: 'profil',
        name: 'DpafProfil',
        component: () => import('../views/dashboard/dpaf/Profil.vue')
      }
    ]
  },
  {
    path: '/dashboard/structure_directionnelles',
    component: () => import('../views/dashboard/structure_directionnelles/DashboardStructureDirect.vue'),
    meta: { requiresAuth: true, requiresStructure: true },
    beforeEnter: (to, from, next) => {
      if (!store.getters.isStructureDirectionnelle) {
        next('/login')
      } else {
        next()
      }
    },
    children: [
      {
        path: '',
        name: 'StructureDirectionnelleOverview',
        component: () => import('../views/dashboard/structure_directionnelles/Overview.vue')
      },
      {
        path: 'stagiaires',
        name: 'StructureDirectionnelleStagiaires',
        component: () => import('../views/dashboard/structure_directionnelles/Stagiaires.vue')
      },
      {
        path: 'tuteurs',
        name: 'StructureDirectionnelleTuteurs',
        component: () => import('../views/dashboard/structure_directionnelles/Tuteurs.vue')
      },
      {
        path: 'sousStructures',
        name: 'StructureDirectionnelleSousStructures',
        component: () => import('../views/dashboard/structure_directionnelles/SousStructures.vue')
      },
      {
        path: 'evaluations',
        name: 'StructureDirectionnelleEvaluations',
        component: () => import('../views/dashboard/structure_directionnelles/Evaluations.vue')
      },
      {
        path: 'profil',
        name: 'StructureDirectionnelleProfil',
        component: () => import('../views/dashboard/structure_directionnelles/Profil.vue')
      },
      {
        path: 'affectations',
        name: 'StructureDirectionnelleAffectations',
        component: () => import('../views/dashboard/structure_directionnelles/Affectations.vue')
      },
      {
        path: 'parametres',
        name: 'StructureDirectionnelleParametres',
        component: () => import('../views/dashboard/structure_directionnelles/Parametres.vue')
      },
      {
        path: 'notifications',
        name: 'StructureDirectionnelleNotifications',
        component: () => import('../views/dashboard/structure_directionnelles/Notifications.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    // Always scroll to top
    return { top: 0 }
  }
})

export default router