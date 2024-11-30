import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import Router from "@/router/index.js";
import {useErrorStore} from "@/stores/error.js";


export const useTransactionStore = defineStore('transaction', () => {

    const listOfTransactions = ref([]);
    const storeError = useErrorStore();
    const totalPages = ref(1);

    const formatDate = (dateString) => {
        const date = new Date(dateString); // Convert ISO string to Date object

        // Manually format the date as DD/MM/YYYY HH:mm:ss
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    };


    const loadTransactions = async (currentPage) => {
        const response = await axios.get("/transactions", {
            params: {
                page: currentPage
            }
        });
        totalPages.value = response.data.meta.last_page;
        listOfTransactions.value = response.data.data.map((transaction) => ({
            id: transaction.id,
            type: transaction.type,
            transaction_datetime: transaction.transaction_datetime,
            user_id: transaction.user_id,
            game_id: transaction.game_id,
            euros: transaction.euros,
            payment_type: transaction.payment_type,
            payment_reference: transaction.payment_reference,
            brain_coins: transaction.brain_coins,
        }));
    }


    return{loadTransactions, listOfTransactions, formatDate, totalPages};
});