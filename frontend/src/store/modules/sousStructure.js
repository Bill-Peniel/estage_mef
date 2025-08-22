import { api } from '@/services/api'
import { tuteurService } from '@/services/api'

export default {
  namespaced: true,

  state: {
    sousStructure: null,
    membres: [],
    sousStructures: [],
    loading: false,
    error: null
  },

  mutations: {
    SET_SOUS_STRUCTURE(state, sousStructure) {
      state.sousStructure = sousStructure
    },
    SET_MEMBRES(state, membres) {
      state.membres = membres
    },
    SET_SOUS_STRUCTURES(state, sousStructures) {
      state.sousStructures = sousStructures
    },
    SET_LOADING(state, loading) {
      state.loading = loading
    },
    SET_ERROR(state, error) {
      state.error = error
    }
  },

  actions: {
    async getSousStructure({ commit }) {
      try {
        commit('SET_LOADING', true)
        const response = await tuteurService.getMyStructure()
        commit('SET_SOUS_STRUCTURE', response)
        commit('SET_MEMBRES', response.tuteurs || [])
        commit('SET_SOUS_STRUCTURES', response.children || [])
        return response
      } catch (error) {
        commit('SET_ERROR', error.message)
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async addSubStructure({ commit, dispatch }, data) {
      try {
        commit('SET_LOADING', true)
        const response = await api.post('/structures', {
          ...data,
          type: 'sous-structure',
          isDeleted: false
        })
        await dispatch('getSousStructure')
        return response.data
      } catch (error) {
        commit('SET_ERROR', error.message)
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async updateSubStructure({ commit, dispatch }, { id, data }) {
      try {
        commit('SET_LOADING', true)
        const response = await api.patch(`/structures/${id}`, data)
        await dispatch('getSousStructure')
        return response.data
      } catch (error) {
        commit('SET_ERROR', error.message)
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async removeSubStructure({ commit, dispatch }, id) {
      try {
        commit('SET_LOADING', true)
        await api.delete(`/structures/${id}`)
        await dispatch('getSousStructure')
      } catch (error) {
        commit('SET_ERROR', error.message)
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async addMember({ commit, dispatch }, member) {
      try {
        commit('SET_LOADING', true)
        const response = await api.post('/structures/membres', member)
        await dispatch('getSousStructure')
        return response.data
      } catch (error) {
        commit('SET_ERROR', error.message)
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async removeMember({ commit, dispatch }, memberId) {
      try {
        commit('SET_LOADING', true)
        await api.delete(`/structures/membres/${memberId}`)
        await dispatch('getSousStructure')
      } catch (error) {
        commit('SET_ERROR', error.message)
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async updateMember({ commit, dispatch }, { memberId, data }) {
      try {
        commit('SET_LOADING', true)
        const response = await api.put(`/structures/membres/${memberId}`, data)
        await dispatch('getSousStructure')
        return response.data
      } catch (error) {
        commit('SET_ERROR', error.message)
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    }
  },

  getters: {
    hasSousStructure: state => !!state.sousStructure,
    getMembres: state => state.membres,
    getSousStructures: state => state.sousStructures
  }
} 