<script setup>
import { ref, onMounted, watch } from 'vue';
import Heading from "../components/UI/Heading.vue";

const deudaTotal = ref(0);
const cupoTotal = ref(0);

// Simulación de data de localStorage
const dataInfoapp = JSON.parse(localStorage.getItem('data')) || [{
    nombre: 'Juan',
    saldorestante: '$50,000',
    saldoabonado: '$100,000'
}];

deudaTotal.value = parseFloat(dataInfoapp[0].saldorestante.replace(/[$,]/g, ''));
cupoTotal.value = parseFloat(dataInfoapp[0].saldoabonado.replace(/[$,]/g, ''));

const handlePantalla6Click = () => {
    window.open("/Pantalla6View", "_parent");
};

const updateProgressBar = () => {
    const total = deudaTotal.value + cupoTotal.value;
    const deudaPercentage = (deudaTotal.value / total) * 100;
    const cupoPercentage = (cupoTotal.value / total) * 100;

    document.getElementById('deuda-bar').style.width = `${deudaPercentage}%`;
    document.getElementById('cupo-bar').style.width = `${cupoPercentage}%`;
};

onMounted(() => {
    updateProgressBar();
});

watch([deudaTotal, cupoTotal], updateProgressBar);
</script>

<template>
  <div>
    <!-- Encabezado -->
    <Heading :mensaje="'Hola, ' + dataInfoapp[0].nombre" />


    <!-- Información financiera -->
    <section class="container banners">
      <div class="info-banner">
        <div>
          <h2>Deuda total</h2>
          <p id="deuda-total">{{ dataInfoapp[0].saldorestante }}</p>
        </div>
        <div>
          <h2>Cupo disponible</h2>
          <p id="cupo-total">{{ dataInfoapp[0].saldoabonado }}</p>
        </div>
      </div>

      <div class="progress">
        <div id="deuda-bar" class="progress-bar bg-primary"></div>
        <div id="cupo-bar" class="progress-bar bg-success"></div>
      </div>

      <div class="text-center mt-3">
        <button id="Pantalla6" class="btn btn-primary" @click="handlePantalla6Click">Abonar</button>
      </div>

      <hr class="separator" />

      <!-- Historial de pagos -->
      <div class="row">
        <div class="col-md-3 banner2">
          <h2>Hoy</h2>
          <img src="/public/Alpina.png" class="img-fluid" alt="Alpina" />
          <p><strong>Alpina</strong></p>
          <p>pagaste $58.000</p>
        </div>

        <div class="col-md-3 banner2">
          <h2></h2>
          <img src="/public/Alpina.png" class="img-fluid" alt="Alpina" />
          <p><strong>Alpina</strong></p>
          <p>pagaste $58.000</p>
        </div>

        <div class="col-md-3 banner2">
          <h2>Ayer</h2>
          <img src="/public/Alpina.png" class="img-fluid" alt="Alpina" />
          <p><strong>Alpina</strong></p>
          <p>pagaste $58.000</p>
        </div>

        <div class="col-md-3 banner2">
          <h2>Ago 10</h2>
          <img src="/public/Alpina.png" class="img-fluid" alt="Alpina" />
          <p><strong>Alpina</strong></p>
          <p>pagaste $58.000</p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.header {
  background-color: #2c1c85;
  padding: 1rem;
  color: white;
}
.header-icons {
  display: flex;
  justify-content: space-between;
  font-size: 1.5rem;
}
.header-text {
  margin-top: 0.5rem;
  font-size: 1.2rem;
}
.info-banner {
  display: flex;
  justify-content: space-around;
  margin: 1rem 0;
}
.progress {
  height: 20px;
  background: #ddd;
  border-radius: 10px;
  overflow: hidden;
}
.progress-bar {
  height: 100%;
  transition: width 0.3s ease-in-out;
}
.bg-primary {
  background-color: #007bff;
}
.bg-success {
  background-color: #28a745;
}
.separator {
  margin: 2rem 0;
  border-top: 1px solid #ccc;
}
.banner2 {
  text-align: center;
  margin-bottom: 2rem;
}
.img-fluid {
  width: 60px;
  height: auto;
}
</style>
