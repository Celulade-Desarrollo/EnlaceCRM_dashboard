<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import Heading from "../components/UI/Heading.vue";
import { fadeInUp } from "../motion/pageAnimation";
import { motion } from "motion-v";
import CardAbonoCupos from "../components/UI/CardAbonoCupos.vue";

// Variables reactivas
const pagar = ref("");
const errorMessage = ref("");
const dataInfoapp = ref([{ nombre: "", saldorestante: "$0" }]);



// Montar el event listener para el envío del formulario y clic en el botón
onMounted(() => {
  const pago1Button = document.getElementById("boton-pago");
  if (pago1Button) {
    pago1Button.addEventListener("click", handlePago1Click);
  }
});
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
        (dataInfoapp && dataInfoapp.length > 0
          ? dataInfoapp[0].nombre
          : 'Usuario')
      "
    />

    <section class="content w-[350px]">
      <CardAbonoCupos :cupoTotal="`200.000`" :cupoDisp="`200.000`" :fechaAbono="`10 AGO`" :deudaTotal="`200.000`"/>   
      <CardAbonoCupos :cupoTotal="`200.000`" :cupoDisp="`200.000`" :fechaAbono="`10 AGO`" :deudaTotal="`200.000`"/>    
    </section>
  </motion.div>
</template>

<style scoped>
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

button {
  padding-left: 1.25rem;
  padding-right: 1.25rem;
  border-radius: 6.25rem;
  background: #dd3590;
  color: white;
  height: 3rem;
  width: 100%;
  margin-top: 20px;
  cursor: pointer;
  border: none;
  outline: none;
  align-items: center;
}
.button:hover {
  background-color: #f15bab;
}

button:focus {
  outline: none;
  box-shadow: none;
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

/* Contenido */
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
#boton-pago:hover {
  background-color: #f15bab;
}


/* Responsive */
@media (max-width: 600px) {
  .header-container {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
}
</style>
