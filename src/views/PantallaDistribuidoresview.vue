<script setup>
import { onMounted, ref, computed } from 'vue'
import { motion } from 'motion-v'
import axios from 'axios'
import { activarSesionExpirada } from "../stores/session.js";
import { useRouter } from "vue-router";

const movimientosEnlace = ref([])
const ruta = ref("asv545")
const fechaSeleccionada = ref(new Date().toISOString().substr(0, 10))
const filtroFactura = ref("");
const filtroTelefono = ref("");

const router = useRouter();

const listaFacturas = computed(() => {
  const facturas = movimientosEnlace.value.map(mov => mov.NroFacturaAlpina);
  return [...new Set(facturas)];
})

const listaTelefonos = computed(()=>{
  const telefonos = movimientosEnlace.value.map(mov => mov.TelefonoTransportista);
  return [...new Set(telefonos)];
})

const formatoMiles = (numero) => {
  return new Intl.NumberFormat('es-ES').format(Number(numero));
};

const movimientosFiltrados = computed(() => {
  return movimientosEnlace.value.filter(mov => {
    const fechaMov = mov.FechaHoraMovimiento?.substring(0, 10);

    const coincideFecha = fechaMov === fechaSeleccionada.value;

    const coincideFactura =
      !filtroFactura.value ||
      mov.NroFacturaAlpina?.toString().includes(filtroFactura.value);

    const coincideTelefono =
      !filtroTelefono.value ||
      mov.TelefonoTransportista?.toString().includes(filtroTelefono.value);

    return coincideFecha && coincideFactura && coincideTelefono;
  });
});

const totalRecaudo = computed(() => {
  return movimientosFiltrados.value.reduce((acc, mov) => acc + (mov.Monto || 0), 0)
})

onMounted(async () => {
  try {
    const response = await axios.get('api/listar/enlace/movimientos')
    movimientosEnlace.value = response.data
    console.log("Movimientos cargados:", movimientosEnlace.value)
  } catch (error) {
    console.error("Error al cargar movimientos:", error)
     if (error.response?.status === 401) {
      activarSesionExpirada();
    }
  }
})
const logout = () => {
  localStorage.removeItem("admin_token");
  localStorage.removeItem("company");
  localStorage.removeItem("admin_tipo");
  localStorage.removeItem("admin_userData");
  localStorage.removeItem("admin_isAuthenticated");
  router.push("/LoginView");
};
</script>

<template>
  <motion.div class="pantalla">
    <section class="logo-container">
      <img src="/public/enlaceFiado.png" alt="logo Enlace CRM" class="logo-main" />
    </section>
    <div class="logout">
      <button class="boton-logout" @click="logout">Cerrar sesión</button>
    </div>
    <div class="num_contacto">
    Contacta soporte al siguiente número: 319-662-2476
    </div>
    <div class="card">
      <section class="total-recaudo">
        <div class="recaudo-linea">
          <span class="label">Total recaudo del día:</span>
          <input type="date" v-model="fechaSeleccionada" />
          <span class="monto-total">${{ formatoMiles(totalRecaudo)}}</span>

          <div class="inputs-wrapper">
            <label for="nombres" class="input-label">
              <input
                class="form-control"
                type="text"
                placeholder=""
                v-model="filtroFactura"
              />
              <span class="floating-label">Buscar factura</span>
            </label>

            <label for="nombres" class="input-label">
              <input
                class="form-control"
                type="text"
                placeholder=""
                v-model="filtroTelefono"
              />
              <span class="floating-label">Buscar teléfono</span>
            </label>
          </div>
        </div>
      </section>
    <!-- <section class="filtros">
          <div class="filtro-item">
            <label>Filtrar por factura:</label>
            <select v-model="filtroFactura">
              <option value="">Todas</option>
              <option
                v-for="fac in listaFacturas"
                :key="fac"
                :value="fac"
              >
                {{ fac }}
              </option>
            </select>
          </div>

          <div class="filtro-item">
            <label>Filtrar por teléfono:</label>
            <select v-model="filtroTelefono">
              <option value="">Todos</option>
              <option
                v-for="tel in listaTelefonos"
                :key="tel"
                :value="tel"
                >
                  {{ tel }}
              </option>
            </select>
          </div>
        </section> -->
      <section class="tabla">
        <div class="titulosTabla">
          <span>Factura</span>
          <span>Teléfono Transportista</span>
          <span>Monto</span>
        </div>

        <div
          v-for="mov in movimientosFiltrados"
          :key="mov.IdMovimiento"
          class="fila"
        >
          <span>{{ mov.NroFacturaAlpina }}</span>
          <span>{{ mov.TelefonoTransportista }}</span>
          <span>${{ formatoMiles(mov.Monto) }}</span>
        </div>
      </section>
    </div>
  </motion.div>
