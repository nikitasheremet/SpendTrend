<script lang="ts" setup>
import Modal from '../DesignSystem/Modal/Modal.vue'
import Input from '../DesignSystem/Input.vue'
import ErrorComponent from '../DesignSystem/Error.vue'
import { computed, ref, watch } from 'vue'
import Spinner from '../DesignSystem/Spinner.vue'
import Button from '../DesignSystem/Button/Button.vue'

const isOpen = defineModel<boolean>({ required: true })
const { title, currentName, loading } = defineProps<{
  title: string
  currentName: string
  loading?: boolean
}>()

const emits = defineEmits<{
  update: [string]
}>()

const updatedName = ref<string>(currentName)
const error = ref<Error | undefined>(undefined)

const isUpdateDisabled = computed(() => {
  const trimmedName = updatedName.value.trim()
  return trimmedName === '' || trimmedName === currentName || loading
})

watch(isOpen, (newVal) => {
  if (newVal) {
    updatedName.value = currentName
    error.value = undefined
  }
})

function handleUpdate() {
  const trimmedName = updatedName.value.trim()
  if (trimmedName === '') {
    error.value = new Error('Name cannot be empty')
    return
  }
  if (trimmedName === currentName) {
    error.value = new Error('Name is the same as the current name')
    return
  }
  emits('update', trimmedName)
}

function closeModal() {
  isOpen.value = false
}

defineExpose({
  setError: (err: Error | undefined) => {
    error.value = err
  },
})
</script>

<template>
  <Modal class="w-9/10" :is-modal-open="isOpen" @modal-closed="closeModal" close-text="X">
    <div v-if="loading" class="flex flex-col items-center gap-4">
      <Spinner />
      <p>Updating...</p>
    </div>
    <div v-else class="flex flex-col gap-4">
      <p>{{ title }}</p>
      <Input type="text" v-model="updatedName" />
      <Button @click="handleUpdate" :disabled="isUpdateDisabled">Update</Button>
      <ErrorComponent v-if="error" :error="error" />
    </div>
  </Modal>
</template>

<style scoped></style>
