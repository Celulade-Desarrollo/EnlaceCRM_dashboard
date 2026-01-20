<script setup>
import { onMounted, ref, computed } from 'vue'
import axios from 'axios'
import BotonAtras from "../components/UI/BotonAtras.vue"

const mesSeleccionado = ref('Enero')

const meses = [
  'Enero', 'Febrero', 'Marzo', 'Abril',
  'Mayo', 'Junio', 'Julio', 'Agosto',
  'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
]

const dispersiones = ref([])

const mesANumero = (mes) => ({
  Enero: 0, Febrero: 1, Marzo: 2, Abril: 3,
  Mayo: 4, Junio: 5, Julio: 6, Agosto: 7,
  Septiembre: 8, Octubre: 9, Noviembre: 10, Diciembre: 11
}[mes])

const formatearMiles = (valor) => {
  if (!valor) return ''
  return valor.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

const limpiarNumero = (valor) => valor.replace(/\./g, '')

const filasFiltradas = computed(() => {
  const mes = mesANumero(mesSeleccionado.value)
  return dispersiones.value.filter(d => {
    if (!d.fecha) return false
    return new Date(d.fecha).getMonth() === mes
  })
})

const guardar = () => {
  console.log('Datos guardados:', dispersiones.value)
}

onMounted(async () => {
  try {
    const dispersionesData = await axios.get("/api/listar/dispersion",
      // {
      //   headers: {
      //       Authorization: `Bearer ${token}`,
      //       "Content-Type": "application/json"
      //   }
      // }
    )
    dispersiones.value = dispersionesData.data.map(fila => ({
      ...fila,
      confirmacion: fila.banco_status === null ? 'No confirmado' : 'Confirmado'
    }))
    console.log("dispersiones", dispersionesData.data)
  } catch (error) {
    console.error("Error cargando dispersiones", error)
  }
});
</script>

<template>
  <BotonAtras />

  <div class="contenedor">
    <div class="top">
      <div class="box">
        <span class="label-mes">Mes</span>
        <select v-model="mesSeleccionado" class="select-mes">
          <option v-for="mes in meses" :key="mes" :value="mes">
            {{ mes }}
          </option>
        </select>
      </div>
    </div>
    <div class="tabla">
      <div class="thead">
        <div>Fecha</div>
        <div>Recaudo</div>
        <div>Dispersión</div>
        <div>Confirmación</div>
      </div>
      <div class="row" v-for="fila in filasFiltradas" :key="fila.id">
        <div class="celda-valor">{{ fila.fecha.split('T')[0] }}</div>
        <div class="celda-valor">{{ formatearMiles(fila.recaudo) }}</div>
        <div class="celda-valor">{{ fila.dispersion }}</div>
        <div>
          <select v-model="fila.confirmacion">
            <option value="No confirmado">No confirmado</option>
            <option value="Confirmado">Confirmado</option>
          </select>
        </div>
      </div>
    </div>
    <div class="acciones">
      <button class="btn primary" @click="guardar">
        Guardar
      </button>
    </div>
  </div>
</template>

<style scoped>
/* CONTENEDOR */
.contenedor {
  width: 700px;
  margin: 40px auto;
  padding: 30px;
  background: #f4f7fb;
  border-radius: 12px;
  font-family: 'Segoe UI', Arial, sans-serif;
}

/* ENCABEZADO */
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
  background: transparent;
  border: none;
  color: white;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  padding: 2px 1px;
  height: 22px;
}

.select-mes option {
  color: black;
}


.tabla {
  background: white ;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
}


.thead {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr; /* 4 columnas ahora */
  background: #251886;
  color: white;
  padding: 12px;
  font-weight: 600;
  text-align: center;
}

.row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr; /* 4 columnas */
  gap: 15px;
  padding: 22px;
  align-items: center;
  border-bottom: 1px solid #e6e6e6;
}



.celda-valor {
  padding: 8px;
  text-align: center;
  border-radius: 6px;
  border: 1.5px solid #cfd8dc;
  background: #f4f7fb;
}

/* SELECT DENTRO DE TABLA */
select {
  padding: 6px;
  border-radius: 6px;
  border: 1px solid #cfd8dc;
  text-align: center;
  background: white;
  cursor: pointer;
}

/* BOTONES */
.acciones {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.btn {
  padding: 12px 28px;
  border-radius: 30px;
  font-size: 15px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: 0.25s;
}

.primary {
  background: #E83E8C;
  color: white;
}

.primary:hover {
  background: #f15bab;
  transform: translateY(-2px);
}
</style>