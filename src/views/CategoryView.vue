<template>
  <div class="category-page">
    <div class="container py-4">
      <!-- Kategori Başlık ve Bilgiler -->
      <div class="category-header mb-4">
        <h1 v-if="categoryStore.selectedCategory">{{ categoryStore.selectedCategory.name }}</h1>
        <h1 v-else>{{ getCategoryName() }}</h1>
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb">
            <li class="breadcrumb-item"><router-link to="/">Ana Sayfa</router-link></li>
            <li v-if="parentCategory" class="breadcrumb-item">
              <router-link :to="`/category/${parentCategory.slug}`">{{ parentCategory.name }}</router-link>
            </li>
            <li class="breadcrumb-item active">{{ getCategoryName() }}</li>
          </ol>
        </nav>
        <div v-if="categoryStore.selectedCategory && categoryStore.selectedCategory.ecommerceDetail && categoryStore.selectedCategory.ecommerceDetail.description" class="category-description mt-2" v-html="categoryStore.selectedCategory.ecommerceDetail.description"></div>
      </div>

      <!-- Adres Seçimi -->
      <div class="address-selection mb-4">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Teslimat Bölgesi</h5>
            <div class="row">
              <div class="col-md-4">
                <select
                  class="form-select mb-3"
                  v-model="selectedDistrict"
                  @change="onDistrictChange"
                >
                  <option value="">İlçe Seçin</option>
                  <option
                    v-for="district in districts"
                    :key="district.id"
                    :value="district"
                  >
                    {{ district.text }}
                  </option>
                </select>
              </div>
              <div class="col-md-4">
                <select
                  class="form-select mb-3"
                  v-model="selectedNeighborhood"
                  :disabled="!selectedDistrict"
                >
                  <option value="">Mahalle Seçin</option>
                  <option
                    v-for="neighborhood in filteredNeighborhoods"
                    :key="neighborhood.id"
                    :value="neighborhood"
                  >
                    {{ neighborhood.data.neighborhood_name }}
                  </option>
                </select>
              </div>
              <div class="col-md-4">
                <button
                  class="btn btn-primary w-100"
                  @click="loadProducts"
                  :disabled="!selectedNeighborhood"
                >
                  Teslimat Bölgesini Güncelle
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <div
          v-for="product in categoryStore.products"
          :key="product.id"
          class="col-md-4 mb-4"
        >
          <ProductCard :product="product" />
        </div>
      </div>
      <!-- Alt Kategoriler (Ana kategori görüntüleniyorsa) -->
      <div v-if="showSubCategories && subCategories.length > 0" class="subcategories-section mb-4">
        <h4 class="mb-3">{{ getCategoryName() }} Kategorileri</h4>
        <div class="row">
          <div
            v-for="subCategory in subCategories"
            :key="subCategory.slug"
            class="col-md-3 mb-3"
          >
            <div class="card h-100 subcategory-card">
              <div class="card-body d-flex flex-column align-items-center text-center">
                <div class="subcategory-icon mb-2">
                  <img
                    :src="getImageSrc(subCategory)"
                    :alt="subCategory.name"
                    class="img-fluid"
                  />
                </div>
                <h6 class="card-title">{{ subCategory.name }}</h6>
                <router-link :to="`/category/${subCategory.slug}`" class="btn btn-sm btn-outline-primary mt-auto">Görüntüle</router-link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Filtreler ve Ürünler -->
      <div class="row">
        <!-- Filtreler -->
        <div class="col-md-3">
          <div class="card filter-card mb-4">
            <div class="card-header">
              <h5 class="mb-0">Filtreler</h5>
            </div>
            <div class="card-body">
              <!-- Dinamik Filtreler -->
              <div v-for="filter in filters" :key="filter.value" class="filter-section mb-4">
                <h6 class="filter-title">{{ filter.name || 'Filtre' }}</h6>

                <!-- Tekli Seçim (Single) -->
                <div v-if="filter.type === 'single'" class="form-check" v-for="option in filter.options" :key="option.value">
                  <input
                    class="form-check-input"
                    type="radio"
                    :id="`filter-${filter.value}-${option.value}`"
                    :name="filter.value"
                    :value="option.value"
                    v-model="selectedFilters[filter.value]"
                    @change="applyFilters"
                  >
                  <label class="form-check-label" :for="`filter-${filter.value}-${option.value}`">
                    {{ option.name }}
                  </label>
                </div>

                <!-- Çoklu Seçim (Multiple) -->
                <div v-if="filter.type === 'multiple'" class="form-check" v-for="option in filter.options" :key="option.value">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    :id="`filter-${filter.value}-${option.value}`"
                    :value="option.value"
                    v-model="selectedFilterArrays[filter.value]"
                    @change="applyFilters"
                  >
                  <label class="form-check-label" :for="`filter-${filter.value}-${option.value}`">
                    {{ option.name }}
                  </label>
                </div>
              </div>

              <!-- Fiyat Aralığı (Manuel olarak eklendi) -->
              <div class="filter-section">
                <h6 class="filter-title">Fiyat Aralığı</h6>
                <div class="row">
                  <div class="col-6">
                    <input
                      type="number"
                      class="form-control form-control-sm"
                      placeholder="Min"
                      v-model="minPrice"
                    >
                  </div>
                  <div class="col-6">
                    <input
                      type="number"
                      class="form-control form-control-sm"
                      placeholder="Max"
                      v-model="maxPrice"
                    >
                  </div>
                </div>
                <div class="d-grid mt-2">
                  <button class="btn btn-sm btn-outline-primary" @click="applyFilters">Uygula</button>
                </div>
              </div>

              <!-- Filtreleri Temizle -->
              <div class="d-grid mt-3">
                <button class="btn btn-sm btn-outline-secondary" @click="clearFilters">
                  Filtreleri Temizle
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Ürün Listesi -->
        <div class="col-md-9">
          <div v-if="categoryStore.loading" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Yükleniyor...</span>
            </div>
            <p class="mt-2">Ürünler Yükleniyor...</p>
          </div>
          <div v-else-if="categoryStore.error" class="alert alert-danger">
            {{ categoryStore.error }}
          </div>
          <div v-else-if="categoryStore.products.length === 0" class="text-center py-5">
            <p>Bu kategoride ürün bulunamadı.</p>
          </div>
          <div v-else>
            <!-- Sonuç Bilgisi -->
            <div class="results-info mb-3 d-flex justify-content-between align-items-center">
              <div>
                <strong>{{ pagination.total }}</strong> ürün bulundu
              </div>
              <div class="d-flex align-items-center">
                <label class="me-2 text-nowrap">Sıralama:</label>
                <select class="form-select form-select-sm" v-model="sortOption" @change="applyFilters">
                  <option value="price_asc">Fiyat (Artan)</option>
                  <option value="price_desc">Fiyat (Azalan)</option>
                  <option value="newest">En Yeniler</option>
                  <option value="popular">En Popüler</option>
                </select>
              </div>
            </div>

            <!-- Ürünler -->
            <div class="row">
              <div
                v-for="product in categoryStore.products"
                :key="product.id"
                class="col-md-4 mb-4"
              >
                <div class="card h-100 product-card">
                  <div class="position-relative">
                    <img
                      :src="getProductImage(product)"
                      class="card-img-top"
                      :alt="product.name"
                    >
                    <div v-if="product.price.discountStatus" class="discount-badge">
                      İndirimli
                    </div>
                    <div v-if="product.ecommerceDetail.newProduct" class="new-badge">
                      Yeni
                    </div>
                  </div>
                  <div class="card-body d-flex flex-column">
                    <h5 class="card-title product-title">{{ product.name }}</h5>
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

                      <button class="btn btn-primary w-100 mt-3" :disabled="!isProductInStock(product)">
                        {{ isProductInStock(product) ? 'Sepete Ekle' : 'Stokta Yok' }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Sayfalama -->
            <nav v-if="pagination.lastPage > 1" aria-label="Sayfalama" class="mt-4">
              <ul class="pagination justify-content-center">
                <li class="page-item" :class="{ 'disabled': pagination.currentPage === 1 }">
                  <a class="page-link" href="#" @click.prevent="changePage(pagination.currentPage - 1)">Önceki</a>
                </li>
                <li v-for="page in paginationPages" :key="page" class="page-item" :class="{ 'active': pagination.currentPage === page }">
                  <a class="page-link" href="#" @click.prevent="changePage(page)">{{ page }}</a>
                </li>
                <li class="page-item" :class="{ 'disabled': pagination.currentPage === pagination.lastPage }">
                  <a class="page-link" href="#" @click.prevent="changePage(pagination.currentPage + 1)">Sonraki</a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useCategoryStore } from '@/stores/category';
