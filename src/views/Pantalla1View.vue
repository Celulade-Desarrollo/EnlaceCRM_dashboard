<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router'; // Importa useRouter para navegar entre vistas
import RouterLink from "../components/UI/Routerlink.vue"; 
import Heading from "../components/UI/Heading.vue";

// Variables reactivas
const celular = ref('');
const data = ref(null);
const error = ref('');

// Instancia de router
const router = useRouter();

let dataInfoapp = $.parseJSON(localStorage.getItem('data'))

// Función para manejar el clic en el botón "Pantalla2"
const handlePantalla2Click = () => {
    window.open("/Pantalla2View", "_parent");
};
const handlePantalla5Click = () => {
    window.open("/Pantalla5View", "_parent");
};

// Montar el event listener para el envío del formulario
onMounted(() => {
  const Pantalla5Button = document.getElementById('Pantalla5');
  if (Pantalla5Button) {
    Pantalla5Button.addEventListener('click', handlePantalla5Click); // Agrega el event listener al botón
  }
  const Pantalla2Button = document.getElementById('Pantalla2');
  if (Pantalla2Button) {
    Pantalla2Button.addEventListener('click', handlePantalla2Click); // Agrega el event listener al botón
  }
});

</script>

<template>
<section class="logo-container">
  <img src="/public/enlaceFiado.png" alt="logo Enlace CRM" class="logo-main" />
</section>
   <!-- Encabezado -->
    <Heading :mensaje="'Hola, ' + dataInfoapp[0].nombre" />
    
  <section class="content">
    <!-- Tarjeta de deuda -->
    <div class="card">
      <h2>Deuda total</h2>
      <p class="bold">{{ dataInfoapp[0]?.saldorestante }}</p>
      <p><span class="bold pink">Fecha siguiente abono:</span></p>
      <p>Cupo disponible: <span class="pink bold">{{ dataInfoapp[0]?.saldoabonado }}</span></p>
      <button class="button" @click="goToPantalla5">Ver más</button>
    </div>

    <!-- Tarjeta de proveedor -->
    <div class="card">
      <h3 class="card-header">Proveedores disponibles para recibir pago</h3>
      <div class="provider-content">
        <img src="/Alpina.png" alt="Alpina" class="alpina-img" />
        <div class="text-center">
          <p class="bold">Alpina</p>
          <button class="button" @click="goToPantalla2">Pagar</button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.logo-container {
  text-align: center;
  margin-top: 1rem;
}

.logo-main {
  width: 200px;
  height: auto;
  display: inline-block;
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

.content {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  align-items: center;
}

.card {
  background: #fff;
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
.button {
  background-color: #dd3590;
  color: white;
  border: none;
  padding: 10px 24px;
  border-radius: 25px;
  font-weight: bold;
  margin-top: 1rem;
  cursor: pointer;
  width: 200px;
  margin-left: auto;
  display: block;
  text-align: center;
}


.button:hover {
  background-color: #f15bab;
}
button:focus {
  outline: none;
  box-shadow: none;
}
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

@media (max-width: 600px) {
  .provider-content {
    flex-direction: column;
  }
}
</style>
