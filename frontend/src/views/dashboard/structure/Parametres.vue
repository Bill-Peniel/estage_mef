
<template>
  <div class="p-6">
    <div class="bg-white shadow rounded-lg">
      <div class="px-6 py-4 border-b border-gray-200">
        <h2 class="text-xl font-semibold text-gray-800">Paramètres de la structure</h2>
      </div>

      <div class="p-6">
        <!-- Informations de la structure -->
        <div class="mb-8">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Informations générales</h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Nom de la structure</label>
              <input type="text" v-model="settings.nomStructure" class="mt-1 input-field" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Email de contact</label>
              <input type="email" v-model="settings.emailContact" class="mt-1 input-field" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Téléphone</label>
              <input type="tel" v-model="settings.telephone" class="mt-1 input-field" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Adresse</label>
              <input type="text" v-model="settings.adresse" class="mt-1 input-field" />
            </div>
          </div>
        </div>

        <!-- Préférences de notification -->
        <div class="mb-8">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Préférences de notification</h3>
          <div class="space-y-4">
            <div class="flex items-center">
              <input type="checkbox" v-model="settings.notifNouveauStagiaire" class="h-4 w-4 text-primary border-gray-300 rounded" />
              <label class="ml-2 block text-sm text-gray-900">Nouveau stagiaire</label>
            </div>
            <div class="flex items-center">
              <input type="checkbox" v-model="settings.notifEvaluation" class="h-4 w-4 text-primary border-gray-300 rounded" />
              <label class="ml-2 block text-sm text-gray-900">Évaluation en attente</label>
            </div>
            <div class="flex items-center">
              <input type="checkbox" v-model="settings.notifFinStage" class="h-4 w-4 text-primary border-gray-300 rounded" />
              <label class="ml-2 block text-sm text-gray-900">Fin de stage</label>
            </div>
          </div>
        </div>

        <!-- Boutons d'action -->
        <div class="flex justify-end space-x-3">
          <button @click="resetSettings" class="btn-outline">
            Réinitialiser
          </button>
          <button @click="saveSettings" class="btn-primary">
            Enregistrer les modifications
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'StructureParametres',
  setup() {
    const settings = ref({
      nomStructure: 'Structure Test SARL',
      emailContact: 'contact@structuretest.com',
      telephone: '+229 33333333',
      adresse: 'Cotonou, Bénin',
      notifNouveauStagiaire: true,
      notifEvaluation: true,
      notifFinStage: true
    })

    const saveSettings = async () => {
      try {
        // Implémenter la sauvegarde des paramètres
        console.log('Saving settings:', settings.value)
        // Ajouter l'appel API ici
      } catch (error) {
        console.error('Error saving settings:', error)
      }
    }

    const resetSettings = () => {
      settings.value = {
        nomStructure: 'Structure Test SARL',
        emailContact: 'contact@structuretest.com',
        telephone: '+229 33333333',
        adresse: 'Cotonou, Bénin',
        notifNouveauStagiaire: true,
        notifEvaluation: true,
        notifFinStage: true
      }
    }

    return {
      settings,
      saveSettings,
      resetSettings
    }
  }
}
</script>
