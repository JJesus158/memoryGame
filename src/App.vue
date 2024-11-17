<script setup>
import { useAuthStore } from '@/stores/auth'
import Toaster from '@/components/ui/toast/Toaster.vue'
import GlobalAlertDialog from "@/common/GlobalAlertDialog.vue";
import {useTemplateRef, provide} from "vue";

const alertDialog = useTemplateRef('alert-dialog')
console.log(alertDialog)
provide('alertDialog', alertDialog)

const storeAuth = useAuthStore()
const logoutConfirmed = () => {
  storeAuth.logout()
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
  <button @click="logout">LogOut</button>
  <RouterView></RouterView>
</template>

<style scoped>

</style>
