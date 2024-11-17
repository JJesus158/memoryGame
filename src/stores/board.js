import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'


export const useBoardStore = defineStore('board', () => {
    const listOfBoards = ref(null)
    const board=ref(null)

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


    const fetchBoard = async (id) => {
            const response = await axios.get(`/boards/${id}`);
            const boardData = response.data.data;

            return {
                id: boardData.id,
                label: `${boardData.board_rows} x ${boardData.board_cols}`,
                value: [{ rows: boardData.board_rows, cols: boardData.board_cols }],
                numberOfCards: boardData.numberOfCards,
            };
    };



   return{listOfBoards, loadBoards, fetchBoard, board};
});