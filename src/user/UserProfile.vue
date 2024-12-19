<script setup>
import { ref, computed, inject } from 'vue';
import { useAuthStore } from "@/stores/auth.js";

// Auth Store
const authStore = useAuthStore();
const alertDialog = inject("alertDialog");

// Computed Properties
const id = computed(() => authStore.userId || 0);
const name = computed(() => authStore.userName || "Anonymous");
const email = computed(() => authStore.userEmail || "Not Provided");
const type = computed(() => authStore.userType || "Standard");
const nickname = computed(() => authStore.userNickName || "Nickname");
const blocked = computed(() => authStore.userBlocked || false);
const brain_coins = computed(() => authStore.userBalance || 0);
const photoFileName = computed(() => {
  return authStore.userPhoto;
})

// Modal States
const showModal = ref(false);
const confirmationInput = ref("");

// Methods
const removeAccount = () => {
  showModal.value = true; // Open the modal to confirm account deletion
}

const closeModal = () => {
  showModal.value = false; // Close the modal
  confirmationInput.value = ''; // Reset the input
}

const handleAccountDeletion = () => {
  try {
    if (confirmationInput.value === "I confirm") {
      authStore.deleteAccount()
      closeModal();
      authStore.logout();
    } else {
      console.error("Invalid confirmation input");
    }
  }catch (error) {
    console.log(error);
  }
}

const logoutConfirmed = () => {
  authStore.logout();
}

const logout = () => {
  alertDialog.value.open(logoutConfirmed,
      'Logout confirmation?', 'Cancel', 'Yes, I want to log out',
      'Are you sure you want to log out? You can still access your account later with your credentials')
}
</script>

<template>
  <div class="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
    <div class="flex flex-col items-center">
      <img
          :src="photoFileName"
          alt="User Photo"
          class="w-24 h-24 rounded-full object-cover shadow-sm border-2 border-gray-200"
      />
      <h2 class="text-xl font-bold mt-4">{{ name }}</h2>
      <p class="text-gray-600 text-sm">{{ email }}</p>
      <p class="text-gray-500 text-sm mt-1 capitalize">Type: {{ type }}</p>
    </div>

    <div class="mt-6 border-t border-gray-200 pt-4">
      <div class="flex justify-between items-center mb-3">
        <span class="text-gray-500 text-sm">User ID:</span>
        <span class="font-medium text-gray-800">{{ id }}</span>
      </div>
      <div class="flex justify-between items-center mb-3">
        <span class="text-gray-500 text-sm">Brain Coins Balance:</span>
        <span class="font-medium text-gray-800">{{ brain_coins }}</span>
      </div>
      <div class="flex justify-between items-center mb-3">
        <span class="text-gray-500 text-sm">NickName:</span>
        <span class="font-medium text-gray-800">{{ nickname }}</span>
      </div>
    </div>
    <div class="flex flex-col">
      <button class="text-gray font-bold" @click="logout">
        Logout
      </button>


      <RouterLink class="flex text-green-900 font-bold justify-center mt-4" :to="{ name: 'editMe' }">Edit Account</RouterLink>

      <button v-if="type === 'P'" class="text-red-600 font-extrabold mt-4" @click="removeAccount">
        Delete Account
      </button>
    </div>

    <div v-if="showModal" class="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
      <div class="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 class="text-2xl font-bold text-center text-red-600">Delete Account Confirmation</h2>
        <p class="text-center text-gray-600 mt-4">
          Are you sure you want to delete your account? This action cannot be undone.
        </p>

        <div class="mt-6">
          <label
              for="confirmationInput"
              class="block text-sm font-medium text-gray-700"
          >
            Type "I confirm" to proceed:
          </label>
          <input
              id="confirmationInput"
              type="text"
              v-model="confirmationInput"
              class="mt-2 w-full p-2 border border-gray-300 rounded-md"
              placeholder="I confirm"
          />
        </div>
        <div class="mt-6 flex justify-between">
          <button
              @click="closeModal"
              class="bg-gray-200 text-gray-700 px-4 py-2 rounded-md"
          >
            Cancel
          </button>
          <button
              @click="handleAccountDeletion"
              class="bg-red-600 text-white px-4 py-2 rounded-md"
              :disabled="confirmationInput !== 'I confirm'"
          >
            Yes, Delete My Account
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
