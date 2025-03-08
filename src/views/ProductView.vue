<template>
  <div class="product-page py-4">
    <div class="container">
      <!-- Yükleniyor... -->
      <div v-if="productStore.loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Yükleniyor...</span>
        </div>
        <p class="mt-2">Ürün bilgileri yükleniyor...</p>
      </div>

      <!-- Hata -->
      <div v-else-if="productStore.error" class="alert alert-danger">
        {{ productStore.error }}
        <button class="btn btn-sm btn-outline-danger ms-2" @click="loadProduct">
          Yeniden Dene
        </button>
      </div>

      <!-- Ürün Bulunamadı -->
      <div v-else-if="!productStore.product" class="alert alert-warning text-center">
        Ürün bulunamadı.
        <router-link to="/" class="btn btn-sm btn-outline-primary ms-2">Ana Sayfaya Dön</router-link>
      </div>

      <!-- Ürün Detayı -->
      <div v-else class="product-detail">
        <div class="row">
          <!-- Ürün Görselleri -->
          <div class="col-md-6 mb-4">
            <div class="product-images">
              <!-- Ana Görsel -->
              <div class="main-image mb-3">
                <img
                  :src="mainImage || 'https://via.placeholder.com/500x500'"
                  :alt="productStore.product.name"
                  class="img-fluid rounded"
                />
              </div>

              <!-- Küçük Görseller -->
              <div class="thumbnail-images d-flex flex-wrap" v-if="productImages.length > 1">
                <div
                  v-for="(image, index) in productImages"
                  :key="index"
                  class="thumbnail-image me-2 mb-2"
                  @click="selectImage(index)"
                  :class="{ active: selectedImageIndex === index }"
                >
                  <img :src="image" :alt="productStore.product.name" class="img-fluid rounded" />
                </div>
              </div>
            </div>
          </div>

          <!-- Ürün Bilgileri -->
          <div class="col-md-6">
            <h1 class="product-title mb-2">{{ productStore.product.name }}</h1>

            <!-- Ürün Açıklaması -->
            <div class="product-description mb-3" v-if="productStore.product.description">
              <p>{{ productStore.product.description }}</p>
            </div>

            <!-- Kategori ve Marka -->
            <div class="product-meta mb-4" v-if="productStore.detailPage">
              <p v-if="productStore.detailPage.category" class="mb-1">
                <span class="text-muted">Kategori:</span>
                <router-link :to="`/category/${productStore.detailPage.category.slug}`">
                  {{ productStore.detailPage.category.name }}
                </router-link>
              </p>
              <p
                v-if="productStore.detailPage.brand && productStore.detailPage.brand.name"
                class="mb-0"
              >
                <span class="text-muted">Marka:</span> {{ productStore.detailPage.brand.name }}
              </p>
            </div>

            <!-- Etiketler -->
            <div
              class="product-tags mb-4"
              v-if="
                productStore.detailPage &&
                productStore.detailPage.productInfos &&
                productStore.detailPage.productInfos.tags &&
                productStore.detailPage.productInfos.tags.length > 0
              "
            >
              <span
                v-for="tag in productStore.detailPage.productInfos.tags"
                :key="tag"
                class="badge bg-light text-dark me-2 mb-2"
              >
                {{ tag }}
              </span>
            </div>

            <!-- Fiyat Bilgisi -->
            <div
              class="product-price mb-4"
              v-if="productStore.detailPage && productStore.detailPage.pricing"
            >
              <span v-if="productStore.detailPage.pricing.hasDiscount" class="old-price me-2">
                {{ productStore.detailPage.pricing.salePrice }} TL
              </span>
              <span class="current-price">
                {{
                  productStore.detailPage.pricing.hasDiscount
                    ? productStore.detailPage.pricing.discountPrice
                    : productStore.detailPage.pricing.salePrice
                }}
                TL
              </span>
            </div>

            <!-- Stok Durumu -->
            <div class="product-stock mb-4" v-if="productStore.product">
              <div v-if="productStore.isInStock" class="stock-status in-stock">
                <i class="bi bi-check-circle-fill me-2"></i> Stokta var
              </div>
              <div v-else class="stock-status out-of-stock">
                <i class="bi bi-x-circle-fill me-2"></i>
                {{ productStore.product.status || 'Stokta yok' }}
              </div>
            </div>

            <!-- Adres Seçimi -->
            <div class="address-selection mb-4">
              <h5 class="mb-3">Teslimat Adresi</h5>
              <div class="input-group">
                <input
                  type="text"
                  class="form-control"
                  v-model="addressText"
                  placeholder="Adresinizi girin..."
                  @click="toggleAddressDropdown"
                  readonly
                />
                <button
                  class="btn btn-outline-secondary"
                  type="button"
                  @click="toggleAddressDropdown"
                >
                  <i class="bi bi-geo-alt"></i>
                </button>
              </div>
              <small v-if="addressStore.selectedAddress" class="text-muted">
                {{ getAddressText(addressStore.selectedAddress) }}
              </small>

              <!-- Adres Seçim Dropdown'u -->
              <div v-if="showAddressDropdown" class="address-dropdown mt-2">
                <div class="card">
                  <div class="card-body">
                    <div v-if="addressStore.loading" class="text-center py-2">
                      <div class="spinner-border spinner-border-sm text-primary" role="status"></div>
                      <span class="ms-2">Adresler yükleniyor...</span>
                    </div>
                    <div v-else-if="addressStore.error" class="alert alert-danger">
                      {{ addressStore.error }}
                      <button class="btn btn-sm btn-outline-danger ms-2" @click="loadAddresses">
                        Yeniden Dene
                      </button>
                    </div>
                    <div v-else>
                      <div class="row mb-3">
                        <div class="col-md-6 mb-2">
                          <label class="form-label">İlçe</label>
                          <select
                            class="form-select"
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
                          <label class="form-label">Mahalle</label>
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
                      <div class="d-flex justify-content-end">
                        <button
                          class="btn btn-sm btn-secondary me-2"
                          @click="showAddressDropdown = false"
                        >
                          İptal
                        </button>
                        <button
                          class="btn btn-sm btn-primary"
                          @click="confirmAddress"
                          :disabled="!selectedNeighborhood"
                        >
                          Adresi Seç
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Teslimat Tarihi Seçimi -->
            <div class="delivery-date-selection mb-4" v-if="productStore.isInStock">
              <h5 class="mb-3">Teslimat Tarihi</h5>
              <div v-if="calendarLoading" class="text-center py-2">
                <div class="spinner-border spinner-border-sm text-primary" role="status"></div>
                <span class="ms-2">Teslimat günleri yükleniyor...</span>
              </div>
              <div v-else-if="calendarError" class="alert alert-danger">
                {{ calendarError }}
                <button class="btn btn-sm btn-outline-danger ms-2" @click="loadCalendarDays">
                  Yeniden Dene
                </button>
              </div>
              <div v-else-if="productStore.calendarDays.length === 0" class="alert alert-warning">
                Teslimat günü bulunmuyor.
              </div>
              <div v-else class="delivery-calendar">
                <div class="row g-2">
                  <div
                    v-for="day in productStore.calendarDays"
                    :key="day.date"
                    class="col-md-4 mb-2"
                  >
                    <div
                      class="delivery-day-card p-2 text-center"
                      :class="{ active: day.date === productStore.selectedDate }"
                      @click="selectDeliveryDate(day.date)"
                    >
                      <div class="day-name">{{ formatDayName(day.day) }}</div>
                      <div class="date">{{ formatDate(day.date) }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Teslimat Saati Seçimi -->
            <div
              class="delivery-time-selection mb-4"
              v-if="productStore.isInStock && productStore.selectedDate"
            >
              <h5 class="mb-3">Teslimat Saati</h5>
              <div v-if="slotsLoading" class="text-center py-2">
                <div class="spinner-border spinner-border-sm text-primary" role="status"></div>
                <span class="ms-2">Teslimat saatleri yükleniyor...</span>
              </div>
              <div v-else-if="slotsError" class="alert alert-danger">
                {{ slotsError }}
                <button class="btn btn-sm btn-outline-danger ms-2" @click="loadDaySlots">
                  Yeniden Dene
                </button>
              </div>
              <div v-else-if="productStore.daySlots.length === 0" class="alert alert-warning">
                Seçilen tarih için teslimat saati bulunmuyor.
              </div>
              <div v-else class="time-slots">
                <div class="row g-2">
                  <div
                    v-for="slot in productStore.daySlots"
                    :key="`${slot.startTime}-${slot.endTime}`"
                    class="col-md-6 mb-2"
                  >
                    <div
                      class="time-slot-card p-2 text-center"
                      :class="{ active: isSelectedTimeSlot(slot) }"
                      @click="selectTimeSlot(slot)"
                    >
                      {{ formatTimeSlot(slot) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Sepete Ekle -->
            <div class="add-to-cart mt-4">
              <button
                class="btn btn-primary btn-lg w-100"
                :disabled="!canAddToCart"
                @click="addToCart"
              >
                <i class="bi bi-cart-plus me-2"></i> Sepete Ekle
              </button>
              <small
                v-if="!canAddToCart && productStore.isInStock"
                class="text-danger d-block mt-2"
              >
                Sepete eklemek için teslimat tarihi ve saati seçmelisiniz.
              </small>
            </div>
          </div>
        </div>

        <!-- Ürün Detay Tabları -->
        <div class="product-tabs mt-5">
          <ul class="nav nav-tabs" id="productTabs" role="tablist">
            <li class="nav-item" role="presentation">
              <button
                class="nav-link active"
                id="description-tab"
                data-bs-toggle="tab"
                data-bs-target="#description"
                type="button"
                role="tab"
                aria-controls="description"
                aria-selected="true"
              >
                Ürün Açıklaması
              </button>
            </li>
            <li class="nav-item" role="presentation">
              <button
                class="nav-link"
                id="details-tab"
                data-bs-toggle="tab"
                data-bs-target="#details"
                type="button"
                role="tab"
                aria-controls="details"
                aria-selected="false"
              >
                Ürün Bilgileri
              </button>
            </li>
            <li class="nav-item" role="presentation">
              <button
                class="nav-link"
                id="shipping-tab"
                data-bs-toggle="tab"
                data-bs-target="#shipping"
                type="button"
                role="tab"
                aria-controls="shipping"
                aria-selected="false"
              >
                Teslimat Detayları
              </button>
            </li>
          </ul>
          <div class="tab-content p-4 border border-top-0 rounded-bottom" id="productTabsContent">
            <div
              class="tab-pane fade show active"
              id="description"
              role="tabpanel"
              aria-labelledby="description-tab"
            >
              <div
                v-if="
                  productStore.detailPage &&
                  productStore.detailPage.productDetail &&
                  productStore.detailPage.productDetail.productDescription
                "
                v-html="productStore.detailPage.productDetail.productDescription"
              ></div>
              <p v-else>Bu ürün için detaylı açıklama bulunmamaktadır.</p>
            </div>
            <div class="tab-pane fade" id="details" role="tabpanel" aria-labelledby="details-tab">
              <h5>Ürün Özellikleri</h5>
              <div
                v-if="productStore.detailPage && productStore.detailPage.productInfos"
                class="product-info-details"
              >
                <!-- Temalar -->
                <div
                  v-if="
                    productStore.detailPage.productInfos.theme &&
                    productStore.detailPage.productInfos.theme.length > 0
                  "
                  class="mb-3"
                >
                  <h6>Tema:</h6>
                  <ul class="list-inline">
                    <li
                      v-for="theme in productStore.detailPage.productInfos.theme"
                      :key="theme"
                      class="list-inline-item"
                    >
                      <span class="badge bg-light text-secondary">{{ theme }}</span>
                    </li>
                  </ul>
                </div>

                <!-- Gönderim Amacı -->
                <div
                  v-if="
                    productStore.detailPage.productInfos.shippingPurpose &&
                    productStore.detailPage.productInfos.shippingPurpose.length > 0
                  "
                  class="mb-3"
                >
                  <h6>Gönderim Amacı:</h6>
                  <ul class="list-inline">
                    <li
                      v-for="purpose in productStore.detailPage.productInfos.shippingPurpose"
                      :key="purpose"
                      class="list-inline-item"
                    >
                      <span class="badge bg-light text-secondary">{{ purpose }}</span>
                    </li>
                  </ul>
                </div>

                <!-- Taşıma -->
                <div
                  v-if="
                    productStore.detailPage.productInfos.transportation &&
                    productStore.detailPage.productInfos.transportation.length > 0
                  "
                  class="mb-3"
                >
                  <h6>Taşıma:</h6>
                  <ul class="list-inline">
                    <li
                      v-for="transport in productStore.detailPage.productInfos.transportation"
                      :key="transport"
                      class="list-inline-item"
                    >
                      <span class="badge bg-light text-secondary">{{ transport }}</span>
                    </li>
                  </ul>
                </div>
              </div>
              <p v-else>Bu ürün için detaylı bilgi bulunmamaktadır.</p>
            </div>
            <div class="tab-pane fade" id="shipping" role="tabpanel" aria-labelledby="shipping-tab">
              <div v-if="productStore.detailPage && productStore.detailPage.shippingDetail">
                <h5 v-if="productStore.detailPage.shippingDetail.name">
                  {{ productStore.detailPage.shippingDetail.name }}
                </h5>
                <div
                  v-if="productStore.detailPage.shippingDetail.description"
                  class="mt-3"
                  v-html="productStore.detailPage.shippingDetail.description"
                ></div>
                <img
                  v-if="productStore.detailPage.shippingDetail.image"
                  :src="productStore.detailPage.shippingDetail.image"
                  alt="Teslimat Bilgisi"
                  class="img-fluid mt-3"
                  style="max-height: 200px"
                />
              </div>
              <p v-else>Bu ürün için teslimat detayı bulunmamaktadır.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useProductStore } from '@/stores/product'
import { useAddressStore } from '@/stores/address'

const route = useRoute()
const productStore = useProductStore()
const addressStore = useAddressStore()

// Adres ve teslimat durumları
const selectedDistrict = ref(null)
const selectedNeighborhood = ref(null)
const districts = ref([])
const neighborhoods = ref([])
const showAddressDropdown = ref(false)
const addressText = ref('')

// Görsel durumları
const selectedImageIndex = ref(0)
const productImages = computed(() => {
  // productStore.getProductImages getter'ını kullan
  const images = productStore.getProductImages
  return images.map((img) => img.imagePath || '')
})

const mainImage = computed(() => {
  if (productImages.value.length === 0) return null
  return productImages.value[selectedImageIndex.value]
})

// Takvim ve slot durumları
const calendarLoading = ref(false)
const calendarError = ref(null)
const slotsLoading = ref(false)
const slotsError = ref(null)

// Sepete eklenebilir mi?
const canAddToCart = computed(() => {
  if (!productStore.product) return false

  return (
    productStore.isInStock &&
    addressStore.selectedAddress &&
    productStore.selectedDate &&
    productStore.selectedTimeSlot
  )
})

// İlçeye göre filtrelenmiş mahalleler
const filteredNeighborhoods = computed(() => {
  if (!selectedDistrict.value) return []

  return neighborhoods.value.filter(
    (neighborhood) => neighborhood.data.district_id === selectedDistrict.value.data.district_id,
  )
})

// İlçe değiştiğinde mahalleleri filtrele
const onDistrictChange = () => {
  selectedNeighborhood.value = null
}

// Adres dropdown'ını aç/kapat
const toggleAddressDropdown = () => {
  showAddressDropdown.value = !showAddressDropdown.value
}

// Tıklama olayını dinle (dropdown dışına tıklandığında kapatmak için)
const handleClickOutside = (event) => {
  const dropdown = document.querySelector('.address-dropdown')
  const inputGroup = document.querySelector('.address-selection .input-group')

  if (
    dropdown &&
    !dropdown.contains(event.target) &&
    inputGroup &&
    !inputGroup.contains(event.target)
  ) {
    showAddressDropdown.value = false
  }
}

// Component mount olduğunda click dinleyicisi ekle
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

// Component unmount olduğunda dinleyiciyi kaldır
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// Adresleri yükle ve ayır
const loadAddresses = async () => {
  try {
    const addresses = await addressStore.fetchAddresses()

    if (addresses) {
      // İlçeleri ayır (district tipindeki adresler)
      districts.value = addresses.filter((address) => address.id.startsWith('district:'))

      // Mahalleleri ayır (neighborhood tipindeki adresler)
      neighborhoods.value = addresses.filter((address) => address.id.startsWith('neighborhood:'))

      // Kayıtlı adres varsa seç
      const savedAddress = localStorage.getItem('selectedAddress')
      if (savedAddress) {
        try {
          const parsedAddress = JSON.parse(savedAddress)
          addressStore.setSelectedAddress(parsedAddress)
          updateAddressText()
        } catch (e) {
          // JSON parse hatası, localStorage'ı temizle
          localStorage.removeItem('selectedAddress')
        }
      }
    }
  } catch (error) {
    console.error('Adres yükleme hatası:', error)
  }
}

// Ürün detayını yükle
const loadProduct = async () => {
  const productSlug = route.params.slug
  if (!productSlug) return

  await productStore.fetchProductDetail(productSlug)

  if (productStore.product && productStore.isInStock) {
    loadCalendarDays()
  }
}

// Teslimat günlerini yükle
const loadCalendarDays = async () => {
  const productSlug = route.params.slug
  if (!productSlug) return

  calendarLoading.value = true
  calendarError.value = null

  try {
    await productStore.fetchCalendarDays(productSlug)
  } catch (error) {
    calendarError.value = 'Teslimat günleri yüklenirken bir hata oluştu.'
  } finally {
    calendarLoading.value = false
  }
}

// Teslimat saat aralıklarını yükle
const loadDaySlots = async () => {
  const productSlug = route.params.slug
  if (!productSlug || !productStore.selectedDate) return

  slotsLoading.value = true
  slotsError.value = null

  try {
    await productStore.fetchDaySlots(productSlug, productStore.selectedDate)
  } catch (error) {
    slotsError.value = 'Teslimat saatleri yüklenirken bir hata oluştu.'
  } finally {
    slotsLoading.value = false
  }
}

const updateAddressText = () => {
  if (addressStore.selectedAddress) {
    addressText.value = getAddressText(addressStore.selectedAddress)
  } else {
    addressText.value = ''
  }
}

// Adres metnini oluştur
const getAddressText = (address) => {
  if (!address) return ''

  if (address.id.startsWith('neighborhood:')) {
    return `${address.data.neighborhood_name}, ${address.data.district_name} / ${address.data.province_name}`
  } else if (address.id.startsWith('district:')) {
    return `${address.data.district_name} / ${address.data.province_name}`
  }

  return address.text || ''
}

// Adresi onayla
const confirmAddress = () => {
  if (selectedNeighborhood.value) {
    addressStore.setSelectedAddress(selectedNeighborhood.value)
    updateAddressText()
    showAddressDropdown.value = false

    // Adres değiştiğinde teslimat günlerini yeniden yükle
    loadCalendarDays()
  }
}

// Teslimat tarihini seç
const selectDeliveryDate = (date) => {
  productStore.setSelectedDate(date)
  loadDaySlots()
}

// Teslimat saatini seç
const selectTimeSlot = (slot) => {
  productStore.setSelectedTimeSlot(slot)
}

// Seçili zaman aralığı mı?
const isSelectedTimeSlot = (slot) => {
  if (!productStore.selectedTimeSlot) return false

  return (
    productStore.selectedTimeSlot.startTime === slot.startTime &&
    productStore.selectedTimeSlot.endTime === slot.endTime
  )
}

// Görseli seç
const selectImage = (index) => {
  selectedImageIndex.value = index
}

// Tarihi formatla
const formatDate = (dateStr) => {
  if (!dateStr) return ''

  const date = new Date(dateStr)
  return date.toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

// Gün adını formatla
const formatDayName = (dayName) => {
  const days = {
    Monday: 'Pazartesi',
    Tuesday: 'Salı',
    Wednesday: 'Çarşamba',
    Thursday: 'Perşembe',
    Friday: 'Cuma',
    Saturday: 'Cumartesi',
    Sunday: 'Pazar',
  }

  // Türkçe günü döndür, yoksa orijinal günü döndür
  return days[dayName] || dayName
}

// Zaman aralığını formatla
const formatTimeSlot = (slot) => {
  if (!slot || !slot.startTime || !slot.endTime) return ''

  // Saatleri '13:00:00' formatından '13:00' formatına dönüştür
  const startTime = slot.startTime.split(':').slice(0, 2).join(':')
  const endTime = slot.endTime.split(':').slice(0, 2).join(':')

  return `${startTime} - ${endTime}`
}

// Sepete ekleme
const addToCart = () => {
  if (!canAddToCart.value) return

  // Sepete ekleme işlemi
  alert('Ürün sepete eklendi!')
}

// Ürün değiştiğinde store'u temizle
watch(
  () => route.params.slug,
  () => {
    productStore.clearProductData()
    loadProduct()
  },
)

// Sayfa yüklendiğinde
onMounted(async () => {
  await loadAddresses()
  await loadProduct()
  updateAddressText()
})
</script>

<style scoped>
.product-title {
  font-size: 1.75rem;
  font-weight: 600;
  color: #333;
}

.product-price {
  font-size: 1.25rem;
}

.old-price {
  text-decoration: line-through;
  color: #888;
  font-size: 1rem;
}

.current-price {
  font-weight: bold;
  color: #4caf50;
  font-size: 1.5rem;
}

.stock-status {
  font-size: 0.95rem;
  padding: 8px 12px;
  border-radius: 4px;
  display: inline-flex;
  align-items: center;
}

.in-stock {
  background-color: rgba(76, 175, 80, 0.1);
  color: #4caf50;
}

.out-of-stock {
  background-color: rgba(244, 67, 54, 0.1);
  color: #f44336;
}

.main-image {
  border-radius: 8px;
  overflow: hidden;
  background-color: #f8f8f8;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.main-image img {
  max-height: 100%;
  object-fit: contain;
}

.thumbnail-image {
  width: 80px;
  height: 80px;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.2s ease;
}

.thumbnail-image.active {
  border-color: #4caf50;
}

.thumbnail-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.delivery-day-card {
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.delivery-day-card:hover {
  border-color: #4caf50;
  background-color: rgba(76, 175, 80, 0.05);
}

.delivery-day-card.active {
  border-color: #4caf50;
  background-color: rgba(76, 175, 80, 0.1);
}

.day-name {
  font-weight: 600;
  font-size: 0.85rem;
}

.time-slot-card {
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.time-slot-card:hover {
  border-color: #4caf50;
  background-color: rgba(76, 175, 80, 0.05);
}

.time-slot-card.active {
  border-color: #4caf50;
  background-color: rgba(76, 175, 80, 0.1);
}

.address-selection {
  position: relative;
}

.address-selection input {
  cursor: pointer;
  background-color: #fff;
}

.address-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 1000;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.btn-primary {
  background-color: #4caf50;
  border-color: #4caf50;
}

.btn-primary:hover:not(:disabled) {
  background-color: #45a049;
  border-color: #45a049;
}

.btn-outline-primary {
  color: #4caf50;
  border-color: #4caf50;
}

.btn-outline-primary:hover {
  background-color: #4caf50;
  border-color: #4caf50;
}

.nav-tabs .nav-link.active {
  color: #4caf50;
  border-color: #dee2e6 #dee2e6 #fff;
}

.nav-tabs .nav-link:not(.active):hover {
  border-color: #e9ecef #e9ecef #dee2e6;
  color: #4caf50;
}

.product-meta a {
  color: #4caf50;
  text-decoration: none;
}

.product-meta a:hover {
  text-decoration: underline;
}
</style>
