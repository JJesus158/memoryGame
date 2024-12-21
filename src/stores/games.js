import { ref, computed, inject } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import { useErrorStore } from '@/stores/error'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/components/ui/toast/use-toast'

export const useGamesStore = defineStore('games', () => {
    const storeAuth = useAuthStore()
    const storeError = useErrorStore()
    const { toast } = useToast()
    const socket = inject('socket')

    const games = ref([])
    const game = ref(null)

    const totalGames = computed(() => games.value.length)

    // Use this function to update the game object in the games array
    const updateGame = (gameArg) => {
        const gameIndex = games.value.findIndex((g) => g.id === gameArg.id);
        if (gameIndex !== -1) {
            games.value[gameIndex] = { ...gameArg } // shallow copy
        }

        if (game.value != null && game.value.id == gameArg.id) {
            game.value = gameArg
        }
    }

    const playerNumberOfCurrentUser = (gameArg) => {
        for (let i = 0; i < gameArg.players.length; i++) {
            if (gameArg.players[i].user.id == storeAuth.userId)
                return i + 1
        }
        return null
    }
    
    const webSocketServerResponseHasError = (response) => {
        if (response.errorCode) {
            storeError.setErrorMessages(response.errorMessage, [], response.errorCode)
            return true
        }
        return false
    }
    
    const removeGameFromList = (gameArg) => {
        const gameIndex = games.value.findIndex((g) => g.id === gameArg.id)
        if (gameIndex >= 0) {
            games.value.splice(gameIndex, 1)
        }
    }

    // fetch playing games from the Websocket server
    const fetchPlayingGames = () => {
        storeError.resetMessages()
        socket.emit('fetchPlayingGames', (response) => {
            if (webSocketServerResponseHasError(response)) {
                return
            }
            games.value = response
        })
    }

    const startGame = (gameArg) => {
        // After adding game to the DB emit a message to the server to start the game
        socket.emit('startGame', gameArg, (startedGame) => {
            console.log('Game has started', startedGame)
        })
    }

    const flipCard = (gameArg, idx) => {
        storeError.resetMessages()
        socket.emit('flipCard', {
            index: idx,
            gameId: gameArg.id
        }, (response) => {
            if (webSocketServerResponseHasError(response)) {
                return
            }
            updateGame(response)
        })
    }

    const quit = (gameArg) => {
        storeError.resetMessages()
        socket.emit('quitGame', gameArg.id, (response) => {
            if (webSocketServerResponseHasError(response)) {
                return
            }
            removeGameFromList(gameArg)
        })
    }
    
    const close = (gameArg) => {
        storeError.resetMessages()
        socket.emit('closeGame', gameArg.id, (response) => {
            if (webSocketServerResponseHasError(response)) {
                return
            }
            removeGameFromList(gameArg)
        })
    }

    socket.on('gameStarted', async (gameArg) => {
        if (gameArg.owner.user.id === storeAuth.userId) {
            toast({
                title: 'Game Started',
                description: `Game #${gameArg.id} has started!`,
            })
        }
        game.value = gameArg
        fetchPlayingGames()
    })

    socket.on('gameEnded', async (gameArg) => {
        updateGame(gameArg)
        // Player that created the game is responsible for updating on the database
        if (playerNumberOfCurrentUser(gameArg) === 1) {
            const APIresponse = await axios.patch('games/' + gameArg.id, {
                status: 'ended',
                winner_id: gameArg.winner,
            })
            const updatedGameOnDB = APIresponse.data.data
            console.log('Game has ended and updated on the database: ', updatedGameOnDB)
        }
    })

    socket.on('gameChanged', (gameArg) => {
        updateGame(gameArg)
    })

    socket.on('gameQuitted', async (payload) => {
        if (payload.userQuit.id != storeAuth.userId) {
            toast({
                title: 'Game Quit',
                description:
                    `${payload.userQuit.name} has quitted game #${payload.game.id}, giving you the win!`,
            })
        }
        updateGame(payload.game)
    })
    
    socket.on('gameInterrupted', async (gameArg) => {
        gameArg.interrupted = true
        updateGame(gameArg)
        toast({
            title: 'Game Interruption',
            description:
                `Game #${gameArg.id} was interrupted because your opponent has gone offline!`,
            variant: 'destructive'
        })
    })

    return {
        games, game, totalGames, playerNumberOfCurrentUser, fetchPlayingGames, startGame, flipCard, quit, close
    }
})
