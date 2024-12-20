<script setup>
import { useTransactionStore } from "@/stores/transaction.js";
import { onMounted, ref } from "vue";
import {useAuthStore} from "@/stores/auth.js";


const storeTransaction = useTransactionStore();
const storeAuth = useAuthStore()
const listOfTransactions = ref([]);
const currentPage = ref(1);
const totalPages = ref(1);

const paymentType = ref("");
const reference = ref("");
const value = ref(0);

const processPayment = () => {
  if (!paymentType.value || !reference.value || value.value <= 0) {
    alert("Please fill all the fields correctly.");
    return;
  }

  const paymentData = {
    "type": paymentType.value,
    "reference": reference.value,
    "value": value.value,
  };
  storeTransaction.insertTransaction(paymentData)


};

onMounted(async () => {
  await storeTransaction.loadTransactions(1);
  listOfTransactions.value = storeTransaction.listOfTransactions;
  totalPages.value = storeTransaction.totalPages;
});

const loadPage = async (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    await storeTransaction.loadTransactions(page);
    listOfTransactions.value = storeTransaction.listOfTransactions;
  }
};
</script>

<template>
  <div class="min-h-screen bg-gray-100 p-6">
    <div v-show="storeAuth.userType === 'P'">

      <!-- Header -->
      <div class="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-4">
        <h1 class="text-2xl font-bold text-gray-800">Purchase Brain Coins</h1>
        <p class="text-sm text-gray-500 mt-1">
          Select a payment method, enter the reference, and amount (in €). Note: Ensure input matches the required format for each type.
        </p>
      </div>

      <div class="max-w-6xl mx-auto mt-4 bg-white rounded-lg shadow-md p-4">
        <form @submit.prevent="processPayment" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700" for="paymentType">Payment Type</label>
            <select
                id="paymentType"
                v-model="paymentType"
                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            >
              <option value="" disabled>Select payment type</option>
              <option value="MBWAY">MBWAY</option>
              <option value="PAYPAL">PAYPAL</option>
              <option value="IBAN">IBAN</option>
              <option value="MB">MB</option>
              <option value="VISA">VISA</option>
            </select>
            <p class="text-xs text-gray-500 mt-1">
              Format varies by type: MBWAY (9 digits, starts with 9), PAYPAL (email), IBAN (2 letters + 23 digits), MB (5-9 digits with hyphen), VISA (16 digits, starts with 4).
            </p>
          </div>

          <!-- Reference -->
          <div>
            <label class="block text-sm font-medium text-gray-700" for="reference">Reference</label>
            <input
                id="reference"
                v-model="reference"
                type="text"
                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>

          <!-- Amount -->
          <div>
            <label class="block text-sm font-medium text-gray-700" for="value">Amount (€)</label>
            <input
                id="value"
                v-model="value"
                type="number"
                min="1"
                max="99"
                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                placeholder="Enter amount (1-99)"
            />
            <p class="text-xs text-gray-500 mt-1">
              Limits: MBWAY (€5), PAYPAL (€10), IBAN (€50), MB (€20), VISA (€30).
            </p>
          </div>

          <div>
            <button
                type="submit"
                class="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
            >
              Process Payment
            </button>
          </div>
        </form>
      </div>
    </div>
    <!-- Transaction History Section -->
    <div class="max-w-6xl mx-auto mt-8 bg-white rounded-lg shadow-md p-4">
      <h2 class="text-xl font-bold text-gray-800">Transaction History</h2>
      <p class="text-sm text-gray-500 mt-1">All your transactions are listed below.</p>

      <!-- Transactions Table -->
      <div class="overflow-x-auto mt-4">
        <table class="min-w-full border border-gray-200 table-fixed">
          <thead>
          <tr class="bg-gray-100 text-gray-800">
            <th class="text-left px-4 py-2 border-b">Date</th>
            <th class="text-left px-4 py-2 border-b">Type</th>
            <th class="text-left px-4 py-2 border-b">Value (€)</th>
            <th class="text-left px-4 py-2 border-b">Payment Type</th>
            <th class="text-left px-4 py-2 border-b">Reference</th>
            <th class="text-left px-4 py-2 border-b">Brain Coins</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="transaction in listOfTransactions" :key="transaction.id">
            <td class="px-4 py-2 border-b">{{transaction.transaction_datetime ? new Date(transaction.transaction_datetime).toLocaleString() : 'N/A' }}</td>
            <td class="px-4 py-2 border-b">{{ transaction.type }}</td>
            <td class="px-4 py-2 border-b">{{ transaction.euros }}</td>
            <td class="px-4 py-2 border-b">{{ transaction.payment_type ?? '-' }}</td>
            <td class="px-4 py-2 border-b">{{ transaction.payment_reference ?? '-' }}</td>
            <td class="px-4 py-2 border-b">{{ transaction.brain_coins }}</td>
          </tr>
          </tbody>
        </table>

        <!-- Pagination Controls -->
        <div class="flex justify-between items-center mt-4">
          <button
              @click="loadPage(currentPage - 1)"
              :disabled="currentPage === 1"
              class="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg disabled:bg-gray-200"
          >
            Previous
          </button>
          <span class="text-gray-700">Page {{ currentPage }} of {{ totalPages }}</span>
          <button
              @click="loadPage(currentPage + 1)"
              :disabled="currentPage === totalPages"
              class="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg disabled:bg-gray-200"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
