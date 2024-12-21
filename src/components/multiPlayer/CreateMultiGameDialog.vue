<script setup>
import { computed, onMounted, ref } from "vue";
import { useBoardStore } from '@/stores/board'
import router from "@/router/index.js"
import { useLobbyStore } from "@/stores/lobby";

const isOpen = ref(false)
const numberOfPlayers = ref(2)

const boardStore = useBoardStore()
const lobbyStore = useLobbyStore()

const listOfBoards = computed(() => boardStore.listOfBoards)

const open = () => { isOpen.value = true }
const close = () => { isOpen.value = false }

const createRoom = async (board) => {
  lobbyStore.addGame({
    boardId: board.id,
    numberOfCards: board.numberOfCards,
    numberOfPlayers: numberOfPlayers.value
  }, async () => {
    await router.push({name: 'multigame'});
  })
  //close()
}

onMounted(async () => {
  await boardStore.loadBoards()
});

defineExpose({
  open
})
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" @click="close">
    <div class="relative w-11/12 max-w-4xl bg-gradient-to-br from-blue-500 to-indigo-800 text-white rounded-lg shadow-lg p-6" @click.stop="">
      <button
        @click="close"
        class="absolute top-4 right-4 text-gray-400 hover:text-white focus:outline-none"
        aria-label="Close"
      >
        &times;
      </button>

      <h1 class="mt-4 text-4xl font-extrabold text-center drop-shadow-lg">
        Choose Your Game Board
      </h1>

      <div class="mt-8 text-center">
        <label for="numPlayers" class="block text-lg font-semibold mb-2">Number of Players</label>
        <select
          id="numPlayers"
          v-model="numberOfPlayers"
          class="bg-gray-700 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option v-for="num in [2, 3, 4]" :key="num" :value="num">
            {{ num }} Players
          </option>
        </select>
      </div>

      <div class="flex flex-wrap justify-center mt-8">
        <div
          v-for="board in listOfBoards"
          :key="board.id"
          class="relative flex flex-col justify-center items-center w-full md:w-1/3 lg:w-1/4 bg-white text-gray-800 shadow-xl rounded-xl p-6 m-4 transform transition duration-300 hover:scale-105"
          :title="`Board ${board.id}`"
        >
          <h2 class="text-2xl font-semibold mb-2">Board {{ board.id }}</h2>

          <div class="flex flex-col text-center">
            <p class="text-lg font-medium mb-1">Pairs: {{ board.numberOfCards / 2 }}</p>
            <p class="text-lg font-light">Size: {{ board.label }}</p>
          </div>

          <button
            class="mt-4 bg-blue-500 text-white py-2 px-4 rounded-full hover:bg-blue-600 transition duration-300"
            @click="createRoom(board)"
          >
            Create Room
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
