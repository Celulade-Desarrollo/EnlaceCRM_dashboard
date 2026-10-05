<script setup>
import { onMounted, ref, computed } from 'vue'
import { motion } from 'motion-v'
import axios from 'axios'
import { activarSesionExpirada } from "../stores/session.js"
import { useRouter } from "vue-router"
import headerDis from "../components/UI/headerDis.vue"

const movimientosEnlace = ref([])
const fechaSeleccionada = ref(new Date().toISOString().substr(0, 10))
const busquedaFiltro = ref("")
const rutaSeleccionada = ref("")
const dateInputRef = ref(null)

const router = useRouter()

const formatoMiles = (numero) => {
  return new Intl.NumberFormat('es-ES').format(Number(numero || 0))
}

const fechaFormateada = computed(() => {
  if (!fechaSeleccionada.value) return ''

  const [year, month, day] = fechaSeleccionada.value.split('-')
  const date = new Date(year, month - 1, day)

  return date.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
})

const abrirCalendario = () => {
  if (!dateInputRef.value) return

  if ('showPicker' in HTMLInputElement.prototype) {
    dateInputRef.value.showPicker()
  } else {
    dateInputRef.value.focus()
  }
}

const movimientosDelDia = computed(() => {
  return movimientosEnlace.value.filter(mov => {
    const fechaMov = mov.FechaHoraMovimiento?.substring(0, 10)
    return fechaMov === fechaSeleccionada.value
  })
})

const rutasDisponibles = computed(() => {
  const rutas = movimientosDelDia.value
    .map(mov => mov.NombreRuta)
    .filter(Boolean)

  return [...new Set(rutas)].sort()
})

const listaAgrupada = computed(() => {
  const mapa = new Map()

  movimientosDelDia.value.forEach(mov => {
    const key = `${mov.NombreRuta}_${mov.TelefonoTransportista}`

    if (!mapa.has(key)) {
      mapa.set(key, {
        ruta: mov.NombreRuta || 'N/A',
        telefono: mov.TelefonoTransportista || 'N/A',
        facturas: new Set(),
        placas: new Set(),
        planillas: new Set(),
        movimientos: [],
        totalRecaudado: 0
      })
    }

    const item = mapa.get(key)

    item.movimientos.push(mov)

    if (mov.NroFacturaAlpina) {
      item.facturas.add(mov.NroFacturaAlpina)
    }

    if (mov.Placa) {
      item.placas.add(mov.Placa)
    }

    if (mov.Planilla) {
      item.planillas.add(mov.Planilla)
    }

    item.totalRecaudado += Number(mov.Monto || 0)
  })

  const arrayAgrupado = Array.from(mapa.values()).map(item => ({
    ...item,
    facturaTexto: Array.from(item.facturas).join(', ') || 'N/A',
    placaTexto: Array.from(item.placas).join(', ') || 'N/A',
    planillaTexto: Array.from(item.planillas).join(', ') || 'N/A'
  }))

  let resultado = arrayAgrupado

  if (rutaSeleccionada.value) {
    resultado = resultado.filter(
      item => item.ruta === rutaSeleccionada.value
    )
  }

  if (busquedaFiltro.value.trim()) {
    const q = busquedaFiltro.value.toLowerCase()

    resultado = resultado.filter(item =>
      item.ruta.toLowerCase().includes(q) ||
      item.telefono.toString().includes(q) ||
      item.placaTexto.toLowerCase().includes(q) ||
      item.planillaTexto.toLowerCase().includes(q)
    )
  }

  return resultado
})

const totalRecaudo = computed(() => {
  const movimientos = rutaSeleccionada.value
    ? movimientosDelDia.value.filter(
        mov => mov.NombreRuta === rutaSeleccionada.value
      )
    : movimientosDelDia.value

  return movimientos.reduce(
    (acc, mov) => acc + Number(mov.Monto || 0),
    0
  )
})

