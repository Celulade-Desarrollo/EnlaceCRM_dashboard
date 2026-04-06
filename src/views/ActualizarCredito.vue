<template>
  <HeadingEnlace />
 <div class="movimientos-container">
    <!-- Componente de error global -->
    <Errormsj v-if="errorMessage" :message="errorMessage" @close="errorMessage = ''" />

    <div class="descarga-container">
      <button class="btn-descargar-abonos" @click="downloadAbonosExcel">
        <img src="/descargar.png" alt="Descargar" class="icon-btn" />
        Descargar Abonos
      </button>
    </div>

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
          <strong>Saldo capital + intereses:</strong>
          ${{ formatearMonto(getSaldoCapitalIntereses(movimiento)) }}
        </p>
  
         <p>
          <strong>Saldo capital:</strong>
          ${{ formatearMonto(calcularSaldoCapital(movimiento)) }}
        </p>
        
        <p class="bg-green-200">
          <strong>Abono capital:</strong>
          <template v-if="movimiento.editando">
            <input 
              type="text"
              :value="movimiento.abonoCapital"
              @input="onAbonoCapitalInput($event, movimiento)"
              inputmode="decimal"
              placeholder="Ej: 1.000,50"
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
        

        <p class="bg-yellow-200">
          <strong>Valor intereses:</strong>
          <template v-if="movimiento.editando">
            <input 
              type="number" 
              v-model.number="movimiento.Intereses" 
              class="monto-input"
            >
          </template>
          <template v-else>
            ${{ formatearMonto(movimiento.Intereses) }}
          </template>
        </p>
        
        <!-- Error específico de abono intereses -->
        <div v-if="movimiento.editando && validarAbonoIntereses(movimiento).error" class="error-mensaje">
          {{ validarAbonoIntereses(movimiento).mensaje }}
        </div>
        
        

         <p class="bg-yellow-200">
          <strong>Valor seguros:</strong>
          <template v-if="movimiento.editando">
            <input 
              type="number" 
              v-model.number="movimiento.Fees" 
              class="monto-input"
            >
          </template>
          <template v-else>
            ${{ formatearMonto(movimiento.Fees) }}
          </template>
        </p>

        <p><strong>Descripción:</strong> {{ movimiento.Descripcion }}</p>
        <p><strong>Fecha de pago programado:</strong> {{ formatearFecha(movimiento.FechaPagoProgramado) }}</p>
        
        <div class="botones">
          <template v-if="movimiento.editando">
            <button 
              @click="actualizarMonto(movimiento)" 
              :disabled="!puedeActualizar(movimiento) || !isValidDecimalNumber(movimiento.abonoCapital)"
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
              class="bg-[#5A44D1] text-white p-2 pl-4 pr-4 rounded-xl"
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
import HeadingEnlace from '../components/UI/headingEnlace.vue'
import * as XLSX from "xlsx";

// ESTADO
const movimientos = ref([])
const errorMessage = ref('')

// CONSTANTES
const MOVIMIENTO_INFO = {
  identificadorTendero: 0,
  monto: 0,
  tipoMovimiento: 2,
  descripcion: "pago de credito",
  fechaPagoProgramado: "",
  idMedioPago: 2,
  telefonoTransportista: ""
}

// FUNCIONES DE FORMATO
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

// FUNCIONES DE CÁLCULO
const getPago = (movimiento) => {
  return movimiento?.Monto || 0
}

const getSaldoCapitalIntereses = (movimiento) => {
  if (!movimiento) return 0
  return movimiento.MontoMasIntereses || 0
}

const getTotalAbonoValue = (movimiento) => {
  return (
    Number(movimiento.abonoCapital || 0) +
    Number(movimiento.abonoIntereses || 0) +
    Number(movimiento.abonoFees || 0)
  )
}


const calcularSaldoCapital = (movimiento) => {
  const abonoCapital = limpiarNumero(movimiento.abonoCapital)
  const pago = Number(getPago(movimiento) || 0)

  if (movimiento.AbonoUsuario != null) {
    const AbonoUsuario = Number(movimiento.AbonoUsuario || 0)
    return pago - AbonoUsuario - abonoCapital
  }
  return pago - abonoCapital
};

const sanearNumeroDecimal = (valor) => {
  if (!valor) return ''

  let limpio = valor.toString()

  // Permitir solo números y separadores
  limpio = limpio.replace(/[^0-9.,]/g, '')

  // Si hay comas, usamos la última como decimal
  const partes = limpio.split(',')

  if (partes.length > 2) {
    limpio = partes[0] + ',' + partes.slice(1).join('')
  }

  // Evitar múltiples puntos seguidos
  limpio = limpio.replace(/\.+/g, '.')

  return limpio
}

const isValidDecimalNumber = (valor) => {
  if (!valor) return true

  const normalizado = valor
    .toString()
    .replace(/\./g, '') // quita miles
    .replace(',', '.')  // decimal real

  return /^\d+(\.\d{1,2})?$/.test(normalizado)
};

const calcularSaldoDisponible = (movimiento) => {
  const pago = Number(getPago(movimiento) || 0)
  const AbonoUsuario = Number(movimiento.AbonoUsuario || 0)
  return pago - AbonoUsuario
}