import { useAddressStore } from '@/stores/address';
import ProductCard from '../components/ProductCard.vue';

const route = useRoute();
const categoryStore = useCategoryStore();
const addressStore = useAddressStore();

// Adres değişkenleri
const selectedDistrict = ref(null);
const selectedNeighborhood = ref(null);
const districts = ref([]);
const neighborhoods = ref([]);

// Kategori ve ürün değişkenleri
const parentCategory = ref(null);
const showSubCategories = ref(false);
const subCategories = ref([]);
const filters = ref([]);
const pagination = ref({
  currentPage: 1,
  perPage: 8,
  total: 0,
  lastPage: 1
});

// Filtre değişkenleri
const selectedFilters = ref({});
const selectedFilterArrays = ref({});
const minPrice = ref(null);
const maxPrice = ref(null);
const sortOption = ref('newest');
const currentPage = ref(1);

// Sayfalama sayfaları
const paginationPages = computed(() => {
  const pages = [];
  for (let i = 1; i <= pagination.value.lastPage; i++) {
    pages.push(i);
  }
  return pages;
});

// İlçeye göre filtrelenmiş mahalleler
const filteredNeighborhoods = computed(() => {
  if (!selectedDistrict.value) return [];

  return neighborhoods.value.filter(
    neighborhood => neighborhood.data.district_id === selectedDistrict.value.data.district_id
  );
});

