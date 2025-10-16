<script setup>
import { computed } from 'vue';
import { motion } from "motion-v";

const props = defineProps({
  cupoTotal: {
    type: String,
    required: true
  },
  cupoDisp:{
    type: String,
    required: true
  },
  deudaTotal:{
    type: String,
    required: true
  },
  fechaAbono:{
    type: String,
    required: true
  }
});
const datosCuenta = JSON.parse(localStorage.getItem("datosCuenta")) || {};

const bloqueoMora = (datosCuenta.BloqueoPorMora);
const formatoMiles = (numero) => {
  return new Intl.NumberFormat('es-ES').format(Number(numero));
};

const fechaFormateada = computed(() => {
  if (!props.fechaAbono) return '';
  
  const [year, month, day] = props.fechaAbono.split('T')[0].split('-');
  const fecha = new Date(Number(year), Number(month) - 1, Number(day));

  return fecha.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
});

</script>

<template>
<motion.div v-bind="fadeInUp">
<section>
  <div class="card">
    <h3 class="font-bold text-lg">Estado de Mi crédito</h3>
    <div class="flex gap-3 flex-column mb-3">
      <h3 class="flex gap-2">
        Cupo total  $
        <p class="font-bold">{{ cupoTotal }}</p>
      </h3>
      <h3 class="flex gap-2"> Cupo disponible $ <p class="font-bold">{{ formatoMiles(props.cupoDisp) }}</p></h3>

      
      <h2 class="text-xl flex gap-3 mt-1 " >Deuda total $<p class="font-bold">{{formatoMiles(deudaTotal) }}</p></h2>

      <h3 v-if="Number(deudaTotal) > 0" class=" flex text-[13px]"> Fecha del siguiente abono:  <p class="font-bold">{{ fechaFormateada }}</p></h3>
     <p v-if="bloqueoMora" id="bloqueo" class="text-danger mt-1"> Bloqueo por mora !</p>
    </div>
    <div class="flex w-full justify-center gap-2">
  <div class="button-banner w-[50%]">
    <button type="button" id="boton-abonar" class="w-full" @click="$emit('abonar')">
    pagar mi cuota
    </button>
  </div>
  <div class="button-banner w-[50%]">
    <button type="button" id="boton-movimientos" class="w-full" @click="$emit('movimientos')">
      Mis Movimientos 
    </button>
    </div>
  </div>
  </div>
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
  padding: 8px 15px;
  border-radius: 6.25rem;
  background: #dd3590;
  color: white;
  height: 3rem;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  margin-top: 20px;
  cursor: pointer;
  border: none;
  outline: none;
  align-items: center;
  font-weight: bold;
  font-size: 13px;
}
button:hover {
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
  padding: 1.8rem;
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