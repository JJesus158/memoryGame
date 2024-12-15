<script setup>
import { ref, inject } from 'vue';
import { useAuthStore } from "@/stores/auth.js";
import {useRouter} from "vue-router";

const router = useRouter();
const authStore = useAuthStore();
const alertDialog = inject("alertDialog");

// Reactive properties for form inputs
const newUserName = ref(authStore.userName || "");
const newUserEmail = ref(authStore.userEmail || "");
const newUserNickName = ref(authStore.userNickName || "");
const newUserPhoto = ref(""); // Will hold the Base64 string of the uploaded image
const fileInput = ref(null);

// Convert image file to Base64
const handlePhotoUpload = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    newUserPhoto.value = e.target.result; // Base64 string
  };
  reader.onerror = () => {
    console.error("Error reading the file");
    alertDialog.value.open(
        null,
        "Failed to process the image",
        "Close",
        "",
        "There was an error reading your image file. Please try again."
    );
  };
  reader.readAsDataURL(file); // Convert to Base64
};


const saveProfile = async () => {
    await authStore.updateProfile({
      name: newUserName.value,
      email: newUserEmail.value,
      nickname: newUserNickName.value,
      photo: newUserPhoto.value,
    });
    router.go(-1)
  }
</script>

<template>
  <div class="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
    <div class="border-t border-gray-200 pt-4 mt-6">
      <div class="mb-3">
        <label for="newUserName" class="block text-sm font-medium text-gray-700">User Name</label>
        <input
            id="newUserName"
            v-model="newUserName"
            class="mt-1 p-2 w-full border border-gray-300 rounded-md"
            placeholder="Enter your new name"
        />
      </div>

      <div class="mb-3">
        <label for="newUserEmail" class="block text-sm font-medium text-gray-700">Email</label>
        <input
            id="newUserEmail"
            v-model="newUserEmail"
            class="mt-1 p-2 w-full border border-gray-300 rounded-md"
            placeholder="Enter your new email"
        />
      </div>

      <div class="mb-3">
        <label for="newUserNickName" class="block text-sm font-medium text-gray-700">Nickname</label>
        <input
            id="newUserNickName"
            v-model="newUserNickName"
            class="mt-1 p-2 w-full border border-gray-300 rounded-md"
            placeholder="Enter your new nickname"
        />
      </div>

      <div class="mb-3">
        <label for="newUserPhoto" class="block text-sm font-medium text-gray-700">Profile Photo</label>
        <input
            id="newUserPhoto"
            type="file"
            ref="fileInput"
            @change="handleFileChange"
            class="mt-1 w-full p-2 border border-gray-300 rounded-md"
        />
        <p class="mt-1 text-sm text-gray-500">Upload a photo to update your profile picture.</p>
        <div v-if="newUserPhoto" class="mt-4">
          <img :src="newUserPhoto" alt="Profile Preview" class="w-24 h-24 rounded-full shadow-md" />
        </div>
      </div>

      <div class="flex justify-end mt-4">
        <button
            @click="saveProfile"
            class="bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          Save Changes
        </button>
      </div>
    </div>
  </div>
</template>
