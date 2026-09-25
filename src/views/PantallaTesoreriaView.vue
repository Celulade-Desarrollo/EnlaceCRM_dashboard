<script setup>
import { ref, watch } from 'vue'
import axios from 'axios'
import headerDis from "../components/UI/headerDis.vue"

const mesAnoSeleccionado = ref('');

const formatearMiles = v =>
  v ? v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') : ''

const filas = ref([])
const todosLosDatos = ref([])
const datosOriginales = ref([])

const listarDatos = async () => {
  if (!mesAnoSeleccionado.value) return

  try {
    const res = await axios.get('/tesoreria/consultar-datos-recaudo')
    const registros = res.data?.data || res.data || []

    todosLosDatos.value = registros.map(d => {
      let fecha = d.fecha || ''
      if (fecha.includes('T')) fecha = fecha.split('T')[0]
      
      return {
        id: d.id,
        fecha,
        recaudo: d.recaudo || 0, // 🎯 Aseguramos que tome el alias del SQL
        dispersion: (d.dispersion || '').trim() 
      }
    })

    datosOriginales.value = JSON.parse(JSON.stringify(todosLosDatos.value))
    filtrarPorMesAno()
  } catch (e) {
    console.error('❌ Error al cargar datos:', e)
  }
}

const filtrarPorMesAno = () => {
  if (!mesAnoSeleccionado.value) {
    filas.value = []
    return
  }
  filas.value = todosLosDatos.value.filter(f =>
    f.fecha?.substring(0, 7) === mesAnoSeleccionado.value
  )
}

const esEditable = (fecha) => {
  const original = datosOriginales.value.find(d => d.fecha === fecha)
  return original && original.dispersion === ''
}

const tieneCambios = () => {
  return filas.value.some(fila => {
    const original = datosOriginales.value.find(d => d.fecha === fila.fecha)
    return original && original.dispersion === '' && fila.dispersion !== ''
  })
}

const guardar = async () => {
  try {
    const nuevos = filas.value.filter(fila => {
      const original = datosOriginales.value.find(d => d.fecha === fila.fecha)
      return original && original.dispersion === '' && fila.dispersion !== ''
    })

    if (!nuevos.length) {
      alert('No hay cambios para guardar')
      return
    }

    // Localiza esta parte en tu función guardar()
const payload = nuevos.map(fila => ({
  fecha: fila.fecha,
  recaudo: fila.recaudo, // Este valor ahora será el real (Tipo 1)
  dispersion: fila.dispersion,
  tesoreria_status: false,
  banco_status: false
}))

    await axios.post('/tesoreria/crear-registro-con-dispersion', payload)

    nuevos.forEach(fila => {
      const index = datosOriginales.value.findIndex(d => d.fecha === fila.fecha)
      if (index !== -1) {
        datosOriginales.value[index].dispersion = fila.dispersion
      }
    })

    // Actualizar datosOriginales para bloquear los guardados
    nuevos.forEach(fila => {
      const index = datosOriginales.value.findIndex(d => d.fecha === fila.fecha)
      if (index !== -1) {
        datosOriginales.value[index].dispersion = fila.dispersion
      }
    })

    alert('Dispersión guardada correctamente en Tesorería')
    // NO recargar para evitar duplicados (el backend debe actualizar status en Recaudo)
  } catch (e) {
    console.error('❌ Error al guardar:', e)
    alert('Error al guardar: ' + (e.response?.data?.message || 'Error desconocido'))
  }
}

watch(mesAnoSeleccionado, listarDatos)
</script>

<template>
  <div class="pantalla-full">
    <headerDis />

    <main class="main-content">
      <div class="full-width-container">

        <h1 class="main-title">Dispersión Mensual</h1>

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

        <!-- SIN MES SELECCIONADO -->
        <div
          v-if="!mesAnoSeleccionado"
          class="mensaje-seleccionar"
        >
          <span class="mensaje-icon">📅</span>
          <span>Seleccione un mes y un año</span>
        </div>

        <!-- SIN DATOS -->
        <div
          v-if="
            mesAnoSeleccionado &&
            filas.length === 0 &&
            todosLosDatos.length > 0
          "
          class="mensaje-sin-datos"
        >
          No hay datos para el mes seleccionado
        </div>

        <!-- TABLA -->
        <div
          class="table-wrapper"
          v-if="filas.length"
        >
          <table class="data-table">

            <thead>
              <tr>
                <th>Fecha</th>
                <th>Recaudo</th>
                <th>Dispersión</th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="fila in filas"
                :key="fila.fecha"
              >
                <td>
                  <input
                    type="date"
                    :value="fila.fecha"
                    disabled
                  />
                </td>

                <td>
                  <input
                    type="text"
                    :value="formatearMiles(fila.recaudo)"
                    disabled
                  />
                </td>

                <td>
                  <select
                    v-model="fila.dispersion"
                    :disabled="!esEditable(fila.fecha)"
                  >
                    <option value="">
                      {{
                        esEditable(fila.fecha)
                          ? 'Seleccione'
                          : '(No editable)'
                      }}
                    </option>

                    <option value="Alpina">
                      Alpina
                    </option>

                    <option value="Surtialimentos">
                      Surtialimentos
                    </option>
                  </select>
                </td>
              </tr>
            </tbody>

          </table>
        </div>

        <!-- GUARDAR -->
        <div
          class="acciones"
          v-if="tieneCambios()"
        >
          <button
            class="btn primary"
            @click="guardar"
          >
            Guardar
          </button>
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
  font-family:
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    sans-serif;
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


/* FILA SUPERIOR */

.top-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}


/* SELECTOR DE MES */

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

  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.select-mes:hover {
  border-color: #cbd5e1;
}

.select-mes:focus {
  border-color: #cbd5e1;

  box-shadow:
    0 0 0 2px rgba(51, 56, 160, 0.08);
}


/* MENSAJES */

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


/* TABLA */

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


/* CAMPOS */

.data-table input,
.data-table select {
  width: 100%;
  height: 36px;

  padding: 8px 12px;

  box-sizing: border-box;

  border: 1px solid #e5e7eb;
  border-radius: 6px;

  background-color: #ffffff;
  color: #374151;

  font-family: inherit;
  font-size: 13px;

  outline: none;

  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.data-table input:focus,
.data-table select:focus {
  border-color: #cbd5e1;

  box-shadow:
    0 0 0 2px rgba(51, 56, 160, 0.06);
}


/* CAMPOS DESHABILITADOS */

.data-table input:disabled,
.data-table select:disabled {
  background-color: #f8fafc;

  color: #6b7280;

  cursor: default;

  opacity: 1;
}


/* SELECT EDITABLE */

.data-table select:not(:disabled) {
  cursor: pointer;
}

.data-table select:not(:disabled):hover {
  border-color: #cbd5e1;
}


/* ACCIONES */

.acciones {
  display: flex;

  justify-content: flex-end;

  margin-top: 20px;
}

.btn {
  padding: 10px 22px;

  border-radius: 6px;

  font-size: 13px;
  font-weight: 600;

  border: none;

  cursor: pointer;

  transition:
    background-color 0.2s ease,
    transform 0.2s ease;

  outline: none;
}

.primary {
  background-color: #3338a0;

  color: #ffffff;
}

.primary:hover {
  background-color: #292d82;

  transform: translateY(-1px);
}

.primary:active {
  transform: translateY(0);
}

.primary:focus,
.primary:focus-visible {
  outline: none;
}


/* RESPONSIVE */

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

  .acciones {
    justify-content: stretch;
  }

  .btn {
    width: 100%;
  }
}

</style>