// İlçe değiştiğinde mahalleyi sıfırla
const onDistrictChange = () => {
  selectedNeighborhood.value = null;
};

// Adresleri yükle ve ayır
const loadAddresses = async () => {
  try {
    const addresses = await addressStore.fetchAddresses();

    if (addresses) {
      // İlçeleri ayır
      districts.value = addresses.filter(address => address.id.startsWith('district:'));

      // Mahalleleri ayır
      neighborhoods.value = addresses.filter(address => address.id.startsWith('neighborhood:'));

    }
  } catch (error) {
  }
};

// Kategori adını almak için
const getCategoryName = () => {
  const categorySlug = route.params.slug;

  // Kategori store'dan kontrol et
  const category = categoryStore.categories.find(cat => cat.slug === categorySlug);

  return category ? category.name : categorySlug;
};

// Görsel URL'sini güvenli bir şekilde almak için
const getImageSrc = (item) => {
  if (item.image && item.image.path) {
    return item.image.path;
  } else if (item.images && item.images.length > 0 && item.images[0] && item.images[0].path) {
    return item.images[0].path;
  }
  return 'https://via.placeholder.com/300x300';
};

// Ürün resmini almak için
const getProductImage = (product) => {
  if (product.images && Array.isArray(product.images)) {
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

// Filtreleri uygula
const applyFilters = () => {
  const params = {
    page: currentPage.value,
    sort: sortOption.value
  };

  // Fiyat aralığı
  if (minPrice.value) params.priceMin = minPrice.value;
  if (maxPrice.value) params.priceMax = maxPrice.value;

  // Filtre seçimleri
  Object.entries(selectedFilters.value).forEach(([key, value]) => {
    if (value) {
      params[key] = value;
    }
  });

  // Çoklu filtre seçimleri
  Object.entries(selectedFilterArrays.value).forEach(([key, values]) => {
    if (values && values.length > 0) {
      params[key] = values.join(',');
    }
  });

  // Adres bilgisi
  if (selectedNeighborhood.value) {
    params.id = selectedNeighborhood.value.id;
    params.province_id = selectedNeighborhood.value.data.province_id;
    params.district_id = selectedNeighborhood.value.data.district_id;
    params.neighborhood_id = selectedNeighborhood.value.data.neighborhood_id;

    if (selectedNeighborhood.value.data.sale_region_id) {
      params.sale_region_id = selectedNeighborhood.value.data.sale_region_id;
    }
  }

  loadProducts(params);
};

// Filtreleri temizle
const clearFilters = () => {
  selectedFilters.value = {};
  selectedFilterArrays.value = {};
  minPrice.value = null;
  maxPrice.value = null;
  sortOption.value = 'newest';
  currentPage.value = 1;

  // Sadece adres bilgisi ile ürünleri getir
  const params = {};
  if (selectedNeighborhood.value) {
    params.id = selectedNeighborhood.value.id;
    params.province_id = selectedNeighborhood.value.data.province_id;
    params.district_id = selectedNeighborhood.value.data.district_id;
    params.neighborhood_id = selectedNeighborhood.value.data.neighborhood_id;
  }

  loadProducts(params);
};

// Sayfa değiştir
const changePage = (page) => {
  if (page < 1 || page > pagination.value.lastPage) return;
  currentPage.value = page;
  applyFilters();
};

// Ürünleri yükle
const loadProducts = async (customParams = null) => {
  if (!route.params.slug) return;

  try {
    const params = customParams || {};

    // API'den ürünleri getir
    const result = await categoryStore.fetchProductsByCategory(route.params.slug, params);

    if (result) {

      // Boş ürün dizisi kontrolü
      if (categoryStore.products.length === 0) {
        console.warn('API\'den ürünler gelmesine rağmen, ürün dizisi boş!');
      }

      // Kategori verilerini ayarla
      if (result.category) {

        // Üst kategori varsa kaydet
        if (result.category.parentCategory) {
          parentCategory.value = result.category.parentCategory;
        }

        // Alt kategorilerin gösterilip gösterilmeyeceğini belirle
        // Ana kategori görüntüleniyorsa alt kategorileri göster
        showSubCategories.value = result.category.type === 'Ana Kategori';
      }

      // Filtre seçeneklerini güncelle
      if (result.filterOptions) {
        filters.value = Array.isArray(result.filterOptions) ? result.filterOptions : [];

        // Filtre seçim objelerini hazırla
        filters.value.forEach(filter => {
          if (filter.type === 'multiple' && !selectedFilterArrays.value[filter.value]) {
            selectedFilterArrays.value[filter.value] = [];
          }
        });
      }

      // Sayfalama bilgilerini güncelle
      if (result.pagination) {
        pagination.value = result.pagination;
      }

      // Kategoriye göre alt kategorileri al (ana kategori ise)
      if (showSubCategories.value) {
        const currentMainCategory = categoryStore.mainCategories.find(cat => cat.slug === route.params.slug);
        if (currentMainCategory && currentMainCategory.subCategories) {
          subCategories.value = currentMainCategory.subCategories;
        }
      }
    } else {
    }
  } catch (error) {
  }
};

// Route değiştiğinde ürünleri yeniden yükle
watch(() => route.params.slug, (newSlug) => {
  if (newSlug) {
    // Filtreleri sıfırla
    selectedFilters.value = {};
    selectedFilterArrays.value = {};
    minPrice.value = null;
    maxPrice.value = null;
    currentPage.value = 1;

    loadProducts();
  }
});

// Sayfa yüklendiğinde
onMounted(async () => {
  // Adres ve ürünleri yükle
  await loadAddresses();
  await loadProducts();
});
</script>

<style scoped>
.category-description {
  font-size: 0.95rem;
  color: #666;
}

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

.filter-title {
  margin-bottom: 12px;
  font-weight: 600;
  font-size: 0.95rem;
}

.filter-section {
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
  margin-bottom: 15px;
}

.filter-section:last-child {
  border-bottom: none;
  padding-bottom: 0;
  margin-bottom: 0;
}

.form-check-label {
  font-size: 0.9rem;
}

.subcategory-icon {
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: #f8f9fa;
  overflow: hidden;
  margin-bottom: 10px;
}

.subcategory-icon img {
  max-width: 60%;
  max-height: 60%;
  object-fit: contain;
}

.btn-primary {
  background-color: #4CAF50;
  border-color: #4CAF50;
}

.btn-outline-primary {
  color: #4CAF50;
  border-color: #4CAF50;
}

.btn-primary:hover, .btn-primary:focus, .btn-primary:active {
  background-color: #45a049;
  border-color: #45a049;
}

.btn-outline-primary:hover, .btn-outline-primary:focus, .btn-outline-primary:active {
  background-color: #4CAF50;
  border-color: #4CAF50;
  color: white;
}

.pagination .page-item.active .page-link {
  background-color: #4CAF50;
  border-color: #4CAF50;
}

.pagination .page-link {
  color: #4CAF50;
}
</style>
