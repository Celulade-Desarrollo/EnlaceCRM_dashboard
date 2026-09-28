<script setup>
import { onMounted, ref, computed } from 'vue'
import { motion } from 'motion-v'
import axios from 'axios'
import { activarSesionExpirada } from "../stores/session.js"
import { useRouter, useRoute } from "vue-router"
import headerDis from "../components/UI/headerDis.vue"

const router = useRouter()
const route = useRoute()

const busquedaFiltro = ref("")
const movimientosDetalle = ref([])

const datosRecaudo = computed(() => {
  return {
    fecha: route.query.fecha || "",
    ruta: route.query.ruta || "N/A",
    telefono: route.query.telefono || "N/A",
    factura: route.query.factura || "N/A",
    placa: route.query.placa || "N/A",
    planilla: route.query.planilla || "N/A",
    total: Number(route.query.total || 0)
  }
})

const formatoMiles = (numero) => {
  return new Intl.NumberFormat('es-ES').format(
    Number(numero || 0)
  )
}

const fechaFormateada = computed(() => {
  if (!datosRecaudo.value.fecha) {
    return "N/A"
  }

  const [year, month, day] =
    datosRecaudo.value.fecha.split("-")

  const date = new Date(
    year,
    month - 1,
    day
  )

  return date.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric"
  })
})

const movimientosFiltrados = computed(() => {
  const q = busquedaFiltro.value
    .toLowerCase()
    .trim()

  if (!q) {
    return movimientosDetalle.value
  }

  return movimientosDetalle.value.filter(mov => {
    return (
      String(mov.NroFacturaAlpina || "")
        .toLowerCase()
        .includes(q) ||

      String(mov.Comercio || "")
        .toLowerCase()
        .includes(q) ||

      String(mov.Telefono || "")
        .toLowerCase()
        .includes(q)
    )
  })
})

const regresar = () => {
  router.back()
}

onMounted(async () => {
  try {
    movimientosDetalle.value = [
      {
        NroFacturaAlpina: "865966",
        Comercio: "Tienda 1",
        Monto: 12613.5
      },
      {
        NroFacturaAlpina: "865967",
        Comercio: "La esquina",
        Monto: 12613.5
      },
    ]
  } catch (error) {
    console.error("Error al cargar detalle:", error)

    if (error.response?.status === 401) {
      activarSesionExpirada()
    }
  }
})
</script>

<template>
  <div class="pantalla-full">

    <headerDis />

    <main class="main-content">

      <motion.div class="full-width-container">

        <div class="title-row">

          <button
            class="btn-regresar"
            @click="regresar"
          >
            ← Regresar
          </button>

          <h1 class="main-title">
            Detalle de Recaudo
          </h1>

        </div>

        <div class="resumen-box">

          <div class="dato-box">

            <span class="dato-label">
              Fecha Recaudo
            </span>

            <span class="dato-value">
              {{ fechaFormateada }}
            </span>

          </div>

          <div class="dato-box">

            <span class="dato-label">
              Ruta
            </span>

            <span class="dato-value">
              {{ datosRecaudo.ruta }}
            </span>

          </div>

          <div class="dato-box transportista-box">

            <span class="dato-label">
              Transportista
            </span>

            <span class="dato-value">
              N/A
            </span>

          </div>

          <div class="dato-box">

            <span class="dato-label">
              Teléfono
            </span>

            <span class="dato-value">
              {{ datosRecaudo.telefono }}
            </span>

          </div>

          <div class="dato-box recaudo-digital">

            <span class="recaudo-monto">
              ${{ formatoMiles(datosRecaudo.total) }}
            </span>

            <span class="recaudo-label">
              Recaudo Pagos Digitales
            </span>

          </div>

        </div>

        <div class="search-wrapper">

          <input
            v-model="busquedaFiltro"
            type="text"
            placeholder="Buscar número de factura, comercio o teléfono"
            class="search-input"
          />

          <span class="search-icon"></span>

        </div>

        <div class="table-wrapper">

          <table class="data-table">

            <thead>

              <tr>

                <th>
                  Factura
                </th>

                <th>
                  Comercio
                </th>

                <th>
                  Monto Recaudado
                </th>

              </tr>

            </thead>

            <tbody>

              <tr
                v-for="(mov, index) in movimientosFiltrados"
                :key="index"
              >

                <td class="factura">
                  {{ mov.NroFacturaAlpina }}
                </td>

                <td>
                  {{ mov.Comercio }}
                </td>

                <td class="col-monto">
                  $ {{ formatoMiles(mov.Monto) }}
                </td>

              </tr>

              <tr
                v-if="movimientosFiltrados.length === 0"
              >

                <td
                  colspan="3"
                  class="empty-state"
                >
                  No hay registros de recaudo para los filtros seleccionados.
                </td>

              </tr>

            </tbody>

          </table>

        </div>

      </motion.div>

    </main>

  </div>
