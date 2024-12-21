<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useErrorStore } from '@/stores/error'
import { useAuthStore } from '@/stores/auth'
import { useBoardStore } from '@/stores/board'
import { useLobbyStore } from '@/stores/lobby'
import { useGamesStore } from '@/stores/games'
import router from '@/router'
import Card from '@/components/Card.vue'
import MultiGameChat from './MultiGameChat.vue'

const storeError = useErrorStore()
const storeAuth = useAuthStore()
const storeBoard = useBoardStore()
const storeLobby = useLobbyStore()
const storeGames = useGamesStore()

const game = ref(null)
const board = ref(null)
const cards = ref([])
const timer = ref(0);

let timerInterval = null;

const gridClass = computed(() => {
  if (board.value?.value?.[0]) {
    return `game-board-grid-${board.value.value[0].rows}-${board.value.value[0].cols}`
  }
  return "game-board-grid-default"
})

const numberOfCards = computed(() => {
  if (game.value == null) return 0

  if (board.value) {
    return board.value.numberOfCards
  }
  return 0
})

const gameStarted = computed(() => {
  if (game.value == null) return false

  return game.value.gameStatus != null
})

const gameEnded = computed(() => {
  if (game.value == null) return false

  return game.value.gameStatus > 0
})

const startGameButtonVisible = computed(() => {
  if (game.value == null || gameStarted.value) return false

  return (game.value.players.length == game.value.numberOfPlayers) && (game.value.owner.user.id == storeAuth.userId)
})

const currentUserTurn = computed(() => {
  if (game.value == null) return false

  if (gameEnded.value) {
    return false
  }
  return game.value.currentPlayer === storeGames.playerNumberOfCurrentUser(game.value)
})

const statusGameMessage = computed(() => {
  if (game.value == null) return ''

  switch (game.value.gameStatus) {
    case 0:
        return `${game.value.players[game.value.currentPlayer - 1].user.name}'s Turn`
    case 1:
        return 'Draw! Nobody wins.'
    case 2:
        return storeGames.playerNumberOfCurrentUser(game.value) == game.value.winner ? 'You won!' : 'You lost.'
    default:
        return game.value.players.length == game.value.numberOfPlayers ?
          `Ready to start! (${game.value.players.length}/${game.value.numberOfPlayers})` :
          `Waiting for players (${game.value.players.length}/${game.value.numberOfPlayers})`
  }
})

const displayElapsedTime = computed(() => {
  if (game.value == null) return 0
  return Math.floor(timer.value / 1000) || 0
})

const startGame = () => {
  storeGames.startGame(game.value)
}

const flipCard = (card) => {
  if (!currentUserTurn.value || game.value.delayActive) {
    return
  }
  storeGames.flipCard(game.value, card.id)
}

const updateTimer = () => {
  if (game.value == null) return
  if (!gameStarted.value || gameEnded.value) return
  if (game.value.isFirstTurn || game.value.delayActive) return
  console.log(game.value.turnStartTime)
  timer.value = (Date.now() - game.value.turnStartTime) + game.value.playerTimers[game.currentPlayer - 1]
}

watch(
  () => storeLobby.game,
  async (newGame, oldGame) => {
    if (newGame != null) {
      console.log("new lobby state", newGame)
      game.value = newGame
    }
  }
)

watch(
  () => storeGames.game,
  async (newGame, oldGame) => {
    if (newGame != null) {
      console.log("new game state", newGame)

      const newCards = []

      // Import all assets and construct the newCards array
      for (let i = 0; i < newGame.board.length; i++) {
        const card = newGame.board[i];
        const icon = (await import(`@/assets/cards/${card.iconKey}.png`)).default;
        newCards.push({
          id: i,
          icon: icon,
          flipped: card.flipped,
          matched: card.matched,
        })
      }

      // Update cards.value after all imports are done
      cards.value = newCards

      game.value = newGame
    }
  }
)

onMounted(async () => {
  if (storeLobby.game == null) {
    storeError.setErrorMessages("The game doesn't exist anymore.")
    await router.push({name: 'multi'})
    return
  }

  game.value = storeLobby.game

  board.value = storeBoard.getById(storeLobby.game.boardId)

  timerInterval = setInterval(updateTimer, 100)
})

onUnmounted(() => {
  clearTimeout(timerInterval)
})
</script>

<template>
  <div class="flex flex-row min-h-screen bg-gray-100">
    <!-- Main Content -->
    <div class="flex flex-col flex-grow items-center justify-center">
      <div class="mb-8">
        {{ statusGameMessage }}
      </div>

      <button
          v-show="startGameButtonVisible"
          @click="startGame"
          class="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
        Start Game
      </button>

      <div v-if="gameStarted && !gameEnded" class="grid gap-4" :class="gridClass">
        <div
          v-for="card in cards"
          :key="card.id"
          class="relative w-24 h-32 perspective cursor-pointer"
          @click="flipCard(card)"
        >
          <Card
            :icon="card.icon"
            :flipped="card.flipped"
            :matched="card.matched"
          />
        </div>
      </div>

      <div
        v-show="gameEnded"
        class="flex flex-col items-center justify-center"
      >
        <h1 class="mb-1.5">Finished!</h1>
        <h1 class="flex justify-center">In {{ displayElapsedTime }} seconds</h1>
        <button
          @click="router.push('/multi')"
          class="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Back to Lobby
        </button>
      </div>

      <div v-if="gameStarted && !gameEnded" class="flex flex-col m-5">
        <h1 class="flex justify-center">Time</h1>
        <h1 class="flex justify-center">{{ displayElapsedTime }} seconds</h1>
      </div>
    </div>

    <!--MultiGameChat></MultiGameChat-->
  </div>
</template>
