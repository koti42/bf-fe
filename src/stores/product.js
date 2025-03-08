// src/stores/product.js
import { defineStore } from 'pinia';
import { productService } from '@/services/api';

export const useProductStore = defineStore('product', {
  state: () => ({
    product: null,
    detailPage: null,
    calendarDays: [],
    daySlots: [],
    selectedDate: null,
    selectedTimeSlot: null,
    loading: false,
    error: null
  }),

  getters: {
    getProduct: (state) => state.product,
    getDetailPage: (state) => state.detailPage,
    getCalendarDays: (state) => state.calendarDays,
    getDaySlots: (state) => state.daySlots,
    getSelectedDate: (state) => state.selectedDate,
    getSelectedTimeSlot: (state) => state.selectedTimeSlot,
    isInStock: (state) => state.product?.status === "Hazır" || false,
    hasPrice: (state) => state.detailPage?.pricing != null,
    isDiscounted: (state) => state.detailPage?.pricing?.hasDiscount || false,
    getProductImages: (state) => {
      const detailImages = state.detailPage?.productDetailImages || [];
      const listImages = state.detailPage?.productListImages || [];
      return [...detailImages, ...listImages].filter(img => img && img.imagePath);
    }
  },

  actions: {
    // Ürün detayını getir
    async fetchProductDetail(productSlug) {
      this.loading = true;
      this.error = null;

      try {
        const response = await productService.getProductDetail(productSlug);

        if (response.data.success) {
          this.detailPage = response.data.data.detailPage;
          this.product = response.data.data.detailPage.product;
          return this.detailPage;
        } else {
          this.error = response.data.message || 'Ürün detayı yüklenirken bir hata oluştu.';
          return null;
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Ürün detayı yüklenirken bir hata oluştu.';
        return null;
      } finally {
        this.loading = false;
      }
    },

    // Ürün teslimat takvim günlerini getir
    async fetchCalendarDays(productSlug) {
      this.loading = true;
      this.error = null;

      try {
        const response = await productService.getProductCalendarDays(productSlug);

        if (response.data.success) {
          this.calendarDays = response.data.data.timeSlots || [];
          return this.calendarDays;
        } else {
          this.error = response.data.message || 'Teslimat günleri yüklenirken bir hata oluştu.';
          return null;
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Teslimat günleri yüklenirken bir hata oluştu.';
        return null;
      } finally {
        this.loading = false;
      }
    },

    // Belirli gün için teslimat saat aralıklarını getir
    async fetchDaySlots(productSlug, date) {
      this.loading = true;
      this.error = null;

      try {
        const response = await productService.getProductCalendarDaySlots(productSlug, date);

        if (response.data.success) {
          this.daySlots = response.data.data.timeSlots || [];
          return this.daySlots;
        } else {
          this.error = response.data.message || 'Teslimat saatleri yüklenirken bir hata oluştu.';
          return null;
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Teslimat saatleri yüklenirken bir hata oluştu.';
        return null;
      } finally {
        this.loading = false;
      }
    },

    // Seçili tarihi ayarla
    setSelectedDate(date) {
      this.selectedDate = date;
      this.selectedTimeSlot = null; // Tarih değiştiğinde saat slotunu sıfırla
    },

    // Seçili saat aralığını ayarla
    setSelectedTimeSlot(timeSlot) {
      this.selectedTimeSlot = timeSlot;
    },

    // Store'u temizle
    clearProductData() {
      this.product = null;
      this.detailPage = null;
      this.calendarDays = [];
      this.daySlots = [];
      this.selectedDate = null;
      this.selectedTimeSlot = null;
      this.error = null;
    }
  }
});
