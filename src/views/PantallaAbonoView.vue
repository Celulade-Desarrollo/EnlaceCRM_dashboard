<script setup>
//import { onMounted } from "vue";
import Heading from "../components/UI/Heading.vue";
import { motion } from "motion-v";

const datosCuenta = JSON.parse(localStorage.getItem("datosCuenta")) || {};
</script>

<template>
<Heading :mensaje="'Hola, ' + datosCuenta.Nombres" />
    <motion.div v-bind="fadeInUp">
    <section>
        <div class="card">
        <div class="provider-content">
        <div class="bg-white w-full rounded-xl flex flex-col items-center relative justify-start pt-3">
            <h2 class="w-full text-center font-bold mb-2">¿Cómo quieres pagar?</h2>
            <a
            href="https://portalpagos.payty.com/PortalPagosPayty/WEB/?codigoConvenio=112878"
            class="no-underline flex items-center justify-between bg-gray-100 rounded-lg shadow w-72 h-20 px-4 mt-4"
            >
            <span class="no-underline flex flex-col text-left font-bold text-gray-700 text-lg leading-tight">
                Pago<br />Digital via PSE
            </span>
            <img src="../../public/PSELOGO.png" class="w-16 h-16" />
            </a>
            <div
            class="no-underline flex items-center justify-between bg-gray-100 rounded-lg shadow w-72 h-20 px-4 mt-4"
            >
            <span class="no-underline flex flex-col text-left font-bold text-gray-700 text-lg leading-tight">
                Pago en corresponsal
            </span>
            <button class="button">
                Info
            </button>
            </div>
        </div>
        </div>
    </div>
  </section>
</motion.div>
</template>

<style scoped>
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
.provider-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.button {
  background-color: #dd3590;
  color: white;
  border: none;
  padding: 10px 24px;
  border-radius: 25px;
  font-weight: bold;
  cursor: pointer;
}

.button:hover {
  background-color: #f15bab;
}
.button:focus {
  outline: none;
  box-shadow: none;
}
</style>
