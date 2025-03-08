<template>
  <div class="shop-products">
    <div class="container">
      <div class="section-header text-center mb-4">
        <h2 v-if="title" class="mb-3">{{ title }}</h2>
        <p v-if="subtitle" class="text-muted">{{ subtitle }}</p>
      </div>

      <div v-if="loading" class="text-center py-4">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Yükleniyor...</span>
        </div>
        <p class="mt-2">Ürünler yükleniyor...</p>
      </div>

      <div v-else-if="error" class="alert alert-danger">
        {{ error }}
        <button class="btn btn-sm btn-outline-danger ms-2" @click="$emit('reload')">Yeniden Dene</button>
      </div>

      <div v-else-if="!products || products.length === 0" class="alert alert-warning text-center">
        Bu kategoride ürün bulunamadı.
      </div>

      <div v-else class="row">
        <div
          v-for="product in products"
          :key="product.id"
          :class="columnClass"
        >
          <ProductCard :product="product" />
        </div>
      </div>

      <div v-if="showMoreButton && products && products.length > 0" class="text-center mt-4">
        <router-link v-if="categorySlug" :to="`/category/${categorySlug}`" class="btn btn-outline-primary">
          Tümünü Gör
        </router-link>
        <button v-else class="btn btn-outline-primary" @click="$emit('loadMore')">
          Daha Fazla Yükle
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
import ProductCard from '@/components/ProductCard.vue';

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  subtitle: {
    type: String,
    default: ''
  },
  products: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  },
  categorySlug: {
    type: String,
    default: ''
  },
  showMoreButton: {
    type: Boolean,
    default: false
  },
  columns: {
    type: Number,
    default: 3,
    validator: (value) => [2, 3, 4, 6].includes(value)
  }
});

const emits = defineEmits(['reload', 'loadMore']);

// Sütun sınıfı hesaplaması
const columnClass = computed(() => {
  const columnMap = {
    2: 'col-md-6',
    3: 'col-md-4',
    4: 'col-lg-3 col-md-6',
    6: 'col-lg-2 col-md-4 col-sm-6'
  };

  return `${columnMap[props.columns]} mb-4`;
});
</script>

<style scoped>
.section-header h2 {
  font-weight: 600;
  color: #333;
}

.shop-products {
  padding: 20px 0;
}
</style>