onMounted(() => {
  movimientosEnlace.value = [
    {
      FechaHoraMovimiento: '2026-09-30T08:15:00',
      NombreRuta: 'Ruta Norte',
      TelefonoTransportista: '3001234567',
      NroFacturaAlpina: 'FAC-1001',
      Placa: 'ABC123',
      Planilla: 'PL-001',
      Monto: 150000,
      Cedula_Usuario: '1001001001'
    },
    {
      FechaHoraMovimiento: '2026-09-30T09:20:00',
      NombreRuta: 'Ruta Norte',
      TelefonoTransportista: '3001234567',
      NroFacturaAlpina: 'FAC-1002',
      Placa: 'ABC123',
      Planilla: 'PL-001',
      Monto: 85000,
      Cedula_Usuario: '1001001002'
    },
    {
      FechaHoraMovimiento: '2026-09-30T10:30:00',
      NombreRuta: 'Ruta Sur',
      TelefonoTransportista: '3109876543',
      NroFacturaAlpina: 'FAC-1003',
      Placa: 'XYZ789',
      Planilla: 'PL-002',
      Monto: 220000,
      Cedula_Usuario: '1001001003'
    },
    {
      FechaHoraMovimiento: '2026-09-29T11:00:00',
      NombreRuta: 'Ruta Centro',
      TelefonoTransportista: '3155555555',
      NroFacturaAlpina: 'FAC-1004',
      Placa: 'DEF456',
      Planilla: 'PL-003',
      Monto: 120000,
      Cedula_Usuario: '1001001004'
    }
  ]
})

const verDetalle = (item) => {
  localStorage.setItem(
    "detalle_recaudo",
    JSON.stringify({
      fecha: fechaSeleccionada.value,
      ruta: item.ruta,
      telefono: item.telefono,
      factura: item.facturaTexto,
      placa: item.placaTexto,
      planilla: item.planillaTexto,
      total: item.totalRecaudado,
      movimientos: item.movimientos
    })
  )

  router.push({
    name: "DetalleRecaudo"
  })
}
</script>

<template>
  <div class="pantalla-full">

    <headerDis />

    <main class="main-content">

      <motion.div class="full-width-container">

        <h1 class="main-title">
          Recaudo Diario
        </h1>

        <div class="top-row">
          <div class="filters-column">

            <div class="date-picker-box">
              <span class="label-date">Fecha</span>
              <div class="input-date-wrapper" @click="abrirCalendario">
                <input
                  ref="dateInputRef"
                  type="date"
                  v-model="fechaSeleccionada"
                  class="hidden-date-input"
                />
                <div class="custom-date-display">
                  <span class="fecha-texto">{{ fechaFormateada }}</span>
                  <span class="calendar-icon"></span>
                </div>
              </div>
            </div>

            <div class="route-picker-box">
              <span class="label-route">Ruta</span>
              <select v-model="rutaSeleccionada" class="select-ruta">
                <option value="">Todas las rutas</option>
                <option v-for="ruta in rutasDisponibles" :key="ruta" :value="ruta">
                  {{ ruta }}
                </option>
              </select>
            </div>

        </div>
        <div class="kpi-box">
          <div class="kpi-amount">$ {{ formatoMiles(totalRecaudo) }}</div>
          <div class="kpi-label">Total Recaudado Día</div>
        </div>
      </div>

      <div class="search-wrapper">

        <input
          type="text"
            v-model="busquedaFiltro"
            placeholder="Buscar por ruta, transportista, teléfono, placa o planilla"
            class="search-input"
          />

          <span class="search-icon"></span>

        </div>

        <div class="table-wrapper">

          <table class="data-table">

            <thead>
              <tr>
                <th>Ruta</th>
                <th>Teléfono</th>
                <th>Placa</th>
                <th>Planilla</th>
                <th>Total Recaudado</th>
                <th class="th-acciones">Acciones</th>
              </tr>
            </thead>

            <tbody>

              <tr
                v-for="(item, index) in listaAgrupada"
                :key="index"
              >

                <td class="col-ruta">
                  {{ item.ruta }}
                </td>

                <td class="col-telefono">
                  {{ item.telefono }}
                </td>

                <td class="col-secundaria">
                  {{ item.placaTexto }}
                </td>

                <td class="col-secundaria">
                  {{ item.planillaTexto }}
                </td>

                <td class="col-monto">
                  $ {{ formatoMiles(item.totalRecaudado) }}
                </td>

                <td class="col-acciones">
                  <button
                    class="btn-detalle"
                    @click="verDetalle(item)"
                  >
                    Ver Detalle
                  </button>
                </td>

              </tr>

              <tr v-if="listaAgrupada.length === 0">

                <td
                  colspan="6"
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
  padding: 32px 40px;
  display: flex;
  justify-content: center;
  background-color: #ffffff;
}

