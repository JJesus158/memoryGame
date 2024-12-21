import { ref, computed, inject } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import { useErrorStore } from '@/stores/error'
import { useAuthStore } from '@/stores/auth'


export const useLobbyStore = defineStore('lobby', () => {
    const storeAuth = useAuthStore()
    const storeError = useErrorStore()
    const socket = inject("socket")

    const games = ref([])
    const game = ref(null)

    const totalGames = computed(() => games.value.length)

    const webSocketServerResponseHasError = (response) => {
        if (response.errorCode) {
            storeError.setErrorMessages(response.errorMessage, [], response.errorCode)
            return true
        }
        return false
    }

    // when the lobby changes on the server, it is updated on the client
    socket.on('lobbyChanged', (lobbyGames) => {
        games.value = lobbyGames

        if (game.value != null) {
            for (let i = 0; i < lobbyGames.length; i++) {
                if (lobbyGames[i].id == game.value.id) {
                    game.value = lobbyGames[i]
                    break
                }
            }
        }
    })

    // fetch lobby games from the Websocket server
    const fetchGames = () => {
        storeError.resetMessages()
        socket.emit('fetchGames', (response) => {
            if (webSocketServerResponseHasError(response)) {
                return
            }
            
            games.value = response

            if (game.value != null) {
                for (let i = 0; i < response.length; i++) {
                    if (response[i].id == game.value.id) {
                        game.value = response[i]
                        break
                    }
                }
            }
        })
    }

    // add a game to the lobby
    const addGame = (gameInfo, onAdded) => {
        storeError.resetMessages()
        socket.emit('addGame', {
            boardId: gameInfo.boardId,
            numberOfCards: gameInfo.numberOfCards,
            numberOfPlayers: gameInfo.numberOfPlayers
        }, (response) => {
            if (webSocketServerResponseHasError(response)) {
                return
            }
            game.value = response
            onAdded()
        })
    }

    // remove a game from the lobby
    const removeGame = (id) => {
        storeError.resetMessages()
        socket.emit('removeGame', id, (response) => {
            if (webSocketServerResponseHasError(response)) {
                return
            }
        })
    }

    // Whether the current user can remove a specific game from the lobby
    const canRemoveGame = (game) => {
        return game.owner.user.id === storeAuth.userId
    }

    // join a game of the lobby
    const joinGame = (id, onJoined) => {
        storeError.resetMessages()
        socket.emit('joinGame', id, async (response) => {
            // callback executed after the join is complete
            if (webSocketServerResponseHasError(response)) {
                return
            }
            game.value = response
            onJoined()
        })
    }

    // Whether the current user can join a specific game from the lobby
    const canJoinGame = (game) => {
        return storeAuth.user && !game.players.some(player => player.user.id == storeAuth.userId)
    }

    return {
        games, game, totalGames, fetchGames, addGame, joinGame, canJoinGame, removeGame, canRemoveGame
    }
})
