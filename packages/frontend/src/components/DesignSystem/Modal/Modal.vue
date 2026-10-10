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
      <div class="modal-content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Fixed to the viewport so the backdrop covers whatever part of the page is
   scrolled into view, and padded so the dialog never touches the edges. */
#modal-outer-container {
  position: fixed;
  inset: 0;
  padding: 16px;
  z-index: 2000;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
}
/* Capped to the backdrop's height; tall content scrolls inside .modal-content
   while the close button stays pinned at the top. */
#modal-inner-container {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  max-height: 100%;
  padding: 16px;
  padding-bottom: 24px;
  background: white;
}

.modal-content {
  min-height: 0;
  overflow-y: auto;
}

.modal-close-container {
  display: flex;
  justify-content: end;
  margin-bottom: 16px;
}
</style>
