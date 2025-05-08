<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Heading from "../components/UI/Heading.vue";

// Variables reactivas
const pagar = ref('');

// Instancia de Vue Router
const router = useRouter();

let dataInfoapp = $.parseJSON(localStorage.getItem('data'))

// Función para manejar el clic en el botón "Pagar"
const handlePago1Click = () => {
  const valorPago = pagar.value; // Asegúrate de que sea un númerogit branch -a
  if (!valorPago || isNaN(valorPago) || valorPago <=0) {
    alert('Por favor, ingresar un valor válido para el pago.')
    return
  }

  localStorage.setItem('pagarValor', valorPago); // Guarda el valor en localStorage
  window.open("/Pantalla3View", "_parent");
};

// Montar el event listener para el envío del formulario y clic en el botón
onMounted(() => {
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
    <div class="row">
      <!-- Banner 1 -->
      <div class="col-md-4 mb-4 banner2">
        <div class="info-banner">
          <h2 class="proveedores">Pago a proveedor.</h2>
          <div class="d-flex align-items-center">
            <div class="text-section ml-3">
              <p class="parrafo-marcas">Alpina</p>
            </div>
            <div class="image-section">
              <picture class="logo">
                <img src="/public/Alpina.png" alt="logo" class="img-fluid" loading="lazy" title="logo" />
              </picture>
            </div>
          </div>          
        </div>
      </div>

      <!-- Línea separadora -->
      <div class="separator"></div>

      <!-- Banner 3 -->
      <div class="col-md-4 mb-4 banner2">
        <div class="info-banner">
          <h2 class="proveedores mb-5">Valor a pagar.</h2>
          <label for="pagar" id="label-pagar" class="input-pagar">
            <input
              class="form-control text-center mb-4"
              aria-required="true"
              aria-invalid="false"
              aria-labelledby="label-pagar"
              name="pagar"
              v-model.number= pagar
              type="number"
              placeholder="Ingresa el valor a pagar"
              autocomplete="off"
              id="pagar-valor"
              required
              aria-describedby="error-pagar"
            />
          </label>
          <div class="button-banner">
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
.input-pagar input {
    background-color: transparent;
    border-width: 0 0 1px;
    border-bottom: solid 1px rgba(17, 17, 17, .2);
    color: #111;
    padding: 8px 0;
    width: auto;
    outline: none;
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
}
.proveedores-pedidos{
    width: 100%;
    letter-spacing: -0.03em;
    line-height: 1.2;
    background-color: #fff;
    color: black;
    padding: 24px;
    display: flex;
    align-items: center;
    font-weight: bold;
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
.info-banner-pedidos {
    display: flex;
    align-items: center;
    justify-content: space-between; /* Distribuye el espacio entre los elementos */
    width: 100%;
    background-color: #fff;
    padding: 24px;
    letter-spacing: -0.03em;
    line-height: 1.2;
    color: black;
    gap: 20px; /* Espacio entre los elementos */
}

.codigo-pedido,
.precio-pedido,
.button-banner-pedidos {
    margin: 0; /* Remueve márgenes adicionales */
    flex-grow: 1; /* Hace que cada elemento crezca para ocupar el espacio disponible */
    text-align: center; /* Alinea el texto al centro */
}
.button-banner-pedidos button:hover {
    color: #fff;
    background-color: #251886;
    border-color: #251886;
}
.button-banner-pedidos button {
    margin-top: -20px;
    background-color: #dd3590;
    color: white;
    width: 100px; /* Ancho fijo para el botón */
    flex-grow: 0; /* Evita que el botón se estire */
}
.titulo-1 {
    font-weight: bold;
}

.titulo {
    margin: 0 0 16px;
    color: inherit;
    font-weight: bold;
    letter-spacing: -0.03em;
    font-size: 1.875rem;
    line-height: 1.2;
}

.subtitulo {
    color: black;
}

.button-banner button {
    background-color: #dd3590;
    color: white;
}

.deuda-total {
    font-weight: bold;
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
    margin-top: -20px;
    z-index: 1;
}

.parrafo-marcas{
    font-weight: bold;
    text-align: center;
}

.img-fluid{
    height: 30%;
    width: 30%;
    margin-left: 150px;
}

.text-section {
    flex-grow: 1;
    margin-left: 20px;
}

.proveedores{
    font-weight: bold;
    color: black;
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
    .info-banner-pedidos {
        align-items: flex-start;
    }

    .codigo-pedido,
    .precio-pedido,
    .button-banner-pedidos {
        margin-bottom: 10px; /* Ajusta el margen para pantallas pequeñas */
        text-align: left; /* Alinea el texto a la izquierda */
        flex-grow: unset; /* Elimina el comportamiento de crecimiento en pantallas pequeñas */
    }
}
</style>
