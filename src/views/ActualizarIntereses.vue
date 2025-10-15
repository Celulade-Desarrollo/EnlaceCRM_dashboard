<template>
  <div class="movimientos-container">
    <section class="logo-container">
      <img src="/public/enlaceFiado.png" alt="logo Enlace CRM" class="logo-main" />
      <!-- <Heading :mensaje="'Hola, Administrador'" /> -->
    </section>
    
    <div v-if="movimientos.length" v-for="movimiento in movimientos" :key="movimiento.IdMovimiento" class="movimiento-card">
      <div class="card-header">
        <h3>Movimiento #{{ movimiento.IdMovimiento }}</h3>
        <span class="fecha"> Realizado el {{ formatearFecha(movimiento.FechaHoraMovimiento) }}</span>
      </div>
      <div class="card-body">
        <p><strong>Cédula:</strong> {{ movimiento.Cedula_Usuario }}</p>
        <p>
          <strong>Pago:</strong>
          <template v-if="movimiento.editando">
            <input 
              type="number" 
              v-model="movimiento.nuevoMonto" 
              class="monto-input"
            >
          </template>
          <template v-else>
            ${{ formatearMonto(getDisplayMonto(movimiento)) }}
          </template>
        </p>
        <p>
          <strong>Saldo Capital:</strong>
          <template v-if="movimiento.editando">
            <input 
              type="number" 
              v-model.number="movimiento.abonoCapital"
              class="saldo-capital-input"
            >
          </template>
          <template v-else>
            ${{ formatearMonto(calcularSaldoCapital(movimiento)) }}
          </template>
        </p>
        <p>
          <strong>Saldo total:</strong>
          ${{ formatearMonto(calcularSaldoTotal(movimiento)) }}
        </p>
        
        <p class="bg-green-200">
          <strong>Interes corriente:</strong>
          <template v-if="movimiento.editando">
            <input 
              type="number" 
              v-model.number="movimiento.interesCorriente"
              class="monto-input"
            >
          </template>
          <template v-else>
            ${{ formatearMonto(movimiento.interesCorriente) }}
          </template>
        </p>

        <p class="bg-green-200">
          <strong>Intereses mora:</strong>
          <template v-if="movimiento.editando">
            <input 
              type="number" 
              v-model.number="movimiento.interesMora" 
              class="monto-input"
            >
          </template>
          <template v-else>
            ${{ formatearMonto(movimiento.interesMora) }}
          </template>
        </p>

    <!-- 
        <p class="bg-green-200">
          <strong>Abono Capital:</strong>
          <template v-if="movimiento.editando">
            <input 
              type="number" 
              v-model.number="movimiento.abonoCapital" 
              class="monto-input"
            >
          </template>
          <template v-else>
            ${{ formatearMonto(movimiento.abonoCapital) }}
          </template>
        </p>
         <p class="bg-green-200">
          <strong>Abono Intereses:</strong>
          <template v-if="movimiento.editando">
            <input 
              type="number" 
              v-model.number="movimiento.abonoIntereses" 
              class="monto-input"
            >
          </template>
          <template v-else>
            ${{ formatearMonto(movimiento.abonoIntereses) }}
          </template>
        </p>
-->

         <p>
          <strong>Cobro fees:</strong>
          <template v-if="movimiento.editando">
            <input 
              type="number" 
              v-model.number="movimiento.cobroFees" 
              class="monto-input"
            >
          </template>
          <template v-else>
            ${{ formatearMonto(movimiento.cobroFees) }}
          </template>
        </p>

        <!-- 
         <p class="bg-green-200">
          <strong>Abono fees:</strong>
          <template v-if="movimiento.editando">
            <input 
              type="number" 
              v-model.number="movimiento.abonoFees" 
              class="monto-input"
            >
          </template>
          <template v-else>
            ${{ formatearMonto(movimiento.abonoFees) }}
          </template>
        </p>
        -->
        <p><strong>Descripción:</strong> {{ movimiento.Descripcion }}</p>
        <p><strong>Fecha de Pago Programado:</strong> {{ formatearFecha(movimiento.FechaPagoProgramado) }}</p>
        
        <div class="botones">
          <template v-if="movimiento.editando">
           <!-- <button @click="actualizarMonto( movimiento.Cedula_Usuario, actualizarSaldo.abonoCapital )" class="p-2 bg-green-400 rounded-xl pl-3 pr-3 text-green-800">Realizar Abono</button>-->
            <button @click="actualizarIntereses( movimiento.IdMovimiento, calcularSaldoTotal(movimiento))" class="p-2 bg-yellow-400 rounded-xl pl-3 pr-3 text-yellow-800">Actualizar Intereses</button> 

      
            <button @click="cancelarEdicion(movimiento)" class="text-gray-400 p-2 border-2 rounded-xl border-solid border-gray-400">Cancelar</button>
          </template>
          <template v-else>
            <button @click="iniciarEdicion(movimiento)" class="bg-[#dd3590] text-white p-2 pl-4 pr-4 rounded-xl">Actualizar Saldo</button>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import axios from 'axios'


const movimientos = ref([])

// Eliminamos el estado global 'actualizarSaldo'.
// Cada movimiento tendrá sus propios campos editables inicializados al obtener los movimientos.


