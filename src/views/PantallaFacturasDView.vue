<script setup>
import { ref, onMounted, watch  } from "vue";
import { useRouter } from "vue-router";
import Heading from "../components/UI/Heading.vue";
import { fadeInUp } from "../motion/pageAnimation";
import { motion } from "motion-v";
import FacturasDisponibles from '../components/UI/FacturasDisponibles.vue';
import axios from 'axios';

// Variables reactivas
const pagar = ref("");
const facturasDisponibles = ref([]);
const errorMessage = ref("");
const totalFacturasSeleccionadas = ref(0);
const facturasSeleccionadas = ref([]);
const token = localStorage.getItem("token");
const datosCuenta = JSON.parse(localStorage.getItem("datosCuenta")) || {};
const estadoCuenta = ref(null)
const bloquearBotones = ref(false);
const isLoading = ref(true);
const facturasEnMora = ref([]);

// Instancia de Vue Router
const router = useRouter();

//console.log("datosCuenta", datosCuenta);

// Función para manejar el clic en el botón "Pagar"
const handleContinuarClick = () => {

  const valorPago = pagar.value;
  const regex = /^\d{5,}$/; // Mínimo 5 dígitos, solo números

   if (!valorPago || isNaN(valorPago) || !regex.test(valorPago)) {
     errorMessage.value =
       "Ingrese un valor válido de al menos 5 dígitos sin puntos ni comas";
     return;
   }else {
     errorMessage.value = "";
   }
    if (valorPago < 20000) {
    errorMessage.value = "El valor mínimo permitido para el pago es de $20.000";
    return;
   }
     if (totalFacturasSeleccionadas.value === 0) {
    errorMessage.value = "Debe seleccionar al menos una factura antes de continuar";
    return;
  }
   if (valorPago > totalFacturasSeleccionadas.value) {
    errorMessage.value =
      "No puede ingresar un valor mayor al total de las facturas seleccionadas";
    return;
  }
   if (valorPago > datosCuenta.CupoDisponible || valorPago > datosCuenta.CupoFinal) {
    errorMessage.value =
      "No puede ingresar un valor mayor al total del cupo disponible o cupo total";
    return;
  }
  errorMessage.value = "";
  localStorage.setItem("pagarValor", valorPago);
  localStorage.setItem("datosCuenta", JSON.stringify(datosCuenta));
  localStorage.setItem("token", token);
  const numerosFacturas = facturasSeleccionadas.value.map(f => f.factura);
  localStorage.setItem("numeroFactura", JSON.stringify(numerosFacturas));

  window.open("/Pantalla3View", "_parent");
};
// Observa cambios en totalFacturasSeleccionadas y actualiza pagar automáticamente
    watch(totalFacturasSeleccionadas, (nuevoTotal) => {
      pagar.value = nuevoTotal;
    });

const actualizarTotal = (total, seleccionadas) => {
  totalFacturasSeleccionadas.value = total;
  facturasSeleccionadas.value = seleccionadas;
};
// Formatea una fecha ISO a formato legible en español "14 de julio de 2025"
  function formatFecha(fechaISO) {
    const fecha = new Date(fechaISO);
    return fecha.toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

onMounted(async () => {
  try {
    const facturasResponse = await axios.post("/api/pagos/facturas-pendientes",
      { identificadorTendero: datosCuenta.Cedula_Cliente }, 
      {
        headers: {  
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );
    facturasDisponibles.value = facturasResponse.data;
   // console.log("Facturas:", facturasResponse.data);
    
    const estadoCuentaResponse = await axios.get(
      "http://localhost:3000/api/pagos/estado-cuenta",
        {
        params: { identificadorTendero: datosCuenta.Cedula_Cliente },
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );
      estadoCuenta.value = estadoCuentaResponse.data;

    // Verifica si existe al menos un movimiento con bloqueo por mora para bloquear el boton
      const hayBloqueo = estadoCuenta.value.movimientos.some(
      (mov) => mov.BloqueoMora === true
    )
    bloquearBotones.value = hayBloqueo

    console.log("¿Bloquear botones?", hayBloqueo) 
    console.log("Estado de cuenta:", estadoCuentaResponse.data);

    // Filtra los movimientos en estadoCuenta para obtener solo los que tienen bloqueo por mora
      if (estadoCuenta.value?.movimientos) {
        facturasEnMora.value = estadoCuenta.value.movimientos.filter(
        (mov) => mov.BloqueoMora === true
        );
      } 

  } catch (error) {
    console.error("Error al cargar facturas o el estado de cuenta:", error);
  }finally {
    isLoading.value = false;
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

    <Heading :mensaje="'Hola, ' + datosCuenta.Nombres" />

    <section class="content">
      <div class="card">
        <div class="header-container">
          <h3 class="card-header-text">Facturas disponibles para pago</h3>
          <img src="/Alpina.png" alt="Alpina" class="alpina-logo-outside" />
        </div>
        <div class="header-container">
          <h3 class="card-header-text">Cupo disponible: ${{ datosCuenta.CupoDisponible }}</h3>
        </div>

        <!-- Loader mientras se cargan las facturas -->
        <div v-if="isLoading" class="loader-container">
          <div class="loader"></div>
          <p>Cargando facturas...</p>
        </div>

        <!-- Mostrar el resto del contenido solo cuando isLoading sea falso -->
        <div v-else>
          <FacturasDisponibles :facturas="facturasDisponibles" @update-total="actualizarTotal" />

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
                :max="totalFacturasSeleccionadas"
              />
              <span class="floating-label">Monto a pagar</span>
            </label>
          </div>
            <div v-if="facturasEnMora.length > 0" class="alert alert-danger mt-3">
              <p><strong>⚠ Tiene factura(s) en mora que debe pagar antes de continuar:</strong></p>
              <ul>
                <li
                  v-for="factura in facturasEnMora"
                  :key="factura.IdMovimiento"
                >
                  <p>
                    <strong>Factura N°:</strong> {{ factura.NroFacturaAlpina }}<br />
                    <strong>Monto:</strong> ${{ factura.Monto.toLocaleString() }}<br />
                    <strong>Fecha de pago programado:</strong> {{ formatFecha(factura.FechaPagoProgramado) }}
                  </p>
                </li>
              </ul>
            </div>
          <div class="button-banner">
            <button type="button" id="boton-pago" @click="handleContinuarClick" :disabled="bloquearBotones" >Continuar</button>
            <p v-if="errorMessage" id="error-email" class="text-danger mt-1">
              {{ errorMessage }}
            </p>
          </div>
        </div>
      </div>
    </section>
  </motion.div>
</template>

<style scoped>

.loader-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 2rem 0;
}

.loader {
  border: 5px solid #5708eb;
  border-top: 5px solid #ff00f2;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
.facturas label {
    display: flex;
    align-items: center;
    cursor: pointer;
    margin-bottom: 10px;
}

.facturas input[type="checkbox"] {
    display: none;
}

.checkbox-visual {
    width: 28px;
    height: 28px;
    border: 2px solid #09008be1;
    background-color: transparent;
    margin-right: 10px;
    display: inline-block;
    position: relative;
    border-radius: 4px;
}

.facturas input[type="checkbox"]:checked + .checkbox-visual {
    background-color: #ff00f2;
}


.facturas input[type="checkbox"]:checked + .checkbox-visual::after {
    content: '';
    position: absolute;
    left: 7px;
    top: 4px;
    width: 8px;
    height: 16px;
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
button:disabled {
  background-color: #ccc;
  opacity: 0.6;
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
button:disabled:hover {
  background-color: #ccc !important;
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
