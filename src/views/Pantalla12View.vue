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
  <header class="header">
    <div class="header-icons">
      <span class="icon-left"><i class="fas fa-user"></i></span>
      <span class="icon-right"><i class="fas fa-question-circle"></i></span>
    </div>
    <div class="header-text">
      <p>Hola, {{ dataInfoapp[0].nombre }}</p>
    </div>
  </header>

  <section class="container banners">
    <div class="row">
      <!-- Banner 1 -->
      <div class="col-md-4 banner1">
        <div class="info-banner">
          <div class="d-flex align-items-center justify-content-between">
            <h2 class="text-black mt-4">Total de recaudo del día:</h2>
            <input type="date" class="form-control ml-3" style="max-width: 150px;">
          </div>
          <p class="deuda-total mb-2 text-black" id="ruta-total">{{ dataInfoapp[0].saldorestante }}</p>
          <div class="button-banner">
            <button class="btn btn-primary mt-2 btn-size" id="Pantalla5">Ver más</button>
          </div>
        </div>
      </div>

      <div class="separator"></div>

      <!-- Dropdown banners -->
      <template v-for="(ruta, index) in 4" :key="index">
        <div class="col-md-4 mb-4 banner2">
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
    </div>
  </section>
</template>

<style scoped>
body {
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  background-color: white;
}

.form-group input {
  background-color: transparent;
  border: none;
  border-bottom: 1px solid rgba(17, 17, 17, 0.2);
  color: #111;
  padding: 8px 0;
  width: 100%;
  outline: none;
}

.form-control {
  border: 1px solid #ddd;
  padding: 6px 12px;
  border-radius: 4px;
}

.container button {
  padding: 0.5rem 1rem;
  border-radius: 50px;
  background: #dd3590;
  color: #fff;
  display: flex;
  margin-bottom: 1rem;
  cursor: pointer;
  border: none;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
}

.ruta-header {
  font-size: 1rem;
  font-weight: bold;
  margin-bottom: 10px;
  color: #000;
  cursor: pointer;
}

.dropdown-content {
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  color: #000;
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
  margin: 0 auto;
}

.deuda-total {
  font-weight: bold;
}

@media (max-width: 767px) {
  .tarjeta {
    background-color: #fff;
    padding: 24px;
    border-radius: 16px;
    width: 100%;
  }

  .info-banner {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
