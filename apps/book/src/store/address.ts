import { create } from 'zustand';

import { Nullable } from '@miyuan/types';

import { AddressItemModel } from '@/apis/address/model';

interface AddressState {
    addressItem: Nullable<AddressItemModel>;
}

interface AddressAction {
    updateAddressItem: (item: Nullable<AddressItemModel>) => void;
}

export const useAddressStore = create<AddressState & AddressAction>((set) => ({
    addressItem: null,
    updateAddressItem(addressItem) {
        set({ addressItem });
    },
}));
