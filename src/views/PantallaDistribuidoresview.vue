<script setup>
import { onMounted, ref, computed } from 'vue'
import { motion } from 'motion-v'
import axios from 'axios'

const movimientosEnlace = ref([])
const ruta = ref("asv545")
const fechaSeleccionada = ref(new Date().toISOString().substr(0, 10)) // yyyy-mm-dd

// Computed para calcular el total de Monto
const totalRecaudo = computed(() => {
  return movimientosEnlace.value.reduce((acc, mov) => acc + (mov.Monto || 0), 0)
})

onMounted(async () => {
  try {
    const response = await axios.get('api/listar/enlace/movimientos')
    movimientosEnlace.value = response.data
  } catch (error) {
    console.error("Error al cargar movimientos:", error)
  }
})
</script>

<template>
  <motion.div class="pantalla">

    <!-- LOGO -->
    <section class="logo-container">
      <img src="/public/enlaceFiado.png" alt="logo Enlace CRM" class="logo-main" />
    </section>

    <!-- CARD -->
    <div class="card">
      <section class="total-recaudo">
        <span class="label">Total recaudo del día:</span>
        <input type="date" v-model="fechaSeleccionada" />
        <span class="monto-total">${{ totalRecaudo }}</span>
      </section>

      <section class="tabla">
        <div class="titulosTabla">
          <span>Factura</span>
          <span>Teléfono Transportista</span>
          <span>Monto</span>
        </div>

        <div
          v-for="mov in movimientosEnlace"
          :key="mov.IdMovimiento"
          class="fila"
        >
          <span>{{ mov.NroFacturaAlpina }}</span>
          <span>{{ mov.TelefonoTransportista }}</span>
          <span>${{ mov.Monto }}</span>
        </div>
      </section>
    </div>

  </motion.div>
</template>

<style scoped>

.total-recaudo {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  margin-bottom: 2rem;
}

.label {
  color: #0043ce;
  font-weight: 600;
}

.recaudo-row {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.monto-total {
  font-size: 1.7rem;
  font-weight: bold;
  color: #0043ce;
}
.pantalla {
  background-color: #1a0f8b;
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 40px;
  font-family: Arial, sans-serif;
}

.logo-container {
  margin-bottom: 30px;
}

.logo-main {
  height: 70px;
  object-fit: contain;
}

.total-recaudo {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  margin-bottom: 2rem;
}

.total-recaudo p {
  color: #0043ce;
  font-weight: 600;
  margin: 0;
}

.monto-total {
  font-size: 1.7rem;
  font-weight: bold;
  color: #0043ce;
}

/* Input */
input[type="date"] {
  border: none;
  border-bottom: 2px solid #0043ce;
  padding: 4px 2px;
  background: transparent;
  color: #0043ce;
  font-size: 1rem;
  outline: none;
  width: 160px;
}

.tabla {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.titulosTabla {
  display: flex; 
  justify-content: space-between; 
  font-weight: bold; 
  color: #0043ce;
  margin-bottom: 0.5rem;
}

.fila {
  display: flex; 
  justify-content: space-between; 
  border-top: 1px solid #9bb1ff;
  padding-top: 0.5rem;
  color: #0043ce;
}

body, html {
  background-color: #1a1a7e !important;
  margin: 0;
  padding: 0;
  height: 100%;
}

* {
  background-color: transparent !important;
}

.card {
  background-color: white !important;
  padding: 50px;
  border-radius: 25px;
  width: 800px;
  margin: 60px auto;
  box-shadow: 0 4px 20px rgba(0,0,0,0.25);
}

.main-container, .container, .wrapper, .fondo, .page {
  background-color: transparent !important;
}
</style>