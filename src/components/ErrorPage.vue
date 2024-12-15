<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="text-center p-8 rounded-lg shadow-lg bg-white max-w-md">
      <div class="text-red-500 mb-4">
        <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-20 w-20 mx-auto"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
        >
          <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M18.364 5.636l-12.728 12.728M5.636 5.636l12.728 12.728"
          />
        </svg>
      </div>
      <h1 class="text-4xl font-bold text-gray-800">
        {{ errorCode || 'Error' }}
      </h1>
      <p class="mt-2 text-lg text-gray-600">
        Oops! Something went wrong.
      </p>
      <p class="mt-1 text-sm text-gray-500">
        We're unable to process your request right now. Please try again later.
      </p>
      <button
          @click="goBack"
          class="mt-6 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg"
      >
        Go Back
      </button>
    </div>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";
import { computed } from "vue";

const route = useRoute();
const router = useRouter();

// Extract error code from route parameters
const errorCode = computed(() => route.params.errorCode);

// Navigate back to the previous page
const goBack = () => {
  router.push({ name: "home"});
};

</script>

<style scoped>
/* Add any custom animations or styles here if needed */
</style>
