<script setup>
import { ref, onMounted, onBeforeUnmount, computed, watch } from "vue";
import Card from "@/components/Card.vue";
import router from "@/router/index.js";
import { useBoardStore } from "@/stores/board.js";
import { useGameStore } from "@/stores/game.js";

const cards = ref([]);
const flippedCards = ref([]);
const matchedCards = ref(0);
const total_turns = ref(0);

const timer = ref(0);  // Time in centiseconds (1 centisecond = 10 ms)
const timerInterval = ref(null);
const timerStarted = ref(false);

const selectedBoard = ref(null);
const game = ref(null);
const gameFinished = ref(false);

const gameStore = useGameStore();
const boardStore = useBoardStore();

const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
});

const gridClass = computed(() => {
  if (selectedBoard.value?.value?.[0]) {
    return `game-board-grid-${selectedBoard.value.value[0].rows}-${selectedBoard.value.value[0].cols}`;
  }
  return "game-board-grid-default";
});

const setupGame = async () => {
  if (game.value) {
    cards.value = game.value.custom.cards;
    matchedCards.value = game.value.custom.cards.filter((card) => card.matched).length;
    total_turns.value = game.value.total_turns_winner;
    flippedCards.value = game.value.custom.cards.filter((card) => card.flipped);
    timer.value = game.value.total_time;
  }
};

const startTimer = () => {
  if (!timerStarted.value) {
    game.value.began_at = new Date().toLocaleString();
  }
  timerStarted.value = true;
  timerInterval.value = setInterval(() => {
    timer.value++;  // Increment by 1 centisecond (0.01 second)
  }, 10);  // Update every 10 ms (0.01 second)
};

const flipCard = (card) => {
  if (!card.flipped && flippedCards.value.length < 2) {
    if (!timerStarted.value) {
      startTimer();
    }

    card.flipped = true;
    flippedCards.value.push(card);
    if (flippedCards.value.length === 2) {
      setTimeout(checkForMatch, 1000);
    }
  }
};

const checkForMatch = () => {
  const [firstCard, secondCard] = flippedCards.value;

  if (firstCard.icon === secondCard.icon) {
    firstCard.matched = true;
    secondCard.matched = true;
    matchedCards.value++;
  } else {
    firstCard.flipped = false;
    secondCard.flipped = false;
  }
  flippedCards.value = [];

  if (matchedCards.value === selectedBoard.value.numberOfCards / 2) {
    finishGame();
  }
  total_turns.value++;
  console.log(total_turns.value);
};

const finishGame = async () => {
  if (gameFinished.value) return;
  gameFinished.value = true;

  clearInterval(timerInterval.value);
  game.value.status = "E";
  game.value.total_time = timer.value;
  game.value.total_turns_winner = total_turns.value;
  game.value.custom.cards = cards.value;
  game.value.ended_at = new Date().toLocaleString();

  await gameStore.updateGame(game.value); // Persist the game state
};

onBeforeUnmount(() => {
  if (game.value?.status === "PL") {
    game.value.total_time = timer.value;
    game.value.status = "I";
    game.value.total_turns_winner = total_turns.value;
    game.value.custom.cards = cards.value;
    gameStore.updateGame(game.value);
  }
  clearInterval(timerInterval.value);
});

onMounted(async () => {
  try {
    game.value = await gameStore.fetchGame(props.id);

    // Check if game is null or not found
    if (!game.value) {
      // Handle the error by redirecting or displaying a message
      console.error("Game not found.");
      await router.push({ name: "ErrorPage", params: { errorCode: "403" } });
      return; // Don't proceed further if game is not available
    }

    selectedBoard.value = await boardStore.fetchBoard(game.value.board_id);
    // Initialize the game status and update the store
    game.value.status = "PL";
    await gameStore.updateGame(game.value);
    await setupGame();
  } catch (error) {
    console.error("An error occurred during game setup:", error);
    // Redirect to an error page or show an error message
    await router.push({ name: "ErrorPage", params: { errorCode: "500" } });
  }
});

watch(selectedBoard, (newBoard) => {
  if (newBoard) {
    setupGame();
  }
});
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
    <div class="grid gap-4" :class="gridClass">
      <div
          v-show="matchedCards < selectedBoard?.numberOfCards / 2"
          class="relative w-24 h-32 perspective cursor-pointer"
          v-for="card in cards"
          :key="card.id"
          @click="flipCard(card)"
      >
        <Card :icon="card.icon" :flipped="card.flipped" :matched="card.matched" />
      </div>
    </div>

    <div
        v-show="matchedCards >= selectedBoard?.numberOfCards / 2"
        class="flex flex-col items-center justify-center min-h-screen bg-gray-100"
    >
      <h1 class="mb-1.5">Finished!</h1>
      <h1 class="flex justify-center">In {{ (timer / 100).toFixed(2) }} seconds & {{total_turns}} moves</h1>  <!-- Showing seconds with 2 decimal places -->
      <button
          @click="router.push('/newgame')"
          class="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Start New Game
      </button>
    </div>

    <div class="flex flex-row m-5 ">
      <div class="flex flex-col m-5 w-[100px]">
        <h1 class="flex justify-center">Time</h1>
        <h1 class="flex justify-center">{{ timer / 100 }} seconds</h1>  <!-- Showing seconds with 2 decimal places -->
      </div>
      <div class="flex flex-col m-5 w-[100px]">
        <h1 class="flex justify-center">Total Turns</h1>
        <h1 class="flex justify-center">{{ total_turns }}</h1>
      </div>

    </div>
  </div>
</template>
