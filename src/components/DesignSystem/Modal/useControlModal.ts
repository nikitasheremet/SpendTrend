import { ref, type Ref } from 'vue'

export function useControlModal(): {
  isModalOpen: Ref<boolean>
  openModal: () => void
  closeModal: () => void
} {
  const isModalOpen = ref(false)

  function openModal() {
    isModalOpen.value = true
  }

  function closeModal() {
    isModalOpen.value = false
  }

  return {
    isModalOpen,
    openModal,
    closeModal,
  }
}