</template>

<style scoped>
.pantalla-full {
  background-color: #ffffff;
  min-height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.main-content {
  flex: 1;
  padding: 24px 40px;
  display: flex;
  justify-content: center;
  background-color: #ffffff;
}

.full-width-container {
  width: 100%;
  max-width: 1400px;
}

.title-row {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.main-title {
  font-size: 24px;
  font-weight: 800;
  color: #000000;
  margin: 0;
}

.btn-regresar {
  background: #ffffff;
  border: 1px solid #4f46e5;
  color: #3737a8;
  border-radius: 5px;
  padding: 8px 14px;
  font-size: 13px;
  font-family: inherit;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.btn-regresar:hover {
  background-color: #f5f5ff;
}

.resumen-box {
  width: 100%;
  min-height: 76px;
  box-sizing: border-box;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 14px 16px;
  display: flex;
  align-items: center;
  margin-bottom: 18px;
}

.dato-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 6px;
  padding: 0 22px 0 0;
  margin-right: 22px;
  border-right: 1px solid #f1f5f9;
  min-width: 100px;
}

.dato-box:first-child {
  padding-left: 0;
}

.dato-label {
  font-size: 12px;
  color: #111827;
  font-weight: 700;
  white-space: nowrap;
}

.dato-value {
  font-size: 13px;
  color: #374151;
  white-space: nowrap;
}

.transportista-box {
  min-width: 170px;
}

.recaudo-digital {
  border-right: none;
  border-left: 1px solid #f1f5f9;
  padding-left: 24px;
  padding-right: 0;
  margin-left: auto;
  margin-right: 0;
  min-width: 200px;
}

.recaudo-monto {
  font-size: 24px;
  line-height: 1;
  font-weight: 800;
  color: #000000;
  white-space: nowrap;
}

.recaudo-label {
  font-size: 12px;
  color: #6b7280;
  margin-top: 4px;
  white-space: nowrap;
}

.search-wrapper {
  position: relative;
  margin-bottom: 18px;
}

.search-input {
  width: 100%;
  padding: 12px 40px 12px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 14px;
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.search-input::placeholder {
  color: #9ca3af;
}

.search-input:focus {
  border-color: #cbd5e1;
  box-shadow: 0 0 0 2px rgba(203, 213, 225, 0.25);
}

.search-icon {
  position: absolute;
  right: 16px;
  top: 50%;
  width: 14px;
  height: 14px;
  border: 1.5px solid #6b7280;
  border-radius: 50%;
  transform: translateY(-60%);
  pointer-events: none;
  box-sizing: border-box;
}

.search-icon::after {
  content: "";
  position: absolute;
  width: 6px;
  height: 1.5px;
  background-color: #6b7280;
  right: -5px;
  bottom: -2px;
  transform: rotate(45deg);
  transform-origin: left center;
}

.table-wrapper {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

.data-table th {
  background-color: #f8fafc;
  color: #374151;
  font-size: 13px;
  font-weight: 700;
  text-align: left;
  padding: 12px 16px;
  border-bottom: 2px solid #e2e8f0;
  white-space: nowrap;
}

.data-table td {
  padding: 14px 16px;
  border-bottom: 1px solid #f1f5f9;
  font-size: 13.5px;
  color: #374151;
}

.data-table th:nth-child(1),
.data-table td:nth-child(1) {
  width: 20%;
}

.data-table th:nth-child(2),
.data-table td:nth-child(2) {
  width: 45%;
}

.data-table th:nth-child(3),
.data-table td:nth-child(3) {
  width: 35%;
}

.factura {
  color: #3737a8 !important;
}

.col-monto {
  font-weight: 700;
  color: #111827;
}

.empty-state {
  text-align: center;
  color: #9ca3af;
  padding: 30px;
  font-size: 13.5px;
}

@media (max-width: 900px) {
  .main-content {
    padding: 24px 20px;
  }

  .resumen-box {
    flex-wrap: wrap;
    gap: 12px;
  }

  .dato-box {
    border-right: none;
    margin-right: 0;
  }

  .recaudo-digital {
    margin-left: 0;
    border-left: none;
    padding-left: 0;
  }
}
</style>