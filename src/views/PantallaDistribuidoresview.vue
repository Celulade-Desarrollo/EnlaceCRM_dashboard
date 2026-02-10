<script setup>
import { onMounted, ref, computed } from 'vue'
import { motion } from 'motion-v'
import axios from 'axios'
import { activarSesionExpirada } from "../stores/session.js";
import { useRouter } from "vue-router";
import headerDis from "../components/UI/headerDis.vue";

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
    <headerDis />
  <motion.div class="pantalla">
    <div class="num_contacto">
      Contacta soporte al siguiente número: 319-662-2476
    </div>

    <div class="card">
      <div class="top">
        <div class="box">
          <span class="label-mes">Total recaudo del día:</span>
          <input type="date" v-model="fechaSeleccionada" />
          <span class="monto-header">
            $ {{ formatoMiles(totalRecaudo) }}
          </span>
        </div>
      </div>

      <!-- FILTROS -->
      <div class="inputs-wrapper">
        <label class="input-label">
          <input class="form-control" type="text" v-model="filtroFactura" placeholder="" />
          <span class="floating-label">Buscar factura</span>
        </label>

        <label class="input-label">
          <input class="form-control" type="text" v-model="filtroTelefono" placeholder="" />
          <span class="floating-label">Buscar teléfono</span>
        </label>
      </div>

      <!-- TABLA -->
      <section class="tabla">
        <div class="thead">
          <div>Factura</div>
          <div>Teléfono Transportista</div>
          <div>Monto</div>
        </div>

        <div
          class="row"
          v-for="mov in movimientosFiltrados"
          :key="mov.IdMovimiento"
        >
          <input type="text" :value="mov.NroFacturaAlpina" disabled />
          <input type="text" :value="mov.TelefonoTransportista" disabled />
          <input type="text" :value="`$ ${formatoMiles(mov.Monto)}`" disabled />
        </div>
      </section>
    </div>
  </motion.div>
</template>

<style scoped>

.pantalla {
  background: #251886;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 40px;
  font-family: 'Segoe UI', Arial, sans-serif;
}
.logo-container {
  margin-bottom: 20px;
}

.logo-main {
  height: 70px;
}

.logout {
  width: 100%;
  max-width: 900px;
  display: flex;
  justify-content: flex-end;
}

.boton-logout {
  padding: 10px 30px;
  border-radius: 20px;
  border: none;
  background: #dd3590;
  color: white;
  font-weight: 600;
  cursor: pointer;
}

.boton-logout:hover {
  background: #f15bab;
}

.num_contacto {
  color: white;
  font-weight: bold;
  width: 100%;
  max-width: 900px;
  text-align: right;
  margin: 15px 0;
  transform: translateX(-100px);
}
.card {
  width: 700px;
  background: #f4f7fb;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(0,0,0,0.2);
}

.top {
  display: flex;
  justify-content: center;
  margin-bottom: 25px;
}

.box {
  background: #251886;
  padding: 16px 25px;
  border-radius: 15px;
}

.header-recaudo {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.label-mes {
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  white-space: nowrap;
  transform: translateX(-30px);
}


input[type="date"] {
  background: transparent;
  border: none;
  border-bottom: 2px solid white;
  color: white;
  font-size: 14px;
  padding-bottom: 2px;
}

.monto-header {
  color: white;
  font-size: 1.6rem;
  font-weight: bold;
}

.monto-header {
  color: white;
  font-size: 1.6rem;
  font-weight: bold;
}

input[type="date"] {
  background: transparent;
  border: none;
  border-bottom: 2px solid #ffffff;
  color: white;
  margin: 5px 0;
  transform: translateX(8px);
}


.inputs-wrapper {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
}

.input-label {
  position: relative;
  width: 100%;
  outline: none;
}

.form-control {
  width: 100%;
  border: none;
  outline: none;
  border-bottom: 2px solid #251886;
  padding: 8px 0;
  background: transparent;
}

.floating-label {
  position: absolute;
  top: 8px;
  left: 0;
  font-size: 14px;
  outline: none;
  box-shadow: none;
  transition: 0.3s;
  
}

.form-control:focus + .floating-label,
.form-control:not(:placeholder-shown) + .floating-label {
  top: -12px;
  font-size: 11px;
  outline: none;
  box-shadow: none;
  border-color: #251886; /* o transparent */
}

.tabla {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  
}

.thead {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  background: #251886;
  color: white;
  padding: 12px;
  font-weight: 600;
  text-align: center;
}

.row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 15px;
  padding: 18px;
  border-bottom: 1px solid #ffffff;
}

.row:hover {
  background: #ffffff;
}

.row input {
  border: 1.5px solid #ffffff;
  border-radius: 6px;
  padding: 8px;
  text-align: center;
  background: #f9fafb;
}

@media (max-width: 768px) {
  .card {
    width: 95%;
  }

  .inputs-wrapper {
    flex-direction: column;
  }

  .num_contacto {
    text-align: center;
  }
}

:deep(input:focus),
:deep(input:focus-visible),
:deep(input:active) {
  outline: none !important;
  box-shadow: none !important;
}

/* Chrome / Edge focus ring */
:deep(input[type="text"]:focus-visible) {
  outline: none !important;
  box-shadow: none !important;
}

/* Autofill / focus interno */
:deep(input:-webkit-autofill),
:deep(input:-webkit-autofill:focus) {
  -webkit-box-shadow: 0 0 0 1000px #f4f7fb inset !important;
  box-shadow: 0 0 0 1000px #f4f7fb inset !important;
  -webkit-text-fill-color: #000 !important;
}

/* Evitar highlight azul al click */
:deep(*) {
  -webkit-tap-highlight-color: transparent;
}

</style>
