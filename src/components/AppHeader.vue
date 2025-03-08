<template>
  <header class="site-header">
    <nav class="navbar navbar-expand-lg navbar-light bg-white">
      <div class="container">
        <!-- Logo -->
        <router-link class="navbar-brand" to="/">
          <span class="logo-text">Çiçek Sitesi</span>
        </router-link>

        <!-- Mobil Menü Butonu -->
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <!-- Menü İçeriği -->
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto">
            <li class="nav-item" v-for="category in categories" :key="category.slug">
              <router-link :to="`/category/${category.slug}`" class="nav-link">
                {{ category.name }}
              </router-link>
            </li>
          </ul>

          <!-- Üye İşlemleri -->
          <div class="nav-user-actions">
            <div v-if="isAuthenticated" class="dropdown">
              <button
                class="btn btn-link dropdown-toggle user-dropdown"
                type="button"
                id="userDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {{ user?.name || 'Hesabım' }}
              </button>
              <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                <li><a class="dropdown-item" href="#">Hesabım</a></li>
                <li><a class="dropdown-item" href="#">Siparişlerim</a></li>
                <li><hr class="dropdown-divider"></li>
                <li><button class="dropdown-item" @click="logout">Çıkış Yap</button></li>
              </ul>
            </div>
            <div v-else class="d-flex">
              <router-link to="/login" class="btn btn-link">Giriş Yap</router-link>
              <router-link to="/register" class="btn btn-outline-primary ms-2">Kayıt Ol</router-link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useCategoryStore } from '@/stores/category';
import { useAuthStore } from '@/stores/auth';

// Store'ları başlat
const categoryStore = useCategoryStore();
const authStore = useAuthStore();

// Kategorileri ref olarak sakla
const categories = ref([]);

// Kullanıcı bilgisi
const isAuthenticated = computed(() => authStore.isAuthenticated);
const user = computed(() => authStore.getUser);

// Çıkış yapma işlevi
const logout = () => {
  authStore.logout();
};

// Kategorileri yükle
const loadCategories = async () => {
  await categoryStore.fetchCategories();
  categories.value = categoryStore.getCategories;
};

// Bileşen yüklendiğinde
onMounted(() => {
  loadCategories();
});
</script>

<style scoped>
.site-header {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 1000;
  background-color: white;
}

.logo-text {
  font-size: 1.5rem;
  font-weight: bold;
  color: #4CAF50;
}

.nav-link {
  font-weight: 500;
  padding: 0.5rem 1rem;
  color: #333;
  transition: color 0.3s ease;
}

.nav-link:hover, .nav-link.active {
  color: #4CAF50;
}

.nav-user-actions {
  display: flex;
  align-items: center;
}

.user-dropdown {
  color: #333;
  text-decoration: none;
  font-weight: 500;
}

.btn-outline-primary {
  color: #4CAF50;
  border-color: #4CAF50;
}

.btn-outline-primary:hover {
  background-color: #4CAF50;
  border-color: #4CAF50;
}
</style>
