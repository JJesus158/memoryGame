<script setup>
import { useAuthStore } from '@/stores/auth'
import Toaster from '@/components/ui/toast/Toaster.vue'
import GlobalAlertDialog from "@/common/GlobalAlertDialog.vue";
import GlobalInputDialog from '@/common/GlobalInputDialog.vue'
import { useTemplateRef, provide, ref, computed, inject } from "vue";
import { useRoute } from "vue-router";
import { useChatStore } from './stores/chat';

const alertDialog = useTemplateRef('alert-dialog')
provide('alertDialog', alertDialog)

const inputDialog = useTemplateRef('input-dialog')
provide('inputDialog', inputDialog)

const storeAuth = useAuthStore()
const storeChat = useChatStore()
const socket = inject('socket')

const route = useRoute();
const isProfilePage = computed(() => route.name === ('me' && 'login'));

let userDestination = null
socket.on('privateMessage', (messageObj) => {
    userDestination = messageObj.user
    inputDialog.value.open(
        handleMessageFromInputDialog,
        'Message from ' + messageObj.user.name,
        `This is a private message sent by ${messageObj?.user?.name}!`,
        'Reply Message', '',
        'Close', 'Reply',
        messageObj.message
    )
})

const handleMessageFromInputDialog = (message) => {
    storeChat.sendPrivateMessageToUser(userDestination, message)
}
</script>


<template>
  <Toaster></Toaster>
  <GlobalAlertDialog ref="alert-dialog"></GlobalAlertDialog>
  <GlobalInputDialog ref="input-dialog"></GlobalInputDialog>
  <div class="flex flex-row justify-between items-center m-4 min-h-14">
    <div class="flex space-x-4">
      <RouterLink :to="{ name: 'home'}" >Memory Game</RouterLink>
      <RouterLink :to="{ name: 'newgame'}" >
        New Game
      </RouterLink>
      <RouterLink v-show="storeAuth.user" :to="{ name: 'games'}" >
        Games
      </RouterLink>
      <RouterLink v-show="storeAuth.user" :to="{name: 'shop'}">Shop</RouterLink>
      <RouterLink v-show="storeAuth.user" :to="{ name: 'me' }">Profile</RouterLink>
      <RouterLink :to="{ name: 'statistics' }">Statistics</RouterLink>
      <RouterLink v-show="storeAuth.userType === 'A'" :to="{ name: 'users' }">Users</RouterLink>
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
  <RouterView></RouterView>
</template>


