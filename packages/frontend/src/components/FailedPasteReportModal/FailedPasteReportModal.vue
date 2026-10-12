<script setup lang="ts">
import { computed, inject, ref } from 'vue'
import Modal from '@/components/DesignSystem/Modal/Modal.vue'
import Button from '@/components/DesignSystem/Button/Button.vue'
import Input from '@/components/DesignSystem/Input.vue'
import { createFailedPasteReport } from '@/gateway/failedPasteReport/createFailedPasteReport'
import { REPORT_BANKS, type ReportBank } from '@contracts/failedPasteReport/createFailedPasteReport'
import { HttpError } from '@/gateway/httpError'
import MessagePopover from '@/components/DesignSystem/Popover/MessagePopover.vue'
import type { LastAddDataPaste } from '@/types/lastAddDataPaste'
import type { PopoverOptions, PopoverRef } from '@/types/designSystem'
import { POPOVER_SYMBOL } from '@/types/providedSymbols'

const TOAST_TIMEOUT_MS = 5000
const REPORT_SENT_MESSAGE = 'Thanks — your report was sent'
const REPORT_FAILED_MESSAGE = "Your report couldn't be sent. Please try again."
const REPORTING_UNAVAILABLE_MESSAGE =
  "Reporting isn't available right now, so your report couldn't be sent."
const STATUS_SERVICE_UNAVAILABLE = 503
const WHAT_WILL_BE_SENT_NOTICE =
  'We’ll send your bank, what went wrong, the app version, your browser, when you pasted, the clipboard formats and how many expenses and incomes were added, so we can fix the importer.'
const OTHER_BANK = 'Other'
const OTHER_BANK_NAME_MAX_LENGTH = 100
const MESSAGE_MAX_LENGTH = 2000
const BANK_ERROR = 'Choose your bank'
const OTHER_BANK_NAME_ERROR = `Enter your bank's name, in up to ${OTHER_BANK_NAME_MAX_LENGTH} characters`
const MESSAGE_ERROR = `Describe what went wrong, in up to ${MESSAGE_MAX_LENGTH} characters`

const { isModalOpen, lastPaste } = defineProps<{
  isModalOpen: boolean
  lastPaste: LastAddDataPaste
}>()
const emit = defineEmits<{
  modalClosed: []
  reportSent: []
}>()

const popover = inject<PopoverRef>(POPOVER_SYMBOL)
const bank = ref<ReportBank | ''>('')
const otherBankName = ref('')
const message = ref('')
const hasTriedToSend = ref(false)
const isSending = ref(false)

const isOtherBank = computed(() => bank.value === OTHER_BANK)
const isBankValid = computed(() => bank.value !== '')
const isOtherBankNameValid = computed(() => {
  const trimmedName = otherBankName.value.trim()
  return !isOtherBank.value || isWithinLength(trimmedName, OTHER_BANK_NAME_MAX_LENGTH)
})
const isMessageValid = computed(() => isWithinLength(message.value.trim(), MESSAGE_MAX_LENGTH))

async function sendReport() {
  hasTriedToSend.value = true
  if (!bank.value || !isOtherBankNameValid.value || !isMessageValid.value) {
    return
  }

  isSending.value = true
  try {
    await createFailedPasteReport({
      bank: bank.value,
      ...(isOtherBank.value && { otherBankName: otherBankName.value.trim() }),
      message: message.value.trim(),
      appVersion: __APP_VERSION__,
      userAgent: window.navigator.userAgent,
      pastedAt: lastPaste.pastedAt,
      clipboardTypes: lastPaste.clipboardTypes,
      expenseCount: lastPaste.expenseCount,
      incomeCount: lastPaste.incomeCount,
    })
  } catch (error) {
    showToast(describeSendFailure(error), { type: 'error' })
    return
  } finally {
    isSending.value = false
  }

  showToast(REPORT_SENT_MESSAGE)
  resetForm()
  emit('reportSent')
}

function showToast(toastMessage: string, options: PopoverOptions = {}) {
  popover?.value?.showPopover(
    MessagePopover,
    { message: toastMessage },
    { timeout: TOAST_TIMEOUT_MS, ...options },
  )
}

function describeSendFailure(error: unknown): string {
  if (error instanceof HttpError && error.status === STATUS_SERVICE_UNAVAILABLE) {
    return REPORTING_UNAVAILABLE_MESSAGE
  }
  return REPORT_FAILED_MESSAGE
}

function resetForm() {
  bank.value = ''
  otherBankName.value = ''
  message.value = ''
  hasTriedToSend.value = false
}

function isWithinLength(value: string, maxLength: number): boolean {
  return value.length > 0 && value.length <= maxLength
}
</script>

<template>
  <Modal :is-modal-open="isModalOpen" close-text="Cancel" @modal-closed="emit('modalClosed')">
    <form class="flex flex-col gap-4 w-[min(32rem,80vw)]" novalidate @submit.prevent="sendReport">
      <h2 class="text-lg font-semibold">Report a failed paste</h2>
      <p class="text-sm text-gray-700">{{ WHAT_WILL_BE_SENT_NOTICE }}</p>
      <label class="flex flex-col gap-1">
        Bank
        <select v-model="bank" class="border border-gray-500 rounded-sm px-2 py-1">
          <option value="" disabled>Select a bank</option>
          <option v-for="bankOption in REPORT_BANKS" :key="bankOption" :value="bankOption">
            {{ bankOption }}
          </option>
        </select>
      </label>
      <p v-if="hasTriedToSend && !isBankValid" class="text-sm text-red-700">{{ BANK_ERROR }}</p>
      <template v-if="isOtherBank">
        <label class="flex flex-col gap-1">
          Which bank?
          <Input v-model="otherBankName" variant="input-border" />
        </label>
        <p v-if="hasTriedToSend && !isOtherBankNameValid" class="text-sm text-red-700">
          {{ OTHER_BANK_NAME_ERROR }}
        </p>
      </template>
      <label class="flex flex-col gap-1">
        What went wrong?
        <Input v-model="message" variant="textarea-border" class="min-h-24" />
      </label>
      <p v-if="hasTriedToSend && !isMessageValid" class="text-sm text-red-700">
        {{ MESSAGE_ERROR }}
      </p>
      <div class="flex justify-end">
        <Button type="primary" :loading="isSending">Send report</Button>
      </div>
    </form>
  </Modal>
</template>
