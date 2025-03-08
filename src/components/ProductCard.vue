<template>
  <div class="card h-100 product-card">
    <div class="position-relative">
      <router-link :to="`/product/${product.slug}`">
        <img
          :src="getProductImage(product)"
          class="card-img-top"
          :alt="product.name"
        >
      </router-link>
      <div v-if="product.price.discountStatus" class="discount-badge">
        İndirimli
      </div>
      <div v-if="product.ecommerceDetail && product.ecommerceDetail.newProduct" class="new-badge">
        Yeni
      </div>
    </div>
    <div class="card-body d-flex flex-column">
      <router-link :to="`/product/${product.slug}`" class="text-decoration-none">
        <h5 class="card-title product-title">{{ product.name }}</h5>
      </router-link>
      <p class="card-text brand-name text-muted">{{ product.brandName || 'Marka belirtilmemiş' }}</p>
      <div class="mt-auto">
        <div v-if="isProductInStock(product)" class="stock-status in-stock">
          <i class="bi bi-check-circle-fill me-1"></i> Stokta var
        </div>
        <div v-else class="stock-status out-of-stock">
          <i class="bi bi-calendar-date me-1"></i> Teslimat: {{ formatDeliveryDate(product.earliestDeliveryDate.date) }}
        </div>

        <div class="price-box mt-2">
          <span v-if="product.price.discountStatus" class="old-price">{{ product.price.salePrice }} TL</span>
          <span class="current-price">{{ product.price.discountStatus ? product.price.discountPrice : product.price.salePrice }} TL</span>
        </div>

        <router-link :to="`/product/${product.slug}`" class="btn btn-primary w-100 mt-3">
          {{ isProductInStock(product) ? 'Ürünü İncele' : 'Detayları Gör' }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
});

// Ürün resmini almak için
const getProductImage = (product) => {
  if (!product || !product.images) return 'https://via.placeholder.com/300x300';

  if (Array.isArray(product.images)) {
    // "list" tipinde bir görsel arayalım
    const listImage = product.images.find(img => img.type === 'list' && img.path);

    if (listImage) {
      return listImage.path;
    }

    // Herhangi bir görsel varsa
    const anyImage = product.images.find(img => img.path);
    if (anyImage) {
      return anyImage.path;
    }
  } else if (typeof product.images === 'object') {
    // Doğrudan images objesi olabilir
    return product.images.listImage || 'https://via.placeholder.com/300x300';
  }

  return 'https://via.placeholder.com/300x300';
};

// Ürünün stok durumunu kontrol et
const isProductInStock = (product) => {
  return product && product.stockStatus && product.stockStatus.stock;
};

// Teslimat tarihini formatla
const formatDeliveryDate = (dateStr) => {
  if (!dateStr) return '';

  // Tarih formatını kontrol et
  if (dateStr === 'Stokta yok') return dateStr;

  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long'
    });
  } catch (e) {
    return dateStr;
  }
};
</script>

<style scoped>
.product-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border-radius: 8px;
  overflow: hidden;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.product-title {
  font-size: 1rem;
  height: 2.5rem;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  color: #333;
}

.brand-name {
  font-size: 0.875rem;
}

.discount-badge, .new-badge {
  position: absolute;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: bold;
}

.discount-badge {
  top: 10px;
  right: 10px;
  background-color: #e53935;
  color: white;
}

.new-badge {
  top: 10px;
  left: 10px;
  background-color: #4CAF50;
  color: white;
}

.stock-status {
  font-size: 0.875rem;
  font-weight: 500;
}

.in-stock {
  color: #4caf50;
}

.out-of-stock {
  color: #f44336;
}

.price-box {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.old-price {
  text-decoration: line-through;
  color: #757575;
  font-size: 0.875rem;
}

.current-price {
  font-weight: bold;
  font-size: 1.25rem;
  color: #4caf50;
}

.btn-primary {
  background-color: #4CAF50;
  border-color: #4CAF50;
}

.btn-primary:hover, .btn-primary:focus, .btn-primary:active {
  background-color: #45a049;
  border-color: #45a049;
}
</style>