const formatearFecha = (fecha) => {
  return new Date(fecha).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const formatearMonto = (monto) => {
  if (isNaN(monto) || monto == null) return '0'
  return Number(monto).toLocaleString('es-CO')
}

const getDisplayMonto = (movimiento) => {
  // Si existe MontoMasIntereses (no null/undefined) usarlo, si no usar Monto
  if (movimiento == null) return 0
  return movimiento.MontoMasIntereses != null ? movimiento.MontoMasIntereses : movimiento.Monto
}


const calcularSaldoCapital = (movimiento) => {
  const pago = Number(getDisplayMonto(movimiento) || 0)
  const abonoCapital = Number(movimiento.abonoCapital || 0)
  return pago - abonoCapital
}

const calcularSaldoTotal = (movimiento) => {
  const B = calcularSaldoCapital(movimiento)
  const D = Number(movimiento.interesCorriente || 0)
  const E = Number(movimiento.interesMora || 0)
  const H = Number(movimiento.cobroFees ?? 500)

  return B + D + E + H 
}


const obtenerMovimientos = async () => {

        const response = await axios.get('/api/listar/enlace/movimientos')
        const data = response.data
        console.log(data)
    

  try {
    const dataPrueba = [
      {
        IdMovimiento: 18674,
        IdUsuarioFinal: 54,
        FechaHoraMovimiento: "2025-10-06T18:04:30.495Z",
        IdTipoMovimiento: 1,
        Monto: 30000,
        Descripcion: "testing",
        Cedula_Usuario: "1111480601",
      },
    ]

    movimientos.value = data.map((mov) => ({
      ...mov,
      editando: false,
      nuevoMonto: mov.MontoMasIntereses != null ? mov.MontoMasIntereses : mov.Monto,
      // Campos por movimiento (estado local)
      interesCorriente: 0,
      interesMora: 0,
      abonoCapital: 0,
      abonoIntereses: 0,
      abonoFees: 0,
      cobroFees: 500,
    }))

  
  // No inicializamos valores globales; cada movimiento mantiene sus cálculos al renderizar.
  } catch (error) {
    console.error('Error al obtener movimientos:', error)
  }
}

const iniciarEdicion = (movimiento) => {
  movimiento.editando = true
  movimiento.nuevoMonto = getDisplayMonto(movimiento)
  // asegurarnos que los campos existen (por si se añadieron dinámicamente)
  movimiento.interesCorriente = movimiento.interesCorriente ?? 0
  movimiento.interesMora = movimiento.interesMora ?? 0
  movimiento.abonoCapital = movimiento.abonoCapital ?? 0
  movimiento.abonoIntereses = movimiento.abonoIntereses ?? 0
  movimiento.abonoFees = movimiento.abonoFees ?? 0
  movimiento.cobroFees = movimiento.cobroFees ?? 500
}

const cancelarEdicion = (movimiento) => {
  movimiento.editando = false
  movimiento.nuevoMonto = movimiento.Monto
  // opcional: resetear campos editables si se desea
}

const movimientoInfo ={
  identificadorTendero: 0,
  monto: 0,
  tipoMovimiento: 2,
  descripcion: "pago de credito",
  fechaPagoProgramado: "",
  idMedioPago: 2,
  nroFacturaAlpina: "string",
  telefonoTransportista: ""
}

const actualizarMonto = async (identificadorTendero, abono) => {
  try {
    const payload = {
      ...movimientoInfo,
      identificadorTendero,
      monto: abono,
    }

    await axios.post('/api/movimientos', payload)

    console.log('Movimiento actualizado correctamente')
  } catch (error) {
    console.error('Error al actualizar monto:', error)
  }
}


const actualizarIntereses = async (IdMovimiento, valorConIntereses) => {
  try {
    await axios.put(`/api/actualizarIntereses/${IdMovimiento}`, { nuevoMonto: valorConIntereses })
  } catch (error) {
    console.error('Error al actualizar intereses:', error)
  }
}

onMounted(obtenerMovimientos)
</script>

<style scoped>


p{
  padding: 2px
}

.titulo {
  font-size: 1.5rem;
  font-weight: bold;
  color:white;
  margin-bottom: 10px;
}
.logout {
  display: flex;
  justify-content: right;
  margin-top: 1rem;
}
.boton-logout {
  padding: 10px 30px;
  font-size: 15px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  background: #dd3590;
  color: #fff;
  outline: none;
  border: none;
}
.boton-logout:hover {
  background-color: #f15bab;
}
.logo-container {
  text-align: center;
  margin-block: 1.5rem;
}

.logo-main {
  width: min(180px, 80%);
  height: auto;
  display: inline;
}
.movimientos-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
  padding: 1rem;
}

.movimiento-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.card-header {
  border-bottom: 1px solid #eee;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
}

.card-header h3 {
  margin: 0;
  color: #2c3e50;
}

.fecha {
  color: #666;
  font-size: 0.9rem;
}

.card-body p {
  margin: 0.5rem 0;
}

strong {
  color: #2c3e50;
}

.botones {
  margin-top: 1rem;
  display: flex;
  gap: 0.5rem;
}

.btn-editar,
.btn-actualizar,
.btn-cancelar {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-weight: bold;
}

.btn-editar {
  background-color: #3498db;
  color: white;
}

.btn-actualizar {
  background-color: #2ecc71;
  color: white;
}

.btn-cancelar {
  background-color: #e74c3c;
  color: white;
}

.monto-input {
  width: 120px;
  padding: 0.3rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button:hover {
  opacity: 0.9;
}
</style>