<script setup>
import { useAuthStore } from '@/stores/auth'
import { useTemplateRef, provide, ref, computed, inject } from "vue";
import { useRoute } from "vue-router";
import Navbar from "@/components/Navbar.vue";
import Home from "@/components/Home.vue";






</script>


<template>
  <div class="flex flex-row">
    <Navbar></Navbar>
    <Home></Home>
  </div>


</template>