</template>

<style scoped>
.inputs-wrapper {
  display: flex;
  gap: 10px;
  flex-wrap: nowrap;
  flex-shrink: 1;
}

.input-label {
  position: relative;
  display: block;
  margin-top: 0;
  width: 180px;
  min-width: 120px;
  flex-shrink: 1; 
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
  top: 10px;
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

.recaudo-linea {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.7rem;
}
/* --- TU CSS ORIGINAL --- */
.num_contacto {
  font-size: 1.2rem;
  font-weight: bold;
  color: white;
  text-align: right;
  margin-right: 10px;
  width: 100%;
  max-width: 1140px;
  align-self: center;
  box-sizing: border-box;
  margin-top: 20px;
}

.logout {
  display: flex;
  justify-content: right;
  margin-top: 1rem;
}

.boton-logout {
  padding: 10px 30px;
  font-size: 16px;
  border-radius: 20px;
  cursor: pointer;
  font-weight: 600;
  background: #dd3590 !important;
  color: #fff;
  border: none;
}
.boton-logout:hover {
  background-color: #f15bab !important;
}

.pantalla {
  background-color: #1a0f8b;
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 40px;
  font-family: Arial, sans-serif;
}

.logo-container {
  margin-bottom: 30px;
}

.logo-main {
  height: 70px;
  object-fit: contain;
}

.total-recaudo {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.label {
  color: #dd3590;
  font-weight: 900;
  white-space: nowrap;
  font-size: 1.2rem;
}

input[type="date"] {
  border: none;
  border-bottom: 2px solid #0043ce;
  padding: 4px 2px;
  background: transparent;
  color: #0043ce;
  font-size: 1.1rem;
  outline: none;
  width: 170px;
}

.monto-total {
  font-size: 1.7rem;
  font-weight: bold;
  color: #0043ce;
  white-space: nowrap;
}

.tabla {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.titulosTabla,
.fila {
  display: flex;
  justify-content: space-between;
  color: #0043ce;
  font-size: 1.1rem;
}

.titulosTabla {
  font-weight: bold;
  color: #dd3590;
  margin-bottom: 0.5rem;
}

.fila {
  border-top: 1px solid #9bb1ff;
  padding-top: 0.5rem;
}

body, html {
  background-color: #1a1a7e !important;
  margin: 0;
  padding: 0;
  height: 100%;
}

* {
  background-color: transparent !important;
}

.card {
  background-color: white !important;
  padding: 50px;
  border-radius: 25px;
  width: 1040px;
  margin: 30px auto;
  box-shadow: 0 4px 20px rgba(0,0,0,0.25);
}
@media (max-width: 940px) {
  .inputs-wrapper {
    flex-wrap: wrap;
    width: 100%;
  }

  .input-label {
    width: calc(50% - 10px);
  }
}
@media (max-width: 600px) {
  .inputs-wrapper {
    flex-direction: column;
  }

  .input-label {
    width: 100%;
  }
}
/* Tablets */
@media (max-width: 1021px) and (min-width: 774px) {

  .card {
    width: 90%;
    padding: 30px;
  }

  /* Evita que el texto se salga */
  .label,
  .monto-total,
  .num_contacto {
    white-space: normal;
  }

  /* Hace que la línea se adapte mejor sin romper */
  .recaudo-linea {
    flex-wrap: wrap;
    gap: 0.8rem;
  }

  input[type="date"] {
    width: 200px;
  }

  .titulosTabla,
  .fila {
    font-size: 1rem;
  }
}
@media (max-width: 1024px) {
  .card {
    width: 90%;
    padding: 30px;
  }

  .logo-main {
    height: 60px;
  }

  .monto-total {
    font-size: 1.4rem;
  }
}

/* Celulares grandes */
@media (max-width: 768px) {

  .card {
    width: 95%;
    padding: 25px;
  }

  .num_contacto {
    text-align: center;
    font-size: 1rem;
    margin-right: 0;
  }

  .recaudo-linea {
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
  }

  .label {
    font-size: 1rem;
  }

  input[type="date"] {
    width: 100%;
    max-width: 250px;
    font-size: 1rem;
  }

  .monto-total {
    font-size: 1.3rem;
  }

  .titulosTabla, .fila {
    font-size: 1rem;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 0.3rem;
  }
}

/* Celulares pequeños */
@media (max-width: 480px) {
  .logo-main {
    height: 50px;
  }

  .boton-logout {
    width: 100%;
    padding: 10px;
    font-size: 14px;
  }

  .monto-total {
    font-size: 1.2rem;
  }
}
@media (max-width: 600px) {
  .recaudo-linea {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>