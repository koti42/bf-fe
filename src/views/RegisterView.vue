<template>
  <div class="register-page">
    <div class="container">
      <div class="row">
        <div class="col-md-6 mx-auto">
          <div class="card register-card">
            <div class="card-header">
              <h3 class="text-center">Kayıt Ol</h3>
            </div>
            <div class="card-body">
              <!-- Hata mesajı -->
              <div v-if="authStore.error" class="alert alert-danger">
                {{ authStore.error }}
              </div>

              <form @submit.prevent="handleRegister">
                <div class="form-group mb-3">
                  <label for="name">Ad Soyad</label>
                  <input
                    type="text"
                    id="name"
                    v-model="name"
                    class="form-control"
                    placeholder="Adınızı ve soyadınızı girin"
                    required
                  />
                </div>

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

                <div class="form-group mb-3">
                  <label for="password_confirmation">Şifre Tekrar</label>
                  <input
                    type="password"
                    id="password_confirmation"
                    v-model="passwordConfirmation"
                    class="form-control"
                    placeholder="Şifrenizi tekrar girin"
                    required
                  />
                </div>

                <div class="form-group mb-3">
                  <div class="form-check">
                    <input
                      type="checkbox"
                      id="notification_preference"
                      v-model="notificationPreference"
                      class="form-check-input"
                    />
                    <label class="form-check-label" for="notification_preference">
                      E-posta bildirimleri almak istiyorum
                    </label>
                  </div>
                </div>

                <div class="d-grid">
                  <button type="submit" class="btn btn-primary" :disabled="authStore.loading">
                    <span v-if="authStore.loading">Kayıt yapılıyor...</span>
                    <span v-else>Kayıt Ol</span>
                  </button>
                </div>

                <div class="text-center mt-3">
                  <p>Zaten hesabınız var mı? <router-link to="/login">Giriş Yap</router-link></p>
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
const name = ref('');
const email = ref('');
const password = ref('');
const passwordConfirmation = ref('');
const notificationPreference = ref(true);

// Form gönderim işlevi
const handleRegister = async () => {
  // Şifre doğrulama kontrolü
  if (password.value !== passwordConfirmation.value) {
    authStore.error = 'Şifreler eşleşmiyor.';
    return;
  }

  // İstek için session_id oluştur
  const sessionId = Math.random().toString(36).substring(2, 15);

  const success = await authStore.register({
    name: name.value,
    email: email.value,
    password: password.value,
    password_confirmation: passwordConfirmation.value,
    notification_preference: notificationPreference.value,
    session_id: sessionId
  });

  if (success) {
    // Başarılı kayıt sonrası ana sayfaya yönlendir (store'da da yapılabilir)
    router.push('/');
  }
};
</script>

<style scoped>
.register-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: 40px 0;
  background-color: #f8f9fa;
}

.register-card {
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
