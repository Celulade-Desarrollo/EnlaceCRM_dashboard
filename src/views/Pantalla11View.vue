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
import heading from '../components/UI/headingEnlace.vue'
import HeadingEnlace from '../components/UI/headingEnlace.vue'
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
 const MODO_PRUEBA = true;

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

// mostrar exel
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
    const nombreTienda = Array.isArray(rest.Nombre_Tienda)
      ? rest.Nombre_Tienda.find(v => v) || ""
      : rest.Nombre_Tienda ?? "";

    return {
      ...rest,

      Nombre_Tienda: nombreTienda,

      Autorizacion_Habeas_Data: rest.Autorizacion_Habeas_Data ? "Sí" : "No",
      Autorizacion_Medios_de_Contacto:
        rest.Autorizacion_Medios_de_Contacto ? "Sí" : "No",
      Registrado_Camara_Comercio:
        rest.Registrado_Camara_Comercio ? "Sí" : "No",
      Declara_Renta: rest.Declara_Renta ? "Sí" : "No",
      Esta_obligado_a_tener_RUT_por_tu_actividad_economica:
        rest.Esta_obligado_a_tener_RUT_por_tu_actividad_economica ? "Sí" : "No",
      Persona_expuesta_politicamente_PEP:
        rest.Persona_expuesta_politicamente_PEP ? "Sí" : "No",
      Familiar_expuesto_politicamente_PEP:
        rest.Familiar_expuesto_politicamente_PEP ? "Sí" : "No",
      Operaciones_moneda_extranjera:
        rest.Operaciones_moneda_extranjera ? "Sí" : "No",
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
    <HeadingEnlace />
  <motion.div v-bind="fadeInUp">

    <div class="descargar-container">
      <button class="boton" @click="downloadExcel">
        <img src="/descargar.png" alt="Descargar Excel  " class="icon" />
        <span>Descargar Excel  
</span>
      </button>
    </div>

    <section class="content">
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
  position: relative;
   top: 10px; 
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #5A44D1;
  color: white;
  font-size: 20px;
  font-weight: 600;
  padding: 16px 20px;
  border: 2px solid #6C63FF;
  border-radius: 20px;
  cursor: pointer;
  width: 310px;
  transition: all 0.3s ease;
}
.icon {
  position: absolute;
  top: 8px;    
  left: 10px;
  width: 35px;
  height: 35px;
  object-fit: contain;
  transition: transform 0.3s ease;
}


.boton:hover {
  background-color: #3A2CA8;
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
  background: #5A44D1;
  color: #fff;
  outline: none;
  border: none;
}
.boton-logout:hover {
  background-color: #3A2CA8;
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
  background: #5A44D1;
  color: #fff;
  outline: none;
  border: none;
}
.boton-enviar:hover {
  background-color: #3A2CA8;
}
</style>