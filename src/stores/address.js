import { defineStore } from 'pinia';
import { addressService } from '@/services/api';

export const useAddressStore = defineStore('address', {
  state: () => ({
    addresses: [],
    selectedAddress: null,
    loading: false,
    error: null
  }),

  getters: {
    getAddresses: (state) => state.addresses,
    getSelectedAddress: (state) => state.selectedAddress
  },

  actions: {
    // Adres listesini getir
    async fetchAddresses() {
      this.loading = true;
      this.error = null;

      try {
        const response = await addressService.searchAddress();

        if (response.data.success) {
          this.addresses = response.data.data.results;
          return this.addresses;
        } else {
          this.error = response.data.message || 'Adresler yüklenirken bir hata oluştu.';
          return null;
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Adresler yüklenirken bir hata oluştu.';
        return null;
      } finally {
        this.loading = false;
      }
    },

    // Seçili adresi güncelle
    setSelectedAddress(address) {
      console.log('Seçilen adres:', address);
      this.selectedAddress = address;
      // Adresi localStorage'a kaydet
      localStorage.setItem('selectedAddress', JSON.stringify(address));
    }
  }
});
