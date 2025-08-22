// Service de messagerie pour tuteur <-> stagiaire
import api from '../api'

export default {
  // Récupérer les messages entre un tuteur et un stagiaire
  async getMessages(tuteurId, stagiaireId) {
    // L’endpoint doit exister côté backend, ici on suppose /messages/conversation?tuteurId=...&stagiaireId=...
    const { data } = await api.get(`/messages/conversation`, {
      params: { tuteurId, stagiaireId }
    })
    return data
  },

  // Envoyer un message
  async sendMessage({ from, to, content, role }) {
    // role = 'tuteur' ou 'stagiaire'
    // L’endpoint doit exister côté backend, ici on suppose /messages/send
    const { data } = await api.post(`/messages/send`, {
      from, to, content, role
    })
    return data
  }
} 