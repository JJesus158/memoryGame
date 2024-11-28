<script setup>
import { computed, onMounted } from "vue";
import { useBoardStore } from '@/stores/board';
import { useAuthStore } from "@/stores/auth.js";
import { useGameStore } from "@/stores/game.js";
import router from "@/router/index.js";

const boardStore = useBoardStore();
const authStore = useAuthStore();
const gameStore = useGameStore();

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



  // Create the new game object
  const cards = await importCards(numberOfCards / 2); // Get shuffled cards
  const newGame = {
    created_user_id: null,
    winner_user_id: null,
    type: 'S',
    status: 'PL',
    began_at: null,
    ended_at: null,
    total_time: null,
    board_id: board.id,
    custom: { cards: cards },
  };


  const game = await gameStore.insertGame(newGame);
  await router.push({ name: 'game', params: { id: game.id } });
};
</script>

<template>
  <div class="flex flex-col h-screen items-center w-screen">
    <h1 class="mt-20">Select a Game:</h1>
    <div v-for="board in listOfBoards" :key="board.id" class="flex justify-between w-1/2 bg-blue-200 items-center h-1/6 m-5 p-10" @click="createGame(board)">
      <h1 class="text-4xl">{{ board.id }}</h1>
      <div class="flex flex-col">
        <h2 class="text-2xl">Number Of Pairs</h2>
        <h2 class="flex text-lg justify-center">{{ board.numberOfCards / 2 }}</h2>
      </div>
      <div class="flex flex-col">
        <h2 class="text-2xl">Board</h2>
        <h2 class="flex justify-center text-lg">{{ board.label }}</h2>
      </div>
    </div>
  </div>
</template>
