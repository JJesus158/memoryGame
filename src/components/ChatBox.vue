<script setup>
import { ref } from 'vue';

const chatVisible = ref(false);
const messages = ref([]);
const userInput = ref('');

const wsConnection = import.meta.env.VITE_WS_CONNECTION;

console.log(wsConnection);

let ws = new WebSocket(wsConnection, 'echo-protocol');

ws.onerror = (event) => {
    messages.value.push({ text: "Connection to WebSocket failed.", server: true });
    ws = null;
};

ws.onmessage = (event) => {
    messages.value.push({ text: event.data, server: true });
};

const toggleChat = () => {
    chatVisible.value = !chatVisible.value;
};

const sendMessage = () => {
    if (userInput.value.trim() === '') return;

    if (ws != null) {
        messages.value.push({ text: userInput.value, server: false });
        ws.send(userInput.value);
    }

    userInput.value = '';
};
</script>

<template>
    <div class="fixed bottom-0 right-0 mb-4 mr-4">
        <button @click="toggleChat" class="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            WebSocket Echo
        </button>
    </div>
    <div v-show="chatVisible" class="fixed bottom-16 right-4 w-96">
        <div class="bg-white shadow-md rounded-lg max-w-lg w-full">
            <div class="p-4 border-b bg-blue-500 text-white rounded-t-lg flex justify-between items-center">
                <p class="text-lg font-semibold">WebSocket Echo</p>
                <button @click="toggleChat" class="text-gray-300 hover:text-gray-400 focus:outline-none focus:text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
            <div id="chatbox" class="p-4 h-80 overflow-y-auto">
              <div v-for="(message, index) in messages" :key="index" :class="{'text-right': !message.server}">
                <p :class="message.server 
                    ? 'bg-gray-200 text-gray-700 rounded-lg py-2 px-4 inline-block mb-2' 
                    : 'bg-blue-500 text-white rounded-lg py-2 px-4 inline-block mb-2'">
                  {{ message.text }}
                </p>
              </div>
            </div>
            <div class="p-4 border-t flex">
                <input v-model="userInput" @keydown.enter="sendMessage" type="text" placeholder="Type a message" class="w-full px-3 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <button @click="sendMessage" class="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600 transition duration-300">Send</button>
            </div>
        </div>
    </div>
</template>
