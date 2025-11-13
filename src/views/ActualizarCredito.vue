<template>
  <div class="movimientos-container">
    <!-- Componente de error global -->
    <Errormsj v-if="errorMessage" :message="errorMessage" @close="errorMessage = ''" />
    
    <section class="logo-container">
      <img src="/public/enlaceFiado.png" alt="logo Enlace CRM" class="logo-main" />
    </section>
    
    <div v-if="movimientos.length" v-for="movimiento in movimientos" :key="movimiento.IdMovimiento" class="movimiento-card">
      <div class="card-header">
        <h3>Movimiento #{{ movimiento.IdMovimiento }}</h3>
        <span class="fecha"> Realizado el {{ formatearFecha(movimiento.FechaHoraMovimiento) }}</span>
      </div>
      
      <div class="card-body">
        <div v-if="movimiento.cargando" class="card-overlay">
          <div class="spinner"></div>
        </div>
        
        <p><strong>Cédula:</strong> {{ movimiento.Cedula_Usuario }}</p>
        
        <p>
          <strong>Pago:</strong>
          ${{ formatearMonto(getPago(movimiento)) }}
        </p>
        
        <p>
          <strong>Saldo Capital + Intereses:</strong>
          <template v-if="movimiento.editando">
            <input 
              type="number" 
              v-model.number="movimiento.MontoMasIntereses" 
              class="monto-input"
            >
          </template>
          <template v-else>
            ${{ formatearMonto(getSaldoCapitalIntereses(movimiento)) }}
          </template>
        </p>
        
        <p>
          <strong>Saldo Capital:</strong>
          ${{ formatearMonto(calcularSaldoCapital(movimiento)) }}
        </p>
        
        <p>
          <strong>Saldo total:</strong>
          ${{ formatearMonto(calcularSaldoTotal(movimiento)) }}
        </p>
        
        <p class="bg-yellow-200">
          <strong>Total Abono:</strong>
          ${{ calcularTotalAbono(movimiento) }}
        </p>
        
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
        
        <!-- Error específico de abono capital -->
        <div v-if="movimiento.editando && validarAbonoCapital(movimiento).error" class="error-mensaje">
          {{ validarAbonoCapital(movimiento).mensaje }}
        </div>
        
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
        
        <!-- Error específico de abono intereses -->
        <div v-if="movimiento.editando && validarAbonoIntereses(movimiento).error" class="error-mensaje">
          {{ validarAbonoIntereses(movimiento).mensaje }}
        </div>
        
        <p class="bg-green-200">
          <strong>Seguro (fees):</strong>
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
        
        <p><strong>Descripción:</strong> {{ movimiento.Descripcion }}</p>
        <p><strong>Fecha de Pago Programado:</strong> {{ formatearFecha(movimiento.FechaPagoProgramado) }}</p>
        
        <div class="botones">
          <template v-if="movimiento.editando">
            <button 
              @click="actualizarMonto(movimiento)" 
              :disabled="!puedeActualizar(movimiento)"
              class="p-2 bg-green-400 rounded-xl pl-3 pr-3 text-green-800"
            >
              Realizar Abono
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
            <button 
              @click="iniciarEdicion(movimiento)" 
              :disabled="!puedeEditar(movimiento)"
              class="bg-[#dd3590] text-white p-2 pl-4 pr-4 rounded-xl"
            >
              Actualizar Saldo
            </button>
            <span v-if="!puedeEditar(movimiento)" class="no-edit-note">
              Saldo capital es 0 — no editable
            </span>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Errormsj from '../components/UI/Alerta.vue'
import axios from 'axios'

// ============================================
// ESTADO
// ============================================
const movimientos = ref([])
const errorMessage = ref('')

// ============================================
// CONSTANTES
// ============================================
const MOVIMIENTO_INFO = {
  identificadorTendero: 0,
  monto: 0,
  tipoMovimiento: 2,
  descripcion: "pago de credito",
  fechaPagoProgramado: "",
  idMedioPago: 2,
  telefonoTransportista: ""
}

