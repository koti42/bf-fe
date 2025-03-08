import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
      meta: {
        title: 'Ana Sayfa'
      }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: {
        title: 'Giriş Yap',
        guest: true // Sadece giriş yapmamış kullanıcılar için
      }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/RegisterView.vue'),
      meta: {
        title: 'Kayıt Ol',
        guest: true // Sadece giriş yapmamış kullanıcılar için
      }
    },
    {
      path: '/category/:slug',
      name: 'category',
      component: () => import('@/views/CategoryView.vue'),
      meta: {
        title: 'Kategori'
      }
    },
    {
      path: '/product/:slug',
      name: 'product',
      component: () => import('@/views/ProductView.vue'),
      meta: {
        title: 'Ürün Detayı'
      }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
      meta: {
        title: 'Sayfa Bulunamadı'
      }
    }
  ]
});

// Router koruması
router.beforeEach((to, from, next) => {
  // Sayfa başlığını ayarla
  document.title = to.meta.title ? `${to.meta.title} | Çiçek Sitesi` : 'Çiçek Sitesi';

  // Kullanıcı durumu kontrolü
  const isAuthenticated = localStorage.getItem('access_token');

  // Eğer sayfa sadece misafirlere özelsa ve kullanıcı giriş yapmışsa, ana sayfaya yönlendir
  if (to.meta.guest && isAuthenticated) {
    return next('/');
  }

  // Eğer sayfa sadece giriş yapmış kullanıcılara özelsa ve kullanıcı giriş yapmamışsa, login sayfasına yönlendir
  if (to.meta.auth && !isAuthenticated) {
    return next('/login');
  }

  next();
});

export default router;
