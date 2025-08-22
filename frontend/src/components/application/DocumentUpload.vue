<template>
  <div class="bg-white rounded-lg shadow-lg p-4 sm:p-6 border-t-4 border-primary">
    <h2 class="text-xl sm:text-2xl font-bold text-primary-dark mb-6 relative pb-2">
      Documents requis
      <span class="absolute bottom-0 left-0 w-16 h-1 bg-primary-light"></span>
    </h2>

    <!-- Candidat Principal -->
    <div class="form-group border rounded-lg overflow-hidden mb-6">
      <button 
        type="button"
        @click="toggleAccordion('candidat1')" 
        class="w-full p-4 text-left bg-gray-50 hover:bg-gray-100 flex justify-between items-center"
      >
        <span class="text-lg font-semibold flex items-center">
          <i class="fas fa-user text-primary-light mr-2"></i>
          Candidat 1 (Principal)
        </span>
        <i :class="['fas', accordionStates.candidat1 ? 'fa-chevron-up' : 'fa-chevron-down']"></i>
      </button>

      <div v-show="accordionStates.candidat1" class="p-4 space-y-4">
        <div class="grid grid-cols-1 gap-4">
          <!-- CV -->
          <div class="form-group">
            <label for="cv" class="form-label">CV <span class="text-red-600">*</span></label>
            <input 
              type="file"
              id="cv"
              @change="handleFileUpload($event, 'cv')"
              class="input-field"
              accept=".pdf,.doc,.docx"
              required
            >
            <p v-if="documents.cv" class="mt-2 text-sm text-green-600">
              <i class="fas fa-check-circle mr-1"></i> Fichier téléchargé : {{ documents.cv.name }}
            </p>
          </div>

          <!-- Lettre de motivation -->
          <div class="form-group">
            <label for="coverLetter" class="form-label">Lettre de motivation <span class="text-red-600">*</span></label>
            <input 
              type="file"
              id="coverLetter"
              @change="handleFileUpload($event, 'coverLetter')"
              class="input-field"
              accept=".pdf,.doc,.docx"
              required
            >
            <p v-if="documents.coverLetter" class="mt-2 text-sm text-green-600">
              <i class="fas fa-check-circle mr-1"></i> Fichier téléchargé : {{ documents.coverLetter.name }}
            </p>
          </div>

          <!-- Lettre de recommandation -->
          <div class="form-group">
            <label for="recommendation" class="form-label">Lettre de recommandation</label>
            <input 
              type="file"
              id="recommendation"
              @change="handleFileUpload($event, 'recommendation')"
              class="input-field"
              accept=".pdf,.doc,.docx"
            >
            <p v-if="documents.recommendation" class="mt-2 text-sm text-green-600">
              <i class="fas fa-check-circle mr-1"></i> Fichier téléchargé : {{ documents.recommendation.name }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Candidats supplémentaires pour binôme/groupe -->
    <template v-if="stageType === 'binome' || stageType === 'groupe'">
      <div v-for="(member, index) in groupMembers" :key="index" class="form-group border rounded-lg overflow-hidden mb-6">
        <button 
          type="button"
          @click="toggleAccordion(`candidat${index + 2}`)" 
          class="w-full p-4 text-left bg-gray-50 hover:bg-gray-100 flex justify-between items-center"
        >
          <span class="text-lg font-semibold flex items-center">
            <i class="fas fa-user-friends text-primary-light mr-2"></i>
            Candidat {{ index + 2 }}
          </span>
          <i :class="['fas', accordionStates[`candidat${index + 2}`] ? 'fa-chevron-up' : 'fa-chevron-down']"></i>
        </button>

        <div v-show="accordionStates[`candidat${index + 2}`]" class="p-4 space-y-4">
          <div class="grid grid-cols-1 gap-4">
            <!-- CV -->
            <div class="form-group">
              <label :for="'cv' + (index + 2)" class="form-label">CV <span class="text-red-600">*</span></label>
              <input 
                type="file"
                :id="'cv' + (index + 2)"
                @change="handleGroupMemberFileUpload($event, index, 'cv')"
                class="input-field"
                accept=".pdf,.doc,.docx"
                required
              >
              <p v-if="documents.groupMembersDocuments[index]?.cv" class="mt-2 text-sm text-green-600">
                <i class="fas fa-check-circle mr-1"></i> Fichier téléchargé : {{ documents.groupMembersDocuments[index].cv.name }}
              </p>
            </div>

            <!-- Lettre de motivation -->
            <div class="form-group">
              <label :for="'coverLetter' + (index + 2)" class="form-label">Lettre de motivation <span class="text-red-600">*</span></label>
              <input 
                type="file"
                :id="'coverLetter' + (index + 2)"
                @change="handleGroupMemberFileUpload($event, index, 'coverLetter')"
                class="input-field"
                accept=".pdf,.doc,.docx"
                required
              >
              <p v-if="documents.groupMembersDocuments[index]?.coverLetter" class="mt-2 text-sm text-green-600">
                <i class="fas fa-check-circle mr-1"></i> Fichier téléchargé : {{ documents.groupMembersDocuments[index].coverLetter.name }}
              </p>
            </div>

            <!-- Lettre de recommandation -->
            <div class="form-group">
              <label :for="'recommendation' + (index + 2)" class="form-label">Lettre de recommandation</label>
              <input 
                type="file"
                :id="'recommendation' + (index + 2)"
                @change="handleGroupMemberFileUpload($event, index, 'recommendation')"
                class="input-field"
                accept=".pdf,.doc,.docx"
              >
              <p v-if="documents.groupMembersDocuments[index]?.recommendation" class="mt-2 text-sm text-green-600">
                <i class="fas fa-check-circle mr-1"></i> Fichier téléchargé : {{ documents.groupMembersDocuments[index].recommendation.name }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- Navigation buttons -->
    <div class="mt-8 flex justify-between items-center">
      <button 
        @click="previousStep" 
        class="btn-secondary px-6 py-2"
      >
        <i class="fas fa-arrow-left mr-2"></i> Précédent
      </button>
      <button 
        @click="nextStep"
        class="btn-primary px-6 py-2"
      >
        Suivant <i class="fas fa-arrow-right ml-2"></i>
      </button>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'DocumentUpload',
  setup() {
    const store = useStore()
    const accordionStates = ref({
      candidat1: true
    })

    const stageType = computed(() => store.state.applicationForm.personalInfo.stageType)
    const groupMembers = computed(() => store.state.applicationForm.personalInfo.groupMembers)

    // Initialiser les documents depuis le store
    const documents = ref({
      cv: store.state.applicationForm.documents.cv,
      coverLetter: store.state.applicationForm.documents.coverLetter,
      recommendation: store.state.applicationForm.documents.recommendation,
      groupMembersDocuments: []
    })

    const toggleAccordion = (accordion) => {
      accordionStates.value[accordion] = !accordionStates.value[accordion]
    }

    const handleFileUpload = (event, documentType) => {
      const file = event.target.files[0]
      if (file) {
        console.log(`Fichier ${documentType} téléchargé:`, {
          name: file.name,
          type: file.type,
          size: file.size,
          isFile: file instanceof File
        })
        
        // Vérifier la taille du fichier (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          alert(`Le fichier ${file.name} est trop volumineux. La taille maximale est de 5MB.`)
          return
        }
        
        // Vérifier le type de fichier
        const allowedTypes = ['.pdf', '.doc', '.docx']
        const fileExtension = '.' + file.name.split('.').pop().toLowerCase()
        if (!allowedTypes.includes(fileExtension)) {
          alert(`Le type de fichier ${fileExtension} n'est pas autorisé. Types acceptés: ${allowedTypes.join(', ')}`)
          return
        }
        
        // Mettre à jour les documents localement
        documents.value[documentType] = file
        
        // Mettre à jour le store immédiatement
        const updatedDocuments = {
          ...store.state.applicationForm.documents,
          [documentType]: file
        }
        store.commit('updateDocuments', updatedDocuments)
        
        // Log de confirmation
        console.log(`Document ${documentType} mis à jour dans le store:`, {
          name: file.name,
          type: file.type,
          size: file.size
        })
      }
    }

    const handleGroupMemberFileUpload = (event, memberIndex, documentType) => {
      const file = event.target.files[0]
      if (file) {
        console.log(`Fichier ${documentType} pour le membre ${memberIndex + 2} téléchargé:`, {
          name: file.name,
          type: file.type,
          size: file.size,
          isFile: file instanceof File
        })
        
        // Vérifier la taille du fichier (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          alert(`Le fichier ${file.name} est trop volumineux. La taille maximale est de 5MB.`)
          return
        }
        
        // Vérifier le type de fichier
        const allowedTypes = ['.pdf', '.doc', '.docx']
        const fileExtension = '.' + file.name.split('.').pop().toLowerCase()
        if (!allowedTypes.includes(fileExtension)) {
          alert(`Le type de fichier ${fileExtension} n'est pas autorisé. Types acceptés: ${allowedTypes.join(', ')}`)
          return
        }
        
        // Mettre à jour les documents localement
        if (!documents.value.groupMembersDocuments[memberIndex]) {
          documents.value.groupMembersDocuments[memberIndex] = {}
        }
        documents.value.groupMembersDocuments[memberIndex][documentType] = file
        
        // Mettre à jour le store immédiatement
        const updatedDocuments = {
          ...store.state.applicationForm.documents,
          groupMembersDocuments: [...documents.value.groupMembersDocuments]
        }
        store.commit('updateDocuments', updatedDocuments)
        
        // Log de confirmation
        console.log(`Document ${documentType} pour le membre ${memberIndex + 2} mis à jour dans le store:`, {
          name: file.name,
          type: file.type,
          size: file.size
        })
      }
    }

    const previousStep = () => {
      store.commit('previousStep')
    }

    const nextStep = () => {
      // Vérifier que les documents obligatoires sont présents
      if (!documents.value.cv || !(documents.value.cv instanceof File)) {
        alert('Le CV est requis et doit être un fichier valide')
        return
      }
      if (!documents.value.coverLetter || !(documents.value.coverLetter instanceof File)) {
        alert('La lettre de motivation est requise et doit être un fichier valide')
        return
      }
      
      // Log des documents avant de passer à l'étape suivante
      console.log('Documents avant validation:', {
        cv: documents.value.cv instanceof File ? {
          name: documents.value.cv.name,
          type: documents.value.cv.type,
          size: documents.value.cv.size
        } : null,
        coverLetter: documents.value.coverLetter instanceof File ? {
          name: documents.value.coverLetter.name,
          type: documents.value.coverLetter.type,
          size: documents.value.coverLetter.size
        } : null
      })
      
      // Mettre à jour le store une dernière fois avant de passer à l'étape suivante
      store.commit('updateDocuments', documents.value)
      store.commit('nextStep')
    }

    return {
      stageType,
      groupMembers,
      documents,
      accordionStates,
      toggleAccordion,
      handleFileUpload,
      handleGroupMemberFileUpload,
      previousStep,
      nextStep
    }
  }
}
</script>

<style scoped>
.input-field {
  @apply w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-300 focus:border-primary outline-none transition duration-200;
}

.form-label {
  @apply block text-sm font-medium text-gray-700 mb-1;
}

.btn-primary {
  @apply bg-primary text-white rounded-md hover:bg-primary-600 transition duration-200;
}

.btn-secondary {
  @apply bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition duration-200;
}
</style>