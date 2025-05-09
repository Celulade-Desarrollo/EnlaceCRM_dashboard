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

let dataInfoapp = JSON.parse(localStorage.getItem('data'));

// Función para manejar el clic en el botón "Pantalla2"
const handlePantalla7Click = () => {
  window.open("/Pantalla7View", "_parent");
};


// Montar el event listener para el envío del formulario
onMounted(() => {
  const Pantalla7Button = document.getElementById('Pantalla7');
  if (Pantalla7Button) {
    Pantalla7Button.addEventListener('click', handlePantalla7Click); // Agrega el event listener al botón
  }
});

</script>
<template>
 <section class="logo-container">
    <img src="/public/enlaceFiado.png" alt="logo Enlace CRM" class="logo-main" />
  </section>

  <Heading :mensaje="'Hola, ' + (dataInfoapp && dataInfoapp.length > 0 ? dataInfoapp[0].nombre : 'Usuario')" />

  <section class="content">
    <div class="card">
        <div class="header-container">
         <strong><h1 class="proveedores">¿Cuánto quieres pagar?</h1></strong><br>
          <div class="info-banner-main mb-4">
            <strong><p class="deuda-total mb-2" id="deuda-total"> Fecha limite de pago: {{dataInfoapp[0].fecha}}</p></strong>
            <strong><p class="fecha-pago ml-5 mb-2" id="fecha-pago">a pagar: {{dataInfoapp[0].pagoMinimo}}</p></strong>
            <strong><p class="cupo-disponible mb-2" id="cupo-disponible">Referencia de pago:<span class="cupo-disponible-dinero"> xys123</span></p></strong>
          </div>
        </div>
         <strong><h2 class="proveedores-pedidos">Pago minimo</h2> </strong>
          <div class="info-banner-pedidos">
            <strong><p class="precio-pedido mb-2" id="precioPedido1">${{dataInfoapp[0].pagoMinimo}}</p></strong>
            <div class="button-banner-pedidos">
              <button type="button" class="button" id="Pantalla7">
                Pagar
              </button>
            </div>
          </div>
    </div>  
    <div class="card">
      <h2 class="abonar">Abonar a la deuda total</h2>
       <div class="provider-content">
        <p class="precio-pedido mb-2" id="precioPedido1">Abona tu deuda a tu medida</p>
        <div class="button-banner-pedidos">
          <button type="button" class="button" id="boton-pago">
            Pagar
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
body {
  font-family: 'Verdana', sans-serif;
  background-color: #2e008b; /* Fondo morado */
  margin: 0;
  padding: 0;
}

.logo-container {
  text-align: center;
  margin-top: 1rem;
}
.proveedores {
  text-align: center;
  font-size: 25px;
  color: #251886;
}
.button:hover {
  background-color: #f15bab;
}
.logo-main {
  max-width: 200px;
  height: auto;
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

.pink {
  color: #dd3590;
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
.abonar{
  font-weight: bold;
  text-align: center;
  font-size: 25px;
  color: #251886;
}

.button:hover {
  background-color: #f15bab;
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