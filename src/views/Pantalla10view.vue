<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import Heading from "../components/UI/Heading.vue";
import { fadeInUp } from "../motion/pageAnimation";
import { motion } from "motion-v";
import * as XLSX from "xlsx";
import CreditBancoCard from "../components/UI/CreditBancoCard.vue";
import axios from "axios";
import SesionExpiradaLogin from "../components/UI/SesionExpiradaLogin.vue";
import { activarSesionExpirada } from "../stores/session.js";
import BotonAtras from "../components/UI/BotonAtras.vue";

const creditDataRecords = ref([]);
const bancowData = ref([]);

const token = localStorage.getItem("admin_token");
const company = localStorage.getItem("company");

const router = useRouter();

const logout = () => {
  localStorage.removeItem("admin_token");
  localStorage.removeItem("company");
  localStorage.removeItem("admin_tipo");
  localStorage.removeItem("admin_userData");
  localStorage.removeItem("admin_isAuthenticated");
  router.push("/LoginView");
};

onMounted(async () => {
  if (!token || company !== "bancow" || company == null) {
    router.push("/LoginView");
    return;
  }

  try {
    // Trae los registros con Scoring, Cupo, Latitud, Longitud, etc.
    const pendientesRes = await axios.get(
      "api/scoring/estado/pendiente-aprobado-confirmado",
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const bancowRes = await axios.get("api/bancow", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    creditDataRecords.value = pendientesRes.data;
    bancowData.value = bancowRes.data;
  } catch (error) {
    console.error("Error cargando datos:", error);
    if (error.response?.status === 401) {
      activarSesionExpirada();
    }
  }
});

async function downloadExcel() {
  try {
    const response = await axios.get("api/excel", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = response.data;
    
    // 🔍 LOGS PARA DEBUGGING - AGREGADOS AQUÍ
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
    link.setAttribute("download", "historicoUsuarios.xlsx");
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
      <BotonAtras />

  <motion.div v-bind="fadeInUp">
    <div class="descargar-container">
<button @click="downloadExcel" class="boton">
  <img src="/public/descargar.png" alt="Descargar Excel" class="icono-btn" />
  Descargar Excel
</button>

 