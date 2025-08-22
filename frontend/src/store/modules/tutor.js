import { api } from '@/services/api'

const state = {
  assignedInterns: [],
  loading: false,
  error: null
}

const mutations = {
  SET_ASSIGNED_INTERNS(state, interns) {
    state.assignedInterns = interns
  },
  SET_LOADING(state, status) {
    state.loading = status
  },
  SET_ERROR(state, error) {
    state.error = error
  }
}

const actions = {
  async getAssignedInterns({ commit }) {
    try {
      commit('SET_LOADING', true)
      const response = await api.get('/tuteurs/assigned-interns')
      commit('SET_ASSIGNED_INTERNS', response.data.data)
      return response.data.data
    } catch (error) {
      commit('SET_ERROR', error.message)
      console.error('Erreur lors de la récupération des stagiaires affectés:', error)
      return []
    } finally {
      commit('SET_LOADING', false)
    }
  }
}

const getters = {
  hasAssignedInterns: state => state.assignedInterns.length > 0
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
} 