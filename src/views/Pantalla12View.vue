<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import RouterLink from "../components/UI/Routerlink.vue";
import Heading from "../components/UI/Heading.vue";
import { fadeInUp } from "../motion/pageAnimation";
import { motion } from "motion-v";

const celular = ref("");
const data = ref(null);
const error = ref("");
const dropdownsVisible = ref({
  ruta1: false,
  ruta2: false,
  ruta3: false,
  ruta4: false,
});

const router = useRouter();
let dataInfoapp = JSON.parse(localStorage.getItem("data"));

const toggleDropdown = (ruta) => {
  Object.keys(dropdownsVisible.value).forEach((key) => {
    dropdownsVisible.value[key] =
      key === ruta ? !dropdownsVisible.value[key] : false;
  });
};

const handlePantalla2Click = () => window.open("/Pantalla2View", "_parent");
const handlePantalla5Click = () => window.open("/Pantalla5View", "_parent");

onMounted(() => {
  const Pantalla5Button = document.getElementById("Pantalla5");
  if (Pantalla5Button) {
    Pantalla5Button.addEventListener("click", handlePantalla5Click);
  }
  const Pantalla2Button = document.getElementById("Pantalla2");
  if (Pantalla2Button) {
    Pantalla2Button.addEventListener("click", handlePantalla2Click);
  }
});
</script>

<template>
  <motion.div v-bind="fadeInUp">


    <Heading :mensaje="'Hola, ' + dataInfoapp[0].nombre" :showBackButton="true" />

    <section class="banners-container">
      <!-- Banner principal -->
      <div class="banner">
        <div class="info-banner">
          <div class="banner-header">
            <h2>Total de recaudo del día:</h2>
            <input type="date" class="date-input" />
          </div>
          <p class="deuda-total" id="ruta-total">
            {{ dataInfoapp[0].saldorestante }}
          </p>
          <div class="boton-container-inside">
            <button class="boton" id="Pantalla5">Ver más</button>
          </div>
        </div>
      </div>

      <!-- Banners de rutas -->
      <template v-for="(ruta, index) in 4" :key="index">
        <div class="banner">
          <div class="info-banner">
            <h2 class="proveedores">Rutas:</h2>
            <h1 class="ruta-header" @click="toggleDropdown(`ruta${index + 1}`)">
              Ruta {{ index + 1 }} - $100.00
              <span class="ver-aqui">Detalle</span>
            </h1>
            <div
              v-if="dropdownsVisible[`ruta${index + 1}`]"
              class="dropdown-content"
            >
              <div class="dropdown-row">
                <div class="column">Número de Factura</div>
                <div class="column">Monto de la Factura</div>
              </div>
              <div class="dropdown-row">
                <div class="column">FE{{ 1000 + index * 1234 }}</div>
                <div class="column">$100.00</div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </section>
  </motion.div>
</template>

<style scoped>
.banners-container {
  display: flex;
  flex-direction: column;
  padding: 1rem;
  gap: 1rem;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  width: 430px;
  height: 300px;
}

.banner {
  width: 100%;
  background-color: #f5f5f5;
  border-radius: 0px;
  padding: 1rem;
}

.logo-container {
  text-align: center;
  margin-top: 1rem;
}

.logo-main {
  width: 200px;
  height: auto;
  display: inline-block;
}

.banner-header {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

@media (min-width: 600px) {
  .banner-header {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
}

.date-input {
  max-width: 150px;
  padding: 6px;
  border: 1px solid #251886;
  border-radius: 6px;
}

.boton-container-inside {
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
}

.boton {
  padding: 0.5rem 1rem;
  border-radius: 25px;
  background: #dd3590;
  color: #fff;
  cursor: pointer;
  border: none;
  font-size: 1rem;
  width: fit-content;
  min-width: 200px;
  outline: none;
}

.boton:hover {
  background-color: #f15bab;
}

.ruta-header {
  font-size: 1rem;
  font-weight: bold;
  margin-top: 1rem;
  color: #000;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.ver-aqui {
  color: #dd3590;
  font-weight: bold;
  margin-left: 1rem;
  text-decoration: underline;
  text-decoration-color: blue; /* línea subrayada azul */
  cursor: pointer;
  font-size: 1.1rem;
}

.dropdown-content {
  background-color: #251886;
  color: #fff;
  padding: 10px;
  margin-top: 10px;
  border-radius: 10px;
}

.dropdown-row {
  display: flex;
  justify-content: space-between;
}

.column {
  flex: 1;
  padding: 5px;
  font-weight: bold;
}

.proveedores {
  background-color: #251886;
  color: #fff;
  border-radius: 25px;
  width: 100px;
  height: 30px;
  text-align: center;
  padding-top: 5px;
}

.deuda-total {
  font-weight: bold;
  color: #000;
  margin-top: 1rem;
}
</style>
