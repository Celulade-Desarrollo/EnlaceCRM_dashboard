<script setup>
import { onMounted, ref, computed } from 'vue'
import { motion } from 'motion-v'
import axios from 'axios'
import { activarSesionExpirada } from "../stores/session.js";
import { useRouter } from "vue-router";
import headerDis from "../components/UI/headerDis.vue";

const movimientosEnlace = ref([])
const fechaSeleccionada = ref(new Date().toISOString().substr(0, 10))
const busquedaFiltro = ref("")
const dateInputRef = ref(null)

const router = useRouter();

const formatoMiles = (numero) => {
  return new Intl.NumberFormat('es-ES').format(Number(numero || 0));
};

const fechaFormateada = computed(() => {
  if (!fechaSeleccionada.value) return '';
  const [year, month, day] = fechaSeleccionada.value.split('-');
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
});

const abrirCalendario = () => {
  if (dateInputRef.value) {
    if ('showPicker' in HTMLInputElement.prototype) {
      dateInputRef.value.showPicker();
    } else {
      dateInputRef.value.focus();
    }
  }
};

const movimientosDelDia = computed(() => {
  return movimientosEnlace.value.filter(mov => {
    const fechaMov = mov.FechaHoraMovimiento?.substring(0, 10);
    return fechaMov === fechaSeleccionada.value;
  });
});

const listaAgrupada = computed(() => {
  const mapa = new Map();

  movimientosDelDia.value.forEach(mov => {
    const key = `${mov.NombreRuta}_${mov.TelefonoTransportista}`;
    
    if (!mapa.has(key)) {
      mapa.set(key, {
        ruta: mov.NombreRuta || 'N/A',
        telefono: mov.TelefonoTransportista || 'N/A',
        facturas: new Set(),
        placas: new Set(),
        planillas: new Set(),
        totalRecaudado: 0
      });
    }

    const item = mapa.get(key);
    if (mov.NroFacturaAlpina) item.facturas.add(mov.NroFacturaAlpina);
    if (mov.Placa) item.placas.add(mov.Placa);
    if (mov.Planilla) item.planillas.add(mov.Planilla);
    
    item.totalRecaudado += Number(mov.Monto || 0);
  });

  const arrayAgrupado = Array.from(mapa.values()).map(item => ({
    ...item,
    facturaTexto: Array.from(item.facturas).join(', ') || 'N/A',
    placaTexto: Array.from(item.placas).join(', ') || 'N/A',
    planillaTexto: Array.from(item.planillas).join(', ') || 'N/A'
  }));

  if (!busquedaFiltro.value.trim()) return arrayAgrupado;

  const q = busquedaFiltro.value.toLowerCase();
  return arrayAgrupado.filter(item => 
    item.ruta.toLowerCase().includes(q) ||
    item.telefono.toString().includes(q) ||
    item.facturaTexto.toLowerCase().includes(q) ||
    item.placaTexto.toLowerCase().includes(q) ||
    item.planillaTexto.toLowerCase().includes(q)
  );
});

const totalRecaudo = computed(() => {
  return movimientosDelDia.value.reduce((acc, mov) => acc + (mov.Monto || 0), 0);
});

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
  <div class="pantalla-full">
    <headerDis />

    <main class="main-content">
      <motion.div class="full-width-container">
        <h1 class="main-title">Recaudo Diario</h1>

        <div class="top-row">
          <div class="date-picker-box">
            <span class="label-date">Fecha</span>
            <div class="input-date-wrapper" @click="abrirCalendario">
              <input 
                ref="dateInputRef"
                type="date" 
                v-model="fechaSeleccionada" 
                class="hidden-date-input" 
              />
              <div class="custom-date-display">
                <span>{{ fechaFormateada }}</span>
                <svg class="calendar-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
              </div>
            </div>
          </div>

          <div class="kpi-box">
            <div class="kpi-amount">$ {{ formatoMiles(totalRecaudo) }}</div>
            <div class="kpi-label">Total Recaudado Día</div>
          </div>
        </div>

        <div class="search-wrapper">
          <input
            type="text"
            v-model="busquedaFiltro"
            placeholder="Buscar por ruta, transportista, teléfono, factura, placa o planilla"
            class="search-input"
          />
          <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>

        <div class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th>Factura</th>
                <th>Ruta</th>
                <th>Teléfono</th>
                <th>Placa</th>
                <th>Planilla</th>
                <th>Total Recaudado</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in listaAgrupada" :key="index">
                <td class="col-secundaria">{{ item.facturaTexto }}</td>
                <td class="col-ruta">{{ item.ruta }}</td>
                <td class="col-telefono">{{ item.telefono }}</td>
                <td class="col-secundaria">{{ item.placaTexto }}</td>
                <td class="col-secundaria">{{ item.planillaTexto }}</td>
                <td class="col-monto">$ {{ formatoMiles(item.totalRecaudado) }}</td>
                <td></td>
              </tr>
              <tr v-if="listaAgrupada.length === 0">
                <td colspan="7" class="empty-state">
                  No hay registros de recaudo para los filtros seleccionados.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </motion.div>
    </main>
  </div>
</template>

<style scoped>
.pantalla-full {
  background-color: #ffffff;
  min-height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.main-content {
  flex: 1;
  padding: 32px 40px;
  display: flex;
  justify-content: center;
  background-color: #ffffff;
}

.full-width-container {
  width: 100%;
  max-width: 1400px;
}

.main-title {
  font-size: 24px;
  font-weight: 800;
  color: #000000;
  margin: 0 0 24px 0;
}

.top-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}

.label-date {
  font-size: 12px;
  color: #6b7280;
  display: block;
  margin-bottom: 6px;
}

.input-date-wrapper {
  position: relative;
  cursor: pointer;
  display: inline-block;
}

.hidden-date-input {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  pointer-events: none;
}

.custom-date-display {
  display: flex;
  align-items: center;
  gap: 16px;
  border: 1px solid #e5e7eb;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  color: #374151;
  background: #ffffff;
  user-select: none;
}

.custom-date-display:hover {
  border-color: #cbd5e1;
}

.calendar-icon {
  color: #6b7280;
}

.kpi-box {
  text-align: right;
}

.kpi-amount {
  font-size: 28px;
  font-weight: 800;
  color: #000000;
}

.kpi-label {
  font-size: 13px;
  color: #6b7280;
  margin-top: 2px;
}

.search-wrapper {
  position: relative;
  margin-bottom: 24px;
}

.search-input {
  width: 100%;
  padding: 12px 40px 12px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 14px;
  outline: none;
  box-sizing: border-box;
}

.search-input::placeholder {
  color: #9ca3af;
}

.search-icon {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: #6b7280;
  pointer-events: none;
}

.table-wrapper {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th {
  background-color: #f8fafc;
  color: #374151;
  font-size: 13px;
  font-weight: 700;
  text-align: left;
  padding: 12px 16px;
  border-bottom: 2px solid #e2e8f0;
  white-space: nowrap;
}

.data-table td {
  padding: 14px 16px;
  border-bottom: 1px solid #f1f5f9;
  font-size: 13.5px;
  color: #374151;
}

.col-ruta {
  font-weight: 500;
}

.col-telefono {
  font-weight: 600;
  color: #111827;
}

.col-secundaria {
  color: #4b5563;
}

.col-monto {
  font-weight: 700;
  color: #111827;
}

.empty-state {
  text-align: center;
  color: #9ca3af;
  padding: 30px;
}
</style>