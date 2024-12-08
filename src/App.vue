<script setup>
import { useAuthStore } from '@/stores/auth'
import Toaster from '@/components/ui/toast/Toaster.vue'
import GlobalAlertDialog from "@/common/GlobalAlertDialog.vue";
import ChatBox from '@/components/ChatBox.vue'
import {useTemplateRef, provide, ref, watch, computed} from "vue";
import {useRoute} from "vue-router";

const alertDialog = useTemplateRef('alert-dialog')
provide('alertDialog', alertDialog)

const storeAuth = useAuthStore()

const route = useRoute();
const isProfilePage = computed(() => route.name === 'me');

</script>

<template>
  <Toaster></Toaster>
  <GlobalAlertDialog ref="alert-dialog"></GlobalAlertDialog>
  <div class="flex flex-row justify-between items-center m-4">
    <div class="flex space-x-4">
      <b>MemoryGame</b>
      <RouterLink :to="{ name: 'newgame'}" >
        NewGame
      </RouterLink>
      <RouterLink :to="{ name: 'games'}" >
        Games
      </RouterLink>
      <RouterLink :to="{name: 'shop'}">Shop</RouterLink>
      <RouterLink :to="{ name: 'me' }">Profile</RouterLink>
    </div>
    <div class="relative flex flex-row items-center min-w-32 justify-center">
      <RouterLink v-if="storeAuth.user && !isProfilePage" :to="{ name: 'me' }">
        <img
            class="w-14 h-14 rounded-full"
            :src="storeAuth.userPhoto"
            alt="Rounded avatar"
        />
      </RouterLink>
      <RouterLink v-else-if="!storeAuth.user && !isProfilePage" :to="{ name: 'login' }">Login</RouterLink>
    </div>
  </div>
  <ChatBox></ChatBox>
  <RouterView></RouterView>
</template>

<style scoped>

</style>
