import { defineStore } from 'pinia';
import { categoryService } from '@/services/api';

export const useCategoryStore = defineStore('category', {
  state: () => ({
    categories: [],
    mainCategories: [],  // Ana kategoriler
    subCategories: {},   // Alt kategoriler (slug'a göre)
    selectedCategory: null,
    products: [],
    loading: false,
    error: null
  }),

  getters: {
    getCategories: (state) => state.categories,
    getMainCategories: (state) => state.mainCategories,
    getSubCategories: (state) => (slug) => state.subCategories[slug] || [],
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
          // Ana kategorileri ve alt kategorileri ayarla
          this.mainCategories = response.data.data;

          // Alt kategorileri ve tümünü birleştir
          let allCategories = [];
          const subCategoryMap = {};

          // Ana kategorileri döngü
          this.mainCategories.forEach(category => {
            allCategories.push({
              name: category.name,
              slug: category.slug,
              type: category.type,
              image: category.images ? category.images[0] : { type: null, path: null, alt: null },
              description: category.ecommerceDetail?.description || null
            });

            // Alt kategorileri hem alt kategoriler haritasına ekle hem de tüm kategorilere ekle
            if (category.subCategories && category.subCategories.length > 0) {
              subCategoryMap[category.slug] = category.subCategories.map(subCat => ({
                name: subCat.name,
                slug: subCat.slug,
                type: subCat.type,
                image: subCat.images ? subCat.images[0] : { type: null, path: null, alt: null },
                description: subCat.ecommerceDetail?.description || null
              }));

              allCategories = [...allCategories, ...subCategoryMap[category.slug]];
            }
          });

          this.subCategories = subCategoryMap;
          this.categories = allCategories;



          return this.categories;
        } else {
          this.error = response.data.message || 'Kategoriler yüklenirken bir hata oluştu.';
          return null;
        }
      } catch (error) {
        this.error = error.message || 'Kategoriler yüklenirken bir hata oluştu.';
        return null;
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

        if (response.data && response.data.success) {
          // API yanıtını logla

          // Ürünleri doğru şekilde almak için kontrol ekliyoruz
          if (response.data.data && response.data.data.products) {
            // Ürünleri state'e ata
            this.products = response.data.data.products;

            // Kategori bilgisini ayarla
            if (response.data.data && response.data.data.category) {
              this.selectedCategory = response.data.data.category;
            }

            return {
              products: this.products,
              category: this.selectedCategory,
              filterOptions: response.data.data.filterOptions || [],
              pagination: response.data.data.pagination || {
                currentPage: 1,
                lastPage: 1,
                total: this.products.length
              }
            };
          } else {
            this.error = 'Ürün verisi bulunamadı.';
            this.products = [];
            return null;
          }
        } else {
          console.error('Ürün API başarılı değil:', response.data);
          this.error = response.data?.message || 'Ürünler yüklenirken bir hata oluştu.';
          this.products = [];
          return null;
        }
      } catch (error) {
        console.error('Ürün yükleme hatası:', error);
        this.error = 'Ürünler yüklenirken bir hata oluştu. Lütfen farklı bir kategori seçin.';
        this.products = [];
        return null;
      } finally {
        this.loading = false;
      }
    }
  }
});
