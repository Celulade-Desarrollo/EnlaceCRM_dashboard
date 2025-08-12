<script setup>
//import { onMounted } from "vue";
import Heading from "../components/UI/Heading.vue";
import { motion } from "motion-v";
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

const router = useRouter();
const datosCuenta = JSON.parse(localStorage.getItem("datosCuenta")) || {};
console.log("Datos de la cuenta:", datosCuenta);

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

    const cupoFinal = parseInt(estadoCuenta.value.CupoFinal.replace(/\./g, ''));
    const cupoDisponible = parseInt(estadoCuenta.value.CupoDisponible);
    const deuda = cupoFinal - cupoDisponible;
    estadoCuenta.value.deudaTotal = deuda;
    console.log("estadoCuenta", estadoCuenta.value);
  } catch (error) {
    console.error("Error al obtener el estado de cuenta:", error);
  }

});
const goToPantallaCorresponsal = () => {
  router.push("/PantallaCorresponsalView");
};
const formatoMiles = (numero) => {
  return new Intl.NumberFormat('es-ES').format(Number(numero));
};

function formatFecha(fechaISO) {
  if (!fechaISO) return '';
  const fecha = new Date(fechaISO);
  return fecha.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
</script>

<template>
  <Heading :mensaje="'Hola, ' + datosCuenta.Nombres" />
  <motion.div v-bind="fadeInUp">
    <section class="content">
      <div class="card">
        <div class="provider-content">
          <div class="bg-white w-full rounded-xl flex flex-col items-center relative justify-start pt-3">
            <div class="flex gap-3 flex-column mb-3">
              <h2 class="text-xl flex gap-3 mt-4">Deuda total $<p class="font-bold">{{ formatoMiles(estadoCuenta.deudaTotal) }}</p></h2>
              <h3 class="flex text-[13px]">Proximo pago $: <p class="font-bold">{{ formatFecha(estadoCuenta.FechaPagoProgramado) }}</p></h3>
              <h3 class="flex text-[13px]">Fecha del siguiente abono: <p class="font-bold">{{ formatFecha(estadoCuenta.FechaPagoProgramado) }}</p></h3>

            </div>
            <h2 class="w-full text-center font-bold mb-2">¿Cómo quieres pagar?</h2>

            <a
              href="https://portalpagos.payty.com/PortalPagosPayty/WEB/?codigoConvenio=112878"
              class="no-underline flex items-center justify-between bg-gray-100 rounded-lg shadow w-72 h-20 px-4 mt-4"
            >
              <span class="no-underline flex flex-col text-left font-bold text-gray-700 text-lg leading-tight">
                Pago<br />Digital via PSE
              </span>
              <img src="../../public/PSELOGO.png" class="w-16 h-16" />
            </a>

            <div
              class="no-underline flex items-center justify-between bg-gray-100 rounded-lg shadow w-72 h-20 px-4 mt-4"
            >
              <span class="no-underline flex flex-col text-left font-bold text-gray-700 text-lg leading-tight">
                Pago en corresponsal
              </span>
              <button class="button" @click="goToPantallaCorresponsal">
                Info
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </motion.div>
</template>

<style scoped>
.content {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  align-items: center;
  background-color: rgb(255, 255, 255);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 800px;
  min-height: 450px;
  margin: 2rem auto;
  top: -30px;
  border-radius: 0;
  position: relative;
  transition: top 0.3s ease;
}

.card {
  background: #fff;
  padding: 1.5rem;
  max-width: 700px;
  min-height: 100px;
  width: 100%;
  text-align: left;
  border-radius: 0;
}

.provider-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.button {
  background-color: #dd3590;
  color: white;
  border: none;
  padding: 10px 24px;
  border-radius: 25px;
  font-weight: bold;
  cursor: pointer;
  width: 200px;
  margin-left: auto;
  display: block;
  text-align: center;
  margin-top: 1rem;
}

.button:hover {
  background-color: #f15bab;
}

.button:focus {
  outline: none;
  box-shadow: none;
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