<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useErrorStore } from '@/stores/error'
import { useAuthStore } from '@/stores/auth'
import { useBoardStore } from '@/stores/board'
import { useLobbyStore } from '@/stores/lobby'
import { useGameStore } from '@/stores/game'
import { useGamesStore } from '@/stores/games'
import router from '@/router'
import Card from '@/components/Card.vue'
import MultiGameChat from './MultiGameChat.vue'

const storeError = useErrorStore()
const storeAuth = useAuthStore()
const storeBoard = useBoardStore()
const storeLobby = useLobbyStore()
const storeGame = useGameStore()
const storeGames = useGamesStore()

const game = ref(null)
const board = ref(null)
const cards = ref([])
const timer = ref(0)
const totalTurns = ref(0)
const opponentTimer = ref(0)
const opponentTotalTurns = ref(0)
const serverTimeOffset = ref(0)

let timerInterval = null
let endAtTime = null
let dbGame = null

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
        return storeGames.playerNumberOfCurrentUser(game.value) == game.value.winner ? 'You won!' :
          `You lost. ${game.value.players[game.value.winner - 1].user.name} won.`
    case 2:
        // good luck getting a draw though haha
        return 'Draw! Nobody wins.'
    default:
        return game.value.players.length == game.value.numberOfPlayers ?
          `Ready to start! (${game.value.players.length}/${game.value.numberOfPlayers})` :
          `Waiting for players (${game.value.players.length}/${game.value.numberOfPlayers})`
  }
})

const displayElapsedTime = computed(() => {
  if (game.value == null) return 0
  return ((timer.value < 0 ? 0 : (timer.value / 1000)) || 0).toFixed(2)
})

const opponentDisplayElapsedTime = computed(() => {
  if (game.value == null) return 0
  return ((opponentTimer.value < 0 ? 0 : (opponentTimer.value / 1000)) || 0).toFixed(2)
})

const startGame = async () => {
  storeGames.startGame(game.value)

  if (game.value.owner.user.id == storeAuth.userId) {
    dbGame = {
      id: game.value.id,
      created_user_id: storeAuth.userId,
      winner_user_id: null,
      type: 'M',
      status: 'PL',
      began_at: null,
      ended_at: null,
      total_time: null,
      board_id: board.value.id,
      custom: { cards: cards.value },
    }

    await storeGame.insertGame(dbGame)
  }
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
  const newTimer = (Date.now() - game.value.turnStartTime) + game.value.playerTimers[game.value.currentPlayer - 1] - serverTimeOffset.value
  if (currentUserTurn.value) {
    timer.value = newTimer
  } else {
    opponentTimer.value = newTimer
  }
}

const quitGame = async () => {
  if (game.value.owner.user.id == storeAuth.userId) {
    dbGame.winner_user_id = game.value.winner ? game.value.players[game.value.winner - 1].user.id : null;
    dbGame.status = 'E';
    dbGame.ended_at = endAtTime;
    dbGame.total_time = game.value.winner ? game.value.playerTimers[game.value.winner - 1] : game.value.playerTimers[0];
    dbGame.total_turns_winner = game.value.winner ? game.value.playerTotalTurns[game.value.winner - 1] : game.value.playerTotalTurns[0];
    dbGame.custom = { cards: cards.value };

    await storeGame.updateGame(dbGame); // Persist the game state
  }

  storeGames.quit(game.value)
  await router.push('/multi')
}

const gameInterrupted = async () => {
  if (game.value.owner.user.id == storeAuth.userId) {
    dbGame.status = 'I'

    const dbResponseGame = await storeGame.updateGame(dbGame) // Persist the game state

    console.log('Game was interrupted and updated on the database: ', dbResponseGame)
  }

  await router.push('/multi')
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

      if (newGame.interrupted === true) {
        await gameInterrupted()
        return
      }

      if (oldGame != null && oldGame.isFirstTurn) {
        serverTimeOffset.value = Date.now() - newGame.turnStartTime
      }

      if (newGame.currentPlayer === storeGames.playerNumberOfCurrentUser(newGame)) {
        totalTurns.value = newGame.playerTotalTurns[newGame.currentPlayer - 1]
      } else {
        opponentTotalTurns.value = newGame.playerTotalTurns[newGame.currentPlayer - 1]
      }

      if (newGame.gameStatus > 0) {
        endAtTime = new Date().toLocaleString()
      }

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
        <h1 class="flex justify-center">In {{ opponentDisplayElapsedTime }} seconds</h1>
        <button
          @click="quitGame"
          class="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Back to Lobby
        </button>
      </div>

      <div v-if="gameStarted && !gameEnded && !currentUserTurn" class="flex flex-row">
        <div class="flex flex-col m-5 w-[150px]">
          <h1 class="flex justify-center">Opponent's Time</h1>
          <h1 class="flex justify-center">{{ opponentDisplayElapsedTime }} seconds</h1>
        </div>
        <div class="flex flex-col m-5 w-[200px]">
          <h1 class="flex justify-center">Opponent's Total Turns</h1>
          <h1 class="flex justify-center">{{ opponentTotalTurns }}</h1>
        </div>
      </div>

      <div v-if="gameStarted && !gameEnded" class="flex flex-row m-5 ">
        <div class="flex flex-col m-5 w-[150px]">
          <h1 class="flex justify-center">My Time</h1>
          <h1 class="flex justify-center">{{ displayElapsedTime }} seconds</h1>
        </div>
        <div class="flex flex-col m-5 w-[200px]">
          <h1 class="flex justify-center">My Total Turns</h1>
          <h1 class="flex justify-center">{{ totalTurns }}</h1>
        </div>
      </div>

    </div>

    <!--MultiGameChat></MultiGameChat-->
  </div>
</template>
