<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import RouterLink from "../components/UI/Routerlink.vue";
import Heading from "../components/UI/Heading.vue";

// Variables reactivas
const celular = ref('');
const data = ref(null);
const error = ref('');
const dropdownsVisible = ref({
  ruta1: false,
  ruta2: false,
  ruta3: false,
  ruta4: false
});

// Instancia de router
const router = useRouter();
let dataInfoapp = JSON.parse(localStorage.getItem('data'));

// Alterna la visibilidad de los dropdowns
const toggleDropdown = (ruta) => {
  // Cierra todos los dropdowns excepto el seleccionado
  Object.keys(dropdownsVisible.value).forEach(key => {
    dropdownsVisible.value[key] = key === ruta ? !dropdownsVisible.value[key] : false;
  });
};

// Redirecciones
const handlePantalla2Click = () => window.open("/Pantalla2View", "_parent");
const handlePantalla5Click = () => window.open("/Pantalla5View", "_parent");

// Configura eventos en botones al montar
onMounted(() => {
  const Pantalla5Button = document.getElementById('Pantalla5');
  if (Pantalla5Button) {
    Pantalla5Button.addEventListener('click', handlePantalla5Click);
  }
  const Pantalla2Button = document.getElementById('Pantalla2');
  if (Pantalla2Button) {
    Pantalla2Button.addEventListener('click', handlePantalla2Click);
  }
});
</script>

<template>
  <Heading :mensaje="'Hola, ' + dataInfoapp[0].nombre" />
  <section class="banners-container">
    <!-- Banner 1 -->
    <div class="banner">
      <div class="info-banner">
        <div class="banner-header">
          <h2>Total de recaudo del día:</h2>
          <input type="date" class="date-input" />
        </div>
        <p class="deuda-total" id="ruta-total">{{ dataInfoapp[0].saldorestante }}</p>
        <button class="boton" id="Pantalla5">Ver más</button>
      </div>
    </div>

    <div class="separator"></div>

    <!-- Banners de rutas -->
    <template v-for="(ruta, index) in 4" :key="index">
      <div class="banner">
        <div class="info-banner">
          <h2 class="proveedores">Rutas:</h2>
          <div class="dropdown">
            <h1 @click="toggleDropdown(`ruta${index + 1}`)" class="ruta-header">
              Ruta {{ index + 1 }} - $100.00
            </h1>
            <div v-if="dropdownsVisible[`ruta${index + 1}`]" class="dropdown-content">
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
      </div>
    </template>
  </section>
</template>

<style scoped>
body {
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  background-color: #251886;
  margin: 0;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.banners-container {
  display: flex;
  flex-direction: column;
  padding: 1rem;
  gap: 1rem;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}

.banner {
  width: 100%;
  background-color: #f5f5f5;
  border-radius: 12px;
  padding: 1rem;
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
  border: 1px solid #ccc;
  border-radius: 4px;
}

.button {
  padding: 0.5rem 1rem;
  border-radius: 50px;
  background: #dd3590;
  color: #fff;
  margin-top: 1rem;
  cursor: pointer;
  border: none;
  font-size: 1rem;
  width: fit-content;
}
.button:hover {
  background-color: #f15bab;
}

.ruta-header {
  font-size: 1rem;
  font-weight: bold;
  margin-top: 1rem;
  color: #000;
  cursor: pointer;
}

.dropdown-content {
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  padding: 10px;
  margin-top: 10px;
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

.separator {
  width: 100%;
  background-color: #b3b0b0;
  height: 1px;
}

.deuda-total {
  font-weight: bold;
  color: #000;
  margin-top: 1rem;
}
</style>
