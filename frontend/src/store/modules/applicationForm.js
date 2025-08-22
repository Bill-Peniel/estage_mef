import axios from 'axios'

const state = {
  personalInfo: {},
  internshipInfo: {},
  isSubmitting: false,
  submissionResult: null,
  currentStep: 1
}

const mutations = {
  SET_PERSONAL_INFO(state, info) {
    state.personalInfo = info
  },
  SET_INTERNSHIP_INFO(state, info) {
    state.internshipInfo = info
  },
  SET_SUBMITTING(state, status) {
    state.isSubmitting = status
  },
  SET_SUBMISSION_RESULT(state, result) {
    state.submissionResult = result
  },
  SET_CURRENT_STEP(state, step) {
    state.currentStep = step
  }
}

const actions = {
  async submitApplication({ commit, state }) {
    try {
      commit('SET_SUBMITTING', true)
      
      // Récupérer le token JWT du localStorage
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('Non authentifié')
      }

      // Créer un FormData pour l'envoi des fichiers
      const formData = new FormData()

      // Ajouter les données textuelles
      formData.append('personalInfo', JSON.stringify({
        firstName: state.personalInfo.firstName,
        lastName: state.personalInfo.lastName,
        email: state.personalInfo.email,
        phone: state.personalInfo.phone,
        address: state.personalInfo.address,
        city: state.personalInfo.city,
        dateOfBirth: state.personalInfo.dateOfBirth,
        nationality: state.personalInfo.nationality,
        gender: state.personalInfo.gender,
        educationLevel: state.personalInfo.educationLevel,
        groupMembers: state.personalInfo.groupMembers || []
      }))

      formData.append('internshipInfo', JSON.stringify({
        startDate: state.internshipInfo.startDate,
        endDate: state.internshipInfo.endDate,
        internshipType: state.internshipInfo.internshipType,
        department: state.internshipInfo.department,
        motivation: state.internshipInfo.motivation,
        skills: state.internshipInfo.skills,
        previousExperience: state.internshipInfo.previousExperience,
        universityName: state.personalInfo.university,
        studyField: state.personalInfo.studyField,
        studyYear: state.personalInfo.educationLevel
      }))

      // Ajouter la photo de profil si elle existe
      if (state.personalInfo.profilePhoto) {
        console.log('Photo trouvée dans le state:', state.personalInfo.profilePhoto.substring(0, 50) + '...')
        // Convertir la base64 en fichier
        const photoBlob = await fetch(state.personalInfo.profilePhoto).then(r => r.blob())
        console.log('Photo convertie en blob:', photoBlob)
        formData.append('photo', photoBlob, 'profile-photo.jpg')
        console.log('Photo ajoutée au FormData')
      } else {
        console.log('Aucune photo trouvée dans le state')
      }

      // Ajouter les autres documents s'ils existent
      if (state.internshipInfo.documents?.cv) {
        formData.append('cv', state.internshipInfo.documents.cv)
      }
      if (state.internshipInfo.documents?.coverLetter) {
        formData.append('coverLetter', state.internshipInfo.documents.coverLetter)
      }
      if (state.internshipInfo.documents?.identityCard) {
        formData.append('identityCard', state.internshipInfo.documents.identityCard)
      }
      if (state.internshipInfo.documents?.universityEnrollment) {
        formData.append('universityEnrollment', state.internshipInfo.documents.universityEnrollment)
      }
      if (state.internshipInfo.documents?.recommendation) {
        formData.append('recommendation', state.internshipInfo.documents.recommendation)
      }
      if (state.internshipInfo.documents?.otherDocuments) {
        state.internshipInfo.documents.otherDocuments.forEach((doc, index) => {
          formData.append('otherDocuments', doc)
        })
      }

      // Envoyer la requête à l'API
      const response = await axios.post('/api/stage-request', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      })

      // Traiter la réponse
      if (response.data.success) {
        commit('SET_SUBMISSION_RESULT', {
          success: true,
          message: response.data.message,
          applicationId: response.data.data.code_suivi
        })
      } else {
        throw new Error(response.data.message || 'Erreur lors de la soumission')
      }
    } catch (error) {
      commit('SET_SUBMISSION_RESULT', {
        success: false,
        message: error.message || 'Une erreur est survenue lors de la soumission'
      })
      throw error
    } finally {
      commit('SET_SUBMITTING', false)
    }
  },

  nextStep({ commit, state }) {
    commit('SET_CURRENT_STEP', state.currentStep + 1)
  },

  previousStep({ commit, state }) {
    commit('SET_CURRENT_STEP', state.currentStep - 1)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
} 