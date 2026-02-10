<script setup>
import axios from "axios";
import * as XLSX from "xlsx";
import { motion } from "motion-v";
import SesionExpiradaLogin from "../components/UI/SesionExpiradaLogin.vue";
import { activarSesionExpirada } from "../stores/session.js";
import HeadingEnlace from '../components/UI/headingEnlace.vue'

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
  <HeadingEnlace />
  <motion.div v-bind="fadeInUp"    <div class="main-container">
    <div class="card">
      <button class="btn" @click="downloadAbonosExcel">
        <img src="/descargar.png" alt="Descargar abonos " class="icon" />
        <span>Descargar abonos 
</span>
      </button>
    </div>
    <SesionExpiradaLogin />
  </motion.div>
</template>

<style scoped>
.main-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 80px;
  padding: 60px;
  height: auto;
  min-height: 70vh;
  background-color: #3A2CA8;
  border: 9px solid #251786;
  margin-top: 70px;
  flex-wrap: wrap;
  box-sizing: border-box;
}

.card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 20px;
  width: 280px;
  min-height: 260px;
  background-color: #3A2CA8;
  border: none;
  outline: none;
  box-shadow: none;
  transition: transform 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
}


.btn {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #5A44D1;
  color: white;
  font-size: 20px;
  font-weight: 600;
  padding: 16px 35px;
  border: 2px solid #6C63FF;
  border-radius: 25px;
  cursor: pointer;
  width: 320px;
  height: 120px;
  transition: all 0.3s ease;
  box-shadow: 2px 3px 5px rgba(0, 0, 0, 0.25);
}

.btn:hover {
  background-color: #3A2CA8;
  transform: scale(1.05);
}


.icon {
  position: absolute;
  top: 8px;    
  left: 15px;
  width: 38px;
  height: 48px;
  object-fit: contain;
  transition: transform 0.3s ease;
}


.btn:hover .icon {
  transform: scale(1.2);
}
@media (max-width: 1024px) {
  .main-container {
    gap: 50px;
    padding: 40px;
  }

  .card {
    width: 240px;
  }
}

@media (max-width: 768px) {
  .main-container {
    flex-direction: column;
    align-items: center;
    gap: 40px;
    padding: 30px;
    border-width: 7px;
  }

  .card {
    width: 80%;
    max-width: 300px;
  }

  .btn {
    font-size: 16px;
    padding: 10px 28px;
  }

}

@media (max-width: 480px) {
  .main-container {
    border-width: 6px;
    padding: 20px;
  }

  .card {
    width: 100%;
    max-width: 280px;
  }

  .btn {
    font-size: 15px;
    padding: 10px 20px;
  }
}
</style>

