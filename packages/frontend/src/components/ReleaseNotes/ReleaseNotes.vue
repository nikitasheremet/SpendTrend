<script setup lang="ts">
import { ref } from 'vue'
import Modal from '../DesignSystem/Modal/Modal.vue'
import type { Changelog } from './changelog'

// isLoggedIn is part of the input contract now; the automatic popup that
// depends on it arrives in a follow-up ticket.
const { appVersion, changelog } = defineProps<{
  appVersion: string
  isLoggedIn: boolean
  changelog: Changelog
}>()

const isModalOpen = ref(false)
</script>

<template>
  <footer class="px-5 py-2 text-center text-xs text-gray-500">
    <button type="button" class="cursor-pointer hover:underline" @click="isModalOpen = true">
      version: {{ appVersion }}
    </button>
  </footer>
  <Modal
    class="flex h-[70vh] w-[60vw] flex-col"
    :is-modal-open="isModalOpen"
    close-on-esc
    close-on-backdrop-click
    @modal-closed="isModalOpen = false"
  >
    <div class="min-h-0 flex-1 overflow-y-auto">
      <h2 class="mb-4 text-2xl font-bold">Release Notes:</h2>
      <section v-for="releaseNotes in changelog" :key="releaseNotes.version" class="mb-6">
        <h3 class="mb-2 text-xl font-semibold">{{ releaseNotes.version }}</h3>
        <h4 class="mt-2 font-semibold">Features</h4>
        <ul v-if="releaseNotes.features.length" class="list-disc pl-6">
          <li v-for="(feature, index) in releaseNotes.features" :key="index">{{ feature }}</li>
        </ul>
        <p v-else>No new features this release.</p>
        <h4 class="mt-2 font-semibold">Bug Fixes</h4>
        <ul v-if="releaseNotes.bugFixes.length" class="list-disc pl-6">
          <li v-for="(bugFix, index) in releaseNotes.bugFixes" :key="index">{{ bugFix }}</li>
        </ul>
        <p v-else>No bug fixes this release.</p>
      </section>
    </div>
  </Modal>
</template>
