<script setup lang="ts">
import { watchEffect } from 'vue'
import Button from '../Button/Button.vue'

const {
  isModalOpen,
  class: className,
  closeText,
  showCloseButton = true,
  closeOnEsc = false,
  closeOnBackdropClick = false,
} = defineProps<{
  isModalOpen: boolean
  class?: string
  closeText?: string
  showCloseButton?: boolean
  closeOnEsc?: boolean
  closeOnBackdropClick?: boolean
}>()
const emit = defineEmits<{
  modalClosed: []
}>()

// Tracks whether the current press started on the backdrop itself, so a drag
// that begins inside the content (e.g. selecting text) and is released on the
// backdrop doesn't count as a backdrop click.
let pressStartedOnBackdrop = false

watchEffect((onCleanup) => {
  if (!isModalOpen || !closeOnEsc) return
  document.addEventListener('keydown', handleKeydown)
  onCleanup(() => document.removeEventListener('keydown', handleKeydown))
})

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') emit('modalClosed')
}

function handleBackdropMousedown(event: MouseEvent) {
  pressStartedOnBackdrop = event.target === event.currentTarget
}

function handleBackdropClick(event: MouseEvent) {
  const clickedBackdrop = pressStartedOnBackdrop && event.target === event.currentTarget
  pressStartedOnBackdrop = false
  if (closeOnBackdropClick && clickedBackdrop) emit('modalClosed')
}
</script>

<template>
  <div
    v-if="isModalOpen"
    id="modal-outer-container"
    @mousedown="handleBackdropMousedown"
    @click="handleBackdropClick"
  >
    <div id="modal-inner-container" role="dialog" aria-modal="true" :class="className">
      <div v-if="showCloseButton" class="modal-close-container">
        <Button id="modal-close-button" @click="emit('modalClosed')">{{
          closeText || 'Close'
        }}</Button>
      </div>
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
#modal-outer-container {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  z-index: 2000;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
}
#modal-inner-container {
  padding: 16px;
  padding-bottom: 24px;
  background: white;
}

.modal-close-container {
  display: flex;
  justify-content: end;
  margin-bottom: 16px;
}
</style>
