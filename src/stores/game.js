import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import Router from "@/router/index.js";
import {useErrorStore} from "@/stores/error.js";
import {toast} from "@/components/ui/toast/index.js";
import {ToastAction} from "radix-vue";
import router from "@/router/index.js";


export const useGameStore = defineStore('game', () => {
    const listOfGames = ref([])
    const storeError = useErrorStore();
    const totalPages = ref(1);


    const loadGames = async (currentPage) => {
        const response = await axios.get("/games", {
            params: {
                page: currentPage
            }
        });


        totalPages.value = response.data.meta.last_page;

        listOfGames.value = response.data.data.map((game) => ({
            id: game.id,
            createdUser: game.created_user,
            winnerUser: game.winner,
            winner_nickname: game.winner_nickname,
            type: game.type,
            status: game.status,
            began_at: game.began_at,
            ended_at: game.ended_at,
            total_time: game.total_time,
            total_turns_winner: game.total_turns_winner,
            board_size: game.board_size,
            board_id: game.board_id,
            custom: game.custom,
        }));
    }

    const getIndexOfGame= (gameId) => {
        return listOfGames.value.findIndex((p) => p.id === gameId)
    }


    const fetchGame = async (gameId) => {
        storeError.resetMessages()
        const response = await axios.get('games/' + gameId)
        const index = getIndexOfGame(gameId)
        if (index > -1) {
            // Instead of a direct assignment, object is cloned/copied to the array
            // This ensures that the object in the array is not the same as the object fetched
            listOfGames.value[index] = Object.assign({}, response.data.data)
        }
        return response.data.data
    }

    const insertGame = async (game) => {
        storeError.resetMessages()
        try {
            const response = await axios.post('/games', game)
            console.log(response.data.data)
            listOfGames.value.push(response.data.data)
            toast({
                description: `Game #${response.data.data.id} 
                              was created!`
            })
            return response.data.data
        } catch (e) {
            storeError.setErrorMessages(e.response.data.message, e.response.data.errors, e.response.status, 'Error creating game!')
            return false
        }
    }

    const updateGame = async (game) => {
        storeError.resetMessages()
        try {
            const response = await axios.put('games/' + game.id, game)
            const index = getIndexOfGame(game.id)
            if (index > -1) {
                // Instead of a direct assignment, object is cloned/copied to the array
                // This ensures that the object in the array is not the same as the object fetched
                listOfGames.value[index] = Object.assign({}, response.data.data)
            }
            toast({
                description: 'Game has been updated correctly!',
            })
            console.log(response.data.data)
            return response.data.data
        } catch (e) {
            storeError.setErrorMessages(e.response.data.message, e.response.data.errors, e.response.status, 'Error updating project!')
            return false
        }
    }




    return{loadGames, listOfGames, insertGame, fetchGame, updateGame, totalPages};
});