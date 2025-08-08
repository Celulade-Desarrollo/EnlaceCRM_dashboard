<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import Heading from "../components/UI/Heading.vue";
import axios from "axios";
const router = useRouter();
import { fadeInUp } from "../motion/pageAnimation";
import { motion } from "motion-v";
import CardAbonoCupos from "../components/UI/CardAbonoCupos.vue";

const estadoCuenta = ref({
  CupoFinal: '',
  CupoDisponible: '',
  FechaPagoProgramado: '',
  deudaTotal: ''
});

const datosCuenta = JSON.parse(localStorage.getItem("datosCuenta")) || {};
onMounted(async () => {
  const IdUsuario = localStorage.getItem("idUsuario");
  // Obtener el token del localStorage
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(
      `/api/user/estado-cuenta/${IdUsuario}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    estadoCuenta.value = response.data;

    const cupoFinal = parseInt(estadoCuenta.value.CupoFinal.replace(/\./g, ''));
    const cupoDisponible = parseInt(estadoCuenta.value.CupoDisponible);
    const deuda = cupoFinal - cupoDisponible;
    estadoCuenta.value.deudaTotal = deuda;

    console.log("deudatotal",estadoCuenta.value);
  } catch (error) {
    console.error("Error al obtener el estado de cuenta:", error);
  }

  const tipo = localStorage.getItem("tipo");
  const idUsuario = localStorage.getItem("idUsuario");

  console.log("localStorage token:", token);
  console.log("localStorage tipo:", tipo);
  console.log("idUsuario",idUsuario);
  console.log("datosCuenta", datosCuenta);
  // Establece fondo morado al cargar esta pantalla
  document.body.style.backgroundColor = "#2e008b";

  // const data = localStorage.getItem("data");
  // if (data) {
  //   try {
  //     dataInfoapp.value = JSON.parse(data);
  //   } catch (e) {
  //     console.error("Error al parsear data desde localStorage:", e);
  //   }
  // }
});

const goToPantallaAbonar = () => {
  router.push("/PantallaAbonoView");
};

const goToPantallaFacturasDisponibles = () => {
   router.push("/PantallaFacturasView");
};

const goToPantalla5 = () => {
  router.push("/Pantalla5View");
};
</script>

<template>
  <Heading :mensaje="'Hola, ' + datosCuenta.Nombres" />

  <motion.div v-bind="fadeInUp">
    <section class="content">
      <CardAbonoCupos
        :cupoTotal="estadoCuenta.CupoFinal"
        :cupoDisp="estadoCuenta.CupoDisponible"
        :fechaAbono="estadoCuenta.FechaPagoProgramado"
        :deudaTotal="estadoCuenta.deudaTotal"
        @abonar="goToPantallaAbonar"
        @movimientos="goToPantalla5"
      />
     
      <!-- Tarjeta de proveedor -->
      <div class="card">
        <div class="provider-content">
          <img src="/Alpina.png" alt="Alpina" class="alpina-img" />
          <div class="text-center">
            <button class="button" @click="goToPantallaFacturasDisponibles" id="Pantalla2">
              Pagar
            </button>
          </div>
        </div>
        </div>
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
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  align-items: center;
  background-color: rgb(255, 255, 255);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 800px;
  min-height: 450px;
  min-height: 100px;
  margin: 2rem auto;
  top: -30px;
  border-radius: 0;
  position: relative;
  transition: top 0.3s ease;
}

.card {
  background: #fff;
  padding: 1.5rem;
  max-width: 700px;
  min-height: 100px;
  width: 100%;
  text-align: left;
  border-radius: 0;
}

.card-header {
  background-color: #251886;
  color: white;
  padding: 0.75rem;
  text-align: center;
  margin-bottom: 1rem;
  border: none;
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
