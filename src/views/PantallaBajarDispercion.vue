<script setup>
import { onMounted, ref, computed } from 'vue'
import axios from 'axios'
import BotonAtras from "../components/UI/BotonAtras.vue"
import { fadeInUp } from "../motion/pageAnimation";
import { motion } from "motion-v";
import * as XLSX from "xlsx";
import SesionExpiradaLogin from "../components/UI/SesionExpiradaLogin.vue";
import { activarSesionExpirada } from "../stores/session.js"

const mesAnoSeleccionado = ref(new Date().toISOString().slice(0,7));

const meses = [
  'Enero', 'Febrero', 'Marzo', 'Abril',
  'Mayo', 'Junio', 'Julio', 'Agosto',
  'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const dispersiones = ref([])
const confirmacionBanco = ref("");
const mensajeError = ref("");
const dispersionId = ref(null);
const token = localStorage.getItem("admin_token");

const mesANumero = (mes) => ({
  Enero: 0, Febrero: 1, Marzo: 2, Abril: 3,
  Mayo: 4, Junio: 5, Julio: 6, Agosto: 7,
  Septiembre: 8, Octubre: 9, Noviembre: 10, Diciembre: 11
}[mes])

const formatearMiles = (valor) => {
  if (!valor) return ''
  return valor.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

const limpiarNumero = (valor) => valor.replace(/\./g, '')


const filasFiltradas = computed(() => {
  return dispersiones.value.filter(d => {
    if (!d.fecha) return false;
    const fecha = new Date(d.fecha);
    const fechaString = `${fecha.getFullYear()}-${String(fecha.getMonth()+1).padStart(2, '0')}`;
    return fechaString === mesAnoSeleccionado.value;
  });
});

async function downloadExcel() {
  try {
    const response = await axios.get("/api/listar/dispersion", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = response.data;
    
    const dataArray = Array.isArray(data) ? data : [data];

     const formattedData = dataArray.map(item => ({
      ...item,
      
      tesoreria_status: item.tesoreria_status === true
        ? "Confirmado"  
        : "No confirmado",
      banco_status: item.banco_status === true
        ? "Confirmado"
        : "No confirmado",
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Datos");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "historicoDispersiones.xlsx");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error al generar Excel:", error);
    alert("No se pudo descargar el archivo");
    if (error.response?.status === 401) {
      activarSesionExpirada();
    }
  }
};
const handleguardarConfirmar = async () => {
  const filasConfirmadas = dispersiones.value.filter(f => f.confirmacion === true && f.banco_status !== true);
    if (filasConfirmadas.length === 0) {
    mensajeError.value = "Debes confirmar al menos una dispersión para guardar";
    return;
  }

  mensajeError.value = "";

try {
  for (const fila of filasConfirmadas) {
    await axios.put(`/api/editar-dispersion/estadoBanco/${fila.id}`,
      {estado: true},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
  }

    window.location.reload();

} catch (error) {
    console.error("Error al guardar confirmación:", error);
     if (error.response?.status === 401) {
      activarSesionExpirada();
    }
  }
}

onMounted(async () => {
  try {
    const dispersionesData = await axios.get("/api/listar/dispersion", 
      {
          headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    )
    dispersiones.value = dispersionesData.data.map(fila => ({
      ...fila,
      confirmacion: fila.banco_status === true ? true : false
    }))
    console.log("dispersiones", dispersionesData.data)
  } catch (error) {
    console.error("Error cargando dispersiones", error)
     if (error.response?.status === 401) {
      activarSesionExpirada();
    }
  }
});
</script>

<template>
  <BotonAtras />
  <motion.div v-bind="fadeInUp">
    <div class="descargar-container">
      <button @click="downloadExcel" class="boton">
        <img src="/public/descargar.png" alt="Descargar Excel" class="icono-btn" />
        Descargar Excel
      </button>
    </div>
    <div class="contenedor">
      <div class="top">
        <div class="box">
          <span class="label-mes">Mes y Año</span>
            <input 
              type="month" 
              v-model="mesAnoSeleccionado" 
              class="select-mes"
            />
        </div>
      </div>
      <div class="tabla">
        <div class="thead">
          <div>Fecha</div>
          <div>Recaudo</div>
          <div>Dispersión</div>
          <div>Confirmación</div>
        </div>
        <div class="row" v-for="fila in filasFiltradas" :key="fila.id">
          <div class="celda-valor">{{ fila.fecha.split('T')[0] }}</div>
          <div class="celda-valor">{{ formatearMiles(fila.recaudo) }}</div>
          <div class="celda-valor">{{ fila.dispersion }}</div>
          <div>
            <select
              class="form-control text-center"
              v-model="fila.confirmacion"
              :disabled="fila.banco_status === true"
            >
              <option :value="false">Selecciona</option>
              <option :value="true">Confirmado</option>
            </select>
          </div>
        </div>
      </div>
      <div class="acciones">
        <button class="btn primary" @click="handleguardarConfirmar">
          Guardar
        </button>
      </div>
      <div v-if="mensajeError" style="color: red; margin-bottom: 1rem; text-align: center;">
        {{ mensajeError }}
      </div>
    </div>
  <SesionExpiradaLogin />
  </motion.div>
</template>

<style scoped>
.descargar-container {
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
}
.boton {
  background-color: #dd3590;
  color: white;
  padding: 12px 50px;
  border: none;
  border-radius: 20px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
  outline: none;
  box-shadow: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
} 
.boton:hover {
  background-color: #f15bab;
}
.icono-btn {
  width: 20px;
  height: 20px;
}
/* CONTENEDOR */
.contenedor {
  width: 700px;
  margin: 40px auto;
  padding: 30px;
  background: #f4f7fb;
  border-radius: 12px;
  font-family: 'Segoe UI', Arial, sans-serif;
}

/* ENCABEZADO */
.top {
  display: flex;
  justify-content: space-between;
  margin-bottom: 25px;
}

.box {
  background: #251886;
  padding: 10px 20px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.label-mes {
  font-size: 13px;
  color: #cfe8f1;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.select-mes {
  background: transparent;
  border: none;
  color: white;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  padding: 2px 1px;
  height: 22px;
}

.select-mes option {
  color: black;
}


.tabla {
  background: white ;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
}


.thead {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr; /* 4 columnas ahora */
  background: #251886;
  color: white;
  padding: 12px;
  font-weight: 600;
  text-align: center;
}

.row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr; /* 4 columnas */
  gap: 15px;
  padding: 22px;
  align-items: center;
  border-bottom: 1px solid #e6e6e6;
}



.celda-valor {
  padding: 8px;
  text-align: center;
  border-radius: 6px;
  border: 1.5px solid #cfd8dc;
  background: #f4f7fb;
}

/* SELECT DENTRO DE TABLA */
select {
  padding: 6px;
  border-radius: 6px;
  border: 1px solid #cfd8dc;
  text-align: center;
  background: white;
  cursor: pointer;
}

/* BOTONES */
.acciones {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.btn {
  padding: 12px 28px;
  border-radius: 30px;
  font-size: 15px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: 0.25s;
}

.primary {
  background: #E83E8C;
  color: white;
}

.primary:hover {
  background: #f15bab;
  transform: translateY(-2px);
}
</style>