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

    const loadGames = async () => {
        const response = await axios.get("/games");
        listOfGames.value = response.data.data.map((game) => ({
            id: game.id,
            created_user_id: game.created_user_id,
            winner_user_id: game.winner_user_id,
            type: game.type,
            status: game.status,
            began_at: game.began_at,
            ended_at: game.ended_at,
            total_time: game.total_time,
            board_id: game.board_id,
            custom: game.custom,
        }));
    }

    const getIndexOfProject = (gameId) => {
        return listOfGames.value.findIndex((p) => p.id === gameId)
    }


    const formatDate = (date) => {
        const pad = (num) => num.toString().padStart(2, '0');
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
    };

    const fetchGame = async (gameId) => {
        storeError.resetMessages()
        const response = await axios.get('games/' + gameId)
        const index = getIndexOfProject(gameId)
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
            storeError.setErrorMessages(e.response.data.message, e.response.data.errors, e.response.status, 'Error creating project!')
            return false
        }
    }

    const updateGame = async (game) => {
        storeError.resetMessages()
        try {
            console.log(game)
            console.log(game.id)
            const response = await axios.put('games/' + game.id, game)
            const index = getIndexOfProject(game.id)
            if (index > -1) {
                // Instead of a direct assignment, object is cloned/copied to the array
                // This ensures that the object in the array is not the same as the object fetched
                listOfGames.value[index] = Object.assign({}, response.data.data)
            }
            toast({
                description: 'Project has been updated correctly!',
            })
            return response.data.data
        } catch (e) {
            storeError.setErrorMessages(e.response.data.message, e.response.data.errors, e.response.status, 'Error updating project!')
            return false
        }
    }

    const deleteGame = async (project) => {
        storeError.resetMessages()
        try {
            await axios.delete('projects/' + project.id)
            const index = getIndexOfProject(project.id)
            if (index > -1) {
                projects.value.splice(index, 1)
            }
            return true
        } catch (e) {
            storeError.setErrorMessages(e.response.data.message, e.response.data.errors, e.response.status, 'Error deleting project!')
            return false
        }
    }


    return{loadGames, listOfGames, insertGame, fetchGame, updateGame, formatDate};
});