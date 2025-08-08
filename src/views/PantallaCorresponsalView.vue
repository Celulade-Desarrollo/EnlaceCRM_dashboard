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
    <section class="content">
      <div class="card">
        <div class="provider-content">
          <div class="info-container">
            <div class="info-texts">
              <h2 class="title">
                Deuda total $<span class="bold-text">{{ formatoMiles(estadoCuenta.deudaTotal) }}</span>
              </h2>
              <h3 class="subtitle">
                Fecha del siguiente abono: <span class="bold-text">{{ formatFecha(estadoCuenta.FechaPagoProgramado) }}</span>
              </h3>
            </div>
            <h2 class="centered-title">Corresponsales Bancarios cerca a ti</h2>
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
  border-radius: 0;
  position: relative;
  transition: top 0.3s ease;
}

.card {
  background: #fff;
  padding: 1.5rem;
  max-width: 700px;
  width: 100%;
  text-align: left;
  border-radius: 0;
}

.provider-content {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.info-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 500px;
}

.info-texts {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.title {
  font-size: 1.25rem; /* similar a text-xl */
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

.subtitle {
  font-size: 13px;
  display: flex;
  gap: 0.5rem;
}

.bold-text {
  font-weight: bold;
}

.centered-title {
  font-weight: bold;
  text-align: center;
  margin-bottom: 1rem;
}

/* Opcional: responsive como la otra pantalla */
@media (max-width: 600px) {
  .provider-content {
    flex-direction: column;
  }
}
</style>
