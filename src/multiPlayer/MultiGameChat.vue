<script setup>
import { ref } from 'vue'

const chatWidth = ref(300)
const chatOpen = ref(true)
const chatMessages = ref([])
const newMessage = ref('')

const sendMessage = () => {
  if (newMessage.value.trim()) {
    chatMessages.value.push({
      id: Date.now(),
      user: 'You',
      text: newMessage.value,
    });
    newMessage.value = '';
  }
}
</script>

<template>
    <!-- Chat Panel -->
    <div
      class="flex flex-col bg-white shadow-md border-l border-gray-300"
      :style="{ width: chatWidth + 'px' }"
    >
      <div class="flex items-center justify-between bg-gray-200 p-2 border-b border-gray-300">
        <h2 class="text-lg font-semibold">Chat</h2>
      </div>

      <div v-if="chatOpen" class="flex flex-col flex-grow overflow-auto p-2">
        <div v-for="message in chatMessages" :key="message.id" class="mb-2">
          <div class="text-sm font-medium">{{ message.user }}</div>
          <div class="text-gray-700">{{ message.text }}</div>
        </div>
      </div>

      <div v-if="chatOpen" class="flex items-center border-t border-gray-300 p-2">
        <input
          type="text"
          v-model="newMessage"
          placeholder="Type a message..."
          class="flex-grow px-2 py-1 border rounded"
          @keyup.enter="sendMessage"
        />
        <button
          @click="sendMessage"
          class="ml-2 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Send
        </button>
      </div>
    </div>
</template>