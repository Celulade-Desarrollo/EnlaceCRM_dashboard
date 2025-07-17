<script setup>
import { ref, onMounted, watch, watchEffect } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import Heading from "../components/UI/Heading.vue";
import { fadeInUp } from "../motion/pageAnimation";
import { motion } from "motion-v";

const deudaTotal = ref(50000);
const cupoTotal = ref(100000);
const mostrarMovimientos = ref(false);
const movimientos = ref([]);
const router = useRouter();

const clienteCedula = ref(null);
const clienteNombre = ref("Usuario");

const extraerDatosCliente = () => {
  try {
    const raw = localStorage.getItem("data");
    const data = raw ? JSON.parse(raw) : [];

    if (data?.[0]?.cedula !== clienteCedula.value) {
      clienteCedula.value = data?.[0]?.cedula ?? null;
      clienteNombre.value = data?.[0]?.nombre ?? "Usuario";
      console.log("📦 Cédula actualizada:", clienteCedula.value);
      cargarMovimientos();
    }
  } catch (e) {
    console.error("Error al leer data del localStorage", e);
    clienteCedula.value = null;
  }
};

const cargarMovimientos = async () => {
  const token = localStorage.getItem("token");
  console.log("🔑 Token usado:", token);
  if (!clienteCedula.value) return;

  try {
    const response = await axios.get(
      `http://localhost:3000/api/pagos/estado-cuenta`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { identificadorTendero: clienteCedula.value }
      }
    );
    console.log("🟢 Respuesta completa:", response.data);

    if (Array.isArray(response.data.movimientos)) {
      movimientos.value = response.data.movimientos;
    } else if (Array.isArray(response.data)) {
      movimientos.value = response.data;
    } else {
      movimientos.value = [];
    }

    deudaTotal.value = response.data.deudaTotal ?? 0;
    cupoTotal.value = response.data.cupoDisponible ?? 0;
    mostrarMovimientos.value = true;
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
    currency: "COP",
    maximumFractionDigits: 0
  }).format(valor);

onMounted(() => {
  extraerDatosCliente();
  updateProgressBar();

  const botonAbonar = document.getElementById("Pantalla6");
  if (botonAbonar) {
    botonAbonar.addEventListener("click", () => {
      router.push("/Pantalla6View");
    });
  }
});

watchEffect(() => {
  extraerDatosCliente();
});

watch([deudaTotal, cupoTotal], updateProgressBar);
</script>

<template>
  <motion.div v-bind="fadeInUp">
    <section class="logo-container">
      <img src="/enlaceFiado.png" alt="logo Enlace CRM" class="logo-main" />
    </section>

    <!-- ✅ Cambiado para usar clienteNombre -->
    <Heading :mensaje="'Hola, ' + clienteNombre" />

    <section class="container banners py-4">
      <div class="d-flex flex-column align-items-center">
        <!-- Banner deuda/cupo -->
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
            <div id="deuda-bar" class="progress-bar deuda-bar"></div>
            <div id="cupo-bar" class="progress-bar cupo-bar"></div>
          </div>
        </div>

        <!-- Botón redirección -->
        <div class="button-banner mb-2">
          <button type="button" class="button" id="Pantalla6">Abonar</button>
        </div>

        <!-- Lista de movimientos -->
        <div v-if="mostrarMovimientos" class="lista-movimientos mt-4">
          <h3 class="titulo-movimientos">Movimientos</h3>

          <div v-if="movimientos.length === 0">
            <p style="text-align: center; color: gray">No hay movimientos registrados.</p>
          </div>

          <div v-else>
            <div v-for="(mov, index) in movimientos" :key="index" class="movimiento">
              <div class="info-movimiento">
                <div class="detalle">
                  <p class="fecha"><strong>Fecha:</strong> {{ formatFecha(mov.FechaHoraMovimiento) }}</p>
                  <p class="descripcion"><strong>Descripción:</strong> {{ mov.Descripcion }}</p>
                  <p class="descripcion"><strong>Estado Movimiento:</strong> {{ mov.IdEstadoMovimiento }}</p>
                  <p class="descripcion"><strong>Fecha Programada:</strong>
                    {{ mov.FechaPagoProgramado ? formatFecha(mov.FechaPagoProgramado) : 'No aplica' }}
                  </p>
                  <p class="descripcion"><strong>Medio de Pago:</strong> {{ mov.IdMedioPago ?? 'N/A' }}</p>
                  <p class="descripcion"><strong>Bloqueo Mora:</strong> {{ mov.BloqueoMora === 1 ? 'Sí' : 'No' }}</p>
                  <p class="descripcion"><strong>Factura Alpina:</strong> {{ mov.NroFacturaAlpina || 'No aplica' }}</p>
                  <p class="descripcion"><strong>Tel. Transportista:</strong> {{ mov.TelefonoTransportista || 'No aplica' }}</p>
                </div>
              </div>
              <p :class="['monto', mov.IdTipoMovimiento === 2 ? 'positivo' : 'negativo']">
                {{ mov.IdTipoMovimiento === 2 ? '+' : '-' }}{{ formatPesos(mov.Monto) }}
              </p>
            </div>
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
