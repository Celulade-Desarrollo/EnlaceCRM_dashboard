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

    const registros = Array.isArray(res.data?.data) ? res.data.data :
                      Array.isArray(res.data) ? res.data : []

    todosLosDatos.value = registros.map(d => {
      let fecha = d.fecha || ''
      if (fecha.includes('T')) fecha = fecha.split('T')[0]
      if (fecha.length > 10) fecha = fecha.substring(0, 10)
      return {
        id: d.id,
        fecha,
        recaudo: d.recaudo,
        dispersion: (d.dispersion || '').trim()
      }
    })

    datosOriginales.value = JSON.parse(JSON.stringify(todosLosDatos.value))
    filtrarPorMesAno()
  } catch (e) {
    console.error('❌ Error al cargar datos:', e)
    alert('Error al cargar datos: ' + (e.message || 'Error desconocido'))
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

    const payload = nuevos.map(fila => ({
      fecha: fila.fecha,
      recaudo: fila.recaudo,
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
  <div>
    <headerDis />

    <div class="contenedor">
      <div class="top">
        <div class="box">
          <span class="label-mes">Mes y Año</span>
          <input
            type="month"
            v-model="mesAnoSeleccionado"
            class="select-mes"
          />
        </div>
      </div>

      <div v-if="!mesAnoSeleccionado" class="mensaje-seleccionar">
        📅 Seleccione un mes y un año
      </div>

      <div v-if="mesAnoSeleccionado && filas.length === 0 && todosLosDatos.length > 0" class="mensaje-sin-datos">
        ⚠️ No hay datos para el mes seleccionado
      </div>

      <div class="tabla" v-if="filas.length">
        <div class="thead">
          <div>Fecha</div>
          <div>Recaudo</div>
          <div>Dispersión</div>
        </div>

        <div class="row" v-for="fila in filas" :key="fila.fecha">
          <input type="date" :value="fila.fecha" disabled />
          <input type="text" :value="formatearMiles(fila.recaudo)" disabled />
          <select v-model="fila.dispersion" :disabled="!esEditable(fila.fecha)">
            <option value="">{{ esEditable(fila.fecha) ? 'Seleccione' : '(No editable)' }}</option>
            <option value="Alpina">Alpina</option>
            <option value="Surtialimentos">Surtialimentos</option>
          </select>
        </div>
      </div>

      <div class="acciones" v-if="tieneCambios()">
        <button class="btn primary" @click="guardar">💾 Guardar</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.contenedor {
  width: 700px;
  margin: 40px auto;
  padding: 30px;
  background: #f4f7fb;
  border-radius: 12px;
  font-family: 'Segoe UI', Arial, sans-serif;
}

.top {
  display: flex;
  justify-content: space-between;
  margin-bottom: 25px;
}

.box {
  background: #251886;
  padding: 10px 20px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.label-mes {
  font-size: 13px;
  color: #cfe8f1;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.select-mes {
  background: #251886c4;
  color: white;
  border: none;
  outline: none;
  padding: 8px;
  border-radius: 6px;
  cursor: pointer;
}

.mensaje-seleccionar,
.mensaje-sin-datos {
  text-align: center;
  padding: 40px 30px;
  background: white;
  border-radius: 12px;
  color: #666;
  font-size: 16px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

.mensaje-sin-datos {
  background: #fff3cd;
  color: #856404;
  border: 2px solid #ffc107;
}

.tabla {
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.thead {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  background: #251886;
  color: white;
  padding: 12px;
  font-weight: 600;
  text-align: center;
  font-size: 14px;
}

.row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 15px;
  padding: 22px;
  align-items: center;
  border-bottom: 1px solid #e6e6e6;
  transition: background 0.2s;
}

.row:last-child {
  border-bottom: none;
}

.row:hover {
  background: #f8f9ff;
}

input,
select {
  padding: 8px 12px;
  border-radius: 6px;
  border: 1.5px solid #cfd8dc;
  text-align: center;
  font-size: 14px;
  transition: border-color 0.2s;
}

input:focus,
select:focus {
  outline: none;
  border-color: #251886;
}

input:disabled,
select:disabled {
  background: #f5f5f5;
  color: #666;
  cursor: not-allowed;
}

select:not(:disabled) {
  cursor: pointer;
}

select:not(:disabled):hover {
  border-color: #E83E8C;
}

.acciones {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 25px;
}

.btn {
  padding: 12px 32px;
  border-radius: 30px;
  font-size: 15px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 15px rgba(232, 62, 140, 0.3);
}

.primary {
  background: #E83E8C;
  color: white;
}

.primary:hover {
  background: #d63384;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(232, 62, 140, 0.4);
}

.primary:active {
  transform: translateY(0);
}
</style>