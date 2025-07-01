import { type Ref } from 'vue';
export declare function useControlModal(): {
    isModalOpen: Ref<boolean>;
    openModal: () => void;
    closeModal: () => void;
};
