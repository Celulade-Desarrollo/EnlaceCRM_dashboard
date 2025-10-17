<script setup>
import axios from "axios";
import * as XLSX from "xlsx";
import { motion } from "motion-v";
import SesionExpiradaLogin from "../components/UI/SesionExpiradaLogin.vue";
import { activarSesionExpirada } from "../stores/session.js";

const token = localStorage.getItem("admin_token");
const company = localStorage.getItem("company");

async function downloadAbonosExcel() {
  try {
    const response = await axios.get("api/bajarAbonos", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = response.data;

    const dataArray = Array.isArray(data) ? data : [data];

    const dataTransformada = dataArray.map((row) => ({ ...row }));

    const worksheet = XLSX.utils.json_to_sheet(dataTransformada);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Abonos");

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
    link.setAttribute("download", "abonos.xlsx");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error al descargar Abonos:", error);
    alert("No se pudo descargar el archivo de abonos");
    if (error.response?.status === 401) {
      activarSesionExpirada();
    }
  }
}
</script>

<template>
  <motion.div v-bind="fadeInUp" class="page-container">
    <section class="logo-container">
      <img
        src="/public/enlaceFiado.png"
        alt="logo Enlace CRM"
        class="logo-main"
      />
    </section>
    <p class="titulo">Hola, Administrador enlaceCRM</p>
    <div class="boton-container">
      <button class="boton" @click="downloadAbonosExcel">
        Descargar Abonos
      </button>
    </div>
    <SesionExpiradaLogin />
  </motion.div>
</template>

<style scoped>
/* Contenedor principal que centra todo */
.page-container {
  display: flex;
  flex-direction: column;
  justify-content: center; /* centra vertical */
  align-items: center;     /* centra horizontal */
  min-height: 100vh;       /* ocupa toda la pantalla */
  text-align: center;
}

.logo-main {
  width: min(180px, 80%);
  height: auto;
  display: inline;
  margin-bottom: 1rem;
}

.titulo {
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
  margin-bottom: 20px;
}

.boton-container {
  text-align: center;
  margin-top: 20px;
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
</style>

