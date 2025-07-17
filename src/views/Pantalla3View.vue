<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import Heading from "../components/UI/Heading.vue";
import { fadeInUp } from "../motion/pageAnimation";
import { motion } from "motion-v";
import axios from "axios";

// Instancia de Vue Router
  const router = useRouter();

  const pagarValor = localStorage.getItem("pagarValor");
  const datosCuenta = JSON.parse(localStorage.getItem("datosCuenta")) || {};
  const facturas = JSON.parse(localStorage.getItem("numeroFactura")) || [];
  const nroFacturaAlpina = facturas.join(",");
  const numeroTransportista = ref("");
  const token = localStorage.getItem("token");
  
  console.log("datosCuenta:", datosCuenta);
  console.log("Facturas seleccionadas:", facturas);

  // Función para manejar el clic en el botón "codigoPedido1"

 const fechaActual = new Date();
 const fechaProgramada = new Date(fechaActual);
 fechaProgramada.setDate(fechaProgramada.getDate() + 15);

 const fechaPagoProgramado = fechaProgramada.toISOString().split("T")[0];

  const handlePagoClick = async () => {
    const dataPagoFactura = {
   "identificadorTendero": datosCuenta.Cedula_Cliente,
   "monto": pagarValor,
   "tipoMovimiento": 1,
   "descripcion": "pago de factura",
   "fechaPagoProgramado": fechaPagoProgramado,
   "idMedioPago": 14,
   "nroFacturaAlpina": nroFacturaAlpina,
  "telefonoTransportista":String(numeroTransportista.value)
}
    console.log("datosPagoFactura:", dataPagoFactura);
     try {
       const pagoFacturas = await axios.post("/api/movimientos",
         dataPagoFactura,
          {
        headers: {  
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
       );
     window.open("/Pantalla4View", "_parent");

     } catch (error) {
       console.error("Error al realizar el pago:", error);
     }
  };
  const handlePagina2Click = () => {
    window.open("/Pantalla2View", "_parent");
  };

  // Montar el event listener para el envío del formulario y clic en el botón
  onMounted(() => {
     const atras = document.getElementById("boton-atras");
     if (atras) {
       atras.addEventListener("click", handlePagina2Click);
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
        'Hola, ' + datosCuenta.Nombres
      "
    />

    <section class="content">
      <div class="card">
        <div class="header-container">
          <img src="/Alpina.png" alt="Alpina" class="alpina-logo-outside" />
        </div>
        <h2 class="proveedores">¿Está seguro que desea pagar?</h2>
        <h1 class="proveedores mb-4" id="cantidad-pagar">
          <span>${{ pagarValor }}</span> a Alpina
        </h1>

        <div class="form-group">
          <label for="pagar" id="label-pagar" class="input-label">
            <input
              class="form-control text-center mb-4"
              aria-required="true"
              aria-invalid="false"
              aria-labelledby="label-pagar"
              name="numeroTransportista"
              v-model="numeroTransportista"
              type="number"
              placeholder=""
              autocomplete="off"
              id="numeroTransportista"
              required
              aria-describedby="error-pagar"
            />
            <span class="floating-label"
              >Ingresa el teléfono del transportista</span
            >
          </label>
        </div>
        <div class="button-banner-pedidos">
          <button type="button" id="boton-pago" class="boton" @click="handlePagoClick">Pagar</button>
          <button type="button" id="boton-atras" class="boton">Atrás</button>
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
  font-size: 20px;
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
  border-radius: 10px;
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
