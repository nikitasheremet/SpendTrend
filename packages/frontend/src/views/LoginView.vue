<script setup lang="ts">
import { onMounted } from 'vue'
import { authClient } from '../lib/auth-client'
import router from '@/router'

onMounted(async () => {
  const { data: session } = await authClient.getSession()
  if (session?.session && new Date() < new Date(session.session.expiresAt)) {
    router.push('/')
  }
})

async function signIn() {
  await authClient.signIn.social({
    provider: 'google',
    callbackURL: 'http://localhost:5173',
  })
  const { data: session } = await authClient.getSession()
  if (session?.session) {
    router.push('/')
  }
}
</script>

<template>
  <div id="login-view">
    <h1>Login</h1>
    <p>Please click the button below to sign in with Google.</p>
    <button @click="signIn">Sign In with Google</button>
  </div>
</template>

<style scoped></style>
