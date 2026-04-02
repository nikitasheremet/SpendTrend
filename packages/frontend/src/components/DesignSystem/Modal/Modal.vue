<script setup lang="ts">
import Button from '../Button/Button.vue'

const props = withDefaults(
  defineProps<{
    isModalOpen: boolean
    class?: string
    closeText?: string
    showCloseButton?: boolean
  }>(),
  {
    showCloseButton: true,
  },
)
defineEmits<{
  modalClosed: []
}>()
</script>

<template>
  <div v-if="props.isModalOpen" id="modal-outer-container">
    <div id="modal-inner-container" :class="props.class">
      <div v-if="props.showCloseButton" class="modal-close-container">
        <Button id="modal-close-button" @click="$emit('modalClosed')">{{
          props.closeText || 'Close'
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
