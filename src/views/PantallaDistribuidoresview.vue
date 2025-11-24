<script setup>
import { onMounted, ref, computed } from 'vue'
import { motion } from 'motion-v'
import axios from 'axios'

const movimientosEnlace = ref([])
const ruta = ref("asv545")

// Computed para calcular el total de Monto
const totalRecaudo = computed(() => {
  return movimientosEnlace.value.reduce((acc, mov) => acc + (mov.Monto || 0), 0)
})

onMounted(async () => {
  try {
    const response = await axios.get('api/listar/enlace/movimientos')
    movimientosEnlace.value = response.data
    console.log("movimientosEnlace", movimientosEnlace.value)
  } catch (error) {
    console.error("Error al cargar movimientos:", error)
  }
})
</script>

<template>
  <motion.div v-bind="fadeInUp">
    <section class="logo-container">
      <img src="/public/enlaceFiado.png" alt="logo Enlace CRM" class="logo-main" />
    </section>
    <p class="titulo">Hola, Distribuidor</p>

    <section class="content">
      Total recaudo del día: <input type="date" /> ${{ totalRecaudo }}
    </section>
    <section>
      <div style="display: flex; justify-content: space-between; font-weight: bold;">
        <span>Ruta</span>
        <span>Recaudo</span>
      </div>
      <div style="display: flex; justify-content: space-between;">
        <span>{{ ruta }}</span>
        <span>${{ totalRecaudo }}</span>
      </div>
    </section>
  </motion.div>
</template>

<style scoped>
.logo-container {
  text-align: center;
  margin-block: 1.5rem;
}
.titulo {
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
  margin-bottom: 10px;
}
.logo-main {
  width: min(180px, 80%);
  height: auto;
  display: inline;
}
.content {
  margin: 1rem 0;
  color: white;
}
</style>