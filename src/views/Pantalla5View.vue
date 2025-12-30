<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import Heading from "../components/UI/Heading.vue";
import { motion } from "motion-v";
import { fadeInUp } from "../motion/pageAnimation";
import { useRouter } from "vue-router";
import SesionExpirada from "../components/UI/SesionExpirada.vue";
import { activarSesionExpirada } from "../stores/session.js";

const router = useRouter();

// Datos iniciales
const datosCuentaUser = JSON.parse(localStorage.getItem("datosCuenta")) || {};
console.log("datosCuentaUser", datosCuentaUser);

const deudaTotal = ref(0);
const cupoTotal = ref(0);
const mostrarMovimientos = ref(true);
const datosCuenta = ref(null);
const movimientos = ref([]);

// Nuevas variables del merge
const interesesPagados = ref(0);
const feesPagados = ref(500);

function formatPesos(valor) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0
  }).format(valor || 0);
}

function formatFecha(fechaISO) {
  const fecha = new Date(fechaISO);
  return fecha.toLocaleDateString("es-CO", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}

const goToPantallaAbonar = () => {
  router.push("/PantallaAbonoView");
};

onMounted(async () => {
  const cedula = datosCuentaUser.Cedula_Cliente;

  const token = localStorage.getItem("token");
  if (!token) {
    console.error("No hay token en localStorage");
    return;
  }

  try {
    const idUsuario = datosCuentaUser.IdUsuarioFinal;

    const resCuenta = await axios.get(`/api/user/estado-cuenta/${idUsuario}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    datosCuenta.value = resCuenta.data;
    cupoTotal.value = resCuenta.data.CupoDisponible || 0;

    const cupoFinal = parseInt(resCuenta.data.CupoFinal.replace(/\./g, ""));
    const cupoDisponible = parseInt(resCuenta.data.CupoDisponible);
    deudaTotal.value = cupoFinal - cupoDisponible;

    // Nuevo endpoint de estado de cuenta con movimientos
    const responseEstadoCuenta = await axios.get(
      `/api/pagos/estado-cuenta?identificadorTendero=${cedula}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    movimientos.value = responseEstadoCuenta.data.movimientos;

    // Calcular intereses pagados
    movimientos.value.forEach((mov) => {
      if (mov.IdTipoMovimiento === 1) {
        interesesPagados.value += parseFloat(
          mov.MontoMasIntereses - mov.Monto - 500
        );
      }
    });

    console.log("movimientos", movimientos.value);
    console.log("responseEstadoCuenta", responseEstadoCuenta);
  } catch (error) {
    console.error("Error al obtener datos:", error);
    if (error.response?.status === 401) {
      activarSesionExpirada();
    }
  }

  document.body.style.backgroundColor = "#2e008b";
});
</script>

<template>

  <Heading :mensaje="'Hola, ' + datosCuentaUser.Nombres" :showBackButton="true" />
  <motion.div v-bind="fadeInUp">
    <section class="container banners py-4">
      <div class="d-flex flex-column align-items-center">
        <!-- Tarjeta de deuda y cupo -->
        <div class="banner1 mb-4">
          <div class="info-banner">
            <div class="d-flex justify-content-between w-100">
              <div class="text-start">
                <h2 class="deuda-total">Deuda total</h2>
                <p class="cantidad-total mb-2" id="deuda-total">{{ formatPesos(deudaTotal) }}</p>
              </div>
              <div class="text-end">
                <h2 class="cupo-total">Cupo disponible</h2>
                <p class="cantidad-total mb-2" id="cupo-total">{{ formatPesos(cupoTotal) }}</p>
              </div>
            </div>
          </div>
          <div class="progress">
            <div id="deuda-bar" class="progress-bar deuda-bar" :style="{ width: deudaTotal + cupoTotal ? ((deudaTotal / (deudaTotal + cupoTotal)) * 100) + '%' : '0%' }"></div>
            <div id="cupo-bar" class="progress-bar cupo-bar" :style="{ width: deudaTotal + cupoTotal ? ((cupoTotal / (deudaTotal + cupoTotal)) * 100) + '%' : '0%' }"></div>
          </div>
        </div>

        <!-- Botón abonar -->
        <div class="button-banner mb-1">
          <button type="button" class="button" @click="goToPantallaAbonar()">Pagar mi cuota</button>
        </div>

        <!-- Lista de movimientos -->
        <div v-if="mostrarMovimientos" class="lista-movimientos mt-4">
          <h3 class="titulo-movimientos">Movimientos</h3>

          <div v-if="movimientos.length === 0">
            <p style="text-align: center; color: gray">No hay movimientos registrados.</p>
          </div>

          <div v-else>
            <div v-for="(mov, index) in movimientos" :key="index" class="movimiento">

              <div class="info-movimiento" v-if="mov.IdTipoMovimiento === 1">
                <div class="detalle">
                  <p class="fecha"><strong>Fecha:</strong> {{ formatFecha(mov.FechaHoraMovimiento) }}</p>
                  <p class="descripcion"><strong>Descripción:</strong> {{ mov.Descripcion }}</p>
                  <p class="descripcion"><strong>Fecha Programada del pago del crédito:</strong>
                    {{ mov.FechaPagoProgramado ? formatFecha(mov.FechaPagoProgramado) : 'No aplica' }}
                  </p>
                  <p class="descripcion"><strong>Factura Alpina:</strong> {{ mov.NroFacturaAlpina || 'No aplica' }}</p>
                  <p class="descripcion"><strong>Tel. Transportista:</strong> {{ mov.TelefonoTransportista || 'No aplica' }}</p>
                </div>
              </div>
               <div class="info-movimiento" v-if="mov.IdTipoMovimiento === 2">
                <div class="detalle">
                  <p class="fecha"><strong>Fecha:</strong> {{ formatFecha(mov.FechaHoraMovimiento) }}</p>
                  <p class="descripcion"><strong>Descripción:</strong> {{ mov.Descripcion }}</p>
                  <p class="descripcion"><strong>Factura Alpina:</strong> {{ mov.NroFacturaAlpina || 'No aplica' }}</p>
                  <p class="descripcion"><strong>Abono capital:</strong> ${{ mov.Monto}}</p>
                  <p class="descripcion"><strong>Intereses:</strong> ${{ mov.Intereses}}</p>
                  <p class="descripcion"><strong>Fees:</strong> ${{ mov.Fees }}</p>

                </div>
              </div>
              <p :class="['monto', mov.IdTipoMovimiento === 2 ? 'positivo' : 'negativo']">
  {{ mov.IdTipoMovimiento === 2
    ? '+' + formatPesos((mov.Monto || 0) + (mov.Intereses || 0) + (mov.Fees || 0))
    : '-' + formatPesos(mov.Monto || 0) 
  }}
</p>
            </div>
          </div>
        </div>
      </div>
      <SesionExpirada /> 
    </section>
    </motion.div>
</template>

<style scoped>
.banners {
  background-color: #ffffff;
  min-height: 100vh;
  

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
  width: 100%;
}
.button {
  background-color: #dd3590;
  color: white;
  border: none;
  padding: 14px 32px;
  border-radius: 25px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  width: auto;
  margin-left: 20px;
  justify-content: flex-start;
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

}
.titulo-movimientos {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 15px;
  text-align: center;
  color: #000000;
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