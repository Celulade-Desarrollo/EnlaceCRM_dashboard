<script setup>
//import { onMounted } from "vue";
import Heading from "../components/UI/Heading.vue";
import { motion } from "motion-v";
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import SesionExpirada from "../components/UI/SesionExpirada.vue";
import { activarSesionExpirada } from "../stores/session.js";

const router = useRouter();
const datosCuenta = JSON.parse(localStorage.getItem("datosCuenta")) || {};
console.log("Datos de la cuenta:", datosCuenta);

const estadoMovimientoPago = ref({});

const estadoCuenta = ref({
  CupoFinal: '',
  CupoDisponible: '',
  FechaPagoProgramado: '',
  deudaTotal: ''
});

onMounted(async () => {
  const IdUsuario = localStorage.getItem("idUsuario");
  const cedula = datosCuenta.Cedula_Cliente
  console.log("IdUsuario:", IdUsuario);
  console.log("cedula:", cedula);
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
    if (error.response?.status === 401) {
      activarSesionExpirada();
    }
  }
   document.body.style.backgroundColor = "#2e008b";
  try{
    const response = await axios.get(
      `/api/pagos/estado-cuenta?identificadorTendero=${cedula}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    estadoMovimientoPago.value = response.data;
    console.log("estadoMovimientoPago", estadoMovimientoPago.value);

  }catch (error) {
    console.error("Error al obtener el estado de cuenta-pago:", error);
     if (error.response?.status === 401) {
      activarSesionExpirada();
    }
  }
   document.body.style.backgroundColor = "#2e008b";
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
    timeZone: 'UTC', // ⚠️ clave
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
const proximoPagoMonto = computed(() => {
  const movimientos = estadoMovimientoPago.value.movimientos || [];
  const hoy = new Date();

  // Paso 1: Obtener facturas pendientes (IdTipoMovimiento === 1)
  const facturasPendientes = movimientos.filter(mov => mov.IdTipoMovimiento === 1);

  // Paso 2: Filtrar facturas que no tengan un pago registrado
  const facturasNoPagadas = facturasPendientes.filter(factura => {
    const yaPagada = movimientos.some(
      m =>
        m.NroFacturaAlpina === factura.NroFacturaAlpina &&
        m.IdTipoMovimiento === 2 // ya pagada
    );
    return !yaPagada;
  });

  // Paso 3: Agrupar por FechaPagoProgramado
  const agrupadasPorFecha = {};
  facturasNoPagadas.forEach(factura => {
    const fecha = factura.FechaPagoProgramado;
    if (!agrupadasPorFecha[fecha]) agrupadasPorFecha[fecha] = [];
    agrupadasPorFecha[fecha].push(factura);
  });

  // Paso 4: Encontrar la fecha más cercana al día actual
  const fechas = Object.keys(agrupadasPorFecha);
  if (fechas.length === 0) return 0;

  const fechaMasCercana = fechas.reduce((prev, curr) => {
    const prevDiff = Math.abs(new Date(prev) - hoy);
    const currDiff = Math.abs(new Date(curr) - hoy);
    return currDiff < prevDiff ? curr : prev;
  });

  // Paso 5: Sumar los montos de esa fecha
  const montoTotal = agrupadasPorFecha[fechaMasCercana].reduce((sum, factura) => {
    return sum + factura.Monto;
  }, 0);

  return montoTotal;
});

</script>

<template>
  <Heading :mensaje="'Hola, ' + datosCuenta.Nombres" :showBackButton="true" />
  <motion.div v-bind="fadeInUp">
    <section class="content">
      <div class="card">
        <div class="provider-content">
          <div class="bg-white w-full rounded-xl flex flex-col items-center relative justify-start pt-3">
            <div class="flex gap-3 flex-column mb-3">
              <h2 class="text-xl flex gap-3 mt-4">Deuda total $<p class="font-bold">{{ formatoMiles(estadoCuenta.deudaTotal) }}</p></h2>
              <h3 class="flex text-[13px]">Proximo pago$: <p  class="font-bold">{{ formatoMiles(proximoPagoMonto) }}</p></h3>
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
    <SesionExpirada />
  </motion.div>
</template>

<style scoped>
.content {
  border: none;
  outline: none;
  box-shadow: none;
}

.card {
  border: none;
  outline: none;
  box-shadow: none;
    width: 100%;
  min-height: calc(100vh - 80px);
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

@media (max-width: 480px) {
  .provider-content {
    flex-direction: column;
  }
}
</style>