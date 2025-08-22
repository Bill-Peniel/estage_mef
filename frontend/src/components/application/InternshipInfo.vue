<template>
  <div class="bg-white rounded-lg shadow-lg p-4 sm:p-6 border-t-4 border-primary">
    <h2 class="text-xl sm:text-2xl font-bold text-primary-dark mb-6 relative pb-2">
      Informations du Stage
      <span class="absolute bottom-0 left-0 w-16 h-1 bg-primary-light"></span>
    </h2>

    <!-- Message d'erreur -->
    <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      {{ error }}
    </div>

    <!-- Indicateur de chargement -->
    <div v-if="loading" class="flex justify-center items-center py-4">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>

    <div v-else>
      <!-- Accordion pour le candidat principal -->
      <div class="mb-6">
      <button 
        @click="toggleAccordion('candidat1')" 
          class="w-full p-4 text-left bg-gray-50 hover:bg-gray-100 flex justify-between items-center rounded-lg"
      >
        <span class="text-lg font-semibold flex items-center">
          <i class="fas fa-user text-primary-light mr-2"></i>
            Candidat Principal
        </span>
        <i :class="['fas', accordionStates.candidat1 ? 'fa-chevron-up' : 'fa-chevron-down']"></i>
      </button>

      <div v-show="accordionStates.candidat1" class="p-4 space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Type de stage -->
          <div class="form-group md:col-span-2">
            <label for="internshipType" class="form-label">Type de stage <span class="text-red-600">*</span></label>
            <select 
              id="internshipType"
              v-model="form.internshipType"
              class="input-field"
              required
            >
              <option value="" disabled>Sélectionnez le type de stage</option>
              <option value="academique">Stage académique</option>
              <option value="professionnel">Stage professionnel</option>
            </select>
          </div>

          <!-- Département -->
          <div class="form-group md:col-span-2">
              <label for="department" class="form-label">Département préféré <span class="text-red-600">*</span></label>
            <select 
              id="department"
              v-model="form.department"
              class="input-field"
              required
            >
                <option value="" disabled>Sélectionnez votre département préféré</option>
                <option v-for="structure in structures" 
                        :key="structure.id" 
                        :value="structure.id">
                  {{ structure.nom }}
                </option>
            </select>
              <p class="text-sm text-gray-500 mt-1">Note: La DPAF se réserve le droit d'affecter le stagiaire à un autre département selon les besoins et disponibilités.</p>
          </div>

          <!-- Dates de stage -->
          <div class="form-group">
            <label for="startDate" class="form-label">Date de début <span class="text-red-600">*</span></label>
            <input 
              type="date"
              id="startDate"
              v-model="form.startDate"
              :min="minStartDate"
              class="input-field"
              required
            >
            <p v-if="dateError" class="text-red-500 text-sm mt-1">{{ dateError }}</p>
          </div>

          <div class="form-group">
            <label for="endDate" class="form-label">Date de fin <span class="text-red-600">*</span></label>
            <input 
              type="date"
              id="endDate"
              v-model="form.endDate"
              :min="form.startDate || minStartDate"
              class="input-field"
              required
            >
            <p v-if="dateError" class="text-red-500 text-sm mt-1">{{ dateError }}</p>
          </div>

          <!-- Université -->
          <div class="form-group" v-if="form.internshipType !== 'professionnel'">
            <label for="universityName" class="form-label">Établissement <span class="text-red-600">*</span></label>
            <input 
              type="text"
              id="universityName"
              v-model="form.universityName"
              class="input-field"
              required
              placeholder="Nom de votre établissement"
            >
          </div>

          <!-- Domaine d'études -->
          <div class="form-group" v-if="form.internshipType !== 'professionnel'">
            <label for="studyField" class="form-label">Domaine d'études <span class="text-red-600">*</span></label>
            <input 
              type="text"
              id="studyField"
              v-model="form.studyField"
              class="input-field"
              required
              placeholder="Votre domaine d'études"
            >
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
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Type de stage -->
            <div class="form-group md:col-span-2">
              <label :for="'internshipType' + (index + 2)" class="form-label">Type de stage <span class="text-red-600">*</span></label>
              <select 
                :id="'internshipType' + (index + 2)"
                v-model="member.internshipType"
                class="input-field"
                required
              >
                <option value="" disabled>Sélectionnez le type de stage</option>
                <option value="academique">Stage académique</option>
                <option value="professionnel">Stage professionnel</option>
                <option value="fin_etudes">Stage de fin d'études</option>
              </select>
            </div>

            <!-- Université -->
            <div class="form-group" v-if="member.internshipType !== 'professionnel'">
              <label :for="'universityName' + (index + 2)" class="form-label">Établissement <span class="text-red-600">*</span></label>
              <input 
                type="text"
                :id="'universityName' + (index + 2)"
                v-model="member.universityName"
                class="input-field"
                required
                placeholder="Nom de votre établissement"
              >
            </div>

            <!-- Domaine d'études -->
            <div class="form-group" v-if="member.internshipType !== 'professionnel'">
              <label :for="'studyField' + (index + 2)" class="form-label">Domaine d'études <span class="text-red-600">*</span></label>
              <input 
                type="text"
                :id="'studyField' + (index + 2)"
                v-model="member.studyField"
                class="input-field"
                required
                placeholder="Votre domaine d'études"
              >
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
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useStore } from 'vuex'
import { tuteurService } from '@/services/api'
import { authService } from '@/services/api'

