<script setup>
import {onMounted, ref} from "vue";
import axios from "axios";
import MemoryGame from "@/MemoryGame.vue";

const listOfBoards = ref(null)
const selectedBoard = ref(null);


const loadBoards = async () => {
  const response = await axios.get("/boards");
  const boards = response.data.data
  listOfBoards.value = boards.map((board)=>{
        return {
          'id': board.id,
          'label': `${board.board_rows} x ${board.board_cols}`,
          'value': [{rows: board.board_rows,cols: board.board_cols}],
          'numberOfCards': board.numberOfCards
        }
      }
  )
}


const selectBoard = (board) => {
  selectedBoard.value = board;
}

onMounted(()=> {
  loadBoards();
})

</script>

<template>
  <div>
    <h2>Select a Board Size:</h2>
    <!-- Display boards as clickable list items -->
    <ul class="space-y-2">
      <li
          v-for="board in listOfBoards"
          :key="board.id"
          class="cursor-pointer bg-blue-200 p-3 rounded-lg hover:bg-blue-300"
          @click="selectBoard(board)"
      >
        {{ board.label }} ({{ board.value[0].rows * board.value[0].cols }} cards)
      </li>
    </ul>
    <MemoryGame v-if="selectedBoard" :listOfBoards="selectedBoard" />
  </div>
</template>

