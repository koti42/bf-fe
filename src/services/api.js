import axios from 'axios';

// API için temel URL
const API_URL = 'https://bf.inverizo.com/api';

// Axios instance oluşturma
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 15000 // 15 saniye zaman aşımı
});

// İstek yapılmadan önce token ekleme
apiClient.interceptors.request.use(
  config => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Yanıt alındığında log kaydet
apiClient.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    if (error.response) {
      console.error('API yanıtında hata:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('API yanıtı alınamadı:', error.message);
    } else {
      console.error('API isteği oluşturulurken hata:', error.message);
    }
    return Promise.reject(error);
  }
);

// Auth servisleri
export const authService = {
  // Kayıt olma
  register(userData) {
    return apiClient.post('/auth/register', userData);
  },

  // Giriş yapma
  login(credentials) {
    return apiClient.post('/auth/login', credentials);
  },

  // Çıkış yapma
  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  }
};

// Kategori servisleri
export const categoryService = {
  getCategoryList() {
    return apiClient.get('/category/get-category-list-menu');
  },

  // Belirli kategorideki ürünleri alma
  getProductsByCategory(categorySlug, params = {}) {
    // ÖNEMLİ: Endpoint'i doğru şekilde oluştur
    // categorySlug'da tekrarlama olmadığından emin ol
    const cleanSlug = categorySlug.replace(/(.+)(\1)+$/, '$1'); // Kategori slug'ındaki tekrarları temizle

    // API endpoint formatını doğru şekilde ayarla
    const endpoint = `/products/get-product/${cleanSlug}`;

    // Adres ve diğer parametrelerini ekle
    const requestParams = {
      ...params
    };

    return apiClient.get(endpoint, { params: requestParams });
  }
};

// Ürün detay servisleri
export const productService = {
  // Ürün detayını getir
  getProductDetail(productSlug) {
    if (!productSlug) {
      return Promise.reject(new Error('Ürün slug\'ı belirtilmedi'));
    }
    try {
      return apiClient.get(`/products/get-product-detail-by-name/${productSlug}`);
    } catch (error) {
      return Promise.reject(error);
    }
  },

  // Ürün teslimat takvim günlerini getir
  getProductCalendarDays(productSlug) {
    if (!productSlug) {
      return Promise.reject(new Error('Ürün slug\'ı belirtilmedi'));
    }
    try {
      return apiClient.get(`/products/get-product-detail-calendar-days/${productSlug}`);
    } catch (error) {
      return Promise.reject(error);
    }
  },

  getProductCalendarDaySlots(productSlug, date) {
    if (!productSlug || !date) {
      return Promise.reject(new Error('Ürün slug\'ı veya tarih belirtilmedi'));
    }
    try {
      return apiClient.get(`/products/get-product-detail-calendar-day-slots/${productSlug}`, {
        params: { date }
      });
    } catch (error) {
      console.error(`Teslimat saatleri alınırken hata oluştu: ${productSlug}, ${date}`, error);
      return Promise.reject(error);
    }
  }
}
// Adres servisleri
export const addressService = {
  // Adres araması
  searchAddress() {
    return apiClient.get('/address/search');
  }
};

// API bağlantı testi
export const testApiConnection = async () => {
  try {
    // Kategori listesi isteği ile test et
    const response = await apiClient.get('/category/get-category-list-menu');
    return {
      success: true,
      status: response.status,
      data: response.data
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      details: error.response || error.request || error
    };
  }
};

export default apiClient;
