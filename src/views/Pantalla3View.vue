<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Heading from "../components/UI/Heading.vue";

// Variables reactivas
const valorPago = ref('');

// Instancia de Vue Router
const router = useRouter();

let dataInfoapp = $.parseJSON(localStorage.getItem('data'))
let pagarValor = localStorage.getItem('pagarValor');


// Función para manejar el clic en el botón "codigoPedido1"
const handlePago1Click = () => {
  window.open("/Pantalla4View", "_parent");
};

// Montar el event listener para el envío del formulario y clic en el botón
onMounted(() => {;
  const pago1Button = document.getElementById('boton-pago');
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
      <picture class="logo">
        <img src="/public/Alpina.png" alt="logo" class="img-fluid" loading="lazy" title="logo" />
      </picture>
      <h2 class="proveedores">¿Está seguro que desea pagar?</h2>
      <h1 class="proveedores mb-4" id="cantidad-pagar"><span>${{ pagarValor }}</span> a Alpina</h1>
      <h1 class="proveedores mb-4">Ingresa el número de teléfono del transportista</h1>
      <label for="pagar" id="label-pagar" class="input-pagar">
            <input
              class="form-control text-center mb-4"
              aria-required="true"
              aria-invalid="false"
              aria-labelledby="label-pagar"
              name="numeroTransportista"
              v-model="numeroTransportista"
              type="number"
              placeholder=""
              autocomplete="off"
              id="numeroTransportista"
              required
              aria-describedby="error-pagar"
            />
          </label>
      <div class="button-banner-pedidos">
        <button type="button" id="boton-pago">
          Pagar
        </button>
        <button type="button" id="atras">
          Atrás
        </button>
      </div>
    </div>
  </section>
</template>

<style>
body {
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  background-color: white;
}

.container {
  display: flex;
  justify-content: center; /* Centra el contenedor en la página */
  align-items: center; /* Centra el contenedor verticalmente */
  height: 100vh; /* Asegura que el contenedor ocupe toda la altura de la pantalla */
}
.input-pagar input {
    background-color: transparent;
    border-width: 0 0 1px;
    border-bottom: solid 1px rgba(17, 17, 17, .2);
    color: #111;
    padding: 8px 0;
    width: auto;
    outline: none;
}
.info-banner {
  display: flex;
  flex-direction: column; /* Alinea los elementos verticalmente */
  align-items: center; /* Centra los elementos horizontalmente */
  text-align: center; /* Centra el texto */
  padding: 24px;

}

.img-fluid {
  height: 30%;
  width: 30%;
  margin: 0 auto; /* Centra la imagen horizontalmente */
  display: block; /* Asegura que la imagen se comporte como un bloque */
}

.proveedores {
  font-weight: bold;
  color: black;
  margin-top: 20px; /* Espacio entre la imagen y el texto */
  align-items: center;
}

.button-banner-pedidos {
  display: flex;
  justify-content: center; /* Centra los botones */
  gap: 20px; /* Espacio entre los botones */
  margin-top: 20px; /* Espacio entre el texto y los botones */
}

.button-banner-pedidos button {
  background-color: #dd3590;
  color: white;
  width: 100px;
}

@media (max-width: 767px) {
  .img-fluid {
    margin-top: -90px;
  }
}
</style>
