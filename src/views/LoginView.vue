<template>
  <div class="login-page">
    <div class="container">
      <div class="row">
        <div class="col-md-6 mx-auto">
          <div class="card login-card">
            <div class="card-header">
              <h3 class="text-center">Giriş Yap</h3>
            </div>
            <div class="card-body">
              <!-- Hata mesajı -->
              <div v-if="authStore.error" class="alert alert-danger">
                {{ authStore.error }}
              </div>

              <form @submit.prevent="handleLogin">
                <div class="form-group mb-3">
                  <label for="email">E-posta Adresi</label>
                  <input
                    type="email"
                    id="email"
                    v-model="email"
                    class="form-control"
                    placeholder="E-posta adresinizi girin"
                    required
                  />
                </div>

                <div class="form-group mb-3">
                  <label for="password">Şifre</label>
                  <input
                    type="password"
                    id="password"
                    v-model="password"
                    class="form-control"
                    placeholder="Şifrenizi girin"
                    required
                  />
                </div>

                <div class="d-grid">
                  <button type="submit" class="btn btn-primary" :disabled="authStore.loading">
                    <span v-if="authStore.loading">Giriş yapılıyor...</span>
                    <span v-else>Giriş Yap</span>
                  </button>
                </div>

                <div class="text-center mt-3">
                  <p>Henüz hesabınız yok mu? <router-link to="/register">Kayıt Ol</router-link></p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

// Form alanları
const email = ref('');
const password = ref('');

// Form gönderim işlevi
const handleLogin = async () => {
  // İstek için session_id oluştur
  const sessionId = Math.random().toString(36).substring(2, 15);

  const success = await authStore.login({
    email: email.value,
    password: password.value,
    session_id: sessionId
  });

  if (success) {
    // Başarılı giriş sonrası ana sayfaya yönlendir (store'da da yapılabilir)
    router.push('/');
  }
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: 40px 0;
  background-color: #f8f9fa;
}

.login-card {
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.card-header {
  background-color: #fff;
  border-bottom: 1px solid #eee;
  padding: 20px;
}

.card-body {
  padding: 30px;
}

.form-control {
  padding: 12px;
  border-radius: 5px;
}

.btn-primary {
  padding: 12px;
  border-radius: 5px;
  background-color: #4CAF50;
  border: none;
}

.btn-primary:hover {
  background-color: #45a049;
}
</style>
