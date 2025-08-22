<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Messages</h1>
    </div>

    <div class="grid grid-cols-12 gap-6 h-[calc(100vh-200px)]">
      <!-- Liste des stagiaires -->
      <div class="col-span-4 bg-white rounded-lg shadow-sm overflow-hidden">
        <div class="p-4 border-b">
          <div class="relative">
            <input 
              type="text" 
              placeholder="Rechercher un stagiaire..." 
              class="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-primary focus:border-primary"
              v-model="searchQuery"
            >
            <i class="fas fa-search absolute left-3 top-3 text-gray-400"></i>
          </div>
        </div>
        <div class="overflow-y-auto h-full">
          <div 
            v-for="stagiaire in stagiaires" 
            :key="stagiaire.id"
            @click="selectStagiaire(stagiaire)"
            class="p-4 border-b hover:bg-gray-50 cursor-pointer"
            :class="{'bg-primary-light': selectedStagiaire?.id === stagiaire.id}"
          >
            <div class="flex items-center">
              <div class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                <span class="text-gray-600 font-medium">{{ stagiaire.nom[0] }}</span>
              </div>
              <div class="ml-3">
                <p class="font-medium">{{ stagiaire.nom }}</p>
                <p class="text-sm text-gray-500">{{ stagiaire.statut }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Zone de conversation -->
      <div class="col-span-8 bg-white rounded-lg shadow-sm flex flex-col">
        <div v-if="selectedStagiaire" class="flex-1">
          <div class="p-4 border-b">
            <div class="flex items-center">
              <div class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                <span class="text-gray-600 font-medium">{{ selectedStagiaire.nom[0] }}</span>
              </div>
              <div class="ml-3">
                <p class="font-medium">{{ selectedStagiaire.nom }}</p>
                <p class="text-sm text-gray-500">{{ selectedStagiaire.statut }}</p>
              </div>
            </div>
          </div>

          <div class="flex-1 p-4 overflow-y-auto" ref="messagesContainer">
            <div v-if="messages.length === 0" class="text-center text-gray-400 mt-8">
              Aucun message pour l’instant
            </div>
            <div v-for="message in messages" :key="message.id" class="mb-4">
              <div :class="[
                'max-w-[70%] rounded-lg p-3',
                message.from === tuteurId ? 'ml-auto bg-primary text-white' : 'bg-gray-100'
              ]">
                <p>{{ message.content }}</p>
                <p class="text-xs mt-1 opacity-70 text-right">{{ message.time }}</p>
              </div>
            </div>
          </div>

          <div class="p-4 border-t">
            <div class="flex gap-2">
              <input 
                type="text" 
                v-model="newMessage"
                @keyup.enter="sendMessage"
                placeholder="Écrivez votre message..." 
                class="flex-1 p-2 border rounded-lg focus:ring-primary focus:border-primary"
              >
              <button 
                @click="sendMessage"
                class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-700"
              >
                <i class="fas fa-paper-plane"></i>
              </button>
            </div>
          </div>
        </div>

        <div v-else class="flex-1 flex items-center justify-center text-gray-500">
          <p>Sélectionnez un stagiaire pour commencer la conversation</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useStore } from 'vuex'
import messageService from '@/services/api/message.service.js'
import api from '@/services/api'

export default {
  name: 'Messages',
  setup() {
    const store = useStore()
    const searchQuery = ref('')
    const selectedStagiaire = ref(null)
    const newMessage = ref('')
    // Récupérer dynamiquement l'ID du tuteur connecté
    const tuteurId = ref(null)
    const stagiaires = ref([])
    const messages = ref([])
    const messagesContainer = ref(null)
    let pollingInterval = null

    // Charger l'ID du tuteur connecté et la liste des stagiaires affectés
    onMounted(async () => {
      const user = store.getters.currentUser
      if (user && user.id) {
        tuteurId.value = user.id
        // Charger la liste des stagiaires affectés à ce tuteur
        try {
          const token = localStorage.getItem('token')
          const { data } = await api.get('/tuteurs/assigned-interns', {
            headers: { Authorization: `Bearer ${token}` }
          })
          // Correction : inclure userId pour la messagerie
          stagiaires.value = (data.data || []).map(stg => ({
            id: stg.id,
            userId: stg.userId, // <-- pour la messagerie
            nom: stg.name,
            statut: stg.status
          }))
        } catch (e) {
          stagiaires.value = []
        }
      }
    })

    // Charger les messages quand on sélectionne un stagiaire
    watch(selectedStagiaire, async (stagiaire) => {
      if (stagiaire && tuteurId.value) {
        // Utilise toujours userId pour la messagerie
        messages.value = await messageService.getMessages(tuteurId.value, stagiaire.userId)
        if (pollingInterval) clearInterval(pollingInterval)
        pollingInterval = setInterval(async () => {
          messages.value = await messageService.getMessages(tuteurId.value, stagiaire.userId)
        }, 3000)
      } else {
        messages.value = []
        if (pollingInterval) clearInterval(pollingInterval)
      }
    })

    watch(messages, async () => {
      await nextTick()
      if (messagesContainer.value) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
      }
    })

    onUnmounted(() => {
      if (pollingInterval) clearInterval(pollingInterval)
    })

    const selectStagiaire = (stagiaire) => {
      selectedStagiaire.value = stagiaire
    }

    const sendMessage = async () => {
      if (!newMessage.value.trim() || !selectedStagiaire.value || !tuteurId.value) return
      await messageService.sendMessage({
        from: tuteurId.value,
        to: selectedStagiaire.value.userId, // <-- toujours userId
        content: newMessage.value,
        role: 'tuteur'
      })
      messages.value = await messageService.getMessages(tuteurId.value, selectedStagiaire.value.userId)
      newMessage.value = ''
    }

    return {
      searchQuery,
      stagiaires,
      selectedStagiaire,
      messages,
      newMessage,
      selectStagiaire,
      sendMessage,
      messagesContainer,
      tuteurId // Added tuteurId to the return object
    }
  }
}
</script>
