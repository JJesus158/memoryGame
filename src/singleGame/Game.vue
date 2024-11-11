<script setup>
import { ref, onMounted, onBeforeUnmount, computed, watch } from "vue";
import Card from "@/components/Card.vue";
import axios from 'axios';
import router from "@/router/index.js";

const cards = ref([]);
const flippedCards = ref([]);
const matchedCards = ref(0);
const timer = ref(0);
const timerInterval = ref(null);
const timerStarted = ref(false);
const listOfBoards = ref([]);
const selectedBoard = ref(null);

const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
});

const loadBoard = async () => {
  const response = await axios.get("/boards");
  const boards = response.data.data;
  listOfBoards.value = boards.map((board) => ({
    id: board.id,
    label: `${board.board_rows} x ${board.board_cols}`,
    value: [{ rows: board.board_rows, cols: board.board_cols }],
    numberOfCards: board.numberOfCards,
  }));
};

const getSelectedBoard = (boards) => {
  selectedBoard.value = boards.find((board) => board.id === props.id);
};


watch(listOfBoards, (newBoards) => {
  if (newBoards.length > 0) {
    getSelectedBoard(newBoards);
    setupGame()
  }

});

const numberOfCards = computed(() => selectedBoard.value ? selectedBoard.value.numberOfCards : 0);


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

  for (let i = 1; i <= numberOfPairs; i++) {

    const randomPrefixIndex = Math.floor(Math.random() * prefixes.length);
    const iconPath = await import(`@/assets/cards/${prefixes[randomPrefixIndex]}${numbersOfCards[i % numbersOfCards.length]}.png`);

    const card = {
      icon: iconPath.default,
      flipped: false,
      matched: false,
      id: `${prefixes[randomPrefixIndex]}${i}`,
    };

    cards.push(card);
    cards.push({ ...card });
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
  console.log(numberOfCards.value)
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

  if (matchedCards.value === numberOfCards.value/2) {
    clearInterval(timerInterval.value);
    setTimeout(()=>{
      router.push('/')
    },2500)
  }
};

const resetGame = () => {
  clearInterval(timerInterval.value);
  cards.value = [];
  timer.value = 0;
  timerStarted.value = false;
  flippedCards.value = [];
  matchedCards.value = 0;
  setupGame()
};

onMounted(() => {
  loadBoard();
});

onBeforeUnmount(() => {
  clearInterval(timerInterval.value);
});
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
    <div class="grid" :class="gridClass" >
      <div
          v-show="matchedCards < numberOfCards/2"
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
      <h1 class="flex justify-center">In {{timer}} seconds</h1>
    </div>
    <div class="flex flex-col m-5">
      <h1 class="flex justify-center">Time</h1>
      <h1 class="flex justify-center">{{timer}} seconds</h1>
    </div>

  </div>
</template>
