<script setup lang="ts">
import { onMounted } from 'vue'
import { authClient } from '../lib/auth-client'
import router from '@/router'
import Button from '@/components/DesignSystem/Button/Button.vue'

onMounted(async () => {
  const { data: session } = await authClient.getSession()
  if (session?.session && new Date() < new Date(session.session.expiresAt)) {
    router.push('/')
  }
})

async function signIn() {
  await authClient.signIn.social({
    provider: 'google',
    callbackURL: import.meta.env.VITE_CALLBACK_URL,
  })
  const { data: session } = await authClient.getSession()
  if (session?.session) {
    router.push('/')
  }
}
</script>

<template>
  <div class="flex flex-col items-center justify-center h-full gap-4">
    <h1 class="text-2xl font-bold">Login</h1>
    <p>Please click the button below to sign in with Google.</p>
    <Button @click="signIn">Sign In with Google</Button>
  </div>
</template>

<style scoped></style>
