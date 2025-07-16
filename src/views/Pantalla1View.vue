<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import Heading from "../components/UI/Heading.vue";
import axios from "axios";
const router = useRouter();
const datosCuenta = ref([
  { nombre: "Juan", saldorestante: "$0", saldoabonado: "$0" }]);
import { fadeInUp } from "../motion/pageAnimation";
import { motion } from "motion-v";
import CardAbonoCupos from "../components/UI/CardAbonoCupos.vue";

const estadoCuenta = ref({
  CupoFinal: '',
  CupoDisponible: '',
  FechaPagoProgramado: '',
  deudaTotal: ''
});

onMounted(async () => {
  const IdUsuario = localStorage.getItem("idUsuario");
  // Obtener el token del localStorage
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(
      `/api/user/estado-cuenta/${IdUsuario}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    estadoCuenta.value = response.data;
    console.log(estadoCuenta.value);
  } catch (error) {
    console.error("Error al obtener el estado de cuenta:", error);
  }

const tipo = localStorage.getItem("tipo");
const idUsuario = localStorage.getItem("idUsuario");
const datosCuenta = JSON.parse(localStorage.getItem("datosCuenta")) || {};

console.log("localStorage token:", token);
console.log("localStorage tipo:", tipo);
console.log("idUsuario",idUsuario);
console.log("datosCuenta", datosCuenta);
  // Establece fondo morado al cargar esta pantalla
  document.body.style.backgroundColor = "#2e008b";

  const data = localStorage.getItem("data");
  if (data) {
    try {
      dataInfoapp.value = JSON.parse(data);
    } catch (e) {
      console.error("Error al parsear data desde localStorage:", e);
    }
  }
});

const goToPantalla2 = () => {
  router.push("/Pantalla2View");
};

const goToPantallaFacturasDisponibles = () => {
   router.push("/PantallaFacturasView");
};

const goToPantalla5 = () => {
  router.push("/Pantalla5View");
};
</script>

<template>
  <section class="logo-container">
    <img
      src="/public/enlaceFiado.png"
      alt="logo Enlace CRM"
      class="logo-main"
    />
  </section>
  <!-- Encabezado -->
  <Heading :mensaje="'Hola, ' + datosCuenta.nombre" />

  <motion.div v-bind="fadeInUp">
    <section class="content">
      <CardAbonoCupos
        :cupoTotal="estadoCuenta.CupoFinal"
        :cupoDisp="estadoCuenta.CupoDisponible"
        :fechaAbono="estadoCuenta.FechaPagoProgramado"
        :deudaTotal="estadoCuenta.deudaTotal"
        @abonar="goToPantalla5"
      />
      <div class="bg-white w-full h-40 rounded-xl flex flex-col items-center relative justify-start pt-3">
        <h2 class="w-full text-center font-bold mb-2">¿Cómo quieres pagar?</h2>
        <a href="https://portalpagos.payty.com/PortalPagosPayty/WEB/?codigoConvenio=112878"
          class=" no-underline flex items-center justify-between bg-gray-100 rounded-lg shadow w-72 h-20 px-4 mt-4"
        >
          <span class=" no-underline flex flex-col text-left font-bold text-gray-700 text-lg leading-tight">
            Pago<br />Digital via PSE
          </span>
          <img src="../../public/PSELOGO.png" class="w-16 h-16" />
        </a>
      </div>
      <!-- Tarjeta de proveedor -->
      <div class="card">
        <div class="provider-content">
          <img src="/Alpina.png" alt="Alpina" class="alpina-img" />
          <div class="text-center">
            <button class="button" @click="goToPantallaFacturasDisponibles" id="Pantalla2">
              Pagar
            </button>
          </div>
        </div>
        </div>
    </section>
  </motion.div>
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
