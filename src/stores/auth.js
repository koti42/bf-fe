import { defineStore } from 'pinia';
import { authService } from '@/services/api';
import router from '@/router';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    // Kullanıcı bilgilerini localStorage'dan getir veya boş obje başlat
    user: JSON.parse(localStorage.getItem('user')) || null,
    loading: false,
    error: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
    getUser: (state) => state.user
  },

  actions: {
    // Giriş yapma
    async login(credentials) {
      this.loading = true;
      this.error = null;

      try {
        const response = await authService.login(credentials);

        if (response.data.success) {
          const { access_token, refresh_token, user } = response.data.data;

          // Token ve kullanıcı bilgilerini localStorage'a kaydet
          localStorage.setItem('access_token', access_token);
          localStorage.setItem('refresh_token', refresh_token);
          localStorage.setItem('user', JSON.stringify(user));

          this.user = user;

          // Ana sayfaya yönlendir
          router.push('/');
          return true;
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Giriş yapılırken bir hata oluştu.';
        return false;
      } finally {
        this.loading = false;
      }
    },

    // Kayıt olma
    async register(userData) {
      this.loading = true;
      this.error = null;

      try {
        const response = await authService.register(userData);

        if (response.data.success) {
          const { access_token, refresh_token, user } = response.data.data;

          // Token ve kullanıcı bilgilerini localStorage'a kaydet
          localStorage.setItem('access_token', access_token);
          localStorage.setItem('refresh_token', refresh_token);
          localStorage.setItem('user', JSON.stringify(user));

          this.user = user;

          // Ana sayfaya yönlendir
          router.push('/');
          return true;
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Kayıt olurken bir hata oluştu.';
        return false;
      } finally {
        this.loading = false;
      }
    },

    // Çıkış yapma
    logout() {
      authService.logout();
      this.user = null;
      router.push('/login');
    }
  }
});
