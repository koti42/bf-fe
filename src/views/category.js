import { defineStore } from 'pinia';
import { categoryService } from '@/services/api';

export const useCategoryStore = defineStore('category', {
  state: () => ({
    categories: [],
    selectedCategory: null,
    products: [],
    loading: false,
    error: null
  }),

  getters: {
    getCategories: (state) => state.categories,
    getProducts: (state) => state.products
  },

  actions: {
    // Kategorileri getir
    async fetchCategories() {
      this.loading = true;
      this.error = null;

      try {
        const response = await categoryService.getCategoryList();

        if (response.data.success) {
          // Blog ve gerçek kategorileri ayır
          const categories = response.data.data.filter(item => item.type === 'Kategori');
          const blogPosts = response.data.data.filter(item => item.type === 'Blog');

          this.categories = categories;
          return categories;
        }
      } catch (error) {
        this.error = 'Kategoriler yüklenirken bir hata oluştu.';
      } finally {
        this.loading = false;
      }
    },

    // Belli bir kategorideki ürünleri getir
    async fetchProductsByCategory(categorySlug, filterParams = {}) {
      this.loading = true;
      this.error = null;

      try {
        const response = await categoryService.getProductsByCategory(categorySlug, filterParams);

        if (response.data.success) {
          this.products = response.data.data.products;
          this.selectedCategory = response.data.data.category;
          return response.data.data;
        }
      } catch (error) {
        this.error = 'Ürünler yüklenirken bir hata oluştu.';
      } finally {
        this.loading = false;
      }
    }
  }
});
