<script setup>
import { computed, onMounted, ref } from "vue";
import { useGameStore } from "@/stores/game.js";
import { useAuthStore } from "@/stores/auth.js";
import router from "@/router/index.js";

const gameStore = useGameStore();
const listOfGames = ref([]);
const currentPage = ref(1);
const totalPages = ref(1);

const storeAuth = useAuthStore();

onMounted(async () => {
  await gameStore.loadGames(); // Load games from the store
  listOfGames.value = gameStore.listOfGames;
  totalPages.value = gameStore.totalPages;
});


const goToGame = (gameID) => {
  router.push(`/games/${gameID}`);
}

const loadPage = async (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    await gameStore.loadGames(page);
    listOfGames.value = gameStore.listOfGames;
  }
};
</script>


<template>
  <div class="min-h-screen bg-gray-100 p-6">
    <div class="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-4">
      <h1 class="text-2xl font-bold text-gray-800">List of Games</h1>
    </div>
    <!-- Games Table -->
    <div class="max-w-6xl mx-auto mt-8 bg-white rounded-lg shadow-md p-4">
      <table class="min-w-full border border-gray-200 table-fixed">
        <thead>
        <tr class="bg-gray-100 text-gray-800">
          <th class="text-left px-4 py-2 border-b">Game ID</th>
          <th class="text-left px-4 py-2 border-b">Type</th>
          <th class="text-left px-4 py-2 border-b">Status</th>
          <th class="text-left px-4 py-2 border-b">Started</th>
          <th class="text-left px-4 py-2 border-b">Ended</th>
          <th class="text-left px-4 py-2 border-b">Total Time</th>
          <th class="text-left px-4 py-2 border-b">Size of Board</th>
          <th class="text-left px-4 py-2 border-b">Number of Turns</th>
          <th class="text-left px-4 py-2 border-b">Created By</th>
          <th class="text-left px-4 py-2 border-b">Winner</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="game in listOfGames" :key="game.id"
            @click="goToGame(game.id)"
        >
          <td class="px-4 py-2 border-b">{{ game.id }}</td>
          <td class="px-4 py-2 border-b">{{ game.type }}</td>
          <td class="px-4 py-2 border-b">{{ game.status }}</td>
          <td class="px-4 py-2 border-b">{{ game.began_at ? new Date(game.began_at).toLocaleString() : 'N/A' }}</td>
          <td class="px-4 py-2 border-b">{{ game.ended_at ? new Date(game.ended_at).toLocaleString() : 'N/A' }}</td>
          <td class="px-4 py-2 border-b">{{ game.total_time }} seconds</td>
          <td class="px-4 py-2 border-b">{{ game.board_size }}</td>
          <td class="px-4 py-2 border-b">{{game.total_turns || 'N/A'}}</td>
          <td class="px-4 py-2 border-b">{{ game.createdUser?.nickname || 'N/A'}}</td>
          <td class="px-4 py-2 border-b">{{ game.winnerUser?.nickname|| "N/A" }}</td>
        </tr>
        </tbody>
      </table>

      <!-- Pagination Controls -->
      <div class="flex justify-between items-center mt-4">
        <button
            @click="loadPage(currentPage - 1)"
            :disabled="currentPage === 1"
            class="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg disabled:bg-gray-200"
        >
          Previous
        </button>
        <span class="text-gray-700">Page {{ currentPage }} of {{ totalPages }}</span>
        <button
            @click="loadPage(currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg disabled:bg-gray-200"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

