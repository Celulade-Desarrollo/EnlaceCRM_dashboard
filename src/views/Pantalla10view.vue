<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import Heading from "../components/UI/Heading.vue";
import { fadeInUp } from "../motion/pageAnimation";
import { motion } from "motion-v";
import CreditBancoCard from "../components/UI/CreditBancoCard.vue";

const creditDataRecords = ref([]);
const router = useRouter();

onMounted(() => {
  const storedData = localStorage.getItem("data");
  if (storedData) {
    try {
      const parsedData = JSON.parse(storedData);
      creditDataRecords.value = parsedData.map((item, index) => ({
        id: item.cedula || `default-${index}-${Date.now()}`,
        cedula: item.cedula,
        scoring: item.scoring || "N/A",
        cupo: item.cupo || "N/A",
        nombre: item.nombre || "Usuario",
      }));
    } catch (e) {
      console.error("Error al leer data desde localStorage:", e);
      initializeDefaultData();
    }
  } else {
    initializeDefaultData();
  }
});

function initializeDefaultData() {
  creditDataRecords.value = [
    {
      id: "1000000001",
      cedula: "1000000001",
      scoring: "750",
      cupo: "5,000,000",
      nombre: "Juan Pérez",
    },
    {
      id: "1000000002",
      cedula: "1000000002",
      scoring: "620",
      cupo: "1,500,000",
      nombre: "María López",
    },
    {
      id: "1000000003",
      cedula: "1000000003",
      scoring: "810",
      cupo: "10,000,000",
      nombre: "Carlos Gómez",
    },
  ];
}

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
      :mensaje="creditDataRecords?.[0]?.nombre ? `Hola, ${creditDataRecords[0].nombre}` : 'Hola, Administrador'"
    />

    <div class="descargar-container">
      <button @click="handleDescargarTodo" class="boton">
        Descargar Exel
      </button>
    </div>

    <section class="content">
      <CreditBancoCard
        v-for="record in creditDataRecords"
        :key="record.id"
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
