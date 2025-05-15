<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useRouter } from "vue-router"; // Importa useRouter para navegar entre vistas
import RouterLink from "../components/UI/Routerlink.vue";
import Heading from "../components/UI/Heading.vue";
import { fadeInUp } from "../motion/pageAnimation";
import { motion } from "motion-v";

// Variables reactivas
const celular = ref("");
const data = ref(null);
const error = ref("");

// Instancia de router
const router = useRouter();

let dataInfoapp = JSON.parse(localStorage.getItem("data"));

// Función para manejar el clic en el botón "Pantalla7"
const handlePantalla7Click = () => {
  window.open("/Pantalla7View", "_parent");
};

// Montar el event listener para el envío del formulario
onMounted(() => {
  const Pantalla7Button = document.getElementById("Pantalla7");
  if (Pantalla7Button) {
    Pantalla7Button.addEventListener("click", handlePantalla7Click); // Agrega el event listener al botón
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

    <section class="content">
      <div class="card">
        <div class="header-container">
          <h2 class="proveedores">Dírigete a tu suscursal más cercana</h2>
          <div class="info-banner-main mb-4">
            <p class="deuda-total mb-2" id="deuda-total">
              Fecha limite de pago: 12 AGO
            </p>
            <p class="fecha-pago ml-5 mb-2" id="fecha-pago">
              Valor a pagar: $226.000
            </p>
            <p class="cupo-disponible mb-2" id="cupo-disponible">
              Referencia de pago:<span class="cupo-disponible-dinero">
                xys123</span
              >
            </p>
          </div>
          <div class="button-banner">
            <button type="submit" class="button" id="Pantalla7">Atras</button>
          </div>
        </div>
      </div>
    </section>
  </motion.div>
</template>

<style scoped>
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
  text-align: center;
  font-size: 17px;
}

.header-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1rem;
  justify-content: center;
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

.info-banner {
  width: 100%;
  letter-spacing: -0.03em;
  line-height: 1.2;
  background-color: #fff;
  color: black;
  padding: 24px;
  display: flex;
  align-items: center;
  margin-top: 30px;
  border-radius: 5px;
}
.info-banner-main {
  width: 100%;
  letter-spacing: -0.03em;
  line-height: 1.2;
  background-color: #e9e9e9;
  color: black;
  padding: 24px;
  align-items: center;
  margin-top: 30px;
  border-radius: 5px;
}
.info-banner-pedidos {
  width: 100%;
  letter-spacing: -0.03em;
  line-height: 1.2;
  background-color: #fff;
  color: black;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 30px;
  border-radius: 5px;
}
.info-banner3 {
  width: 100%;
  letter-spacing: -0.03em;
  line-height: 1.2;
  background-color: #fff;
  color: black;
  padding: 24px;
  display: flex;
  align-items: center;
  margin-top: -80px;
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

.deuda-total {
  font-weight: bold;
}

.proveedores {
  font-weight: bold;
  color: black;
  width: 100%;
  letter-spacing: -0.03em;
  line-height: 1.2;
  background-color: #fff;
  padding: 24px;
  display: flex;
  align-items: center;
  margin-bottom: -40px;
}
.fecha-pago {
  font-weight: bold;
}

.cupo-disponible-dinero {
  font-weight: bold;
  color: #f15bab;
}
.cupo-disponible {
  font-weight: bold;
}
.parrafo-marcas {
  font-weight: bold;
  text-align: center;
}

.img-fluid {
  height: 80%;
  width: 80%;
}

.text-section {
  flex-grow: 1;
  margin-left: 20px;
}

@media (max-width: 600px) {
  .header-container {
    flex-direction: column; /* Asegurar que siga siendo columna en responsive */
    align-items: center;
    text-align: center;
  }

  .info-banner {
    flex-direction: column;
    align-items: flex-start;
  }

  .text-section {
    margin-left: 0;
    margin-top: 10px;
  }
}
</style>
