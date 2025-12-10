import { provide, TemplateRef } from 'vue'
import { POPOVER_SYMBOL } from '@/types/providedSymbols'

export function useProvidePopover(popoverRef: TemplateRef) {
  provide(POPOVER_SYMBOL, popoverRef)
}
