<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import Heading from "../components/UI/Heading.vue";
import { fadeInUp } from "../motion/pageAnimation";
import { motion } from "motion-v";
import CreditBancoCard from "../components/UI/CreditBancoCard.vue";
import axios from "axios";

const creditDataRecords = ref([])
const router = useRouter();

onMounted(async () => {
  try {
    const response = await axios.get('http://localhost:8080/api/flujoRegistroEnlace/estado/pendiente')
    creditDataRecords.value = response.data
  } catch (error) {
    console.error('Error cargando datos:', error)
  }
})

const handleCardAprobado = (data) => {
  console.log("Card APROBADA:", data.cedula);
  console.log("Datos de inputs de la card:", data);
};

const handleCardNoAprobado = (cedula) => {
  console.log("Card NO APROBADA para Cédula:", cedula);
};


</script>

<template>
  <motion.div v-bind="fadeInUp">
    <section class="logo-container">
      <img
        src="/public/enlaceFiado.png"
        alt="logo Enlace CRM"
        class="logo-main"
      />
    </section>

    <Heading
      :mensaje=" 'Hola, Administrador'"
    />

    <div class="descargar-container">
      <button @click="handleDescargarTodo" class="boton">
        Descargar Excel
      </button>
    </div>

    <section class="content">
      <CreditBancoCard
         v-for="record in creditDataRecords"
        :key="record.Cedula_Cliente"
        :data="record"
        @aprobado="handleCardAprobado"
        @noAprobado="handleCardNoAprobado"
      />
    </section>
  </motion.div>
</template>

<style scoped>
.logo-container {
  text-align: center;
  margin-block: 1.5rem;
}

.logo-main {
  width: min(180px, 80%);
  height: auto;
  display: inline;
}

.content {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  align-items: center;
}

.descargar-container {
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.boton {
  background-color: #dd3590;
  color: white;
  padding: 12px 50px;
  border: none;
  border-radius: 20px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
  outline: none;
  box-shadow: none;
}

.boton:hover {
  background-color: #f15bab;
}
</style>
