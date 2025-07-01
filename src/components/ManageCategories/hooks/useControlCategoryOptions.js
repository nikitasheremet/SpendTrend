import { sleep } from '@/helpers/sleep';
import { nextTick, ref } from 'vue';
export function useControlCategoryOptions() {
    const isOptionsOpen = ref(false);
    function toggleOptions() {
        isOptionsOpen.value = !isOptionsOpen.value;
    }
    async function closeOptions() {
        const ONE_HUNDRED_MS_TO_ALLOW_MODAL_TO_OPEN = 100;
        await sleep(ONE_HUNDRED_MS_TO_ALLOW_MODAL_TO_OPEN);
        await nextTick();
        isOptionsOpen.value = false;
    }
    return {
        isOptionsOpen,
        toggleOptions,
        closeOptions,
    };
}