export default {
  name: 'InternshipInfo',
  setup() {
    const store = useStore()
    const accordionStates = ref({
      candidat1: true
    })
    const structures = ref([])
    const loading = ref(false)
    const error = ref(null)
    const dateError = ref('')

    const stageType = computed(() => store.state.applicationForm.personalInfo.stageType)
    const groupMembers = computed(() => store.state.applicationForm.personalInfo.groupMembers)

    const form = ref({
      internshipType: '',
      department: '',
      startDate: '',
      endDate: '',
      universityName: '',
      studyField: ''
    })

    // Utility function to format dates consistently
    const formatDate = (date) => {
      if (!date) return ''
      try {
        const dateObj = new Date(date)
        if (isNaN(dateObj.getTime())) return ''
        return dateObj.toLocaleDateString('fr-FR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        }).split('/').join('-')
      } catch (error) {
        console.error('Error formatting date:', error)
        return ''
      }
    }

    // Utility function to convert to ISO format for storage
    const toISODate = (date) => {
      if (!date) return ''
      try {
        const dateObj = new Date(date)
        if (isNaN(dateObj.getTime())) return ''
        return dateObj.toISOString().split('T')[0]
      } catch (error) {
        console.error('Error converting to ISO date:', error)
        return ''
      }
    }

    // Calculer la date minimale (aujourd'hui)
    const minStartDate = computed(() => {
      const today = new Date()
      return toISODate(today)
    })

    // Fonction pour valider une date
    const validateDate = (date) => {
      if (!date) return true
      const dateObj = new Date(date)
      return !isNaN(dateObj.getTime())
    }

    // Surveiller les changements de dates
    watch(
      [() => form.value.startDate, () => form.value.endDate],
      ([newStartDate, newEndDate]) => {
        dateError.value = ''
        
        // Ne valider que si les deux dates sont complètes
        if (validateDate(newStartDate) && validateDate(newEndDate)) {
          const start = new Date(newStartDate)
          const end = new Date(newEndDate)
          const today = new Date()
          today.setHours(0, 0, 0, 0)

          if (start < today) {
            dateError.value = 'La date de début ne peut pas être antérieure à aujourd\'hui'
            return
          }
          
          if (end < start) {
            dateError.value = 'La date de fin ne peut pas être antérieure à la date de début'
            return
          }
        }
      },
      { deep: true }
    )

    // Charger les structures depuis l'API
    const loadStructures = async () => {
      try {
        loading.value = true
        error.value = null
        console.log('Chargement des structures...')

        // Vérifier si l'utilisateur est authentifié
        if (!authService.isAuthenticated()) {
          throw new Error('Vous devez être connecté pour accéder aux structures')
        }

        const response = await tuteurService.getStructures()
        console.log('Réponse des structures:', response)
        
        if (Array.isArray(response)) {
          structures.value = response.map(structure => ({
            id: structure.id,
            nom: structure.nomStructure || structure.nom
          }))
          console.log('Structures chargées:', structures.value)
        } else {
          console.error('Format de réponse invalide:', response)
          error.value = 'Format de données invalide'
        }
      } catch (err) {
        console.error('Erreur lors du chargement des structures:', err)
        error.value = err.message || 'Erreur lors du chargement des structures'
      } finally {
        loading.value = false
      }
    }

    // Charger les structures au montage du composant
    onMounted(async () => {
      console.log('Composant monté, chargement des structures...')
      await loadStructures()
    })

    const toggleAccordion = (accordion) => {
      accordionStates.value[accordion] = !accordionStates.value[accordion]
    }

    const previousStep = () => {
      store.commit('previousStep')
    }

    const nextStep = () => {
      // Vérifier les dates avant de passer à l'étape suivante
      if (form.value.startDate && form.value.endDate) {
        const start = new Date(form.value.startDate)
        const end = new Date(form.value.endDate)
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        if (start < today) {
          dateError.value = 'La date de début ne peut pas être antérieure à aujourd\'hui'
          return
        }

        if (end < start) {
          dateError.value = 'La date de fin ne peut pas être antérieure à la date de début'
          return
        }

        // Format dates before storing (in ISO format)
        const formattedData = {
          ...form.value,
          startDate: toISODate(form.value.startDate),
          endDate: toISODate(form.value.endDate)
        }
        store.commit('updateInternshipInfo', formattedData)
      } else {
      store.commit('updateInternshipInfo', form.value)
      }
      store.commit('nextStep')
    }

    return {
      form,
      stageType,
      groupMembers,
      accordionStates,
      structures,
      loading,
      error,
      dateError,
      minStartDate,
      formatDate,
      toISODate,
      validateDate,
      toggleAccordion,
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
  @apply bg-primary text-white rounded-md hover:bg-primary-700 transition duration-200;
}

.btn-secondary {
  @apply bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition duration-200;
}
</style>
