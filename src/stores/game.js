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
        }));
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


    return{loadGames, listOfGames, insertGame};
});