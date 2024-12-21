<script setup>
import Lobby from './Lobby.vue'
import Chat from '@/components/chat/Chat.vue'
import { useAuthStore} from '@/stores/auth'
import CreateMultiGameDialog from './CreateMultiGameDialog.vue';
import { ref, useTemplateRef } from 'vue';

const storeAuth = useAuthStore()

const dialog = useTemplateRef("dialog")

const showCreateGame = () => {
    dialog.value.open()
}
</script>
<template>
    <div class="absolute items-center w-full h-full bg-gradient-to-br from-blue-500 to-indigo-800 text-white">
        <div class="flex flex-row columns-2 space-x-4 px-8">
            <Chat class="grow shrink basis-0 bg-white text-black"></Chat>
            <Lobby class="grow shrink basis-0 bg-white text-black" :showCreateGame="showCreateGame"></Lobby>
        </div>
    </div>
    <CreateMultiGameDialog ref="dialog"></CreateMultiGameDialog>
</template>