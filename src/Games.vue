<script setup>
import { computed, onMounted, ref } from "vue";
import { useGameStore } from "@/stores/game.js";
import {useAuthStore} from "@/stores/auth.js";

const gameStore = useGameStore();
const listOfGames = ref([]);

const storeAuth = useAuthStore()


onMounted(async () => {
  await gameStore.loadGames(); // Load games from the store
  listOfGames.value = gameStore.listOfGames;
});


</script>

<template>
  <div class="container mx-auto py-8 px-4">
    <h1 class="text-2xl font-bold mb-6 text-center">List of Games</h1>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
          v-for="game in listOfGames"
          :key="game.id"
          class="p-4 bg-white shadow-lg rounded-lg border border-gray-200 hover:shadow-xl transition"
      >
        <!-- Game Details -->
        <h2 class="text-lg font-semibold mb-2">Game ID: {{ game.id }}</h2>
        <p class="text-sm text-gray-500 mb-1">
          <span class="font-medium">Type:</span> {{ game.type }}
        </p>
        <p class="text-sm text-gray-500 mb-1">
          <span class="font-medium">Status:</span> {{ game.status }}
        </p>
        <p class="text-sm text-gray-500 mb-1">
          <span class="font-medium">Started:</span>
          {{ new Date(game.began_at).toLocaleString() }}
        </p>
        <p class="text-sm text-gray-500 mb-1">
          <span class="font-medium">Ended:</span>
          {{ game.ended_at ? new Date(game.ended_at).toLocaleString() : "N/A" }}
        </p>
        <p class="text-sm text-gray-500 mb-1">
          <span class="font-medium">Total Time:</span>
          {{ game.total_time }} seconds
        </p>
        <p class="text-sm text-gray-500 mb-1">
          <span class="font-medium">Board ID:</span> {{ game.board_id }}
        </p>

        <!-- Admin-only Details -->
        <div v-if="storeAuth.userType  === 'A' " class="mt-4">
          <h3 class="text-sm font-medium text-gray-700 mb-1">Admin Information:</h3>
          <p class="text-sm text-gray-500 mb-1">
            <span class="font-medium">Created by User ID:</span>
            {{ game.created_user_id }}
          </p>
          <p class="text-sm text-gray-500 mb-1">
            <span class="font-medium">Winner User ID:</span>
            {{ game.winnerUserId || "No winner yet" }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
