<template>
  <div class="bg-white rounded-lg shadow-lg p-4 sm:p-6 border-t-4 border-primary">
    <h2 class="text-xl sm:text-2xl font-bold text-primary-dark mb-6 relative pb-2">
      Résumé de votre demande
      <span class="absolute bottom-0 left-0 w-16 h-1 bg-primary-light"></span>
    </h2>

    <!-- Informations générales -->
    <div class="mb-6 p-4 bg-gray-50 rounded-lg">
      <h3 class="text-lg font-semibold text-primary mb-4">Informations générales du stage</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p class="text-gray-600">Type de stage</p>
          <p class="font-medium">{{ internshipInfo.internshipType === 'academique' ? 'Stage académique' : 
            internshipInfo.internshipType === 'professionnel' ? 'Stage professionnel' : 'Stage de fin d\'études' }}</p>
        </div>
        <div>
          <p class="text-gray-600">Département</p>
          <p class="font-medium">{{ getDepartmentLabel(internshipInfo.department) }}</p>
          <p class="text-sm text-gray-500">(Préférence exprimée)</p>
        </div>
        <div>
          <p class="text-gray-600">Date de début</p>
          <p class="font-medium">{{ formatDate(internshipInfo.startDate) }}</p>
        </div>
        <div>
          <p class="text-gray-600">Date de fin</p>
          <p class="font-medium">{{ formatDate(internshipInfo.endDate) }}</p>
        </div>
      </div>
    </div>

    <!-- Candidat Principal -->
    <div class="mb-6">
      <h3 class="text-lg font-semibold text-primary mb-4">Candidat Principal</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
        <div>
          <p class="text-gray-600">Nom complet</p>
          <p class="font-medium">{{ personalInfo.firstName }} {{ personalInfo.lastName }}</p>
        </div>
        <div>
          <p class="text-gray-600">Email</p>
          <p class="font-medium">{{ personalInfo.email }}</p>
        </div>
        <div>
          <p class="text-gray-600">Téléphone</p>
          <p class="font-medium">{{ personalInfo.phone }}</p>
        </div>
        <div>
          <p class="text-gray-600">Date de naissance</p>
          <p class="font-medium">{{ formatDate(personalInfo.dateOfBirth) }}</p>
        </div>
        <div>
          <p class="text-gray-600">Nationalité</p>
          <p class="font-medium">{{ personalInfo.nationality }}</p>
        </div>
        <div>
          <p class="text-gray-600">Niveau d'études</p>
          <p class="font-medium">{{ personalInfo.educationLevel }}</p>
        </div>
      </div>
    </div>

    <!-- Autres Candidats (pour binôme/groupe) -->
    <template v-if="personalInfo.stageType === 'binome' || personalInfo.stageType === 'groupe'">
      <div v-for="(member, index) in personalInfo.groupMembers" :key="index" class="mb-6">
        <h3 class="text-lg font-semibold text-primary mb-4">Candidat {{ index + 2 }}</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
          <div>
            <p class="text-gray-600">Nom complet</p>
            <p class="font-medium">{{ member.firstName }} {{ member.lastName }}</p>
          </div>
          <div>
            <p class="text-gray-600">Email</p>
            <p class="font-medium">{{ member.email }}</p>
          </div>
          <div>
            <p class="text-gray-600">Téléphone</p>
            <p class="font-medium">{{ member.phone }}</p>
          </div>
          <div>
            <p class="text-gray-600">Date de naissance</p>
            <p class="font-medium">{{ formatDate(member.dateOfBirth) }}</p>
          </div>
          <div>
            <p class="text-gray-600">Nationalité</p>
            <p class="font-medium">{{ member.nationality }}</p>
          </div>
          <div>
            <p class="text-gray-600">Niveau d'études</p>
            <p class="font-medium">{{ member.educationLevel }}</p>
          </div>
        </div>
      </div>
    </template>

    <!-- Message de succès -->
    <div v-if="submissionResult && submissionResult.success" class="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
      <p class="text-green-700 font-medium">{{ submissionResult.message }}</p>
      <p class="text-green-600 mt-2">Un code unique a été envoyé à votre adresse email ({{ personalInfo.email }}). Conservez ce code pour suivre l'état de votre demande.</p>
    </div>

    <!-- Navigation buttons -->
    <div class="mt-8 flex justify-between items-center">
      <button 
        @click="previousStep" 
        class="btn-secondary px-6 py-2"
      >
        <i class="fas fa-arrow-left mr-2"></i> Précédent
      </button>
      <button 
        @click="submitApplication"
        class="btn-primary px-6 py-2"
        :disabled="isSubmitting"
      >
        <span v-if="isSubmitting">
          <i class="fas fa-circle-notch fa-spin mr-2"></i>
          Soumission en cours...
        </span>
        <span v-else>
          Soumettre <i class="fas fa-check ml-2"></i>
        </span>
      </button>
    </div>
  </div>
</template>

<script>
import { computed, ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { tuteurService } from '@/services/api'


export default {
  name: 'Summary',
  setup() {
    const store = useStore()
    const router = useRouter()
    const structures = ref([])

    const personalInfo = computed(() => store.state.applicationForm.personalInfo)
    const internshipInfo = computed(() => store.state.applicationForm.internshipInfo)
    const isSubmitting = computed(() => store.state.applicationForm.isSubmitting)

    // Fonction pour charger les structures
    const loadStructures = async () => {
      try {
        const response = await tuteurService.getStructures();
        if (Array.isArray(response)) {
          structures.value = response.map(structure => ({
            id: structure.id,
            nom: structure.nomStructure || structure.nom
          }));
        }
      } catch (error) {
        console.error('Erreur lors du chargement des structures:', error);
      }
    };

    // Fonction pour obtenir le nom du département
    const getDepartmentLabel = (departmentId) => {
      if (!departmentId) return 'Non spécifié';
      const structure = structures.value.find(s => s.id == departmentId);
      return structure ? structure.nom : `Département ${departmentId}`;
    };

    const formatDate = (date) => {
      if (!date) return ''
      return new Date(date).toLocaleDateString('fr-FR')
    }

    const previousStep = () => {
      store.commit('previousStep')
    }

    const submissionResult = computed(() => store.state.applicationForm.submissionResult)

    // Charger les structures au montage du composant
    onMounted(async () => {
      await loadStructures();
    });

    const submitApplication = async () => {
      try {
        await store.dispatch('submitApplication')
        // Scroll to top to show success message
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } catch (error) {
        console.error('Erreur lors de la soumission:', error)
        store.commit('setSubmissionResult', {
          success: false,
          message: error.message || 'Une erreur est survenue lors de la soumission'
        })
      }
    }

    return {
      submissionResult,
      personalInfo,
      internshipInfo,
      isSubmitting,
      formatDate,
      getDepartmentLabel,
      previousStep,
      submitApplication
    }
  }
}
</script>

<style scoped>
.btn-primary {
  @apply bg-primary text-white rounded-md hover:bg-primary-600 transition duration-200;
}

.btn-secondary {
  @apply bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition duration-200;
}
</style>