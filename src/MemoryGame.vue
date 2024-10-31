<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import Card from "@/components/Card.vue";

const boardSizes = [
  { label: '3 x 4', value: { rows: 3, cols: 4 } },
  { label: '4 x 4', value: { rows: 4, cols: 4 } },
  { label: '6 x 6', value: { rows: 6, cols: 6 } },
];

let numberOfCards = ref(6);
const cards = ref([]);
const flippedCards = ref([]);
const matchedCards = ref(0);
const timer = ref(0);
const timerInterval = ref(null);
const timerStarted = ref(false);
const selectedBoard = ref(boardSizes[0]);

const importCards = async (numberOfCards) => {
  const cards = [];
  const prefixes = ['c', 'e', 'p', 'o'];
  const numbersOfCards = ['1', '2', '3', '4', '5', '6', '7', '11', '12', '13'];

  for (let i = 1; i <= numberOfCards; i++) {
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
  cards.value = await importCards(numberOfCards);
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

  if (matchedCards.value === numberOfCards) {
    clearInterval(timerInterval.value);
  }
};

const resetGame = () => {
  clearInterval(timerInterval.value);
  cards.value = [];
  timer.value = 0;
  timerStarted.value = false;
  flippedCards.value = [];
  matchedCards.value = 0;
  setupGame(); // Restart the game
};

const changeBoardSize = (boardSize) => {
  numberOfCards = ((boardSize.rows * boardSize.cols) / 2);
  resetGame();
};

onMounted(() => {
  setupGame();
});

onBeforeUnmount(() => {
  clearInterval(timerInterval.value);
});
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
    <h1 class="text-lg p-8 justify-center">Time taken: {{ timer }} seconds</h1>
    <div class="flex flex-row items-center justify-center mb-4">
      <h1>Select Board Size:</h1>
      <select v-model="selectedBoard" @change="changeBoardSize(selectedBoard) " class="mx-1.5">
        <option v-for="size in boardSizes" :key="size.label" :value="size.value">
          {{ size.label }}
        </option>
      </select>
    </div>
    <div :class="`grid grid-cols-${selectedBoard.cols} grid-rows-${selectedBoard.rows}`">
      <div
          v-if="matchedCards < numberOfCards"
          class="relative w-24 h-32 perspective cursor-pointer"
          v-for="card in cards"
          :key="card.id"
          @click="flipCard(card)"
      >
        <Card :icon="card.icon" :flipped="card.flipped" :matched="card.matched" />
      </div>
    </div>
    <div v-if="matchedCards >= numberOfCards" class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 class="mb-1.5">Finished!</h1>
      <button class="bg-blue-200 p-3.5 rounded-full text-gray-50" @click="resetGame">Play Again</button>
    </div>
  </div>
</template>
