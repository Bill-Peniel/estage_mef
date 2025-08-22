<template>
  <div>
    <!-- Bulle flottante -->
    <button
      class="fixed z-50 bottom-6 right-6 bg-indigo-600 text-white rounded-full shadow-lg w-16 h-16 flex items-center justify-center text-3xl hover:bg-indigo-700 transition"
      :class="{ 'animate-bounce-once': bouncing }"
      @click="toggleChat"
      aria-label="Ouvrir le chatbot"
    >
      <i class="fas fa-comments"></i>
      <span v-if="unreadCount > 0" class="absolute top-2 right-2 bg-red-500 text-xs rounded-full px-2 py-0.5">{{ unreadCount }}</span>
    </button>

    <!-- Fenêtre de chat -->
    <transition name="fade">
      <div v-if="open" class="fixed z-50 bottom-24 right-6 w-80 max-w-full bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-pop-in">
        <div class="bg-indigo-600 text-white px-4 py-3 flex items-center justify-between">
          <span class="font-semibold"><i class="fas fa-robot mr-2"></i>Assistant IA</span>
          <button @click="toggleChat" class="text-white hover:text-gray-200 text-lg"><i class="fas fa-times"></i></button>
        </div>
        <div class="flex-1 px-4 py-3 space-y-2 overflow-y-auto chatbot-scroll" ref="chatBody" style="max-height: 350px;">
          <div v-for="(msg, i) in messages" :key="i" :class="msg.from === 'user' ? 'text-right' : 'text-left'">
            <div :class="msg.from === 'user' ? 'inline-block bg-indigo-100 text-indigo-900' : 'inline-block bg-gray-100 text-gray-700'" class="rounded-lg px-3 py-2 mb-1 max-w-[80%]">
              <span v-html="msg.text"></span>
            </div>
          </div>
        </div>
        <form @submit.prevent="sendMessage" class="flex items-center border-t border-gray-200 p-2 bg-gray-50">
          <input
            v-model="input"
            type="text"
            class="flex-1 rounded-lg border border-gray-300 px-3 py-2 mr-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
            placeholder="Posez votre question..."
            autocomplete="off"
            @keydown.enter.exact.prevent="sendMessage"
          />
          <button type="submit" :disabled="loading || !input.trim()" class="bg-indigo-600 text-white rounded-lg px-4 py-2 font-semibold shadow hover:bg-indigo-700 transition disabled:opacity-60 disabled:cursor-not-allowed">
            <span v-if="loading"><i class="fas fa-spinner fa-spin"></i></span>
            <span v-else><i class="fas fa-paper-plane"></i></span>
          </button>
        </form>
      </div>
    </transition>
  </div>
</template>

<script>
import { ref, nextTick, onMounted, onUnmounted } from 'vue';
import { sendChatbotMessage } from '@/services/api/chatbot.service';

export default {
  name: 'ChatbotWidget',
  setup() {
    const open = ref(false);
    const input = ref('');
    const messages = ref([
      { from: 'bot', text: 'Bonjour ! Je suis votre assistant IA. Posez-moi une question sur le site.' }
    ]);
    const loading = ref(false);
    const unreadCount = ref(0);
    const chatBody = ref(null);
    const bouncing = ref(false);
    let bounceInterval = null;

    const startBounce = () => {
      if (bounceInterval) clearInterval(bounceInterval);
      bounceInterval = setInterval(() => {
        bouncing.value = false;
        setTimeout(() => { bouncing.value = true; }, 10);
        setTimeout(() => { bouncing.value = false; }, 1200);
      }, 5000);
    };
    const stopBounce = () => {
      if (bounceInterval) clearInterval(bounceInterval);
      bouncing.value = false;
    };

    const toggleChat = () => {
      open.value = !open.value;
      if (open.value) {
        unreadCount.value = 0;
        stopBounce();
        nextTick(() => {
          if (chatBody.value) chatBody.value.scrollTop = chatBody.value.scrollHeight;
        });
      } else {
        startBounce();
      }
    };

    const sendMessage = async () => {
      const text = input.value.trim();
      if (!text) return;
      messages.value.push({ from: 'user', text });
      input.value = '';
      loading.value = true;
      nextTick(() => {
        if (chatBody.value) chatBody.value.scrollTop = chatBody.value.scrollHeight;
      });
      try {
        const answer = await sendChatbotMessage(text);
        messages.value.push({ from: 'bot', text: answer });
        if (!open.value) unreadCount.value++;
      } catch (e) {
        messages.value.push({ from: 'bot', text: "Désolé, une erreur est survenue. Réessayez plus tard." });
      } finally {
        loading.value = false;
        nextTick(() => {
          if (chatBody.value) chatBody.value.scrollTop = chatBody.value.scrollHeight;
        });
      }
    };

    onMounted(() => {
      if (!open.value) startBounce();
    });
    onUnmounted(() => {
      stopBounce();
    });

    return {
      open,
      input,
      messages,
      loading,
      unreadCount,
      chatBody,
      toggleChat,
      sendMessage,
      bouncing
    };
  }
};
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
.animate-pop-in {
  animation: pop-in 0.25s cubic-bezier(.4,2,.6,1) both;
}
@keyframes pop-in {
  0% { transform: scale(0.7); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}
.chatbot-scroll::-webkit-scrollbar {
  width: 6px;
  background: #f3f4f6;
}
.chatbot-scroll::-webkit-scrollbar-thumb {
  background: #c7d2fe;
  border-radius: 3px;
}
@keyframes bounce-once {
  0%   { transform: translateY(0) scaleX(1) scaleY(1); }
  5%   { transform: translateY(0) scaleX(1.2) scaleY(0.8); } /* Squash au sol */
  10%  { transform: translateY(-40px) scaleX(0.9) scaleY(1.1); } /* Stretch en l'air */
  15%  { transform: translateY(-30px) scaleX(1.05) scaleY(0.95); }
  20%  { transform: translateY(0) scaleX(1.15) scaleY(0.85); } /* Squash au sol */
  24%  { transform: translateY(-20px) scaleX(0.95) scaleY(1.05); } /* Stretch petit rebond */
  28%  { transform: translateY(0) scaleX(1.08) scaleY(0.92); } /* Squash */
  32%  { transform: translateY(-8px) scaleX(0.98) scaleY(1.02); } /* Stretch mini rebond */
  36%  { transform: translateY(0) scaleX(1.03) scaleY(0.97); } /* Squash */
  40%  { transform: translateY(0) scaleX(1) scaleY(1); }
  100% { transform: translateY(0) scaleX(1) scaleY(1); }
}
.animate-bounce-once {
  animation: bounce-once 1.2s cubic-bezier(.28,.84,.42,1) 1;
  will-change: transform;
}
</style> 