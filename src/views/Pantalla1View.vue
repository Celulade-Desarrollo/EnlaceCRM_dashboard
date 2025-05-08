<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
let dataInfoapp = JSON.parse(localStorage.getItem('data')) || [{ nombre: 'Juan', saldorestante: '$50,000', saldoabonado: '$100,000' }];

const goToPantalla2 = () => {
  router.push('/Pantalla2View');
};

const goToPantalla5 = () => {
  router.push('/Pantalla5View');
};
</script>

<template>
  <!-- Logo principal -->
  <section class="logo-container">
    <img src="/public/enlaceFiado.png" alt="logo Enlace CRM" class="logo-main" />
  </section>

  <!-- Encabezado -->
  <header class="header">
    <span class="icon-left icon-circle"><i class="fas fa-user"></i></span>
    <p>Hola, {{ dataInfoapp[0].nombre }}</p>
    <span class="icon-right icon-circle"><i class="fas fa-question-circle"></i></span>
    <!-- Font Awesome CDN -->
<link
  rel="stylesheet"
  href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
/>

  </header>

  <section class="content">
    <!-- Tarjeta de deuda -->
    <div class="card">
      <h2>Deuda total</h2>
      <p class="bold">{{ dataInfoapp[0].saldorestante }}</p>
      <p><span class="bold">Fecha siguiente abono:</span></p>
      <p>Cupo disponible: <span class="pink bold">{{ dataInfoapp[0].saldoabonado }}</span></p>
      <button class="btn" @click="goToPantalla5">Ver más</button>
    </div>

    <!-- Tarjeta de proveedor -->
    <div class="card">
      <h3 class="card-header">Proveedores disponibles para recibir pago.</h3>
      <div class="provider-content">
        <img src="/Alpina.png" alt="Alpina" class="alpina-img" />
        <div class="text-center">
          <p class="bold">Alpina</p>
          <button class="btn2" @click="goToPantalla2">Pagar</button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Estructura general */
body {
  font-family: 'Verdana', sans-serif;
  background-color: white;
  margin: 0;
  padding: 0;
}

.logo-container {
  text-align: center;
  margin-top: 1rem;
}
.logo-main {
  max-width: 200px;
  height: auto;
}

/* Encabezado */
.header {
  background-color: #021066;;
  color: rgb(255, 255, 255);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  border-radius: 16px;
  margin: 1rem auto;
  width: 90%;
  font-size: 1.1rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.icon-left,
.icon-right {
  font-size: 1.2rem;
}

.icon-circle {
  background-color: white;
  color: #2b008b;
  padding: 0.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Contenido */
.content {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  align-items: center;
}

.card {
  background: #fff;
  border: 2px solid #251886;
  border-radius: 15px;
  padding: 1.5rem;
  max-width: 500px;
  width: 100%;
  text-align: left;
}

.card-header {
  background-color: #251886;
  color: white;
  padding: 0.75rem;
  border-radius: 10px;
  text-align: center;
  margin-bottom: 1rem;
}

.bold {
  font-weight: bold;
}

.pink {
  color: #dd3590;
}

.btn {
  background-color: #dd3590;
  color: white;
  border: none;
  padding: 10px 24px;
  border-radius: 25px;
  font-weight: bold;
  margin-top: 1rem;
  cursor: pointer;
}

.btn2{
    color: white;
  border: none;
  padding: 10px 24px;
  border-radius: 25px;
  font-weight: bold;
  margin-top: 1rem;
  cursor: pointer;
  width: 200px;
}
/* Proveedor */
.provider-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.alpina-img {
  width: 140px;
  height: auto;
}

.text-center {
  text-align: center;
}

/* Responsive */
@media (max-width: 600px) {
  .provider-content {
    flex-direction: column;
  }
}
</style>
