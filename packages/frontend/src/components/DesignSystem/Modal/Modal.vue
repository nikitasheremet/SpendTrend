<script setup lang="ts">
import Button from '../Button/Button.vue'

const {
  isModalOpen,
  class: modalClass,
  closeText,
} = defineProps<{
  isModalOpen: boolean
  class?: string
  closeText?: string
}>()
defineEmits<{
  modalClosed: []
}>()
</script>

<template>
  <div id="modal-outer-container" v-if="isModalOpen">
    <div :class="modalClass" id="modal-inner-container">
      <div class="modal-close-container">
        <Button @click="$emit('modalClosed')" id="modal-close-button">{{
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