.full-width-container {
  width: 100%;
  max-width: 1400px;
}

.main-title {
  font-size: 24px;
  font-weight: 800;
  color: #000000;
  margin: 0 0 24px 0;
}

.top-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}

.date-picker-box {
  display: flex;
  flex-direction: column;
}

.label-date,
.label-route {
  font-size: 12px;
  color: #6b7280;
  display: block;
  margin-bottom: 6px;
}

.input-date-wrapper {
  position: relative;
  cursor: pointer;
  display: inline-block;
}

.hidden-date-input {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  pointer-events: none;
}

.custom-date-display {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  min-width: 180px;
  border: 1px solid #e5e7eb;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  color: #374151;
  background: #ffffff;
  user-select: none;
  transition: border-color 0.2s ease;
}

.custom-date-display:hover {
  border-color: #cbd5e1;
}

.fecha-texto {
  color: #374151;
  white-space: nowrap;
}

.calendar-icon {
  width: 16px;
  height: 15px;
  border: 1.5px solid #6b7280;
  border-radius: 3px;
  position: relative;
  flex-shrink: 0;
  box-sizing: border-box;
}

.calendar-icon::before {
  content: "";
  position: absolute;
  left: 2px;
  right: 2px;
  top: 4px;
  border-top: 1.5px solid #6b7280;
}

.calendar-icon::after {
  content: "";
  position: absolute;
  width: 3px;
  height: 4px;
  background-color: #6b7280;
  top: -3px;
  left: 3px;
  border-radius: 1px;
  box-shadow: 6px 0 #6b7280;
}

.route-picker-box {
  display: flex;
  flex-direction: column;
}

.select-ruta {
  height: 38px;
  min-width: 220px;
  padding: 8px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background-color: #ffffff;
  color: #374151;
  font-size: 14px;
  font-family: inherit;
  outline: none;
  cursor: pointer;
  box-sizing: border-box;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.select-ruta:hover {
  border-color: #cbd5e1;
}

.select-ruta:focus {
  border-color: #cbd5e1;
  box-shadow: 0 0 0 2px rgba(51, 56, 160, 0.08);
}

.kpi-box {
  text-align: right;
}

.kpi-amount {
  font-size: 28px;
  font-weight: 800;
  color: #000000;
}

.kpi-label {
  font-size: 13px;
  color: #6b7280;
  margin-top: 2px;
}

.search-wrapper {
  position: relative;
  margin-bottom: 24px;
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

.data-table th,
.data-table td {
  width: 16.6667%;
}

.col-ruta {
  font-weight: 500;
}

.col-telefono {
  font-weight: 600;
  color: #111827;
}

.col-secundaria {
  color: #4b5563;
}

.col-monto {
  font-weight: 700;
  color: #111827;
}

.th-acciones,
.col-acciones {
  text-align: center !important;
  vertical-align: middle;
}

.btn-detalle {
  background: none;
  border: none;
  padding: 0;
  margin: 0 auto;
  display: inline-block;
  color: deepskyblue;
  font-family: inherit;
  font-size: 13.5px;
  font-weight: 400;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: color 0.2s ease, border-color 0.2s ease;
  text-align: center;
}

.btn-detalle:hover {
  color: #0099cc;
  border-bottom-color: #0099cc;
}

.btn-detalle:focus,
.btn-detalle:active {
  outline: none;
  font-weight: 400;
}

.empty-state {
  text-align: center;
  color: #9ca3af;
  padding: 30px;
  font-size: 13.5px;
}
.filters-column {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.select-ruta {
  height: 38px;
  width: 100%;
  min-width: 220px;
  padding: 8px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background-color: #ffffff;
  color: #374151;
  font-size: 14px;
  font-family: inherit;
  outline: none;
  cursor: pointer;
  box-sizing: border-box;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}
</style>