import { create } from 'zustand';

// TODO: 抽离到shares

interface CommonState {
    loading: boolean;
}

interface CommonAction {
    updatePendingRequest: (num: number) => void;
}

export const useGlobalStore = create<CommonState & CommonAction>((set) => ({
    loading: false,
    updatePendingRequest(num: number) {
        set({ loading: num !== 0 });
    },
}));
