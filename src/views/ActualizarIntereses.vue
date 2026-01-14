<template>
     <HeadingEnlace />
<div class="movimientos-container">
    <div v-if="movimientos.length" v-for="movimiento in movimientos" :key="movimiento.IdMovimiento" class="movimiento-card">
      <div class="card-header">
        <h3>Movimiento #{{ movimiento.IdMovimiento }}</h3>
        <span class="fecha"> Realizado el {{ formatearFecha(movimiento.FechaHoraMovimiento) }}</span>
      </div>
      <div class="card-body">
        <!-- Overlay de carga -->
        <div v-if="movimiento.cargando" class="card-overlay">
          <div class="spinner"></div>
        </div>

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
            <button 
              @click="actualizarIntereses(movimiento)" 
              :disabled="movimiento.cargando"
              class="p-2 bg-yellow-400 rounded-xl pl-3 pr-3 text-yellow-800"
            >
              Actualizar Intereses
            </button> 

      
            <button 
              @click="cancelarEdicion(movimiento)" 
              :disabled="movimiento.cargando"
              class="text-gray-400 p-2 border-2 rounded-xl border-solid border-gray-400"
            >
              Cancelar
            </button>
          </template>
          <template v-else>
            <button @click="iniciarEdicion(movimiento)" class="bg-[#5A44D1] text-white p-2 pl-4 pr-4 rounded-xl">Actualizar Saldo</button>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import axios from 'axios'
import HeadingEnlace from '../components/UI/headingEnlace.vue'


const movimientos = ref([])
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
  try {
    const response = await axios.get('/api/listar/enlace/movimientos')
    const data = response.data
    console.log(data)

    movimientos.value = data.map((mov) => ({
      ...mov,
      editando: false,
      cargando: false,
      nuevoMonto: mov.MontoMasIntereses != null ? mov.MontoMasIntereses : mov.Monto,
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
}

const actualizarIntereses = async (movimiento) => {
  try {
    movimiento.cargando = true
    
    const valorConIntereses = calcularSaldoTotal(movimiento)
    await axios.put(`/api/actualizarIntereses/${movimiento.IdMovimiento}`, { 
      nuevoMonto: valorConIntereses,
    })
    
    console.log('Intereses actualizados correctamente')
    
    // Recargar la página después de actualizar
    window.location.reload()
  } catch (error) {
    console.error('Error al actualizar intereses:', error)
  } finally {
    movimiento.cargando = false
  }
}

onMounted(obtenerMovimientos)
</script>

<style scoped>
p {
  padding: 0.2rem;
}

.titulo {
  font-size: clamp(1.2rem, 2vw, 1.5rem); /* se adapta al tamaño de pantalla */
  font-weight: bold;
  color: white;
  margin-bottom: 1rem;
}

.logout {
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
}

.boton-logout {
  padding: 0.6rem 2rem;
  font-size: clamp(0.8rem, 1vw, 1rem);
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  background: #5A44D1;
  color: #fff;
  outline: none;
  border: none;
  transition: background 0.3s;
}

.boton-logout:hover {
  background-color: #5A44D1;
}

.logo-container {
  text-align: center;
  margin-block: 1.5rem;
}

.logo-main {
  width: clamp(120px, 30%, 180px); /* ancho adaptativo */
  height: auto;
  display: inline-block;
}

.movimientos-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  padding: 1rem;
    max-width:500px;
  margin: 0 auto;
}

.movimiento-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  position: relative;
  transition: transform 0.2s;
}

.movimiento-card:hover {
  transform: translateY(-3px);
}

.card-header {
  border-bottom: 1px solid #eee;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
}

.card-header h3 {
  margin: 0;
  font-size: clamp(1rem, 1.5vw, 1.2rem);
  color: #2c3e50;
}

.fecha {
  color: #666;
  font-size: clamp(0.8rem, 1vw, 0.9rem);
}

.card-body {
  position: relative;
}

.card-body p {
  margin: 0.3rem 0;
  font-size: clamp(0.8rem, 1vw, 0.95rem);
}

strong {
  color: #2c3e50;
}

.botones {
  margin-top: 1rem;
  display: flex;
  flex-wrap: wrap; /* se envían a la siguiente línea en pantallas pequeñas */
  gap: 0.5rem;
}

.btn-editar,
.btn-actualizar,
.btn-cancelar {
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-weight: bold;
  font-size: clamp(0.75rem, 1vw, 0.9rem);
}

.btn-editar { background-color: #3498db; color: white; }
.btn-actualizar { background-color: #2ecc71; color: white; }
.btn-cancelar { background-color: #e74c3c; color: white; }

.monto-input {
  width: 100%;
  max-width: 120px;
  padding: 0.3rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button:hover { opacity: 0.9; }
button:disabled { opacity: 0.5; cursor: not-allowed; }

/* Overlay y spinner */
.card-overlay {
  position: absolute;
  inset: 0;
  background: rgba(255,255,255,0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  z-index: 10;
}

.spinner {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 4px solid rgba(0,0,0,0.08);
  border-top-color: #2ecc71;
  animation: spin 1s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

@media (max-width: 500px) {
  .titulo { text-align: center; }
  .logout { justify-content: center; margin-top: 0.5rem; }
  .botones { justify-content: center; }
}
</style>
