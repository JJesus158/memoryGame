<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="w-full max-w-md bg-white rounded-lg shadow-md p-6">
      <h2 class="text-2xl font-bold text-center text-gray-700 mb-6">Register</h2>
      <form @submit.prevent="register" class="space-y-4">
        <!-- Name -->
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
          <input
              id="name"
              v-model="name"
              type="text"
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter the admin name"
              required
          />
        </div>

        <!-- Email -->
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
          <input
              id="email"
              v-model="email"
              type="email"
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter the admin email"
              required
          />
        </div>

        <!-- Password -->
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
          <input
              id="password"
              v-model="password"
              type="password"
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter the admin password"
              required
          />
        </div>

        <!-- Confirm Password -->
        <div>
          <label for="passwordConfirmation" class="block text-sm font-medium text-gray-700">Confirm Password</label>
          <input
              id="passwordConfirmation"
              v-model="passwordConfirmation"
              type="password"
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Confirm the admin password"
              required
          />
        </div>

        <!-- Nickname -->
        <div>
          <label for="nickname" class="block text-sm font-medium text-gray-700">Nickname</label>
          <input
              id="nickname"
              v-model="nickname"
              type="text"
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter the admin nickname"
              required
          />
        </div>

        <!-- Profile Photo -->
        <div>
          <label for="photo" class="block text-sm font-medium text-gray-700">Profile Photo</label>
          <input
              id="photo"
              type="file"
              @change="handlePhotoUpload"
              accept="image/*"
              class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border file:border-gray-300 file:text-sm file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
          />
        </div>

        <!-- Submit Button -->
        <button
            type="submit"
            class="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md shadow-md transition duration-200"
        >
          Register
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth.js";

const authStore = useAuthStore();

// Form inputs
const name = ref("");
const email = ref("");
const password = ref("");
const passwordConfirmation = ref("");
const nickname = ref("");
const photo = ref(null); // Base64 image string

// Handle photo upload
const handlePhotoUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      photo.value = reader.result; // Base64 string
    };
    reader.readAsDataURL(file);
  }
};


const register = async () => {
  try {
    await authStore.registerProfile({
      name: name.value,
      email: email.value,
      password: password.value,
      password_confirmation: password.value,
      nickname: nickname.value,
      photo: photo.value,
    });
    console.log("Registration successful!");
  } catch (error) {
    console.error("Error during registration:", error);
  }
};
</script>


