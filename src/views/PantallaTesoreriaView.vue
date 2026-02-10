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
const opcionesDispersion = ['Alpina', 'Surtialimentos']

const listarDatos = async () => {
  if (!mesAnoSeleccionado.value) return

  try {
    const res = await axios.get('/tesoreria/consultar-datos-recaudo')
    const registros = Array.isArray(res.data?.data) ? res.data.data : res.data

    todosLosDatos.value = registros.map(d => ({
      id: d.id,
      fecha: d.fecha.substring(0, 10),
      recaudo: d.recaudo,
      dispersion: (d.dispersion || '').trim()
    }))

    datosOriginales.value = JSON.parse(JSON.stringify(todosLosDatos.value))
    filtrarPorMesAno()
  } catch (e) {
    console.error('Error al cargar datos:', e)
    alert('Error al cargar datos del servidor')
  }
}

const filtrarPorMesAno = () => {
  filas.value = todosLosDatos.value.filter(f => 
    f.fecha.substring(0, 7) === mesAnoSeleccionado.value
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

    for (const fila of nuevos) {
      if (!fila.id) {
        alert('Error: Registro sin ID')
        return
      }

      await axios.put('/tesoreria/actualizar-dispersion', {
        id: fila.id,
        dispersion: fila.dispersion
      })
    }

    nuevos.forEach(fila => {
      const index = datosOriginales.value.findIndex(d => d.fecha === fila.fecha)
      if (index !== -1) {
        datosOriginales.value[index].dispersion = fila.dispersion
      }
    })

    alert('Dispersión actualizada correctamente')
    await listarDatos()
  } catch (e) {
    console.error('Error al guardar:', e)
    alert('Error al guardar: ' + (e.response?.data?.message || 'Error desconocido'))
  }
}

watch(mesAnoSeleccionado, listarDatos)
</script>

<template>
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
}

.tabla {
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
}

.thead {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  background: #251886;
  color: white;
  padding: 12px;
  font-weight: 600;
  text-align: center;
}

.row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 15px;
  padding: 22px;
  align-items: center;
  border-bottom: 1px solid #e6e6e6;
}

.row:hover {
  background: #f1f7fa;
}

input,
select {
  padding: 8px;
  border-radius: 6px;
  border: 1.5px solid #cfd8dc;
  text-align: center;
}

input:disabled,
select:disabled {
  background: #f2f2f2;
  color: #666;
}

.acciones {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 20px;
}

.btn {
  padding: 12px 28px;
  border-radius: 30px;
  font-size: 15px;
  font-weight: 600;
  border: none;
  cursor: pointer;
}

.primary {
  background: #E83E8C;
  color: white;
}
</style>