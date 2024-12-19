<script setup>
import { onMounted, ref } from "vue";
import { useUserStore } from "@/stores/user.js";
import { useAuthStore } from "@/stores/auth.js";
import router from "@/router/index.js";

const userStore = useUserStore();
const listOfUsers = ref([]);
const currentPage = ref(1);
const totalPages = ref(1);
onMounted(async () => {
  await userStore.loadUsers(); // Load users from the store
  listOfUsers.value = userStore.listOfUsers;
  totalPages.value = userStore.totalPages;
});


const goToUser = (userID) => {
  router.push(`/users/${userID}`);
}

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
    <!-- User Table -->
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
          <th class="text-left px-4 py-2 border-b">Photo</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="user in listOfUsers" :key="user.id"
            @click="goToUser(user.id)"
        >
          <td class="px-4 py-2 border-b">{{ user.id }}</td>
          <td class="px-4 py-2 border-b">{{ user.name }}</td>
          <td class="px-4 py-2 border-b">{{ user.email }}</td>
          <td class="px-4 py-2 border-b">{{ user.type }} </td>
          <td class="px-4 py-2 border-b">{{ user.blocked }}</td>
          <td class="px-4 py-2 border-b">{{user.brain_coins}}</td>
          <td class="px-4 py-2 border-b">{{user.photoFileName}}</td>

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
</template>

