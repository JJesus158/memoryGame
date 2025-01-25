<script setup>
import { ref } from 'vue';

const isMenuOpen = ref(true);
</script>

<template>
  <div :class="[
      'flex flex-col px-2 pt-6 sm:p-6 bg-black h-screen text-white ',
      isMenuOpen ? 'lg:w-1/5 md:w-1/4 w-2/5' : 'w-20 items-center'
    ]" >
    <div class="flex-row flex w-max">
      <button @click="isMenuOpen = !isMenuOpen">
        <svg class="h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"  fill="white"><path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/></svg>
      </button>
      <b v-show="isMenuOpen" class="px-3.5">Leiriweesti</b>
    </div>

    <div class="flex flex-row pt-10 w-max">
      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="white"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg>
      <h1 v-show="isMenuOpen" class="pl-1.5 ">Create New</h1>
    </div>

    <div class="flex flex-row pt-3 w-max">
      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="white"><path d="M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z"/></svg>
      <h1 v-show="isMenuOpen" class="pl-1.5 ">Home</h1>
    </div>

    <div class="flex flex-row pt-3 w-max">
      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="white"><path d="M120-520v-320h320v320H120Zm0 400v-320h320v320H120Zm400-400v-320h320v320H520Zm0 400v-320h320v320H520ZM200-600h160v-160H200v160Zm400 0h160v-160H600v160Zm0 400h160v-160H600v160Zm-400 0h160v-160H200v160Zm400-400Zm0 240Zm-240 0Zm0-240Z"/></svg>
      <h1 v-show="isMenuOpen" class="pl-1.5 ">LL Library</h1>
    </div>

  </div>
</template>

<style scoped>

</style>