// ============================================
// FUNCIONES DE FORMATO
// ============================================
const formatearFecha = (fecha) => {
  if (!fecha) return 'N/A'
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

// ============================================
// FUNCIONES DE CÁLCULO
// ============================================
const getPago = (movimiento) => {
  return movimiento?.Monto || 0
}

const getSaldoCapitalIntereses = (movimiento) => {
  if (!movimiento) return 0
  const totalAbono = getTotalAbonoValue(movimiento)
  return movimiento.MontoMasIntereses - Number(movimiento.AbonoUsuario || 0) - totalAbono
}

const getTotalAbonoValue = (movimiento) => {
  return (
    Number(movimiento.abonoCapital || 0) +
    Number(movimiento.abonoIntereses || 0) +
    Number(movimiento.abonoFees || 0)
  )
}

const calcularTotalAbono = (movimiento) => {
  return formatearMonto(getTotalAbonoValue(movimiento))
}

const calcularSaldoCapital = (movimiento) => {
  const abonoCapital = Number(movimiento.abonoCapital || 0)
  const pago = Number(getPago(movimiento) || 0)

  if (movimiento.AbonoUsuario != null) {
    const AbonoUsuario = Number(movimiento.AbonoUsuario || 0)
    return pago - AbonoUsuario
  }
  return pago - abonoCapital
}

const calcularSaldoTotal = (movimiento) => {
  const pago = Number(getPago(movimiento) || 0)
  const abonoCapital = Number(movimiento.abonoCapital || 0)
  
  if (movimiento.AbonoUsuario != null) {
    const AbonoUsuario = Number(movimiento.AbonoUsuario || 0)
    const resultado = pago - AbonoUsuario
    return resultado - abonoCapital
  }
  return pago - abonoCapital
}

// ============================================
// FUNCIONES DE VALIDACIÓN
// ============================================
const validarAbonoCapital = (movimiento) => {
  const pago = Number(getPago(movimiento) || 0)
  const abonoCapital = Number(movimiento.abonoCapital || 0)

  if (abonoCapital > pago) {
    return {
      error: true,
      mensaje: 'El abono capital no puede ser mayor al pago'
    }
  }
  return { error: false, mensaje: '' }
}

const validarAbonoIntereses = (movimiento) => {
  const pago = Number(getPago(movimiento) || 0)
  const abonoIntereses = Number(movimiento.abonoIntereses || 0)

  if (abonoIntereses > pago) {
    return {
      error: true,
      mensaje: 'El abono de intereses no puede ser mayor que el valor original de la factura'
    }
  }
  return { error: false, mensaje: '' }
}

const puedeEditar = (movimiento) => {
  return calcularSaldoCapital(movimiento) !== 0
}

const puedeActualizar = (movimiento) => {
  if (movimiento.cargando) return false
  
  const validacionCapital = validarAbonoCapital(movimiento)
  const validacionIntereses = validarAbonoIntereses(movimiento)
  
  return !validacionCapital.error && !validacionIntereses.error
}

// ============================================
// OPERACIONES CON LA API
// ============================================
const obtenerMovimientos = async () => {
  try {
    const response = await axios.get('/api/listar/enlace/movimientos')
    const data = response.data   

    movimientos.value = data.map((mov) => ({
      ...mov,
      editando: false,
      nuevoMonto: mov.MontoMasIntereses != null ? mov.MontoMasIntereses : mov.Monto,
      interesCorriente: 0,
      interesMora: 0,
      abonoCapital: 0,
      abonoIntereses: 0,
      abonoFees: 0,
      cobroFees: 0,
      cargando: false,
    }))
  } catch (error) {
    console.error('Error al obtener movimientos:', error)
    errorMessage.value = 'Error al cargar los movimientos. Por favor, intenta de nuevo.'
  }
}

const iniciarEdicion = (movimiento) => {
  if (!puedeEditar(movimiento)) return

  movimiento.editando = true
  movimiento.nuevoMonto = getPago(movimiento)
  errorMessage.value = ''
  
  movimiento.interesCorriente = movimiento.interesCorriente ?? 0
  movimiento.interesMora = movimiento.interesMora ?? 0
  movimiento.abonoCapital = movimiento.abonoCapital ?? 0
  movimiento.abonoIntereses = movimiento.abonoIntereses ?? 0
  movimiento.abonoFees = movimiento.abonoFees ?? 0
  movimiento.cobroFees = movimiento.cobroFees ?? 0
}

const cancelarEdicion = (movimiento) => {
  movimiento.editando = false
  movimiento.nuevoMonto = getPago(movimiento)
  errorMessage.value = ''
}

const actualizarMonto = async (movimiento) => {
  // Validar antes de enviar
  const validacionCapital = validarAbonoCapital(movimiento)
  const validacionIntereses = validarAbonoIntereses(movimiento)

  if (validacionCapital.error) {
    errorMessage.value = validacionCapital.mensaje
    return
  }

  if (validacionIntereses.error) {
    errorMessage.value = validacionIntereses.mensaje
    return
  }

  try {
    movimiento.cargando = true
    errorMessage.value = ''

    const payload = {
      ...MOVIMIENTO_INFO,
      identificadorTendero: movimiento.Cedula_Usuario,
      monto: movimiento.abonoCapital,
      nroFacturaAlpina: movimiento.NroFacturaAlpina,
      IdMovimiento: movimiento.IdMovimiento
    }

    await axios.post('/api/movimientos', payload)
    await axios.put(`/api/actualizarAbono/${movimiento.IdMovimiento}`, { 
      nuevoMonto: movimiento.abonoCapital 
    })

    console.log('Movimiento actualizado correctamente')
    window.location.reload()
  } catch (error) {
    console.error('Error al actualizar monto:', error)
    errorMessage.value = 'Error al actualizar el movimiento. Por favor, intenta de nuevo.'
  } finally {
    movimiento.cargando = false
  }
}

// ============================================
// LIFECYCLE
// ============================================
onMounted(obtenerMovimientos)
</script>

<style scoped>
p {
  padding: 2px
}

.titulo {
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
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
  position: relative;
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

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

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

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-mensaje {
  background-color: #fee;
  color: #c00;
  padding: 0.5rem;
  margin: 0.5rem 0;
  border-radius: 4px;
  font-size: 0.9rem;
  border-left: 3px solid #c00;
}

.no-edit-note {
  font-size: 0.85rem;
  color: #666;
  font-style: italic;
}
</style>