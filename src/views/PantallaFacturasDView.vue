<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import Heading from "../components/UI/Heading.vue";
import { fadeInUp } from "../motion/pageAnimation";
import { motion } from "motion-v";
import FacturasDisponibles from '../components/UI/FacturasDisponibles.vue';
// Variables reactivas
const pagar = ref("");
const facturasDisponibles = ref([]);
const errorMessage = ref("");
const dataInfoapp = ref([{ nombre: "", saldorestante: "$0" }]);
// Instancia de Vue Router
const router = useRouter();

//let dataInfoapp = $.parseJSON(localStorage.getItem("data"));

// Función para manejar el clic en el botón "Pagar"
const handlePago1Click = () => {
  const valorPago = pagar.value;
  const regex = /^\d{5,}$/; // Mínimo 5 dígitos, solo números
  const saldoTotal = parseFloat(
    dataInfoapp.value[0].saldorestante.replace("$", "").replace(",", "")
  );
  if (!valorPago || isNaN(valorPago) || !regex.test(valorPago)) {
    errorMessage.value =
      "Ingrese un valor válido de al menos 5 dígitos sin puntos ni comas";
    return;
  }
  if (valorPago > saldoTotal) {
    errorMessage.value = "No puede ingresar un valor mayor a la deuda";
    return;
  }

  localStorage.setItem("pagarValor", valorPago); // Guarda el valor en localStorage
  window.open("/Pantalla3View", "_parent");
};

onMounted(async () => {
  //  try {
  //     const response = await fetch("http://localhost:3000/api/pagos/facturas-pendientes");
  //    const data = await response.json();

  //    facturasDisponibles.value = data;
  // } catch (error) {
  //    console.error("Error al cargar facturas:", error);
  // }

   facturasDisponibles.value = [
   {
    clienteId: "8100005233",
     documento: "7724996",
    factura: "3381",     valor: 10000,
   },
  {

     clienteId: "8100005233",
    documento: "7724997",
    factura: "3382",
    valor: 20000,
  },
 ];
  const dataUser = localStorage.getItem("data");
  if (dataUser) {
    try {
      dataInfoapp.value = JSON.parse(dataUser);
      const saldo = parseFloat(
        dataInfoapp.value[0].saldorestante.replace("$", "").replace(",", "")
      );
       pagar.value = saldo;
    } catch (error) {
      console.error("Error al leer data desde localStorage:", error);
    }
  }
});

</script>

<template>
  <motion.div v-bind="fadeInUp">
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
          <h3 class="card-header-text">Facturas disponibles para pago</h3>
          <img src="/Alpina.png" alt="Alpina" class="alpina-logo-outside" />
        </div>
      <FacturasDisponibles :facturas="facturasDisponibles" @update-total="pagar = $event" />

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
              :max="
                parseFloat(
                  dataInfoapp[0].saldorestante.replace('$', '').replace(',', '')
                )
              "
            />
            <span class="floating-label">Monto a pagar</span>
          </label>
        </div>
        <div class="button-banner">
          <button type="button" id="boton-pago" @click="handlePago1Click">Continuar</button>
          <p v-if="errorMessage" id="error-email" class="text-danger mt-1">
            {{ errorMessage }}
          </p>
        </div>
      </div>
    </section>
  </motion.div>
</template>

<style scoped>
.facturas label {
    display: flex; /* Para alinear el checkbox visual con el texto */
    align-items: center; /* Centrar verticalmente */
    cursor: pointer; /* Indica que es un elemento interactivo */
    margin-bottom: 10px; /* Espacio entre las facturas */
}

.facturas input[type="checkbox"] {
    /* Oculta el checkbox nativo */
    display: none;
}

.checkbox-visual {
    width: 28px;          /* Aumenta el ancho */
    height: 28px;         /* Aumenta el alto */
    border: 2px solid #09008be1;
    background-color: transparent;
    margin-right: 10px;
    display: inline-block;
    position: relative;
    border-radius: 4px;
}

/* Estilo cuando el checkbox está marcado */
.facturas input[type="checkbox"]:checked + .checkbox-visual {
    background-color: #ff00f2;
}

/* El checkmark más grande */
.facturas input[type="checkbox"]:checked + .checkbox-visual::after {
    content: '';
    position: absolute;
    left: 7px;
    top: 4px;
    width: 8px;           /* Ancho del checkmark */
    height: 16px;         /* Alto del checkmark */
    border: solid white;
    border-width: 0 3px 3px 0;
    transform: rotate(45deg);
}

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
  left: 50%;
  top: 0;
  transform: translateX(-50%);
  color: black;
  font-size: 16px;
  pointer-events: none;
  transition: 0.3s ease all;
  font-family: sans-serif;
  white-space: nowrap;
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
