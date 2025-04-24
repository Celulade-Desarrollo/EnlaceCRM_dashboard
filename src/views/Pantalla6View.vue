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
    <div class="row">
      <!-- Banner 1 -->
      <div class="col-md-4 banner1">
        <h2 class="proveedores">¿Cuánto quieres pagar?</h2>
        <div class="info-banner-main mb-4">
          <p class="deuda-total mb-2" id="deuda-total">Fecha limite de pago: {{dataInfoapp[0].fecha}}</p>
          <p class="fecha-pago ml-5 mb-2" id="fecha-pago">Valor a pagar: {{dataInfoapp[0].pagoMinimo}}</p>
          <p class="cupo-disponible mb-2" id="cupo-disponible">Referencia de pago:<span class="cupo-disponible-dinero"> xys123</span></p>
        </div>
      </div>
      <!-- Banner 2 -->
      <div class="col-md-4 banner1">
        <h2 class="proveedores-pedidos">Pago minimo</h2>
        <div class="info-banner-pedidos">
          <p class="precio-pedido mb-2" id="precioPedido1">${{dataInfoapp[0].pagoMinimo}}</p>
          <div class="button-banner-pedidos">
            <button type="button" id="Pantalla7">
              Pagar
            </button>
          </div>
        </div>
      </div>
      <!-- Línea separadora -->
      <div class="separator"></div>

      <div class="col-md-4 banner1">
        <h2 class="proveedores-pedidos mt-4">Abonar a la deuda total</h2>
        <div class="info-banner-pedidos">
          <p class="precio-pedido mb-2" id="precioPedido1">Abona a tu deuda a tu medida</p>
          <div class="button-banner-pedidos">
            <button type="button" id="boton-pago">
              Pagar
            </button>
          </div>
        </div>
      </div>
    </div>
    
  </section>
</template>

<style>
body {
    font-family: Verdana, Geneva, Tahoma, sans-serif;
    background-color: white;
}

.formkit-wrapper {
    align-items: center;
    width: 100%;
}

.formkit-input {
    text-align: center;
}

.formkit-help {
    margin-left: 50px;
}

.form-group input {
    background-color: transparent;
    border-width: 0 0 1px;
    border-bottom: solid 1px rgba(17, 17, 17, 0.2);
    color: rgb(17, 17, 17);
    padding: 8px 0;
    width: 100%;
    outline: none;
}

.container button {
    padding: 0.5rem 1rem;
    border-radius: 6.25rem;
    background: #dd3590;
    color: #fff;
    display: flex;
    margin-bottom: 1rem;
    cursor: pointer;
    border: none;
    align-items: center;
    position: relative;
    font-size: 1rem;
    justify-content: center;
    width: auto;
}

.container button svg {
    margin-left: 8px;
}

.parrafo {
    margin: 20px 0;
    font-size: medium;
}

.info-banner {
    width: 100%;
    letter-spacing: -0.03em;
    line-height: 1.2;
    background-color: #fff;
    color: black;
    padding: 24px;
    display: flex;
    align-items: center;
    margin-top: 30px;
    border-radius: 5px;
}
.info-banner-main {
    width: 100%;
    letter-spacing: -0.03em;
    line-height: 1.2;
    background-color: #e9e9e9;
    color: black;
    padding: 24px;
    align-items: center;
    margin-top: 30px;
    border-radius: 5px;
}
.info-banner-pedidos {
    width: 100%;
    letter-spacing: -0.03em;
    line-height: 1.2;
    background-color: #fff;
    color: black;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 30px;
    border-radius: 5px;
}
.info-banner3 {
    width: 100%;
    letter-spacing: -0.03em;
    line-height: 1.2;
    background-color: #fff;
    color: black;
    padding: 24px;
    display: flex;
    align-items: center;
    margin-top: -80px; 
}
.titulo-1 {
    font-weight: bold;
}

.titulo {
    margin: 0 0 16px;
    color: black;
    font-weight: bold;
    letter-spacing: -0.03em;
    font-size: 1.875rem;
    line-height: 1.2;
}

.subtitulo {
    color: black;
}

.proveedores-pedidos,
.precio-pedido{
  color: black;
}

.button-banner button {
    background-color: #dd3590;
    color: white;
}

.deuda-total {
    font-weight: bold;
}
.proveedores{
    font-weight: bold;
    color: black;
    width: 100%;
    letter-spacing: -0.03em;
    line-height: 1.2;
    background-color: #fff;
    padding: 24px;
    display: flex;
    align-items: center;
    margin-bottom: -40px;
}
.fecha-pago {
    font-weight: bold;
}

.cupo-disponible-dinero {
    font-weight: bold;
}

.separator {
    width: 100%;
    background-color: #b3b0b0;
    height: 1px;
    margin: 0 auto;
}

.parrafo-marcas{
    font-weight: bold;
    text-align: center;
}

.img-fluid{
    height: 80%;
    width: 80%;
}

.text-section {
    flex-grow: 1;
    margin-left: 20px;
}

.proveedores{
    font-weight: bold;
}
@media (max-width: 767px) {
    .img-fluid {
        margin-top: -90px;
    }

    .tarjeta {
        background-color: #fff;
        padding: 24px;
        border-radius: 16px;
        width: 100%;
    }

    .info-banner {
        flex-direction: column;
        align-items: flex-start;
    }

    .text-section {
        margin-left: 0;
        margin-top: 10px;
    }
}
</style>
