<script>
import jwtDecode from "jwt-decode";
import axios from "axios";
import Heading from "../componets/UI/Heading.vue";


const datosCuenta = JSON.parse(localStorage.getItem("datosCuenta")) || {};

export default {
  name: "Pantalla5View",
  data() {
    return {
      cliente: null,
      datosCuenta: null,
      movimientos: []
    };
  },
  methods: {
    async obtenerDatos() {
      const token = sessionStorage.getItem("token");
      if (!token) return console.error("No hay token en sessionStorage");

      const decoded = jwtDecode(token);
      const cedula = decoded.cedula;
      console.log("Token usado:", token);
      console.log("Cédula actualizada:", cedula);

      try {
        // Obtener cliente desde localStorage
        const clientes = JSON.parse(localStorage.getItem("data")) || [];
        const clienteActual = clientes.find(c => c.cedula === cedula);
        this.cliente = clienteActual || { nombre: "No encontrado", cedula };

        // Obtener estado de cuenta (por ID, ej: 54)
        const idUsuario = sessionStorage.getItem("idUsuario");
        if (idUsuario) {
          const resCuenta = await axios.get(`/api/user/estado-cuenta/${idUsuario}`);
          this.datosCuenta = resCuenta.data;
          console.log("Estado de cuenta:", resCuenta.data);
        }

        // Obtener movimientos por cédula
        const resMov = await axios.get(`/api/movimientos?identificadorTendero=${cedula}`);
        this.movimientos = resMov.data;
        console.log("Movimientos:", resMov.data);

      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
    },
    redirigirAbonar() {
      this.$router.push("/pantalla6");
    }
  },
  mounted() {
    this.obtenerDatos();
  }
};
</script>


<template>
  <motion.div v-bind="fadeInUp">
    <section class="logo-container">
      <img src="/enlaceFiado.png" alt="logo Enlace CRM" class="logo-main" />
    </section>

    <Heading :mensaje="'Hola, ' + datosCuenta.Nombres" />

    <section class="container banners py-4">
      <div class="d-flex flex-column align-items-center">
        <!-- Tarjeta de deuda y cupo -->
        <div class="banner1 mb-4">
          <div class="info-banner">
            <div class="d-flex justify-content-between w-100">
              <div class="text-start">
                <h2 class="deuda-total">Deuda total</h2>
                <p class="cantidad-total mb-2" id="deuda-total">{{ formatPesos(deudaTotal) }}</p>
              </div>
              <div class="text-end">
                <h2 class="cupo-total">Cupo disponible</h2>
                <p class="cantidad-total mb-2" id="cupo-total">{{ formatPesos(cupoTotal) }}</p>
              </div>
            </div>
          </div>
          <div class="progress">
            <div id="deuda-bar" class="progress-bar deuda-bar" :style="{ width: deudaTotal + cupoTotal ? ((deudaTotal / (deudaTotal + cupoTotal)) * 100) + '%' : '0%' }"></div>
            <div id="cupo-bar" class="progress-bar cupo-bar" :style="{ width: deudaTotal + cupoTotal ? ((cupoTotal / (deudaTotal + cupoTotal)) * 100) + '%' : '0%' }"></div>
          </div>
        </div>

        <!-- Botón abonar -->
        <div class="button-banner mb-2">
          <button type="button" class="button" @click="router.push('/Pantalla6View')">Abonar</button>
        </div>

        <!-- Lista de movimientos -->
        <div v-if="mostrarMovimientos" class="lista-movimientos mt-4">
          <h3 class="titulo-movimientos">Movimientos</h3>

          <div v-if="movimientos.length === 0">
            <p style="text-align: center; color: gray">No hay movimientos registrados.</p>
          </div>

          <div v-else>
            <div v-for="(mov, index) in movimientos" :key="index" class="movimiento">
              <div class="info-movimiento">
                <div class="detalle">
                  <p class="fecha"><strong>Fecha:</strong> {{ formatFecha(mov.FechaHoraMovimiento) }}</p>
                  <p class="descripcion"><strong>Descripción:</strong> {{ mov.Descripcion }}</p>
                  <p class="descripcion"><strong>Estado Movimiento:</strong> {{ mov.IdEstadoMovimiento }}</p>
                  <p class="descripcion"><strong>Fecha Programada:</strong>
                    {{ mov.FechaPagoProgramado ? formatFecha(mov.FechaPagoProgramado) : 'No aplica' }}
                  </p>
                  <p class="descripcion"><strong>Medio de Pago:</strong> {{ mov.IdMedioPago ?? 'N/A' }}</p>
                  <p class="descripcion"><strong>Bloqueo Mora:</strong> {{ mov.BloqueoMora === 1 ? 'Sí' : 'No' }}</p>
                  <p class="descripcion"><strong>Factura Alpina:</strong> {{ mov.NroFacturaAlpina || 'No aplica' }}</p>
                  <p class="descripcion"><strong>Tel. Transportista:</strong> {{ mov.TelefonoTransportista || 'No aplica' }}</p>
                </div>
              </div>
              <p :class="['monto', mov.IdTipoMovimiento === 2 ? 'positivo' : 'negativo']">
                {{ mov.IdTipoMovimiento === 2 ? '+' : '-' }}{{ formatPesos(mov.Monto) }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </motion.div>
</template>


<style scoped>
.banners {
  background-color: #ffffff;
  min-height: 100vh;
  border-radius: 10px;
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
.banner1 {
  background-color: #ffffff;
  border: 2px solid #2b008b;
  border-radius: 15px;
  padding: 20px;
  width: 100%;
  max-width: 400px;
}
.progress {
  margin-top: 10px;
  height: 25px;
  background-color: #ddd;
  border-radius: 10px;
  overflow: hidden;
}
.progress-bar {
  transition: width 0.5s ease;
  height: 100%;
}
.deuda-bar {
  background-color: #007bff;
  width: 0%;
}
.cupo-bar {
  background-color: #0aba33;
  width: 0%;
}
.button-banner {
  display: flex;
  justify-content: center;
}
.button {
  background-color: #dd3590;
  color: white;
  border: none;
  padding: 14px 32px;
  border-radius: 25px;
  font-weight: bold;
  cursor: pointer;
  width: 100%;
  max-width: 500px;
  text-align: center;
  font-size: 1.1rem;
  transition: background-color 0.3s ease;
}
.button:hover {
  background-color: #f15bab;
}
button:focus {
  outline: none;
  box-shadow: none;
}

/* NUEVO: estilos movimientos */
.lista-movimientos {
  width: 100%;
  max-width: 400px;
  background-color: #fff;
  padding: 15px;
  border-radius: 12px;
  border: 2px solid #2b008b;
}
.titulo-movimientos {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 15px;
  text-align: center;
  color: #2b008b;
}
.movimiento {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ccc;
  padding: 10px 0;
}
.info-movimiento {
  display: flex;
  align-items: center;
  gap: 10px;
}
.logo-mov {
  width: 40px;
  height: 40px;
  object-fit: contain;
}
.detalle {
  display: flex;
  flex-direction: column;
}
.fecha {
  font-weight: bold;
  font-size: 0.9rem;
}
.descripcion {
  font-size: 0.85rem;
  color: #555;
}
.monto {
  font-weight: bold;
  font-size: 1rem;
}
.monto.negativo {
  color: red;
}
.monto.positivo {
  color: green;
}
</style> 
