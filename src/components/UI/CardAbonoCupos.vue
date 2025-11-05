<script setup>
import { computed, ref, onMounted } from 'vue';
import { motion } from "motion-v";
import axios from 'axios';

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
const estadoCuenta = ref({});
const token = localStorage.getItem("token");
const datosCuenta = JSON.parse(localStorage.getItem("datosCuenta")) || {};
console.log("datosCuenta en CardAbonoCupos:", datosCuenta);
const bloqueoMora = (datosCuenta.BloqueoPorMora);
//const valorProximoAbono =

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

onMounted (async () => {
 const estadoCuentaResponse = await axios.get(
      "/api/pagos/estado-cuenta",
      {
        params: { identificadorTendero: datosCuenta.Cedula_Cliente },
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );

  estadoCuenta.value = estadoCuentaResponse.data;
  console.log("estadocuentaa",estadoCuenta.value)
});

const valorProximoAbono = computed(() => {
  if (!estadoCuenta.value.movimientos) return 0;

  const movimientos = estadoCuenta.value.movimientos;
  const hoy = new Date();

  // 1️⃣ Filtramos los de tipo 1 (utilización)
  const tipo1 = movimientos.filter(m => m.IdTipoMovimiento === 1);

  // 2️⃣ Obtenemos las facturas que ya tienen pago (tipo 2)
  const facturasPagadas = movimientos
    .filter(m => m.IdTipoMovimiento === 2)
    .map(m => m.NroFacturaAlpina);

  // 3️⃣ Nos quedamos con las facturas tipo 1 que NO estén pagadas
  const sinPagar = tipo1.filter(m => !facturasPagadas.includes(m.NroFacturaAlpina));

  if (sinPagar.length === 0) return 0;

  // 4️⃣ Convertimos fechas y separamos las que están vencidas
  const vencidas = sinPagar.filter(m => new Date(m.FechaPagoProgramado) <= hoy);
  const futuras = sinPagar.filter(m => new Date(m.FechaPagoProgramado) > hoy);

  // 5️⃣ Si hay facturas vencidas → sumamos todas sus deudas
  if (vencidas.length > 0) {
    return vencidas.reduce((acc, mov) => acc + (mov.Monto || 0), 0);
  }

  // 6️⃣ Si no hay vencidas → mostramos la más próxima a vencer
  const proxima = futuras.sort(
    (a, b) => new Date(a.FechaPagoProgramado) - new Date(b.FechaPagoProgramado)
  )[0];

  return proxima ? proxima.Monto : 0;
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
      
      <h2 class="text-xl flex gap-3 mt-1">Deuda total $<p class="font-bold">{{formatoMiles(deudaTotal) }}</p></h2>
      <h2 class="text-xl flex gap-3 mt-1">Valor siguiente abono: <p class="font-bold">{{ formatoMiles(valorProximoAbono) }}</p></h2>
      <h3 v-if="Number(deudaTotal) > 0" class=" flex text-[13px]"> Fecha del siguiente abono:  <p class="font-bold">{{ fechaFormateada }}</p></h3>
     <div v-if="bloqueoMora" class="alert alert-danger mt-3">
        <p><strong>⚠ Estas bloqueado por mora </strong></p>
      </div>
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