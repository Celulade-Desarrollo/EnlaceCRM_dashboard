<script setup>
import { ref, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import RouterLink from "../components/UI/Routerlink.vue";
import Heading from "../components/UI/Heading.vue";
import { fadeInUp } from "../motion/pageAnimation";
import { motion } from "motion-v";

const celular = ref("");
const data = ref(null);
const error = ref("");

const deudaTotal = ref(50000);
const cupoTotal = ref(100000);
const mostrarMovimientos = ref(false);
const movimientos = ref([]);

const router = useRouter();

let dataInfoapp = [];
let clienteId = null;
try {
  const raw = localStorage.getItem("data");
  dataInfoapp = raw ? JSON.parse(raw) : [];
  clienteId = dataInfoapp?.[0]?.id;
} catch (e) {
  console.error("Error al leer data del localStorage", e);
  dataInfoapp = [];
}

const handlePantalla6Click = async () => {
  await cargarMovimientos();
  mostrarMovimientos.value = true;
};

const cargarMovimientos = async () => {
  try {
    const response = await axios.get(`http://localhost:3000/api/movimientos/${clienteId}`);
    movimientos.value = response.data;
  } catch (err) {
    console.error("❌ Error al obtener movimientos:", err);
    movimientos.value = [];
  }
};

const updateProgressBar = () => {
  const total = deudaTotal.value + cupoTotal.value;
  const deudaPercentage = (deudaTotal.value / total) * 100;
  const cupoPercentage = (cupoTotal.value / total) * 100;

  document.getElementById("deuda-bar").style.width = `${deudaPercentage}%`;
  document.getElementById("cupo-bar").style.width = `${cupoPercentage}%`;
};

const formatFecha = (fecha) => {
  const d = new Date(fecha);
  const hoy = new Date();
  if (d.toDateString() === hoy.toDateString()) return "Hoy";

  return d.toLocaleDateString("es-CO", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
};

const formatPesos = (valor) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0
  }).format(valor);

onMounted(() => {
  const Pantalla5Button = document.getElementById("Pantalla6");
  if (Pantalla5Button) {
    Pantalla5Button.addEventListener("click", handlePantalla6Click);
  }

  updateProgressBar();
});

watch([deudaTotal, cupoTotal], updateProgressBar);
</script>

<template>
  <motion.div v-bind="fadeInUp">
    <section class="logo-container">
      <img src="/public/enlaceFiado.png" alt="logo Enlace CRM" class="logo-main" />
    </section>

    <Heading :mensaje="'Hola, ' + (dataInfoapp?.[0]?.nombre || 'Usuario')" />

    <section class="container banners py-4">
      <div class="d-flex flex-column align-items-center">
        <!-- Banner 1 -->
        <div class="banner1 mb-4">
          <div class="info-banner">
            <div class="d-flex justify-content-between w-100">
              <div class="text-start">
                <h2 class="deuda-total">Deuda total</h2>
                <p class="cantidad-total mb-2" id="deuda-total">${{ deudaTotal }}</p>
              </div>
              <div class="text-end">
                <h2 class="cupo-total">Cupo disponible</h2>
                <p class="cantidad-total mb-2" id="cupo-total">${{ cupoTotal }}</p>
              </div>
            </div>
          </div>
          <div class="progress">
            <div id="deuda-bar" class="progress-bar deuda-bar" role="progressbar"></div>
            <div id="cupo-bar" class="progress-bar cupo-bar" role="progressbar"></div>
          </div>
        </div>

        <!-- Botón Abonar -->
        <div class="button-banner mb-4">
          <button type="button" class="button" id="Pantalla6">Abonar</button>
        </div>

        <!-- Movimientos últimos 3 meses -->
        <div v-if="mostrarMovimientos" class="lista-movimientos mt-4">
          <h3 class="titulo-movimientos">Movimientos</h3>

          <div v-for="(mov, index) in movimientos" :key="index" class="movimiento">
            <div class="info-movimiento">
              <div class="detalle">
                <p class="fecha">{{ formatFecha(mov.FechaMovimiento) }}</p>
                <p class="descripcion">{{ mov.Descripcion }}</p>
              </div>
            </div>
            <p :class="['monto', mov.IdTipoMovimiento === 2 ? 'positivo' : 'negativo']">
              {{ mov.IdTipoMovimiento === 2 ? '+' : '-' }}{{ formatPesos(mov.Monto) }}
            </p>
          </div>
        </div>
      </div>
    </section>
  </motion.div>
</template>


<style scoped>
.banners {
  background-color: #ffffff;
  min-height: 100vh;
  border-radius: 10px;
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
.banner1 {
  background-color: #ffffff;
  border: 2px solid #2b008b;
  border-radius: 15px;
  padding: 20px;
  width: 100%;
  max-width: 400px;
}
.progress {
  margin-top: 10px;
  height: 25px;
  background-color: #ddd;
  border-radius: 10px;
  overflow: hidden;
}
.progress-bar {
  transition: width 0.5s ease;
  height: 100%;
}
.deuda-bar {
  background-color: #007bff;
  width: 0%;
}
.cupo-bar {
  background-color: #0aba33;
  width: 0%;
}
.button-banner {
  display: flex;
  justify-content: center;
}
.button {
  background-color: #dd3590;
  color: white;
  border: none;
  padding: 14px 32px;
  border-radius: 25px;
  font-weight: bold;
  cursor: pointer;
  width: 100%;
  max-width: 500px;
  text-align: center;
  font-size: 1.1rem;
  transition: background-color 0.3s ease;
}
.button:hover {
  background-color: #f15bab;
}
button:focus {
  outline: none;
  box-shadow: none;
}

/* NUEVO: estilos movimientos */
.lista-movimientos {
  width: 100%;
  max-width: 400px;
  background-color: #fff;
  padding: 15px;
  border-radius: 12px;
  border: 2px solid #2b008b;
}
.titulo-movimientos {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 15px;
  text-align: center;
  color: #2b008b;
}
.movimiento {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ccc;
  padding: 10px 0;
}
.info-movimiento {
  display: flex;
  align-items: center;
  gap: 10px;
}
.logo-mov {
  width: 40px;
  height: 40px;
  object-fit: contain;
}
.detalle {
  display: flex;
  flex-direction: column;
}
.fecha {
  font-weight: bold;
  font-size: 0.9rem;
}
.descripcion {
  font-size: 0.85rem;
  color: #555;
}
.monto {
  font-weight: bold;
  font-size: 1rem;
}
.monto.negativo {
  color: red;
}
.monto.positivo {
  color: green;
}
</style>
