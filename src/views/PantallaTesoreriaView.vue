<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import headerDis from "../components/UI/headerDis.vue"

const router = useRouter()

const mesAnoSeleccionado = ref('')

const formatearMiles = v =>
  v ? v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') : ''

const filas = ref([])
const todosLosDatos = ref([])

const listarDatos = () => {
  if (!mesAnoSeleccionado.value) {
    filas.value = []
    return
  }

  const registros = [
    { id: 1, fecha: '2026-09-01', recaudo: 3500000 },
    { id: 2, fecha: '2026-09-02', recaudo: 4200000 },
    { id: 3, fecha: '2026-09-03', recaudo: 2800000 }
  ]

  todosLosDatos.value = registros.map(d => ({
    id: d.id,
    fecha: d.fecha,
    recaudo: Number(d.recaudo || 0)
  }))

  filtrarPorMesAno()
}

const filtrarPorMesAno = () => {
  if (!mesAnoSeleccionado.value) {
    filas.value = []
    return
  }

  filas.value = todosLosDatos.value.filter(
    f => f.fecha?.substring(0, 7) === mesAnoSeleccionado.value
  )
}

const verDetalle = (fila) => {
  const recaudo = Number(fila.recaudo || 0)

  localStorage.setItem(
    'detalle_recaudo',
    JSON.stringify({
      id: fila.id,
      fecha: fila.fecha,
      recaudo: recaudo,
      total: recaudo
    })
  )

  router.push('/detalle-recaudo-tesoreria')
}

watch(mesAnoSeleccionado, listarDatos)
</script>

<template>
  <div class="pantalla-full">
    <headerDis />

    <main class="main-content">
      <div class="full-width-container">
        <h1 class="main-title">Recaudo</h1>

        <div class="top-row">
          <div class="month-picker-box">
            <span class="label-month">Mes y Año</span>
            <div class="input-month-wrapper">
              <input
                type="month"
                v-model="mesAnoSeleccionado"
                class="select-mes"
              />
            </div>
          </div>
        </div>

        <div v-if="!mesAnoSeleccionado" class="mensaje-seleccionar">
          <span class="mensaje-icon">📅</span>
          <span>Seleccione un mes y un año</span>
        </div>

        <div
          v-if="mesAnoSeleccionado && filas.length === 0 && todosLosDatos.length > 0"
          class="mensaje-sin-datos"
        >
          No hay datos para el mes seleccionado
        </div>

        <div class="table-wrapper" v-if="filas.length">
          <table class="data-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Recaudo</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="fila in filas" :key="fila.id">
                <td>
                  <input type="date" :value="fila.fecha" disabled />
                </td>
                <td>
                  <input type="text" :value="formatearMiles(fila.recaudo)" disabled />
                </td>
                <td>
                  <button class="btn-detalle" @click="verDetalle(fila)">
                    Ver detalle
                  </button>
                </td>
              </tr>
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

.month-picker-box {
  display: flex;
  flex-direction: column;
}

.label-month {
  font-size: 12px;
  color: #6b7280;
  display: block;
  margin-bottom: 6px;
}

.input-month-wrapper {
  position: relative;
  cursor: pointer;
  display: inline-block;
}

.select-mes {
  height: 38px;
  min-width: 180px;
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

.select-mes:hover {
  border-color: #cbd5e1;
}

.select-mes:focus {
  border-color: #cbd5e1;
  box-shadow: 0 0 0 2px rgba(51, 56, 160, 0.08);
}

.mensaje-seleccionar,
.mensaje-sin-datos {
  width: 100%;
  min-height: 110px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-sizing: border-box;
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  color: #6b7280;
  font-size: 14px;
  margin-bottom: 24px;
}

.mensaje-icon {
  font-size: 17px;
}

.mensaje-sin-datos {
  color: #6b7280;
}

.table-wrapper {
  width: 100%;
  overflow-x: auto;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background-color: #ffffff;
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

.data-table th,
.data-table td {
  width: 33.3333%;
}

.data-table td {
  padding: 14px 16px;
  border-bottom: 1px solid #f1f5f9;
  font-size: 13.5px;
  color: #374151;
}

.data-table tbody tr:last-child td {
  border-bottom: none;
}

.data-table input {
  width: 100%;
  height: 36px;
  padding: 8px 12px;
  box-sizing: border-box;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background-color: #f8fafc;
  color: #6b7280;
  font-family: inherit;
  font-size: 13px;
  outline: none;
}

.btn-detalle {
  background: none;
  border: none;
  padding: 0;
  margin: 0;
  color: deepskyblue;
  font-family: inherit;
  font-size: 13.5px;
  font-weight: 400;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: color 0.2s ease, border-color 0.2s ease;
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

@media (max-width: 768px) {
  .main-content {
    padding: 28px 20px;
  }

  .main-title {
    font-size: 22px;
  }

  .data-table th,
  .data-table td {
    padding: 10px 12px;
  }

  .data-table {
    min-width: 650px;
  }

  .table-wrapper {
    overflow-x: auto;
  }
}
</style>  