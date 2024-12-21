<script setup>
import { ref, onMounted, computed } from "vue";
import Card from "@/components/Card.vue";
import router from "@/router/index.js";

const flippedCards = ref([]);
const matchedCards = ref(0);
const total_turns = ref(0);

const timer = ref(0);
const timerInterval = ref(null);
const timerStarted = ref(false);

const cards = ref([]);
const gameFinished = ref(false);

const numberOfCards = 12; // Total number of cards (6 pairs)

const startTimer = () => {
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

  if (matchedCards.value === numberOfCards / 2) {
    finishGame();
  }
  total_turns.value++;
};

const finishGame = async () => {
  clearInterval(timerInterval.value);
  gameFinished.value = true;
};

const importCards = async (numberOfPairs) => {
  const cardsArray = [];
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
        id: cardKey,  // Add unique card identifier
        icon: iconPath.default,
        flipped: false,
        matched: false,
      };
      cardsArray.push(card, { ...card }); // Add two identical cards (for the pair)
    }

    i++;
  }

  return shuffleArray(cardsArray);
};

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Swap elements
  }
  return array;
};

onMounted(async () => {
  cards.value = await importCards(numberOfCards / 2); // Get shuffled cards
});

</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
    <div v-if="!gameFinished" class="grid grid-cols-4 grid-rows-3 gap-4">
      <div
          v-for="(card, index) in cards"
          :key="card.id || index"
          class="relative w-24 h-32 perspective cursor-pointer"
          @click="flipCard(card)"
      >
        <Card :icon="card.icon" :flipped="card.flipped" :matched="card.matched" />
      </div>
    </div>

    <div v-if="gameFinished" class="flex flex-col items-center justify-center">
      <h1 class="mb-1.5">Finished!</h1>
      <h1 class="flex justify-center">In {{ timer }} seconds</h1>
      <button
          @click="router.push('/newgame')"
          class="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Start New Game
      </button>
    </div>

    <div v-else class="flex flex-col m-5">
      <h1 class="flex justify-center">Time</h1>
      <h1 class="flex justify-center">{{ timer }} seconds</h1>
    </div>
  </div>
</template>

