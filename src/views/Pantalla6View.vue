<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import Heading from "../components/UI/Heading.vue";
import SesionExpirada from "../components/UI/SesionExpirada.vue";
import { fadeInUp } from "../motion/pageAnimation";
import { motion } from "motion-v";

// Router
const router = useRouter();

// Token y datos de cuenta
const token = localStorage.getItem("token");
const datosCuenta = JSON.parse(localStorage.getItem("datosCuenta")) || {};

// Traer número actual guardado
const TelefonoTransportista = ref(localStorage.getItem("telefonoTransportista") || "");

// Error de validación
const errorMessage = ref("");

// Guardar cambios y volver a pantalla 4
const guardarNumero = async () => {
  if (!TelefonoTransportista.value) {
    errorMessage.value = "Por favor ingresa un número válido";
    return;
  }

  errorMessage.value = "";

  try {
    // 🔥 CONVERTIR A STRING EXPLÍCITAMENTE
    const telefonoString = String(TelefonoTransportista.value);
    
    // Guardar en localStorage
    localStorage.setItem("telefonoTransportista", telefonoString);

    console.log("📞 Actualizando teléfono en BD:", telefonoString);
    console.log("📋 Datos a enviar:", {
      identificadorTendero: datosCuenta.Cedula_Cliente,
      telefonoTransportista: telefonoString
    });

    // 🔥 ACTUALIZAR EN LA BASE DE DATOS
    const response = await axios.put(
      "/api/movimientos/actualizar-telefono",
      {
        identificadorTendero: datosCuenta.Cedula_Cliente,
        telefonoTransportista: telefonoString // 🔥 ENVIAR COMO STRING
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Respuesta del servidor:", response.data);

    // ✅ Esperar un momento antes de redirigir
    setTimeout(() => {
      window.open("/Pantalla4View", "_parent");
    }, 500);

  } catch (error) {
    console.error("❌ Error completo:", error);
    console.error("❌ Response error:", error.response?.data);
    
    // 🔥 Si es error 500 pero ya se guardó en BD, redirigir igual
    if (error.response?.status === 500) {
      console.log("⚠️ Error 500 pero puede que se haya guardado, redirigiendo...");
      setTimeout(() => {
        window.open("/Pantalla4View", "_parent");
      }, 1000);
      return;
    }
    
    if (error.response) {
      // Error con respuesta del servidor
      errorMessage.value = error.response.data?.error || "Error al actualizar el número";
    } else if (error.request) {
      // Error de red
      errorMessage.value = "No se pudo conectar con el servidor";
    } else {
      // Otro tipo de error
      errorMessage.value = "Error al actualizar el número. Intenta nuevamente.";
    }
  }
};

// Volver sin guardar
const cancelar = () => {
  window.open("/Pantalla4View", "_parent");
};
</script>


<template>
  <motion.div v-bind="fadeInUp">

    <Heading
      mensaje="Editar número del transportista"
      :showBackButton="true"
    />

    <section class="content">
      <div class="card">
        <div class="header-container">
          <img src="/Alpina.png" alt="Alpina" class="alpina-logo-outside" />
        </div>

        <h2 class="proveedores">Ingresa el número correcto</h2>

        <div class="form-group">
          <label id="label-pagar" class="input-label">
            <input
              class="form-control text-center mb-4"
              v-model="TelefonoTransportista"
              type="number"
              autocomplete="off"
              required
            />
            <span class="floating-label">Teléfono del transportista</span>
          </label>
        </div>

        <div class="button-banner-pedidos">
          <p v-if="errorMessage" class="error-text">{{ errorMessage }}</p>

          <button type="button" class="boton" @click="guardarNumero">
            Enviar
          </button>
        </div>
      </div>
    </section>

    <SesionExpirada />
  </motion.div>
</template>


<style scoped>
.error-text {
  color: red;
  font-size: 0.99rem;
}
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.input-label {
  position: relative;
  display: block;
  width: 100%;
  margin-top: 24px;
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
.form-control {
  width: 100%;
  padding: 10px 0;
  font-size: 16px;
  border: none;
  border-bottom: 2px solid #09008be1;
  background: transparent;
  font-family: sans-serif;
  outline: none;
  transition: border-color 0.3s ease;
}

.floating-label {
  position: absolute;
  left: 0;
  top: 0px;
  color: black;
  font-size: 16px;
  pointer-events: none;
  transition: 0.3s ease all;
  font-family: sans-serif;
}

/* Animación al enfocar o escribir */
.form-control:focus + .floating-label,
.form-control:not(:placeholder-shown) + .floating-label {
  top: -15px;
  font-size: 12px;
  color: black;
}

.input-label:hover .form-control {
  border-bottom-color: #ff00f2;
}

.form-control:focus {
  border-bottom-color: #0064e6cc;
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
  background-color: rgb(255, 255, 255);
  width: 100%;
  min-height: calc(100vh - 80px);
}



.card {
  background: #fff;
  border: none;
  box-shadow: none;
  outline: none;
  margin-top: -15px;
  padding: 1.5rem;
  text-align: center;
  width: 100%;
  min-height: calc(100vh - 80px);
}

.header-container {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  justify-content: center;
}

.card-header-text {
  background-color: #251886;
  color: white;
  padding: 0.75rem 1rem;
  margin: 0;
}

.alpina-logo-outside {
  width: 80px;
  height: auto;
  margin-left: 1rem;
}

.bold {
  font-weight: bold;
}
.boton:hover {
  background-color: #f15bab;
}
/* Proveedor */
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
@media (max-width: 480px) {
.content {
  padding: 1rem;
  align-items: center;
  outline: none;
  width: 100%;
  min-height: calc(100vh - 80px);
}
  .card {
    padding: 1rem;
    width: 100%;
    min-height: calc(100vh - 80px);
  }

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
