<script setup>
import { useScoreBoardStore } from "@/stores/scoreBoard.js";
import { useAuthStore } from "@/stores/auth.js";

// Get the store and actions
const storeGlobalScores = useScoreBoardStore();
const storeAuth = useAuthStore();


storeGlobalScores.loadGlobalScoreBoard();
if (storeAuth.user) {
  storeGlobalScores.loadPersonalSingleScoreBoard();
}

// Access the score data from the store
const globalScores = storeGlobalScores.listOfGlobalScores;
console.log(storeAuth.user);
const personalScores = storeAuth.user ? storeGlobalScores.listOfPersonalScores : { singlePlayer: [], totalVictories: 0, totalLosses: 0 };
</script>

<template>
<div class="bg-gradient-to-br from-blue-500 to-indigo-800  min-h-screen p-4">

  <div class="flex justify-center">
    <RouterLink
        :to="{ name: 'newgame' }"
        class="flex items-center justify-center px-6 py-3 bg-gray-900 text-white rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition duration-200 ease-in-out"
        aria-label="Start a new single-player game"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"></path>
      </svg>
      New Single Game
    </RouterLink>
  </div>

  <div class="py-8">
    <div class="w-full max-w-7xl mx-auto px-4">

      <!-- Global Single-Player Scores Table -->
      <div v-if="globalScores.singlePlayer.length > 0" class="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 class="text-3xl font-semibold text-gray-800 mb-4">Global Single-Player Scores (Top 10)</h2>
        <table class="min-w-full table-auto">
          <thead class="bg-gray-200">
          <tr>
            <th class="px-4 py-2 text-left">Board Size</th>
            <th class="px-4 py-2 text-left">Best Time</th>
            <th class="px-4 py-2 text-left">Minimum Turns</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(score, index) in globalScores.singlePlayer" :key="index">
            <td class="border-t border-gray-300 px-4 py-2">{{ score.boardSize }}</td>
            <td class="border-t border-gray-300 px-4 py-2">
              <ul class="list-none">
                <li v-for="(time, idx) in score.bestTimes" :key="idx">
                  <span class="font-semibold">{{ time.nickname }}:</span> {{ time.time }} seconds
                </li>
              </ul>
            </td>
            <td class="border-t border-gray-300 px-4 py-2">
              <ul class="list-none">
                <li v-for="(turn, idx) in score.minTurns" :key="idx">
                  <span class="font-semibold">{{ turn.nickname }}:</span> {{ turn.turns }} turns
                </li>
              </ul>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
      <p v-else class="text-white text-lg">No single-player scores available.</p>

      <!-- Global Multiplayer Scores Table -->
      <div v-if="globalScores.multiplayer.length > 0" class="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 class="text-3xl font-semibold text-gray-800 mb-4">Global Multiplayer Scores (Top 5)</h2>
        <table class="min-w-full table-auto">
          <thead class="bg-gray-200">
          <tr>
            <th class="px-4 py-2 text-left">Nickname</th>
            <th class="px-4 py-2 text-left">Victories</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(score, index) in globalScores.multiplayer" :key="index">
            <td class="border-t border-gray-300 px-4 py-2">{{ score.nickname }}</td>
            <td class="border-t border-gray-300 px-4 py-2">{{ score.victories }}</td>
          </tr>
          </tbody>
        </table>
      </div>
      <p v-else class="text-white text-lg">No multiplayer scores available.</p>

      <!-- Personal Single Player Scores Table -->
      <div v-if="personalScores.singlePlayer.length > 0 && storeAuth.userType==='P' " class="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 class="text-3xl font-semibold text-gray-800 mb-4">Personal Single-Player Scores</h2>
        <table class="min-w-full table-auto">
          <thead class="bg-gray-200">
          <tr>
            <th class="px-4 py-2 text-left">Board Size</th>
            <th class="px-4 py-2 text-left">Best Time</th>
            <th class="px-4 py-2 text-left">Minimum Turns</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(score, index) in personalScores.singlePlayer" :key="index">
            <td class="border-t border-gray-300 px-4 py-2">{{ score.boardSize }}</td>
            <td class="border-t border-gray-300 px-4 py-2">
              <ul class="list-none">
                <li v-for="(time, idx) in score.bestTimes" :key="idx">
                  <span class="font-semibold">{{ time.nickname }}</span> {{ time.time }} seconds
                </li>
              </ul>
            </td>
            <td class="border-t border-gray-300 px-4 py-2">
              <ul class="list-none">
                <li v-for="(turn, idx) in score.minTurns" :key="idx">
                  <span class="font-semibold">{{ turn.nickname }}</span> {{ turn.turns }} turns
                </li>
              </ul>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
      <p v-else class="text-white text-lg">No personal scores available.</p>

      <!-- Personal Multiplayer Scores Table -->
      <div v-if="personalScores.totalVictories" class="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 class="text-3xl font-semibold text-gray-800 mb-4">Personal Multiplayer Scores</h2>
        <p class="font-semibold">{{ personalScores.totalVictories }} Victories</p>
        <p class="font-semibold">{{ personalScores.totalLosses }} Losses</p>
      </div>
      <p v-else class="text-white text-lg">No multiplayer scores available.</p>
    </div>
  </div>
</div>
</template>
