<script setup>
import { useAuthStore } from '@/stores/auth'
import Toaster from '@/components/ui/toast/Toaster.vue'
import GlobalAlertDialog from "@/common/GlobalAlertDialog.vue";
import ChatBox from '@/components/ChatBox.vue'
import {useTemplateRef, provide, ref, watch} from "vue";

const alertDialog = useTemplateRef('alert-dialog')

console.log(alertDialog)
provide('alertDialog', alertDialog)

const storeAuth = useAuthStore()

watch(() => storeAuth.userBalance, (newBalance) => {
  // This will trigger every time userBalance changes
  console.log('User balance updated:', newBalance)
})

const logoutConfirmed = () => {
  storeAuth.logout()
  toggleDropDowntMenu()
}

const dropDownMenu = ref(false)

const toggleDropDowntMenu = () => {
  dropDownMenu.value = !dropDownMenu.value
}

const logout = () => {
  alertDialog.value.open(logoutConfirmed,
      'Logout confirmation?', 'Cancel', `Yes, I want to log out`,
      `Are you sure you want to log out? You can still access your account later with
your credentials.`)
}
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
    </div>
    <div class="relative flex flex-row items-center min-w-32 justify-center">
      <img v-show="storeAuth.user" class="w-14 h-14 rounded-full"
           :src="storeAuth.userPhotoUrl" alt="Rounded avatar" @click="toggleDropDowntMenu">
      <div v-if="dropDownMenu" class="absolute  top-full mt-2 bg-white shadow-md rounded p-2">
        <h1>{{storeAuth.userName}}</h1>
        <h1>{{storeAuth.userBalance}} coins</h1>
        <button class="text-red-600 font-bold" @click="logout">
          Logout
        </button>
      </div>
      <RouterLink v-show="!storeAuth.user" :to="{ name: 'login'}">Login</RouterLink>
    </div>
  </div>
  <ChatBox></ChatBox>
  <RouterView></RouterView>
</template>

<style scoped>

</style>
