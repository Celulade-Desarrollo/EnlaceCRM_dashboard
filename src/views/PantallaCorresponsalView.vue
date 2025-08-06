<script setup>
//import { onMounted } from "vue";
import Heading from "../components/UI/Heading.vue";
import { motion } from "motion-v";
import { ref, onMounted } from "vue";
import axios from "axios";


const datosCuenta = JSON.parse(localStorage.getItem("datosCuenta")) || {};
console.log("Datos de la cuenta:", datosCuenta);
const deudaTotal = ref(0);

const estadoCuenta = ref({
  CupoFinal: '',
  CupoDisponible: '',
  FechaPagoProgramado: '',
  deudaTotal: ''
});
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
  } catch (error) {
    console.error("Error al obtener el estado de cuenta:", error);
  }
});
</script>

<template>
<Heading :mensaje="'Hola, ' + datosCuenta.Nombres" />
    <motion.div v-bind="fadeInUp">
    <section>
        <div class="card">
        <div class="provider-content">
        <div class="bg-white w-full rounded-xl flex flex-col items-center relative justify-start pt-3">
            <div class="flex gap-3 flex-column mb-3">
            <h2 class="text-xl flex gap-3 mt-4 " >Deuda total $<p class="font-bold">{{ formatoMiles(estadoCuenta.deudaTotal) }}</p></h2>
            <h3 class=" flex text-[13px]"> Fecha del siguiente abono:  <p class="font-bold">{{ formatFecha(estadoCuenta.FechaPagoProgramado) }}</p></h3>
          </div>
            <h2 class="w-full text-center font-bold mb-2">Corresponsales Bancarios cerca a ti </h2>
           <img src="" alt="">
        </div>
        </div>
    </div>
  </section>
</motion.div>
</template>

<style scoped>
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
}

.button:hover {
  background-color: #f15bab;
}
.button:focus {
  outline: none;
  box-shadow: none;
}
</style>