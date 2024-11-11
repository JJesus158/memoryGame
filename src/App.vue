<script setup>
import {onMounted, provide, ref} from "vue";
import axios from "axios";

const listOfBoards = ref(null)


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

provide('listOfBoards', listOfBoards);

onMounted(()=> {
  loadBoards();
})
</script>

<template>
 <!-- <MemoryGame></MemoryGame> !-->
  <RouterView></RouterView>
</template>

<style scoped>

</style>
