<script setup>
import { ref, watch } from 'vue'
import axios from 'axios'
import headerDis from "../components/UI/headerDis.vue"

/* =========================
   UTILIDADES
========================= */
const formatearMiles = v =>
  v ? v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') : ''

/* =========================
   ESTADO
========================= */
const meses = [
  'Enero','Febrero','Marzo','Abril','Mayo','Junio',
  'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'
]

const mesSeleccionado = ref('')
const filas = ref([])
const todosLosDatos = ref([])
const datosOriginales = ref([])
const opcionesDispersion = ['Alpina', 'Surtialimentos']

/* =========================
   LISTAR DATOS
========================= */
const listarDatos = async () => {
  if (!mesSeleccionado.value) return

  try {
    const res = await axios.get(
      'http://localhost:3000/tesoreria/consultar-datos-recaudo'
    )

    const registros = Array.isArray(res.data?.data)
      ? res.data.data
      : res.data

    // 👉 lo que viene de la BD, tal cual
    todosLosDatos.value = registros.map(d => ({
      fecha: d.fecha.substring(0, 10),
      recaudo: d.recaudo,
      dispersion: d.dispersion ?? '' // NULL → ''
    }))

    // copia para comparar
    datosOriginales.value = JSON.parse(JSON.stringify(todosLosDatos.value))

    filtrarPorMes()
  } catch (e) {
    console.error('❌ ERROR BACKEND:', e)
    alert('Error al cargar datos del servidor')
  }
}

/* =========================
   FILTRO POR MES
========================= */
const filtrarPorMes = () => {
  const mesIndex = meses.indexOf(mesSeleccionado.value) + 1
  const mes = mesIndex.toString().padStart(2, '0')

  filas.value = todosLosDatos.value.filter(
    f => f.fecha.substring(5, 7) === mes
  )
}

/* =========================
   SOLO EDITABLE SI EN BD ERA NULL
========================= */
const esEditable = (fecha) => {
  const original = datosOriginales.value.find(d => d.fecha === fecha)
  return original && original.dispersion === ''
}

/* =========================
   HAY CAMBIOS REALES?
========================= */
const tieneCambios = () => {
  return filas.value.some(fila => {
    const original = datosOriginales.value.find(d => d.fecha === fila.fecha)
    return original &&
           original.dispersion === '' &&
           fila.dispersion !== ''
  })
}

/* =========================
   GUARDAR (SOLO LOS NULL)
========================= */
const guardar = async () => {
  try {
    const nuevos = filas.value.filter(fila => {
      const original = datosOriginales.value.find(d => d.fecha === fila.fecha)
      return original &&
             original.dispersion === '' &&
             fila.dispersion !== ''
    })

    if (!nuevos.length) {
      alert('⚠️ No hay registros nuevos para guardar')
      return
    }

    for (const fila of nuevos) {
      await axios.post(
        'http://localhost:3000/tesoreria/crear-registro-con-dispersion',
        {
          fecha: fila.fecha,
          recaudo: fila.recaudo,
          dispersion: fila.dispersion
        }
      )
    }

    alert('✅ Dispersión registrada correctamente')
    listarDatos()
  } catch (e) {
    console.error('❌ Error backend:', e.response?.data || e)
    alert('❌ Error al guardar')
  }
}

/* =========================
   WATCH
========================= */
watch(mesSeleccionado, listarDatos)
</script>

<template>
  <headerDis />

  <div class="contenedor">
    <div class="top">
      <div class="box">
        <span class="label-mes">Mes</span>
        <select v-model="mesSeleccionado" class="select-mes">
          <option value="">Seleccione mes</option>
          <option v-for="mes in meses" :key="mes">{{ mes }}</option>
        </select>
      </div>
    </div>

    <div class="tabla" v-if="filas.length">
      <div class="thead">
        <div>Fecha</div>
        <div>Recaudo</div>
        <div>Dispersión</div>
      </div>

      <div class="row" v-for="fila in filas" :key="fila.fecha">
        <input type="date" :value="fila.fecha" disabled />

        <input
          type="text"
          :value="formatearMiles(fila.recaudo)"
          disabled
        />

        <select
          v-model="fila.dispersion"
          :disabled="!esEditable(fila.fecha)"
        >
          <option value="">Seleccione</option>
          <option
            v-for="op in opcionesDispersion"
            :key="op"
            :value="op"
          >
            {{ op }}
          </option>
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