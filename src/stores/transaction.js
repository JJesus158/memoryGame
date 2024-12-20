import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import Router from "@/router/index.js";
import {useErrorStore} from "@/stores/error.js";
import {toast} from "@/components/ui/toast/index.js";
import {useAuthStore} from "@/stores/auth.js";


export const useTransactionStore = defineStore('transaction', () => {

    const listOfTransactions = ref([]);
    const storeError = useErrorStore();
    const totalPages = ref(1);
    const authStore = useAuthStore();


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
    };


    const verifyTransaction = async (transaction) => {
        storeError.resetMessages()
        try {
            const response = await axios.post('https://dad-202425-payments-api.vercel.app/api/debit', transaction)
            console.log(response.data.status)
            return response.data.status
        } catch (e) {
            storeError.setErrorMessages(e.response.data.message, e.response.data.errors, e.response.status, 'Error creating transaction!')
            return false
        }
    };

    const insertTransaction = async (transaction) => {
        storeError.resetMessages()

        try {
            verifyTransaction(transaction);
            const response = await axios.post('/transactions', transaction)
            console.log(response.data.data)
            listOfTransactions.value.unshift(response.data.data)
            toast({
                description: `Transaction #${response.data.data.id} 
                              was created!`
            })
            console.log(response.data.data)
            await authStore.refreshUserInfo()
            return response.data.data
        } catch (e) {
            storeError.setErrorMessages(e.response.data.message, e.response.data.errors, e.response.status, 'Error creating transaction!')
            return false
        }
    }


    return{loadTransactions, listOfTransactions, totalPages, verifyTransaction, insertTransaction};
});