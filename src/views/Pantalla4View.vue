<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Heading from '../components/UI/Heading.vue';

// Variables reactivas
const pagar = ref('');
const router = useRouter();

let dataInfoapp = $.parseJSON(localStorage.getItem('data'))
let pagarValor = localStorage.getItem('pagarValor');

// Función para manejar el clic en el botón "codigoPedido1"
const handlePago1Click = () => {
  window.open("/Pantalla1View", "_parent");
};

// Montar el event listener para el envío del formulario y clic en el botón
onMounted(() => {
  const pago1Button = document.getElementById('codigoPedido1');
  if (pago1Button) {
    pago1Button.addEventListener('click', handlePago1Click);
  }
});
</script>

<template>
     <header class="header">
    <div class="header-icons">
      <!-- Ícono de ayuda a la izquierda -->
      <span class="icon-left">
        <i class="fas fa-user"></i>
      </span>
      
      <!-- Ícono de usuario a la derecha -->
      <span class="icon-right">
        <i class="fas fa-question-circle"></i>
      </span>
    </div>
    
    <!-- Mensaje de saludo -->
    <div class="header-text">
      <p>Hola, {{dataInfoapp[0].nombre}}</p>
    </div>
  </header>

  <section class="container banners">
    <div class="info-banner">
    
      <h2 class="proveedores mb-4" id="pagado">Su pago por <span>${{ pagarValor }}</span> para Alpina <br>ha sido recibido</h2>
      <picture class="logo">
        <img src="/public/Alpina.png" alt="logo" class="img-fluid" loading="lazy" title="logo" />
      </picture>
      <h1 class="proveedores mb-4" id="cantidad-pagar">¡Muchas gracias!</h1>
    </div>
    
  </section>
  <div class="button-inicio" @click="handlePago1Click">
      <button>Inicio</button>
    </div>
</template>

<style>
body {
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  background-color: white;
}
.button-inicio{
  padding-right: 20px;
  padding-left: 20px;
  margin-top: -200px;
  margin-bottom: 50px;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: start;
  padding: 16px;
  background-color: #251886;
  min-height: 80px;
  width: 100%;
}

.header-icons {
  display: flex;
  width: 100%;
}

.icon-left,
.icon-right {
  font-size: 24px;
  display: flex;
  align-items: center;
}

.header-text {
  flex-grow: 1;
  text-align: start;
  font-size: 18px;
  color: #fff;
}

.container {
  display: flex;
  justify-content: center; /* Centra el contenedor en la página */
  align-items: center; /* Centra el contenedor verticalmente */
  height: 100vh; /* Asegura que el contenedor ocupe toda la altura de la pantalla */
}

.info-banner {
  display: flex;
  flex-direction: column; /* Alinea los elementos verticalmente */
  align-items: center; /* Centra los elementos horizontalmente */
  text-align: center; /* Centra el texto */
  padding: 24px;
  margin-top: -55px;
}

.logo{
  margin-top: -30px;
}

.img-fluid {
  height: 60%;
  width: 60%;
  margin: 0 auto; /* Centra la imagen horizontalmente */
  display: block; /* Asegura que la imagen se comporte como un bloque */
}

.proveedores {
  font-weight: bold;
  color: black;
  margin-top: 20px; /* Espacio entre la imagen y el texto */
}

.button-banner-pedidos button {
  background-color: #dd3590;
  color: white;
  width: auto;
}

@media (max-width: 767px) {
  .img-fluid {
    margin-top: -90px;
  }
}
</style>
