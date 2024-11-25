<script setup>
import { useAuthStore } from '@/stores/auth'
import Toaster from '@/components/ui/toast/Toaster.vue'
import GlobalAlertDialog from "@/common/GlobalAlertDialog.vue";
import ChatBox from '@/components/ChatBox.vue'
import {useTemplateRef, provide, ref} from "vue";

const alertDialog = useTemplateRef('alert-dialog')
console.log(alertDialog)
provide('alertDialog', alertDialog)

const storeAuth = useAuthStore()
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
    </div>
    <div class="relative flex flex-row items-center">
      <img v-show="storeAuth.user" class="w-14 h-14 rounded-full"
           :src="storeAuth.userPhotoUrl" alt="Rounded avatar" @click="toggleDropDowntMenu">
      <div v-if="dropDownMenu" class="absolute right-0 top-full mt-2 bg-white shadow-md rounded p-2">
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
