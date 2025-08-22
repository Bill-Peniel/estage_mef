<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Messages</h1>
    </div>

    <div class="grid grid-cols-12 gap-6 h-[calc(100vh-200px)]">
      <!-- Liste des tuteurs -->
      <div class="col-span-4 bg-white rounded-lg shadow-sm overflow-hidden">
        <div class="p-4 border-b">
          <div class="relative">
            <input 
              type="text" 
              placeholder="Rechercher un tuteur..." 
              class="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-primary focus:border-primary"
              v-model="searchQuery"
            >
            <i class="fas fa-search absolute left-3 top-3 text-gray-400"></i>
          </div>
        </div>
        <div class="overflow-y-auto h-full">
          <div 
            v-for="tuteur in tuteurs" 
            :key="tuteur.id"
            @click="selectTuteur(tuteur)"
            class="p-4 border-b hover:bg-gray-50 cursor-pointer"
            :class="{'bg-primary-light': selectedTuteur?.id === tuteur.id}"
          >
            <div class="flex items-center">
              <div class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                <span class="text-gray-600 font-medium">{{ tuteur.nom[0] }}</span>
              </div>
              <div class="ml-3">
                <p class="font-medium">{{ tuteur.nom }}</p>
                <p class="text-sm text-gray-500">{{ tuteur.role }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Zone de conversation -->
      <div class="col-span-8 bg-white rounded-lg shadow-sm flex flex-col">
        <div v-if="selectedTuteur" class="flex-1">
          <div class="p-4 border-b">
            <div class="flex items-center">
              <div class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                <span class="text-gray-600 font-medium">{{ selectedTuteur.nom[0] }}</span>
              </div>
              <div class="ml-3">
                <p class="font-medium">{{ selectedTuteur.nom }}</p>
                <p class="text-sm text-gray-500">{{ selectedTuteur.role }}</p>
              </div>
            </div>
          </div>

          <div class="flex-1 p-4 overflow-y-auto" ref="messagesContainer">
            <div v-if="messages.length === 0" class="text-center py-8 text-gray-400 text-lg font-semibold">
              Aucun message pour l’instant
            </div>
            <div v-for="message in messages" :key="message.id" class="mb-4">
              <div :class="[
                'max-w-[70%] rounded-lg p-3',
                message.from === stagiaireId ? 'ml-auto bg-blue-600 text-white' : 'mr-auto bg-gray-200 text-gray-800'
              ]">
                <div class="flex items-center mb-1">
                  <span v-if="message.from === stagiaireId" class="text-xs font-bold mr-2">Moi</span>
                  <span v-else class="text-xs font-bold mr-2">Tuteur</span>
                  <span class="text-xs text-gray-400">{{ message.role }}</span>
                </div>
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
          <p>Sélectionnez un tuteur pour commencer la conversation</p>
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
    const selectedTuteur = ref(null)
    const newMessage = ref('')
    const stagiaireId = ref(null)
    const tuteurs = ref([])
    const messages = ref([])
    const messagesContainer = ref(null)
    let pollingInterval = null

    // Charger dynamiquement le tuteur assigné au stagiaire connecté
    onMounted(async () => {
      const user = store.getters.currentUser
      if (user && user.id) {
        stagiaireId.value = user.id
        try {
          const token = localStorage.getItem('token')
          // Utilise le nouvel endpoint sécurisé pour stagiaire connecté
          const { data } = await api.get(`/stagiaires/me`, {
            headers: { Authorization: `Bearer ${token}` }
          })
          if (data.tuteur && data.tuteur.user && data.tuteur.user.profile) {
            tuteurs.value = [{
              id: data.tuteur.userId,
              nom: `${data.tuteur.user.profile.prenom} ${data.tuteur.user.profile.nom}`.trim(),
              role: 'Tuteur principal'
            }]
          } else {
            tuteurs.value = []
          }
        } catch (e) {
          tuteurs.value = []
        }
      }
    })

    // Charger les messages quand on sélectionne un tuteur
    watch(selectedTuteur, async (tuteur) => {
      if (tuteur && stagiaireId.value) {
        // Charger immédiatement
        messages.value = await messageService.getMessages(tuteur.id, stagiaireId.value)
        // Démarrer le polling
        if (pollingInterval) clearInterval(pollingInterval)
        pollingInterval = setInterval(async () => {
          messages.value = await messageService.getMessages(tuteur.id, stagiaireId.value)
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

    const selectTuteur = (tuteur) => {
      selectedTuteur.value = tuteur
    }

    const sendMessage = async () => {
      if (!newMessage.value.trim() || !selectedTuteur.value || !stagiaireId.value) return
      await messageService.sendMessage({
        from: stagiaireId.value, // l'expéditeur est le stagiaire
        to: selectedTuteur.value.id, // le destinataire est le tuteur
        content: newMessage.value,
        role: 'stagiaire'
      })
      // Toujours rafraîchir avec getMessages(tuteurId, stagiaireId)
      messages.value = await messageService.getMessages(selectedTuteur.value.id, stagiaireId.value)
      newMessage.value = ''
    }

    return {
      searchQuery,
      tuteurs,
      selectedTuteur,
      messages,
      newMessage,
      selectTuteur,
      sendMessage,
      messagesContainer,
      stagiaireId: stagiaireId // expose la string, pas le ref
    }
  }
}
</script>
