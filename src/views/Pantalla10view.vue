<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import Heading from "../components/UI/Heading.vue";
import { fadeInUp } from "../motion/pageAnimation";
import { motion } from "motion-v";
import CreditBancoCard from "../components/UI/CreditBancoCard.vue"; // Importa el nuevo componente

// Este arreglo contendrá los datos para CADA card que se generará.
// Puedes poblarlo dinámicamente desde una API o localStorage.
const creditDataRecords = ref([]);

// Instancia de Vue Router (se mantiene)
const router = useRouter();

onMounted(() => {
  const storedData = localStorage.getItem("data");
  if (storedData) {
    try {
      const parsedData = JSON.parse(storedData);
      // Asume que 'parsedData' podría contener múltiples registros o uno solo.
      // Si `parsedData` es un array de objetos con `cedula`, `scoring`, `cupo`, etc.:
      creditDataRecords.value = parsedData.map((item, index) => ({
        id: item.cedula || `default-${index}-${Date.now()}`, // Usa cedula como ID si es única, sino un índice único
        cedula: item.cedula,
        scoring: item.scoring || "N/A", // Asegúrate de que tus datos tengan 'scoring' y 'cupo'
        cupo: item.cupo || "N/A",
        nombre: item.nombre || "Usuario",
      }));
    } catch (e) {
      console.error("Error al leer data desde localStorage:", e);
      // Si hay un error o localStorage está vacío, inicializa con datos por defecto
      initializeDefaultData();
    }
  } else {
    // Si no hay datos en localStorage, inicializa con algunos datos de ejemplo
    initializeDefaultData();
  }
});

// Función para inicializar datos
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
    // Puedes añadir más objetos aquí para ver más cards al inicio
  ];
  console.log("Datos inicializados por defecto:", creditDataRecords.value);
}

// NUEVA FUNCIÓN: Para simular la llegada de un nuevo registro
const addRandomCreditRecord = () => {
  const newId = `new-${Date.now()}`; // ID único basado en el tiempo
  const randomScoring = Math.floor(Math.random() * (900 - 300 + 1)) + 300;
  const randomCupo = Math.floor(Math.random() * (10000 - 100 + 1)) * 1000; // Cupo en miles
  const randomNameIndex = Math.floor(Math.random() * 5);
  const randomNames = ["Ana", "Luis", "Sofía", "Pedro", "Elena"];

  const newRecord = {
    id: newId,
    cedula: `CED-${Math.floor(Math.random() * 1000000000)}`, // Cédula aleatoria
    scoring: String(randomScoring),
    cupo: `$${randomCupo.toLocaleString('es-CO')}`, // Formato de moneda
    nombre: randomNames[randomNameIndex],
  };

  creditDataRecords.value.push(newRecord);
  console.log("Nuevo registro añadido:", newRecord);
};


// Estos métodos manejarán los eventos que cada CreditInfoCard emita
const handleCardAprobado = (data) => {
  console.log("Card APROBADA:", data.cedula);
  console.log("Datos de inputs de la card:", data);
  // Aquí puedes enviar estos datos a tu backend, actualizar el estado global, etc.
};

const handleCardNoAprobado = (cedula) => {
  console.log("Card NO APROBADA para Cédula:", cedula);
  // Lógica para manejar el "No Aprobado" para esa cédula
};

const handleCardDescargar = (cedula) => {
  console.log("Descargar para Cédula:", cedula);
  // Lógica para la descarga para esa cédula
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
      :mensaje="
        'Hola, ' +
        (creditDataRecords && creditDataRecords.length > 0 && creditDataRecords[0].nombre
          ? creditDataRecords[0].nombre
          : 'Administrador')
      "
    />

    <section class="content">
      <!-- <button @click="addRandomCreditRecord" class="btn-add-card">
        + Agregar Nueva Card
      </button> -->

      <CreditBancoCard
        v-for="record in creditDataRecords"
        :key="record.id"
        :data="record"
        @aprobado="handleCardAprobado"
        @noAprobado="handleCardNoAprobado"
        @descargar="handleCardDescargar"
      />

      <p v-if="errorMessage" id="error-email" class="text-danger mt-1">
        {{ errorMessage }}
      </p>
    </section>
  </motion.div>
</template>

<style scoped>
/* Estilos existentes */
.logo-container {
  text-align: center;
  margin-top: 1rem;
}

.content {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem; /* Espacio entre las cards generadas dinámicamente */
  align-items: center;
}

.text-danger {
  color: red;
  margin-top: 5px;
}

input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Nuevo estilo para el botón de agregar card */
.btn-add-card {
  background-color: #28a745; /* Color verde */
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  margin-bottom: 2rem; /* Espacio debajo del botón */
  transition: background-color 0.3s ease;
}

.btn-add-card:hover {
  background-color: #218838; /* Verde más oscuro al pasar el ratón */
}
</style>