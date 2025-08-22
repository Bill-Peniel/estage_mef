# Portail Universitaire

Un portail web moderne permettant aux universités de suivre leurs étudiants en stage et de récupérer les évaluations soumises par les tuteurs.

## Fonctionnalités

- **Tableau de bord** : Vue d'ensemble des étudiants et des statistiques
- **Gestion des étudiants** : Liste complète des étudiants en stage avec filtres
- **Évaluations** : Consultation des notes et évaluations des tuteurs
- **Rapports** : Génération de rapports détaillés
- **Paramètres** : Configuration du compte université

## Technologies utilisées

- **Vue.js 3** : Framework frontend
- **Vue Router** : Navigation et routage
- **Tailwind CSS** : Framework CSS utilitaire
- **Vite** : Build tool moderne

## Installation

```bash
# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm run dev

# Construire pour la production
npm run build
```

## Structure du projet

```
src/
├── views/           # Pages principales
│   ├── Home.vue     # Page d'accueil
│   ├── Login.vue    # Page de connexion
│   ├── Register.vue # Page d'inscription
│   ├── Dashboard.vue # Tableau de bord
│   ├── Students.vue # Gestion des étudiants
│   └── Evaluations.vue # Évaluations
├── router/          # Configuration des routes
├── assets/          # Ressources statiques
└── main.js         # Point d'entrée
```

## API Integration

Le portail est conçu pour s'intégrer avec votre API backend. Les points d'intégration principaux sont :

- **Authentification** : `/api/auth/login` et `/api/auth/register`
- **Étudiants** : `/api/students` pour récupérer la liste
- **Évaluations** : `/api/evaluations` pour les notes
- **Rapports** : `/api/reports` pour les statistiques

## Développement

Pour contribuer au projet :

1. Fork le repository
2. Créer une branche feature
3. Faire vos modifications
4. Tester avec `npm run test:unit`
5. Soumettre une pull request

## Licence

MIT License
