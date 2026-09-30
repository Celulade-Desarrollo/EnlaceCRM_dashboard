<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import headerDis from "../components/UI/headerDis.vue"
import { useRouter } from "vue-router"

const router = useRouter()

const cargando = ref(false)
const busquedaFiltro = ref('')
const fechaRecaudo = ref('')
const totalRecaudo = ref(0)
const movimientos = ref([])

const datosDetalle = ref({
  fecha: '',
  recaudo: 0,
  dispersion: ''
})

const formatoMiles = numero => {
  return new Intl.NumberFormat('es-ES').format(Number(numero || 0))
}

const fechaFormateada = computed(() => {
  if (!fechaRecaudo.value) return ''

  const [year, month, day] = fechaRecaudo.value.split('-')
  const date = new Date(year, month - 1, day)

  return date.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
})

const movimientosFiltrados = computed(() => {
  if (!busquedaFiltro.value.trim()) {
    return movimientos.value
  }

  const q = busquedaFiltro.value.toLowerCase()

  return movimientos.value.filter(mov => {
    return Object.values(mov).some(valor =>
      String(valor ?? '')
        .toLowerCase()
        .includes(q)
    )
  })
})

const cargarDetalle = async () => {
  if (!fechaRecaudo.value) return

  cargando.value = true
  movimientos.value = []

  try {
    const res = await axios.get(
      `/tesoreria/recaudo-detalle/${fechaRecaudo.value}`
    )

    const data = res.data?.data || res.data || []

    movimientos.value = Array.isArray(data)
      ? data
      : data.movimientos || data.detalle || []

  } catch (error) {
    console.error('Error al cargar detalle:', error)
    movimientos.value = []
  } finally {
    cargando.value = false
  }
}

const regresar = () => {
  router.back()
}

onMounted(() => {
  const guardado = localStorage.getItem('detalle_recaudo')

  if (!guardado) {
    router.back()
    return
  }

  try {
    datosDetalle.value = JSON.parse(guardado)

    fechaRecaudo.value = datosDetalle.value.fecha || ''

    totalRecaudo.value = Number(
      datosDetalle.value.recaudo || 0
    )

    cargarDetalle()
  } catch (error) {
    console.error('Error leyendo detalle:', error)
    router.back()
  }
})
</script>

<template>
  <div class="pantalla-full">
    <headerDis />

    <main class="main-content">
      <div class="full-width-container">

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
              Total Facturas
            </span>

            <span class="dato-value">
              {{ movimientosFiltrados.length }}
            </span>
          </div>

          <div class="recaudo-digital">
            <span class="recaudo-monto">
              ${{ formatoMiles(totalRecaudo) }}
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
            placeholder="Buscar por factura, cliente, código, tienda, ubicación o teléfono"
            class="search-input"
          />

          <span class="search-icon"></span>
        </div>

        <div class="table-wrapper">

          <table class="data-table">

            <thead>
              <tr>
                <th>Factura</th>
                <th>Cliente</th>
                <th>Código</th>
                <th>Tienda</th>
                <th>Ubicación</th>
                <th>Teléfono</th>
                <th>Monto</th>
              </tr>
            </thead>

            <tbody>

              <tr v-if="cargando">
                <td
                  colspan="7"
                  class="loader-cell"
                >
                  <div class="table-loader">
                    <div class="spinner"></div>
                    <span>Cargando datos...</span>
                  </div>
                </td>
              </tr>

              <template v-else>

                <tr
                  v-for="(mov, index) in movimientosFiltrados"
                  :key="mov.id || mov.Id || index"
                >

                  <td class="factura">
                    {{
                      mov.factura ??
                      mov.Factura ??
                      mov.NroFactura ??
                      mov.NroFacturaAlpina ??
                      'N/A'
                    }}
                  </td>

                  <td class="col-cliente">
                    {{
                      mov.cliente ??
                      mov.Cliente ??
                      mov.NombreCliente ??
                      'N/A'
                    }}
                  </td>

                  <td class="cod-cliente">
                    {{
                      mov.codigo ??
                      mov.Codigo ??
                      mov.CodigoCliente ??
                      mov.Cedula ??
                      'N/A'
                    }}
                  </td>

                  <td class="col-comercio">
                    {{
                      mov.tienda ??
                      mov.Tienda ??
                      mov.NombreTienda ??
                      mov.Comercio ??
                      'N/A'
                    }}
                  </td>

                  <td class="col-ubicacion">
                    {{
                      mov.ubicacion ??
                      mov.Ubicacion ??
                      mov.Direccion ??
                      'N/A'
                    }}
                  </td>

                  <td class="col-telefono">
                    {{
                      mov.telefono ??
                      mov.Telefono ??
                      mov.TelefonoCliente ??
                      'N/A'
                    }}
                  </td>

                 <td class="col-monto">
                  ${{ formatoMiles(
                    mov.MontoRecaudado ??
                    mov.monto ??
                    mov.Monto ??
                    mov.valor ??
                    mov.Valor ??
                    0
                  ) }}
                </td>

                </tr>

                <tr
                  v-if="movimientosFiltrados.length === 0"
                >
                  <td
                    colspan="7"
                    class="empty-state"
                  >
                    No hay registros de recaudo para esta fecha.
                  </td>
                </tr>

              </template>

            </tbody>

          </table>

        </div>

      </div>
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

.recaudo-digital {
  border-left: 1px solid #f1f5f9;
  padding-left: 24px;
  margin-left: auto;
  min-width: 200px;
  display: flex;
  flex-direction: column;
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
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  min-width: 1100px;
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
  vertical-align: middle;
}

.data-table th:nth-child(1),
.data-table td:nth-child(1) {
  width: 12%;
}

.data-table th:nth-child(2),
.data-table td:nth-child(2) {
  width: 18%;
}

.data-table th:nth-child(3),
.data-table td:nth-child(3) {
  width: 12%;
}

.data-table th:nth-child(4),
.data-table td:nth-child(4) {
  width: 18%;
}

.data-table th:nth-child(5),
.data-table td:nth-child(5) {
  width: 18%;
}

.data-table th:nth-child(6),
.data-table td:nth-child(6) {
  width: 12%;
}

.data-table th:nth-child(7),
.data-table td:nth-child(7) {
  width: 10%;
}

.factura {
  color: #3737a8 !important;
  white-space: nowrap;
}

.cod-cliente {
  font-weight: 500;
  color: #111827;
  white-space: nowrap;
}

.col-cliente,
.col-comercio,
.col-ubicacion {
  white-space: normal;
  word-break: break-word;
  line-height: 1.4;
}

.col-telefono {
  white-space: nowrap;
}

.col-monto {
  font-weight: 700;
  color: #111827;
  white-space: nowrap;
}

.empty-state {
  text-align: center;
  color: #9ca3af;
  padding: 30px;
  font-size: 13.5px;
}

.loader-cell {
  height: 220px;
  text-align: center;
  vertical-align: middle;
}

.table-loader {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: #6b7280;
  font-size: 13.5px;
}

.spinner {
  width: 28px;
  height: 28px;
  border: 3px solid #e5e7eb;
  border-top-color: #4f46e5;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
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