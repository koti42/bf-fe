<template>
  <div class="home-page">
    <!-- Header & Banner -->
    <section class="hero-banner mb-5">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-md-6">
            <h1 class="display-4 fw-bold">Taze Çiçeklerle Sevdiklerinizi Mutlu Edin</h1>
            <p class="lead">En güzel çiçek aranjmanları ve buketleri ile sevdiklerinize özel anlar yaşatın.</p>
            <div class="d-flex flex-wrap gap-2 mt-4">
              <router-link to="/category/gercek-cicekler" class="btn btn-primary">Gerçek Çiçekler</router-link>
              <router-link to="/category/yapay-cicekler" class="btn btn-outline-primary">Yapay Çiçekler</router-link>
            </div>
          </div>
          <div class="col-md-6 text-center">
            <img src="https://via.placeholder.com/500x400" alt="Çiçek Buketi" class="img-fluid rounded" />
          </div>
        </div>
      </div>
    </section>



    <!-- Adres Seçimi -->
    <section class="address-section mb-5">
      <div class="container">
        <div class="card">
          <div class="card-body">
            <h4 class="mb-3">Teslimat Adresinizi Seçin</h4>
            <div v-if="addressStore.loading">
              <div class="d-flex align-items-center">
                <div class="spinner-border spinner-border-sm me-2" role="status"></div>
                <span>Adresler yükleniyor...</span>
              </div>
            </div>
            <div v-else-if="addressStore.error" class="alert alert-danger">
              {{ addressStore.error }}
              <button class="btn btn-sm btn-outline-danger ms-2" @click="loadAddresses">Yeniden Dene</button>
            </div>
            <div v-else-if="districts.length === 0" class="alert alert-warning">
              Adres bilgileri yüklenemedi.
              <button class="btn btn-sm btn-outline-warning ms-2" @click="loadAddresses">Yeniden Dene</button>
            </div>
            <div v-else class="row">
              <div class="col-md-6">
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
              <div class="col-md-6">
                <select
                  class="form-select"
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
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Kategoriler -->
    <section class="categories-section mb-5">
      <div class="container">
        <h2 class="text-center mb-4">Kategoriler</h2>
        <div v-if="categoryStore.loading">
          <div class="d-flex justify-content-center align-items-center">
            <div class="spinner-border text-primary me-2" role="status"></div>
            <span>Kategoriler yükleniyor...</span>
          </div>
        </div>
        <div v-else-if="categoryStore.error" class="alert alert-danger text-center">
          {{ categoryStore.error }}
          <button class="btn btn-sm btn-outline-danger ms-2" @click="loadCategories">Yeniden Dene</button>
        </div>
        <div v-else-if="categoryStore.categories.length === 0" class="alert alert-warning text-center">
          Kategori bilgileri yüklenemedi.
          <button class="btn btn-sm btn-outline-warning ms-2" @click="loadCategories">Yeniden Dene</button>
        </div>
        <div v-else class="row">
          <div
            v-for="category in categoryStore.categories"
            :key="category.slug"
            class="col-md-4 mb-4"
          >
            <div class="card h-100 category-card">
              <div class="card-body d-flex flex-column align-items-center text-center">
                <div class="category-icon mb-3">
                  <img
                    :src="category.image && category.image.path ? category.image.path : 'https://via.placeholder.com/150'"
                    :alt="category.name"
                    class="img-fluid"
                  />
                </div>
                <h5 class="card-title">{{ category.name }}</h5>
                <router-link :to="`/category/${category.slug}`" class="btn btn-outline-primary mt-auto">Görüntüle</router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useCategoryStore } from '@/stores/category';
import { useAddressStore } from '@/stores/address';
import { useAuthStore } from '@/stores/auth';

// Debug modu (geliştirme için)
const debugMode = ref(true); // Geliştirme bittikten sonra false yapın

// Store'ları başlat
const categoryStore = useCategoryStore();
const addressStore = useAddressStore();
const authStore = useAuthStore();

// Adres değişkenleri
const selectedDistrict = ref(null);
const selectedNeighborhood = ref(null);

// İlçeleri ve mahalleleri ayır
const districts = ref([]);
const neighborhoods = ref([]);

// İlçeye göre filtrelenmiş mahalleler
const filteredNeighborhoods = computed(() => {
  if (!selectedDistrict.value) return [];

  console.log('Mahalleler filtreleniyor:', selectedDistrict.value?.data?.district_id);

  // Seçili ilçeye ait mahalleleri filtrele
  return neighborhoods.value.filter(
    neighborhood => neighborhood.data.district_id === selectedDistrict.value.data.district_id
  );
});

// İlçe değiştiğinde mahalleleri filtrele
const onDistrictChange = () => {
  console.log('İlçe değişti:', selectedDistrict.value?.text);
  selectedNeighborhood.value = null;
};

// Adresleri yükle ve ayır
const loadAddresses = async () => {
  console.log('Adresler yükleniyor...');
  try {
    const addresses = await addressStore.fetchAddresses();

    if (addresses) {
      console.log('Toplam adres sayısı:', addresses.length);

      // İlçeleri ayır (district tipindeki adresler)
      districts.value = addresses.filter(address => address.id.startsWith('district:'));
      console.log('İlçe sayısı:', districts.value.length);

      // Mahalleleri ayır (neighborhood tipindeki adresler)
      neighborhoods.value = addresses.filter(address => address.id.startsWith('neighborhood:'));
      console.log('Mahalle sayısı:', neighborhoods.value.length);
    } else {
      console.error('Adresler yüklenemedi');
    }
  } catch (error) {
    console.error('Adres yükleme hatası:', error);
  }
};

// Kategorileri yükle
const loadCategories = async () => {
  console.log('Kategoriler yükleniyor...');
  try {
    const categories = await categoryStore.fetchCategories();
    console.log('Kategori verileri:', categories ? categories.length : 'kategoriler alınamadı');
  } catch (error) {
    console.error('Kategori yükleme hatası:', error);
  }
};

// Tüm verileri yeniden yükle
const reloadData = async () => {
  console.log('Veriler yeniden yükleniyor...');
  await Promise.all([loadAddresses(), loadCategories()]);
};

// Sayfa yüklendiğinde
onMounted(async () => {
  console.log('Ana sayfa yükleniyor...');
  // Adres ve kategorileri yükle
  await Promise.all([loadAddresses(), loadCategories()]);
});
</script>

<style scoped>
.hero-banner {
  padding: 60px 0;
  background-color: #f9f9f9;
  border-radius: 10px;
}

.debug-section {
  font-size: 0.9rem;
}

.category-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
}

.category-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.category-icon {
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: #f8f9fa;
  overflow: hidden;
}

.category-icon img {
  max-width: 60px;
  max-height: 60px;
}

.btn-primary, .btn-outline-primary {
  padding: 10px 20px;
  border-radius: 5px;
}

.btn-primary {
  background-color: #4CAF50;
  border-color: #4CAF50;
}

.btn-outline-primary {
  color: #4CAF50;
  border-color: #4CAF50;
}

.btn-primary:hover {
  background-color: #45a049;
  border-color: #45a049;
}

.btn-outline-primary:hover {
  background-color: #4CAF50;
  border-color: #4CAF50;
}
</style>
