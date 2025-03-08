<template>
  <div class="product-image" :class="{ 'product-image-loading': loading }">
    <img
      v-if="!error && !loading"
      :src="imageSrc"
      :alt="alt"
      @load="onLoad"
      @error="onError"
      class="img-fluid"
    />

    <div v-if="loading" class="product-image-placeholder">
      <div class="placeholder-icon"></div>
    </div>

    <div v-if="error" class="product-image-error">
      <img :src="defaultImage" :alt="alt" class="img-fluid" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

// Props
const props = defineProps({
  product: {
    type: Object,
    required: true
  },
  type: {
    type: String,
    default: 'list' // list, hover, detail
  },
  alt: {
    type: String,
    default: 'Ürün Görseli'
  },
  defaultImage: {
    type: String,
    default: 'https://via.placeholder.com/300x300'
  }
});

// İç durum
const loading = ref(true);
const error = ref(false);

// Görsel URL'si
const imageSrc = computed(() => {
  if (!props.product) return props.defaultImage;

  if (props.product.images && Array.isArray(props.product.images)) {
    // "type" ile uyumlu bir görsel ara
    const typedImage = props.product.images.find(img => img.type === props.type && img.path);

    if (typedImage) {
      return typedImage.path;
    }

    // Herhangi bir görsel yoksa ilk görseli al
    const anyImage = props.product.images.find(img => img.path);
    if (anyImage) {
      return anyImage.path;
    }
  }

  return props.defaultImage;
});

// Yükleme olayı
const onLoad = () => {
  loading.value = false;
  error.value = false;
};

// Hata olayı
const onError = () => {
  loading.value = false;
  error.value = true;
};

// Bileşen yüklendiğinde
onMounted(() => {
  // Görsel önceden önbelleğe alınmışsa hemen yükleme durumunu güncelle
  const img = new Image();
  img.src = imageSrc.value;
  img.onload = onLoad;
  img.onerror = onError;

  // Görsel hemen yüklenmediyse 3 saniye sonra zaman aşımı
  setTimeout(() => {
    if (loading.value) {
      onLoad(); // Bekleme süresini bitir
    }
  }, 3000);
});
</script>

<style scoped>
.product-image {
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 100%; /* 1:1 en-boy oranı (kare) */
  overflow: hidden;
  background-color: #f5f5f5;
  border-radius: 8px;
}

.product-image img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-image:hover img {
  transform: scale(1.05);
}

.product-image-loading {
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-image-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f0f0f0;
}

.placeholder-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 3px solid #e0e0e0;
  border-top: 3px solid #4CAF50;
  animation: spin 1s linear infinite;
}

.product-image-error {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8f8f8;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