const validarAbonoCapital = (movimiento) => {
  const abonoCapitalRaw = movimiento.abonoCapital || ''

  if (!isValidDecimalNumber(abonoCapitalRaw)) {
    return {
      error: true,
      mensaje: 'Abono capital debe ser número válido, opcional 2 decimales'
    }
  }

  const abonoCapital = limpiarNumero(abonoCapitalRaw)
  const saldoDisponible = calcularSaldoDisponible(movimiento)

  if (abonoCapital > saldoDisponible) {
    return {
      error: true,
      mensaje: 'El abono capital no puede ser mayor al saldo capital restante'
    }
  }

  if (abonoCapital < 0) {
    return {
      error: true,
      mensaje: 'El abono capital no puede ser negativo'
    }
  }

  return { error: false, mensaje: '' }
}

const onAbonoCapitalInput = (event, movimiento) => {
  let valor = event.target.value

  valor = sanearNumeroDecimal(valor)

  movimiento.abonoCapital = valor
};

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

const token = localStorage.getItem("admin_token")

const downloadAbonosExcel = async () => {
  try {
    const response = await axios.get("api/bajarAbonos", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })

    const data = response.data
    const dataArray = Array.isArray(data) ? data : [data]
    const dataTransformada = dataArray.map((row) => ({ ...row }))

    const worksheet = XLSX.utils.json_to_sheet(dataTransformada)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Abonos")

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" })
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    })

    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", "abonos.xlsx")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error("Error al descargar Abonos:", error)
    alert("No se pudo descargar el archivo de abonos")
  }
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
      SaldoCapital: 0,
      InteresMora: 0,
      abonoCapital: 0,
      Intereses: 0,
      Fees: 0,
      cargando: false,
    }))
    console.log("data",data.value)
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
  
  movimiento.Intereses = movimiento.Intereses ?? 0
  movimiento.interesesMora = movimiento.interesesMora ?? 0
  movimiento.abonoCapital = movimiento.abonoCapital ?? 0
  movimiento.abonoIntereses = movimiento.abonoIntereses ?? 0
  movimiento.abonoFees = movimiento.abonoFees ?? 0
  movimiento.Fees = movimiento.Fees ?? 0

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

    const abonoCapitalLimpio = limpiarNumero(movimiento.abonoCapital)
    const interesesLimpios = limpiarNumero(movimiento.Intereses)
    const feesLimpios = limpiarNumero(movimiento.Fees)

    const payload = {
      ...MOVIMIENTO_INFO,
      identificadorTendero: movimiento.Cedula_Usuario,
      monto: abonoCapitalLimpio,
      nroFacturaAlpina: movimiento.NroFacturaAlpina,
      IdMovimiento: movimiento.IdMovimiento,
      Intereses: interesesLimpios,
      InteresesMora: limpiarNumero(movimiento.interesMora),
      Fees: feesLimpios
    }

    await axios.post('/api/movimientos', payload)
    await axios.put(`/api/actualizarAbono/${movimiento.IdMovimiento}`, { 
      nuevoMonto: abonoCapitalLimpio,
      Intereses: interesesLimpios,
      Fees: feesLimpios 
    })


    window.location.reload()
  } catch (error) {
    errorMessage.value = 'Error al actualizar el movimiento. Por favor, intenta de nuevo.'
  } finally {
    movimiento.cargando = false
  }
}

const limpiarNumero = (valor) => {
  if (!valor) return 0

  return Number(
    valor
      .toString()
      .replace(/\./g, '')
      .replace(',', '.')
  )
};

onMounted(obtenerMovimientos)
</script>

<style scoped>
p {
  padding: 2px;
}

.titulo {
  font-size: clamp(1.2rem, 2vw, 1.5rem);
  font-weight: bold;
  color: white;
  margin-bottom: 10px;
}

.logout {
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
}

.boton-logout {
  padding: 10px 30px;
  font-size: clamp(0.9rem, 1vw, 1rem);
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  background: #dd3590;
  color: #fff;
  outline: none;
  border: none;
  transition: background 0.3s;
}

.boton-logout:hover {
  background-color: #f15bab;
}

.logo-container {
  text-align: center;
  margin-block: 1.5rem;
}

.logo-main {
  width: clamp(120px, 30%, 180px);
  height: auto;
  display: inline-block;
}


.movimientos-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
  padding: 1rem;
  max-width: 500px;
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

.descarga-container {
  grid-column: 1 / -1;
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.btn-descargar-abonos {
  background-color: #5A44D1;
  color: white;
  font-size: 1rem;
  padding: 12px 24px;
  border: none;
  border-radius: 29px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: 0.3s ease;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.btn-descargar-abonos:hover {
  background-color: #5A44D1;
  transform: translateY(-2px);
}

.icon-btn {
  width: 20px;
  height: 20px;
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

.card-body p {
  margin: 0.5rem 0;
  font-size: clamp(0.8rem, 1vw, 0.95rem);
}

strong {
  color: #2c3e50;
}

.botones {
  margin-top: 1rem;
  display: flex;
  flex-wrap: wrap;
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
  font-size: clamp(0.8rem, 1vw, 0.9rem);
  border-left: 3px solid #c00;
}

.no-edit-note {
  font-size: clamp(0.75rem, 1vw, 0.85rem);
  color: #666;
  font-style: italic;
}


@media (max-width: 500px) {
  .titulo { text-align: center; }
  .logout { justify-content: center; margin-top: 0.5rem; }
  .botones { justify-content: center; }
  .movimientos-container { padding: 0.5rem; gap: 0.5rem; }
}
</style>
