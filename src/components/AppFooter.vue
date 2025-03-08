<template>
  <footer class="site-footer pt-5 pb-4 mt-5">
    <div class="container">
      <div class="row">
        <!-- Hakkımızda Sütunu -->
        <div class="col-md-3 mb-4">
          <h5 class="mb-3">Hakkımızda</h5>
          <p class="text-muted">
            Çiçek Sitesi olarak en kaliteli ve taze çiçekleri sizlere ulaştırmak için çalışıyoruz.
          </p>
        </div>

        <!-- Hızlı Erişim Sütunu -->
        <div class="col-md-3 mb-4">
          <h5 class="mb-3">Hızlı Erişim</h5>
          <ul class="list-unstyled">
            <li class="mb-2">
              <router-link to="/" class="footer-link">Ana Sayfa</router-link>
            </li>
            <li class="mb-2">
              <router-link to="/category/gercek-cicekler" class="footer-link">Gerçek Çiçekler</router-link>
            </li>
            <li class="mb-2">
              <router-link to="/category/yapay-cicekler" class="footer-link">Yapay Çiçekler</router-link>
            </li>
            <li class="mb-2">
              <router-link to="/category/cicekler" class="footer-link">Tüm Çiçekler</router-link>
            </li>
          </ul>
        </div>

        <!-- Yardım Sütunu -->
        <div class="col-md-3 mb-4">
          <h5 class="mb-3">Yardım</h5>
          <ul class="list-unstyled">
            <li class="mb-2">
              <a href="#" class="footer-link">Sıkça Sorulan Sorular</a>
            </li>
            <li class="mb-2">
              <a href="#" class="footer-link">Teslimat Bilgileri</a>
            </li>
            <li class="mb-2">
              <a href="#" class="footer-link">İade Politikası</a>
            </li>
            <li class="mb-2">
              <a href="#" class="footer-link">Gizlilik Politikası</a>
            </li>
          </ul>
        </div>

        <!-- İletişim Sütunu -->
        <div class="col-md-3 mb-4">
          <h5 class="mb-3">İletişim</h5>
          <ul class="list-unstyled">
            <li class="mb-2">
              <i class="bi bi-geo-alt me-2"></i> İstanbul, Türkiye
            </li>
            <li class="mb-2">
              <i class="bi bi-envelope me-2"></i> info@ciceksitesi.com
            </li>
            <li class="mb-2">
              <i class="bi bi-telephone me-2"></i> +90 (212) 123 4567
            </li>
          </ul>
          <div class="social-links mt-3">
            <a href="#" class="social-link me-2"><i class="bi bi-facebook"></i></a>
            <a href="#" class="social-link me-2"><i class="bi bi-twitter"></i></a>
            <a href="#" class="social-link me-2"><i class="bi bi-instagram"></i></a>
          </div>
        </div>
      </div>

      <hr class="my-4">

      <!-- Telif Hakkı -->
      <div class="row">
        <div class="col-md-12 text-center">
          <p class="mb-0 text-muted">
            &copy; {{ new Date().getFullYear() }} Çiçek Sitesi. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
// Footer component
</script>

<style scoped>
.site-footer {
  background-color: #f8f9fa;
  border-top: 1px solid #eaeaea;
}

h5 {
  font-weight: 600;
  color: #4CAF50;
}

.footer-link {
  color: #666;
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-link:hover {
  color: #4CAF50;
  text-decoration: none;
}

.social-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #e9ecef;
  color: #4CAF50;
  transition: all 0.3s ease;
}

.social-link:hover {
  background-color: #4CAF50;
  color: white;
}
</style>
