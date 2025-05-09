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
  <!-- Logo principal -->
  <section class="logo-container">
    <img src="/public/enlaceFiado.png" alt="logo Enlace CRM" class="logo-main" />
  </section>

  <!-- Encabezado -->
    <Heading :mensaje="'Hola, ' + dataInfoapp[0].nombre" />

  <section class="content">
    <!-- Tarjeta de deuda -->
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




