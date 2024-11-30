<script setup>
import { ref, onMounted, onBeforeUnmount, computed, watch } from "vue";
import Card from "@/components/Card.vue";
import router from "@/router/index.js";
import { useBoardStore } from "@/stores/board.js";
import { useGameStore } from "@/stores/game.js";

const cards = ref([]);
const flippedCards = ref([]);
const matchedCards = ref(0);

const timer = ref(0);
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

    flippedCards.value = game.value.custom.cards.filter((card) => card.flipped);
    timer.value = game.value.total_time;
  }
};

const startTimer = () => {
  if (!timerStarted.value) {
    game.value.began_at = gameStore.formatDate(new Date());
  }
  timerStarted.value = true;
  timerInterval.value = setInterval(() => {
    timer.value++;
  }, 1000);
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
};

const finishGame = async () => {
  if (gameFinished.value) return;
  gameFinished.value = true;

  clearInterval(timerInterval.value);
  game.value.status = "E";
  game.value.total_time = timer.value;
  game.value.custom.cards = cards.value;
  game.value.ended_at = gameStore.formatDate(new Date());

  await gameStore.updateGame(game.value); // Persist the game state
};

onBeforeUnmount(() => {
  if (game.value.status === "PL") {
    game.value.total_time = timer.value;
    game.value.status = "I";
    game.value.custom.cards = cards.value;
    gameStore.updateGame(game.value);
  }
  clearInterval(timerInterval.value);
});

onMounted(async () => {
  game.value = await gameStore.fetchGame(props.id);
  selectedBoard.value = await boardStore.fetchBoard(game.value.board_id);
  game.value.status = "PL";
  await gameStore.updateGame(game.value);
  await setupGame();
});

watch(selectedBoard, (newBoard) => {
  if (newBoard) {
    setupGame();
  }
});
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
    <div class="grid" :class="gridClass">
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
      <h1 class="flex justify-center">In {{ timer }} seconds</h1>
      <button
          @click="router.push('/newgame')"
          class="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Start New Game
      </button>
    </div>

    <div class="flex flex-col m-5">
      <h1 class="flex justify-center">Time</h1>
      <h1 class="flex justify-center">{{ timer }} seconds</h1>
    </div>
  </div>
</template>
