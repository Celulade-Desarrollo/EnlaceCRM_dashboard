<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import Heading from "../components/UI/Heading.vue";

// Variables reactivas
const pagar = ref("");
const errorMessage = ref("");

// Instancia de Vue Router
const router = useRouter();

let dataInfoapp = $.parseJSON(localStorage.getItem("data"));

// Función para manejar el clic en el botón "Pagar"
const handlePago1Click = () => {
  const valorPago = pagar.value;
  const regex = /^\d{5,}$/; // Mínimo 6 dígitos, solo números

  if (!valorPago || isNaN(valorPago) || !regex.test(valorPago)) {
    errorMessage.value =
      "Ingrese un valor válido de al menos 6 dígitos sin puntos ni comas";
    return;
  }

  localStorage.setItem("pagarValor", valorPago); // Guarda el valor en localStorage
  window.open("/Pantalla3View", "_parent");
};

// Montar el event listener para el envío del formulario y clic en el botón
onMounted(() => {
  const pago1Button = document.getElementById("boton-pago");
  if (pago1Button) {
    pago1Button.addEventListener("click", handlePago1Click);
  }
});
</script>

<template>
  <section class="logo-container">
    <img
      src="/public/enlaceFiado.png"
      alt="logo Enlace CRM"
      class="logo-main"
    />
  </section>

  <Heading
    :mensaje="
      'Hola, ' +
      (dataInfoapp && dataInfoapp.length > 0
        ? dataInfoapp[0].nombre
        : 'Usuario')
    "
  />

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
            v-model.number="pagar"
            type="number"
            placeholder=""
            autocomplete="off"
            id="pagar-valor"
            aria-describedby="error-pagar"
          />
          <span class="floating-label">Ingresa el valor a pagar</span>
        </label>
      </div>
      <div class="button-banner">
        <button type="button" id="boton-pago">Pagar</button>
        <p v-if="errorMessage" id="error-email" class="text-danger mt-1">
          {{ errorMessage }}
        </p>
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
body {
  font-family: "Verdana", sans-serif;
  background-color: #251886;
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
