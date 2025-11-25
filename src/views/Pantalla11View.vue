<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import ScoringEnlaceCard from '../components/UI/scoringEnlaceCard.vue'
import Heading from '../components/UI/Heading.vue'
import { useRouter } from 'vue-router'
import { motion } from 'motion-v'
import SesionExpiradaLogin from "../components/UI/SesionExpiradaLogin.vue";
import { activarSesionExpirada } from "../stores/session.js";
import * as XLSX from "xlsx";

const clientes = ref([])
const creditDataRecords = ref([])
const router = useRouter()
const scoringData = ref([]);
const token = localStorage.getItem("admin_token");
const company = localStorage.getItem("company");
const bancowData = ref([])
  
console.log("Token:", token);
console.log("Company:", company);

const logout = () => {  
  localStorage.removeItem("admin_token");
  localStorage.removeItem("company");
  localStorage.removeItem("admin_tipo");
  localStorage.removeItem("admin_userData");
  localStorage.removeItem("admin_isAuthenticated");

  router.push("/LoginView");
}

onMounted(async () => {
  // si no hay token o el company no es "enlace", redirige
  if (!token || company !== "enlace" || company == null) {
    router.push("/LoginView"); 
    return
  }

  try {
    const response = await axios.get('api/flujoRegistroEnlace/estado/pendiente-aprobado', {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    const scoringRes = await axios.get(
      'api/scoring',
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const bancowRes = await axios.get(
      'api/bancow',
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
  
    scoringData.value = scoringRes.data;
    creditDataRecords.value = response.data
    bancowData.value = bancowRes.data;
  } catch (error) {
    console.error('Error cargando datos:', error)
    if (error.response?.status === 401) {
      activarSesionExpirada();
    }
  }
});


// FUNCIÓN DESCARGAR EXCEL
async function downloadExcel() {
  try {
    const response = await axios.get("api/excel", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = response.data;
    
    console.log("🔍 Datos completos del API:", data[0]);
    console.log("🔍 Latitud:", data[0]?.Latitud);
    console.log("🔍 Longitud:", data[0]?.Longitud);
    console.log("🔍 Todas las propiedades:", Object.keys(data[0]));
    
    const dataArray = Array.isArray(data) ? data : [data];

    const dataTransformada = dataArray.map(
      ({
        Id,
        Estado_Scoring,
        Numero_de_Cliente_Alpina,
        nbCliente,
        nbAgenteComercial,
        Estado,
        ...rest
      }) => {
        return {
          ...rest,
          Autorizacion_Habeas_Data: rest.Autorizacion_Habeas_Data ? "Sí" : "No",
          Autorizacion_Medios_de_Contacto: rest.Autorizacion_Medios_de_Contacto
            ? "Sí"
            : "No",
          Registrado_Camara_Comercio: rest.Registrado_Camara_Comercio
            ? "Sí"
            : "No",
          Declara_Renta: rest.Declara_Renta ? "Sí" : "No",
          Esta_obligado_a_tener_RUT_por_tu_actividad_economica:
            rest.Esta_obligado_a_tener_RUT_por_tu_actividad_economica
              ? "Sí"
              : "No",
          Persona_expuesta_politicamente_PEP:
            rest.Persona_expuesta_politicamente_PEP ? "Sí" : "No",
          Familiar_expuesto_politicamente_PEP:
            rest.Familiar_expuesto_politicamente_PEP ? "Sí" : "No",
          Operaciones_moneda_extranjera: rest.Operaciones_moneda_extranjera
            ? "Sí"
            : "No",
          Declaracion_de_nacionalidad_y_residencia_fiscal_en_Colombia:
            rest.Declaracion_de_nacionalidad_y_residencia_fiscal_en_Colombia
              ? "Sí"
              : "No",
          Latitud: rest.Latitud || "",
          Longitud: rest.Longitud || "",
          Estado: Estado,
        };
      }
    );

    const worksheet = XLSX.utils.json_to_sheet(dataTransformada);
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
    link.setAttribute("download", "historicoUsuariosEnlace.xlsx");
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
}
</script>

<template>
  <motion.div v-bind="fadeInUp">
    <section class="logo-container">
      <img src="/public/enlaceFiado.png" alt="logo Enlace CRM" class="logo-main" />
      <!-- <Heading :mensaje="'Hola, Administrador'" /> -->
    </section>
      <p class="titulo">Hola, Administrador enlaceCRM</p>

    <div class="descargar-container">
      <button @click="downloadExcel" class="boton">
        Descargar Excel
      </button>
    </div>

    <section class="content">
      <div class="logout">
        <button class="boton-logout" @click="logout">Cerrar sesión</button>
      </div>
      <ScoringEnlaceCard
        v-for="record in creditDataRecords"
        :key="record.id"
        :data="record"
        :token= "token"
        :bancowData= "bancowData"
        :scoringData="scoringData"
      />
    </section>
    <SesionExpiradaLogin />
  </motion.div>
</template>

<style scoped>
.titulo {
  font-size: 1.5rem;
  font-weight: bold;
  color:white;
  margin-bottom: 10px;
}

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
}

.boton:hover {
  background-color: #f15bab;
}


.logout {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
}
.boton-logout {
  padding: 10px 30px;
  font-size: 15px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  background: #dd3590;
  color: #fff;
  outline: none;
  border: none;
}
.boton-logout:hover {
  background-color: #f15bab;
}
.logo-container {
  text-align: center;
  margin-block: 1.5rem;
}
.logo-main {
  width: min(180px, 80%);
  height: auto;
  display: inline;
}

.tarjeta-acciones {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
}
.boton-enviar {
  padding: 10px 30px;
  font-size: 15px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  background: #dd3590;
  color: #fff;
  outline: none;
  border: none;
}
.boton-enviar:hover {
  background-color: #f15bab;
}
</style>