import { ref } from "vue";
import { defineStore } from "pinia";
import axios from "axios";
import { useErrorStore } from "@/stores/error.js";

export const useScoreBoardStore = defineStore("scoreBoard", () => {
    // Initialize the scores state
    const listOfGlobalScores = ref({
        singlePlayer: [],
        multiplayer: [],
    });

    const listOfPersonalScores = ref({
        singlePlayer: [],
        totalVictories: 0,
        totalLosses: 0,
    })
    // Error store for error handling
    const storeError = useErrorStore();




    // Function to load the global multiplayer scoreboard from the API
    const loadGlobalScoreBoard = async () => {
        try {
            const response = await axios.get("/scoreboard/global");

            const data = response.data.data;

            listOfGlobalScores.value.multiplayer = data.multiplayer.map((player) => ({
                nickname: player.nickname,
                victories: parseInt(player.total_victories, 10), // Ensure victories are integers
            }));

            listOfGlobalScores.value.singlePlayer = data.single_player.map((board) => ({
                boardSize: board.board_size,
                bestTimes: board.best_times.map((time) => ({
                    nickname: time.nickname,
                    time: parseFloat(time.time), // Ensure the time is numeric
                })),
                minTurns: Object.keys(board.min_turns).map((key) => ({
                    nickname: board.min_turns[key].nickname,
                    turns: parseInt(board.min_turns[key].turns, 10), // Ensure turns are integers
                })),
            }));
            console.log("Loaded multiplayer scores:", listOfGlobalScores.value.multiplayer);
        } catch (error) {
            console.error("Error loading multiplayer scoreboard:", error);

            // Save error in the error store if needed
            storeError.setError("Failed to load multiplayer scoreboard data. Please try again.");
        }
    };

    const loadPersonalSingleScoreBoard = async () => {
        try {
            const response = await axios.get("/scoreboard/personal");
            const data = response.data.data;
            console.log(data)
            listOfPersonalScores.value.singlePlayer = data.single_player.map((board) => ({
                boardSize: board.board_size,
                bestTimes: board.best_times.map((time) => ({
                    nickname: time.nickname,
                    time: parseFloat(time.time), // Ensure the time is numeric
                })),
                minTurns: Object.keys(board.min_turns).map((key) => ({
                    nickname: board.min_turns[key].nickname,
                    turns: parseInt(board.min_turns[key].turns, 10), // Ensure turns are integers
                })),
            }));
            listOfPersonalScores.value.totalVictories = data.multiplayer.total_victories;
            listOfPersonalScores.value.totalLosses = data.multiplayer.total_losses;
            console.log("Loaded single-player scores:", listOfPersonalScores.value.singlePlayer);
        } catch (error) {
            console.error("Error loading single-player scoreboard:", error);

            // Save error in the error store if needed
            storeError.setError("Failed to load single-player scoreboard data. Please try again.");
        }
    };

    return { listOfGlobalScores, loadGlobalScoreBoard,loadPersonalSingleScoreBoard,listOfPersonalScores };
});
