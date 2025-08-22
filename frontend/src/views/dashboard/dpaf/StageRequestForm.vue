<template>
  <div class="p-6">
    <h1 class="text-2xl text-green-800 font-bold mb-6">Nouvelle demande de stage</h1>

    <form @submit.prevent="submitForm" class="space-y-6">
      <!-- Informations de l'étudiant -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <h2 class="text-lg font-semibold mb-4">Informations de l'étudiant</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Nom complet
            </label>
            <input type="text" v-model="formData.studentName" required
                   class="input-field" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Numéro étudiant
            </label>
            <input type="text" v-model="formData.studentId" required
                   class="input-field" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input type="email" v-model="formData.email" required
                   class="input-field" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Téléphone
            </label>
            <input type="tel" v-model="formData.phone"
                   class="input-field" />
          </div>
        </div>
      </div>

      <!-- Informations du stage -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <h2 class="text-lg font-semibold mb-4">Informations du stage</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Structure d'accueil
            </label>
            <input type="text" v-model="formData.organization" required
                   class="input-field" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Type de stage
            </label>
            <select v-model="formData.stageType" required class="input-field">
              <option value="">Sélectionnez un type</option>
              <option value="initiation">Stage d'initiation</option>
              <option value="perfectionnement">Stage de perfectionnement</option>
              <option value="fin_etudes">Stage de fin d'études</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Date de début
            </label>
            <input type="date" v-model="formData.startDate" required
                   class="input-field" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Date de fin
            </label>
            <input type="date" v-model="formData.endDate" required
                   class="input-field" />
          </div>

          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Description du stage
            </label>
            <textarea v-model="formData.description" required
                      class="input-field h-32" 
                      placeholder="Décrivez les objectifs et les tâches du stage..."></textarea>
          </div>
        </div>
      </div>

      <!-- Documents requis -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <h2 class="text-lg font-semibold mb-4">Documents requis</h2>
        
        <div class="space-y-4">
          <div v-for="(doc, index) in requiredDocuments" :key="index" class="flex items-center gap-4">
            <label class="flex-1">
              <span class="block text-sm font-medium text-gray-700 mb-1">
                {{ doc.name }}
              </span>
              <input type="file" 
                     @change="handleFileUpload($event, doc.name)"
                     class="input-field" 
                     :required="!uploadedFiles[doc.name]" />
            </label>
            <div v-if="uploadedFiles[doc.name]" class="text-green-600">
              <i class="fas fa-check-circle"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- Boutons d'action -->
      <div class="flex justify-end gap-4">
        <button type="button" @click="resetForm" 
                class="btn-outline">
          Réinitialiser
        </button>
        <button type="submit" 
                class="btn-primary"
                :disabled="loading">
          <span v-if="loading" class="mr-2">
            <i class="fas fa-spinner fa-spin"></i>
          </span>
          Soumettre la demande
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import { settingsService } from '@/services/settings.service'
import { stageRequestService } from '@/services/api'

export default {
  name: 'StageRequestForm',
  setup() {
    const toast = useToast()
    const loading = ref(false)
    const requiredDocuments = ref([])
    const uploadedFiles = ref({})

    const formData = ref({
      studentName: '',
      studentId: '',
      email: '',
      phone: '',
      organization: '',
      stageType: '',
      startDate: '',
      endDate: '',
      description: ''
    })

    const fetchRequiredDocuments = async () => {
      try {
        const settings = await settingsService.getSettings()
        requiredDocuments.value = settings.documents
      } catch (error) {
        console.error('Erreur lors du chargement des documents requis:', error)
        toast.error('Erreur lors du chargement des documents requis')
      }
    }

    const handleFileUpload = (event, docName) => {
      const file = event.target.files[0]
      if (file) {
        // Vérifier la taille du fichier (50MB max)
        if (file.size > 50 * 1024 * 1024) {
          toast.error(`Le fichier ${file.name} dépasse la taille maximale de 50MB`)
          event.target.value = null
          return
        }
        uploadedFiles.value[docName] = file
      }
    }

    const resetForm = () => {
      formData.value = {
        studentName: '',
        studentId: '',
        email: '',
        phone: '',
        organization: '',
        stageType: '',
        startDate: '',
        endDate: '',
        description: ''
      }
      uploadedFiles.value = {}
    }

    const submitForm = async () => {
      try {
        loading.value = true

        // Vérifier que tous les documents requis sont fournis
        const missingDocs = requiredDocuments.value.filter(
          doc => !uploadedFiles.value[doc.name]
        )

        if (missingDocs.length > 0) {
          toast.error('Veuillez fournir tous les documents requis')
          return
        }

        // Créer un objet FormData pour l'envoi des fichiers
        const formDataToSend = new FormData()
        
        // Ajouter les informations du formulaire
        Object.keys(formData.value).forEach(key => {
          formDataToSend.append(key, formData.value[key])
        })

        // Ajouter les fichiers
        Object.entries(uploadedFiles.value).forEach(([docName, file]) => {
          formDataToSend.append(docName, file)
        })

        // Envoyer la demande avec retry automatique
        const response = await stageRequestService.createStageRequest(formDataToSend)
        
        if (response.success) {
          toast.success('Demande de stage soumise avec succès')
          resetForm()
        } else {
          throw new Error(response.message || 'Erreur lors de la soumission')
        }
      } catch (error) {
        console.error('Erreur lors de la soumission de la demande:', error)
        toast.error(error.message || 'Erreur lors de la soumission de la demande')
      } finally {
        loading.value = false
      }
    }

    onMounted(() => {
      fetchRequiredDocuments()
    })

    return {
      formData,
      loading,
      requiredDocuments,
      uploadedFiles,
      handleFileUpload,
      resetForm,
      submitForm
    }
  }
}
</script> 