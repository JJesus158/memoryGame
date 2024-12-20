<script setup>
import { computed, onMounted, ref } from "vue";
import { useGameStore } from "@/stores/game.js";
import { useAuthStore } from "@/stores/auth.js";
import router from "@/router/index.js";
import {useUserStore} from "@/stores/user.js";

const userStore = useUserStore();
const listOfUsers = ref([]);
const currentPage = ref(1);
const totalPages = ref(1);

const storeAuth = useAuthStore();

onMounted(async () => {
  await userStore.loadUsers() // Load games from the store
  listOfUsers.value = userStore.listOfUsers;
  totalPages.value = userStore.totalPages;
});



const loadPage = async (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    await userStore.loadUsers(page);
    listOfUsers.value = userStore.listOfUsers;
  }
};
</script>


<template>
  <div class="min-h-screen bg-gray-100 p-6">
    <div class="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-4">
      <h1 class="text-2xl font-bold text-gray-800">List of Users</h1>
    </div>
    <!-- Games Table -->
    <div class="max-w-6xl mx-auto mt-8 bg-white rounded-lg shadow-md p-4">
      <table class="min-w-full border border-gray-200 table-fixed">
        <thead>
        <tr class="bg-gray-100 text-gray-800">
          <th class="text-left px-4 py-2 border-b">User ID</th>
          <th class="text-left px-4 py-2 border-b">Name</th>
          <th class="text-left px-4 py-2 border-b">Email</th>
          <th class="text-left px-4 py-2 border-b">Type</th>
          <th class="text-left px-4 py-2 border-b">Nickname</th>
          <th class="text-left px-4 py-2 border-b">Blocked</th>
          <th class="text-left px-4 py-2 border-b">Brain Coins</th>
          <th class="text-left px-4 py-2 border-b"></th>
          <th class="text-left px-4 py-2 border-b"></th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="user in listOfUsers" :key="user.id">
          <td class="px-4 py-2 border-b">{{ user.id }}</td>
          <td class="px-4 py-2 border-b">{{ user.name }}</td>
          <td class="px-4 py-2 border-b">{{ user.email }}</td>
          <td class="px-4 py-2 border-b">{{ user.type }}</td>
          <td class="px-4 py-2 border-b">{{ user.nickname }}</td>
          <td class="px-4 py-2 border-b">{{user.blocked}}</td>
          <td class="px-4 py-2 border-b">{{ user.brain_coins_balance}}</td>
          <td class="px-4 py-2 border-b">
            <button v-if="!user.blocked" @click="userStore.blockUser(user)"> <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="red"><path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q54 0 104-17.5t92-50.5L228-676q-33 42-50.5 92T160-480q0 134 93 227t227 93Zm252-124q33-42 50.5-92T800-480q0-134-93-227t-227-93q-54 0-104 17.5T284-732l448 448Z"/></svg></button>
            <button v-else @click="userStore.unblockUser(user)"> <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="yellow"><path d="M240-640h360v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85h-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640Zm0 480h480v-400H240v400Zm240-120q33 0 56.5-23.5T560-360q0-33-23.5-56.5T480-440q-33 0-56.5 23.5T400-360q0 33 23.5 56.5T480-280ZM240-160v-400 400Z"/></svg></button>
          </td>
          <td @click="userStore.deleteUser(user)" class="px-4 py-2 border-b"><button><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="black"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg> </button> </td>
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
    <div class="flex items-center justify-center mt-4 w-full">
      <RouterLink v-show="storeAuth.user" :to="{ name: 'registerAdmin' }" class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition flex items-center space-x-2">
        <span>Register Admin</span>
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
          <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/>
        </svg>
      </RouterLink>
    </div>

  </div>
</template>

