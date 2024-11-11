<script setup>


import axios from "axios";
import {onMounted, ref} from "vue";
const listOfGames = ref([])

const loadGames = async () => {
  const response = await axios.get("/games");
  listOfGames.value = response.data.data.map((game) => ({
    id: game.id,
    createdUserId: game.created_user_id,
    winnerUserId: game.winner_user_id,
    type: game.type,
    status: game.status,
    beganAt: game.began_at,
    endedAt: game.ended_at,
    totalTime: game.total_time,
    boardId: game.board_id,
    custom: game.custom, // Assuming this is already JSON format
    createdAt: game.created_at,
    updatedAt: game.updated_at,
  }));
}
onMounted(()=>{
  loadGames();
})

</script>

<template>
<h1>afds</h1>
</template>

