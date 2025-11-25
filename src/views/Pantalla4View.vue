<script setup>
import { ref, onMounted, watch } from "vue";
import { useRouter } from "vue-router"; // Importa useRouter para navegar entre vistas
import RouterLink from "../components/UI/Routerlink.vue";
import Heading from "../components/UI/Heading.vue";

// Variables reactivas
const celular = ref("");
const data = ref(null);
const error = ref("");

const deudaTotal = ref(0);
const cupoTotal = ref(0);
const datosCuenta = JSON.parse(localStorage.getItem("datosCuenta")) || {};

const telefonoTransportista = ref("");
onMounted(() => {
  telefonoTransportista.value = localStorage.getItem("telefonoTransportista") || "";

  console.log("📦 DATOS COMPLETOS EN PANTALLA 4 (ACTUALIZADOS):", {
    telefonoTransportista: telefonoTransportista.value,
    datosCuenta,
    pagarValor,
    dataInfoapp,
    celular: celular.value,
    deudaTotal: deudaTotal.value,
    cupoTotal: cupoTotal.value,
  });
});



// Instancia de router
const router = useRouter();
let pagarValor = localStorage.getItem("pagarValor");
let dataInfoapp = JSON.parse(localStorage.getItem("data"));

// deudaTotal.value = parseFloat(
//   dataInfoapp[0].saldorestante.replace(/[$,]/g, "")
// );
// cupoTotal.value = parseFloat(dataInfoapp[0].saldoabonado.replace(/[$,]/g, ""));

function formatPesos(valor) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0
  }).format(valor || 0);
}

const handlePago1Click = () => {
  window.open("/Pantalla1View", "_parent");
};

const handleeditarClick= () => {
  window.open("/Pantalla6View", "_parent");
};

// Función para calcular y ajustar la barra de progreso
// const updateProgressBar = () => {
//   const total = deudaTotal.value + cupoTotal.value;
//   const deudaPercentage = (deudaTotal.value / total) * 100;
//   const cupoPercentage = (cupoTotal.value / total) * 100;

//   document.getElementById("deuda-bar").style.width = `${deudaPercentage}%`;
//   document.getElementById("cupo-bar").style.width = `${cupoPercentage}%`;
// };

// Montar el event listener para el envío del formulario
onMounted(() => {
  const Pantalla5Button = document.getElementById("Pantalla6");
  if (Pantalla5Button) {
    Pantalla5Button.addEventListener("click", handlePantalla6Click); // Agrega el event listener al botón
  }

  // Actualizar la barra de progreso al montar el componente
  //updateProgressBar();
});

// Observar cambios en los valores para actualizar la barra de progreso
//watch([deudaTotal, cupoTotal], updateProgressBar);
</script>

<template>

  <Heading :mensaje="'Hola, ' + datosCuenta.Nombres" :showBackButton="true" /> 

  <section class="content">
    <div class="card">
      <div class="header-container">
        <picture class="logo">
          <img
            src="/public/Alpina.png"
            alt="logo"
            class="img-fluid"
            loading="lazy"
            title="logo"
          />
        </picture>
        <h2 class="proveedores mb-4" id="pagado">
         Tu pago por <span>{{ formatPesos(pagarValor) }}</span> para Alpina <br />ha sido recibido exitosamente.
        </h2>
      <h2>El comprobante ha sido enviado al número telefónico {{ telefonoTransportista }}.</h2>



        <h1 class="proveedores mb-4" id="cantidad-pagar">
          <strong>¡Muchas gracias!</strong>
        </h1>
      </div>
      <div class="button-inicio" @click="handleeditarClick">
        <button type="button" class="button">Editar número</button>
      </div>
            <div class="button-inicio" @click="handlePago1Click">
        <button type="button" class="button">Volver al inicio</button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.logo-container {
  text-align: center;
  margin-top: 1rem;
}

#cantidad-pagar {
  margin-top: 30px; /* Ajusta el valor como quieras */
}


.logo-main {
  width: 200px;
  height: auto;
  display: inline-block;
}

/* Contenido */
.content {
    width: 100%;
  min-height: calc(100vh - 80px);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  align-items: center;
}

.card {
  background: #fff;
  padding: 1rem;
  text-align: center;
  font-size: 17px;
  width: 100%;
  min-height: calc(100vh - 80px);
}

.header-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1rem;
  justify-content: center;
}

.logo {
  margin-bottom: 1rem;
  margin-top: 0px;
  width: 200px;
}

.alpina-logo-outside {
  width: 80px;
  height: auto;
  margin-left: rem;
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
  margin-bottom: 1rem;
}

.alpina-img {
  width: 140px;
  height: auto;
}

.text-center {
  text-align: center;
}

/* Formulario de pago */
.form-group {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.form-group h2.proveedores {
  margin: 0;
  white-space: nowrap;
  width: auto;
}

/* Responsive */
@media (max-width: 600px) {
  .header-container {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .alpina-logo-outside {
    margin-left: 0;
    margin-top: 0.5rem;
  }

  .provider-content {
    flex-direction: column;
  }

  .form-group {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
