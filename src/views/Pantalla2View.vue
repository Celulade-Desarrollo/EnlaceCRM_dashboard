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
  const valorPago = pagar.value; // Asegúrate de que sea un número

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
  <section class="logo-container">
    <img src="/public/enlaceFiado.png" alt="logo Enlace CRM" class="logo-main" />
  </section>

  <Heading :mensaje="'Hola, ' + (dataInfoapp && dataInfoapp.length > 0 ? dataInfoapp[0].nombre : 'Usuario')" />

  <section class="content">
    <div class="card">
      <div class="header-container">
        <h3 class="card-header-text">Pago a proveedor Alpina</h3>
        <img src="/Alpina.png" alt="Alpina" class="alpina-logo-outside" />
      </div>
      <div class="form-group">
         <label for="valor" class="input-label">
          <input
            class="form-control text-center"
            aria-required="true"
            aria-invalid="false"
            aria-labelledby="label-pagar"
            name="pagar"
            v-model.number= pagar
            type="number"
            placeholder=""
            autocomplete="off"
            id="pagar-valor"
            required
            aria-describedby="error-pagar"
          />
          <span class="floating-label">Ingresa el valor a pagar</span>
        </label>
      </div>
      <div class="button-banner">
        <button type="button" id="boton-pago" class="button">
          Pagar
        </button>
      </div>
    </div>
  </section>
</template>


<style scoped>
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.input-label {
  position: relative;
  display: block;
  width: 100%;
  margin-top: 24px;
}

.form-control {
  width: 100%;
  padding: 10px 0;
  font-size: 16px;
  border: none;
  border-bottom: 2px solid #09008be1;
  background: transparent;
  font-family: sans-serif;
  outline: none;
  transition: border-color 0.3s ease;
}

.floating-label {
  position: absolute;
  left: 0;
  top: 0px;
  color: black;
  font-size: 16px;
  pointer-events: none;
  transition: 0.3s ease all;
  font-family: sans-serif;
}

/* Animación al enfocar o escribir */
.form-control:focus + .floating-label,
.form-control:not(:placeholder-shown) + .floating-label {
  top: -15px;
  font-size: 12px;
  color: black;
}

.input-label:hover .form-control {
  border-bottom-color: #ff00f2;
}

.form-control:focus {
  border-bottom-color: #0064e6cc;
  outline: none;
  box-shadow: none;
}
button {
  padding-left: 1.25rem;
  padding-right: 1.25rem;
  border-radius: 6.25rem;
  background: #dd3590;
  color: white;
  height: 3rem;
  width: 100%;
  margin-top: 20px;
  cursor: pointer;
  border: none;
  outline: none;
  align-items: center;
}
.button:hover {
  background-color: #f15bab;
}

button:focus {
  outline: none;
  box-shadow: none;
}
.logo-container {
  text-align: center;
  margin-top: 1rem;
}

.logo-main {
  width: 200px;
  height: auto;
  display: inline-block;
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
  border-radius: 15px;
  padding: 1.5rem;
  max-width: 500px;
  width: 100%;
  text-align: left;
}

.header-container {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.card-header-text {
  background-color: #251886;
  color: white;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  margin: 0; 
}

.alpina-logo-outside {
  width: 80px;
  height: auto;
  margin-left: 1rem;
}

.bold {
  font-weight: bold;
}
#boton-pago:hover {
  background-color: #f15bab;

}
/* Proveedor */
.provider-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}

.alpina-img {
  width: 140px;
  height: auto;
}

.text-center {
  text-align: center;
}

/* Formulario de pago */
.form-group {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.form-group h2.proveedores {
  margin: 0;
  white-space: nowrap;
  width: auto;
}

.form-group label.input-pagar {
  flex-grow: 1;
  display: block;
}

.form-group label.input-pagar input {
  width: 100%;
  text-align: right;
}

/* Responsive */
@media (max-width: 600px) {
  .header-container {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .alpina-logo-outside {
    margin-left: 0;
    margin-top: 0.5rem;
  }

  .provider-content {
    flex-direction: column;
  }

  .form-group {
    flex-direction: column;
    align-items: stretch;
  }

  .form-group h2.proveedores {
    margin-bottom: 0.5rem;
    text-align: center;
  }

  .form-group label.input-pagar input {
    text-align: center;
  }
}
</style>
