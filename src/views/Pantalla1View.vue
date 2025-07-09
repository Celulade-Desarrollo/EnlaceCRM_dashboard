<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import Heading from "../components/UI/Heading.vue";
const router = useRouter();
const dataInfoapp = ref([
  { nombre: "Juan", saldorestante: "$0", saldoabonado: "$0" },
]);
import { fadeInUp } from "../motion/pageAnimation";
import { motion } from "motion-v";
import CardAbonoCupos from "../components/UI/CardAbonoCupos.vue";

onMounted(() => {
  // Establece fondo morado al cargar esta pantalla
  document.body.style.backgroundColor = "#2e008b";

  const data = localStorage.getItem("data");
  if (data) {
    try {
      dataInfoapp.value = JSON.parse(data);
    } catch (e) {
      console.error("Error al parsear data desde localStorage:", e);
    }
  }
});

const goToPantalla2 = () => {
  router.push("/Pantalla2View");
};

const goToPantallaFacturasDisponibles = () => {
   router.push("/PantallaFacturasView");
};

const goToPantalla5 = () => {
  router.push("/Pantalla5View");
};
</script>

<template>
  <section class="logo-container">
    <img
      src="/public/enlaceFiado.png"
      alt="logo Enlace CRM"
      class="logo-main"
    />
  </section>
  <!-- Encabezado -->
  <Heading :mensaje="'Hola, ' + dataInfoapp[0].nombre" />

  <motion.div v-bind="fadeInUp">
    <section class="content">
      <CardAbonoCupos :cupoTotal="`200.000`" :cupoDisp="`200.000`" :fechaAbono="`10 AGO`" :deudaTotal="`200.000`" @abonar="goToPantalla5"/>   
    </section>
  </motion.div>
</template>

<style scoped>
.logo-container {
  text-align: center;
  margin-top: 1rem;
}

.logo-main {
  width: 200px;
  height: auto;
  display: inline-block;
}

.icon-left,
.icon-right {
  font-size: 1.2rem;
}

.icon-circle {
  background-color: white;
  color: #2b008b;
  padding: 0.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.content {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  align-items: center;
}

.card {
  background: #fff;
  border-radius: 15px;
  padding: 1.5rem;
  max-width: 500px;
  width: 100%;
  text-align: left;
}

.card-header {
  background-color: #251886;
  color: white;
  padding: 0.75rem;
  border-radius: 10px;
  text-align: center;
  margin-bottom: 1rem;
}

.bold {
  font-weight: bold;
}
.button {
  background-color: #dd3590;
  color: white;
  border: none;
  padding: 10px 24px;
  border-radius: 25px;
  font-weight: bold;
  margin-top: 1rem;
  cursor: pointer;
  width: 200px;
  margin-left: auto;
  display: block;
  text-align: center;
}

.button:hover {
  background-color: #f15bab;
}
button:focus {
  outline: none;
  box-shadow: none;
}
.provider-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.alpina-img {
  width: 140px;
  height: auto;
}

.text-center {
  text-align: center;
}

@media (max-width: 600px) {
  .provider-content {
    flex-direction: column;
  }
}
</style>
