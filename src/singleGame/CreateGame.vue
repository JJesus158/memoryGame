<script setup>
import { computed, onMounted } from "vue";
import { useBoardStore } from '@/stores/board';
import { useGameStore } from "@/stores/game.js";
import router from "@/router/index.js";
import {useAuthStore} from "@/stores/auth.js";


const boardStore = useBoardStore();
const gameStore = useGameStore();
const authStore = useAuthStore();

onMounted(async () => {
  await boardStore.loadBoards();
});

const listOfBoards = computed(() => boardStore.listOfBoards);

// Create Game function
const createGame = async (board) => {
  const numberOfCards = board.numberOfCards;

  // Import cards based on the number of pairs
  const importCards = async (numberOfPairs) => {
    const cards = [];
    const prefixes = ['c', 'e', 'p', 'o'];
    const numbersOfCards = ['1', '2', '3', '4', '5', '6', '7', '11', '12', '13'];
    const uniqueCards = new Set();

    let i = 0;
    while (uniqueCards.size < numberOfPairs) {
      const prefix = prefixes[i % prefixes.length];
      const number = numbersOfCards[Math.floor(i / prefixes.length) % numbersOfCards.length];
      const cardKey = `${prefix}${number}`;

      if (!uniqueCards.has(cardKey)) {
        uniqueCards.add(cardKey);
        const iconPath = await import(`@/assets/cards/${cardKey}.png`);

        const card = {
          icon: iconPath.default,
          flipped: false,
          matched: false,
        };
        cards.push(card, { ...card }); // Add two identical cards (for the pair)
      }

      i++;
    }

    return shuffleArray(cards);
  };

  // Shuffle the cards
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
    return array;
  };



  const cards = await importCards(numberOfCards / 2); // Get shuffled cards
  const newGame = {
    created_user_id: authStore.userId,
    winner_user_id: null,
    type: 'S',
    status: 'PL',
    began_at: null,
    ended_at: null,
    total_time: null,
    board_id: board.id,
    custom: { cards: cards },
  };

  if(authStore.user !== null) {
    const game = await gameStore.insertGame(newGame);
    await router.push({name: 'game', params: {id: game.id}});
  }else {
    await router.push({name: 'guestGame'});
  }

};
</script>

<template>
  <div class="flex flex-col h-screen items-center w-screen bg-gradient-to-br from-blue-500 to-indigo-800 text-white">
    <h1 class="mt-16 text-5xl font-extrabold text-white drop-shadow-lg">
      Choose Your Game Board
    </h1>
    <p v-if="!authStore.user" class="mt-2 text-lg font-light">
      Unlock challenging boards by logging in and playing!
    </p>

    <div
        v-for="board in listOfBoards"
        :key="board.id"
        class="relative flex flex-col justify-center items-center w-3/4 md:w-1/3 lg:w-1/4 bg-white text-gray-800 shadow-xl rounded-xl p-8 m-6 transform transition duration-300 hover:scale-105"
        :class="{ 'opacity-60 cursor-not-allowed': !authStore.user && (board.id === 2 || board.id === 3) }"
        :title="!authStore.user && (board.id === 2 || board.id === 3) ? 'Login required to unlock this game!' : ''"
        @click="!authStore.user && (board.id === 2 || board.id === 3) ? null : createGame(board)"
    >

      <div
          v-if="!authStore.user && (board.id === 2 || board.id === 3)"
          class="absolute top-4 right-4 text-gray-400 text-3xl"
      >
        🔒
      </div>

      <h1 class="text-3xl font-semibold mb-2">Board {{ board.id }}</h1>

      <div class="flex flex-col text-center">
        <p class="text-lg font-medium mb-1">Pairs: {{ board.numberOfCards / 2 }}</p>
        <p class="text-lg font-light">Size: {{ board.label }}</p>
      </div>

      <button
          v-if="authStore.user || board.id !== 2 && board.id !== 3"
          class="mt-6 bg-blue-500 text-white py-2 px-4 rounded-full hover:bg-blue-600 transition duration-300"
      >
        Start Game
      </button>
    </div>
  </div>
</template>

