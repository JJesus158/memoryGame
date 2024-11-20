<script setup>
import {computed, onMounted, ref} from "vue";
import axios from "axios";
import MemoryGame from "@/singleGame/Game.vue";
import { useBoardStore } from '@/stores/board'
const boardStore = useBoardStore();

onMounted(async () => {
  await boardStore.loadBoards();
});

const listOfBoards = computed(() => boardStore.listOfBoards);


</script>



<template>
  <div class="flex flex-col h-screen items-center w-screen">
    <h1 class="mt-20">Select a Game:</h1>
    <RouterLink v-for="board in listOfBoards" :to="{ name: 'game', params: { id: board.id}}" class="flex justify-between w-1/2 bg-blue-200 items-center h-1/6 m-5 p-10">
      <h1 class="text-4xl" >{{board.id}}</h1>
      <div class="flex flex-col">
        <h2 class="text-2xl">Number Of Pairs</h2>
        <h2 class="flex text-lg justify-center">{{board.numberOfCards/2}}</h2>
      </div>
      <div class="flex flex-col">
        <h2 class="text-2xl">Board</h2>
        <h2 class="flex justify-center text-lg">{{board.label}}</h2>
      </div>


    </RouterLink>
  </div>
</template>

