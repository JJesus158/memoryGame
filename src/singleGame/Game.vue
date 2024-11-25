<script setup>
import { ref, onMounted, onBeforeUnmount, computed, watch } from "vue";
import Card from "@/components/Card.vue";
import router from "@/router/index.js";
import { useBoardStore } from "@/stores/board.js";
import {useGameStore} from "@/stores/game.js";
import {useAuthStore} from "@/stores/auth.js";


const cards = ref([]);
const flippedCards = ref([]);
const matchedCards = ref(0);

const timer = ref(0);
const timerInterval = ref(null);
const timerStarted = ref(false);

const selectedBoard = ref(null);

// stores
const boardStore = useBoardStore();

const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
});


const gameStore = useGameStore();
const authStore = useAuthStore();


watch(()=>props.id, async (newIDValue)=>{
  selectedBoard.value = await boardStore.fetchBoard(newIDValue)
  setupGame()
},
{ immediate: true });


const numberOfCards = computed(() => (selectedBoard.value ? selectedBoard.value.numberOfCards : 0));

const gridClass = computed(() => {
  if (selectedBoard.value) {
    return `game-board-grid-${selectedBoard.value.value[0].rows}-${selectedBoard.value.value[0].cols}`;
  }
  return '';
});

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
        id: cardKey,
      };
      cards.push(card, { ...card });
    }

    i++;
  }

  return shuffleArray(cards);
};

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const setupGame = async () => {
  cards.value = await importCards(numberOfCards.value / 2);
  matchedCards.value = 0;
};

const startTimer = () => {
  timer.value = 0; // Reset timer
  timerStarted.value = true;
  timerInterval.value = setInterval(() => {
    timer.value++;
  }, 1000);
};

const flipCard = (card) => {
  if (!card.flipped && flippedCards.value.length < 2) {
    if (!timerStarted.value) {
      startTimer();
      gameStore.insertGame(newGame);

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

  if (matchedCards.value === numberOfCards.value / 2) {
    clearInterval(timerInterval.value);
    setTimeout(() => {
      router.push('/newgame');
    }, 2500);
  }
};

const newGame = {
  created_user_id: authStore.userId,
  winner_user_id: null,
  type: 'S',
  status: 'PL',
  beganAt: new Date().getTime(),
  endedAt: null,
  totalTime: null,
  board_id: props.id
}


onBeforeUnmount(() => {
  clearInterval(timerInterval.value);
});
</script>

<template>
  {{newGame}}
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
    <div class="grid" :class="gridClass">
      <div
          v-show="matchedCards < numberOfCards / 2"
          class="relative w-24 h-32 perspective cursor-pointer"
          v-for="card in cards"
          :key="card.id"
          @click="flipCard(card)"
      >
        <Card :icon="card.icon" :flipped="card.flipped" :matched="card.matched" />
      </div>
    </div>
    <div v-show="matchedCards >= numberOfCards / 2" class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 class="mb-1.5">Finished!</h1>
      <h1 class="flex justify-center">In {{ timer }} seconds</h1>
    </div>
    <div class="flex flex-col m-5">
      <h1 class="flex justify-center">Time</h1>
      <h1 class="flex justify-center">{{ timer }} seconds</h1>
    </div>
  </div>
</template>
