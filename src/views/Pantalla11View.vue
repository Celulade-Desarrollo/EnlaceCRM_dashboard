<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import ScoringEnlaceCard from '../components/UI/scoringEnlaceCard.vue';
import Heading from '../components/UI/Heading.vue';
import { useRouter } from "vue-router";
import { motion } from "motion-v";
const clientes = ref([]);

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

</script>

<template>
    <motion.div v-bind="fadeInUp">
  <section class="logo-container">
    <img src="/public/enlaceFiado.png" alt="logo Enlace CRM" class="logo-main" />
    <Heading :mensaje="'Hola, Administrador'" />
  </section>

  <section class="content">
      <ScoringEnlaceCard
        v-for="record in creditDataRecords"
        :key="record.id"
        :data="record"
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

.tarjeta-acciones {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
}
.boton-enviar {
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
.boton-enviar:hover {
  background-color: #f15bab;
}
</style>
