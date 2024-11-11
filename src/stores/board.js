import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'


export const useBoardStore = defineStore('board', () => {
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

   return{listOfBoards, loadBoards}
});