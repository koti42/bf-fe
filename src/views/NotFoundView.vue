<template>
  <div class="not-found">
    <div class="container text-center py-5">
      <h1 class="display-1">404</h1>
      <h2 class="mb-4">Sayfa Bulunamadı</h2>
      <p class="lead">Aradığınız sayfa bulunamadı veya taşınmış olabilir.</p>
      <router-link to="/" class="btn btn-primary mt-3">Ana Sayfaya Dön</router-link>
    </div>
  </div>
</template>

<script>
// 404 sayfası
export default {
  name: 'NotFoundView'
}
</script>

<style scoped>
.not-found {
  min-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

h1 {
  font-size: 6rem;
  color: #4CAF50;
}
</style>
