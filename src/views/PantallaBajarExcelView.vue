<script setup>
import axios from "axios";
import * as XLSX from "xlsx";

const token = localStorage.getItem("admin_token");
const company = localStorage.getItem("company");

async function downloadAbonosExcel() {
  try {
    const response = await axios.get("http://localhost:3000/api/bajarAbonos", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = response.data;

    // Verificamos que venga como array
    const dataArray = Array.isArray(data) ? data : [data];

    // Si quieres transformar los datos antes de exportar, lo puedes hacer aquí
    const dataTransformada = dataArray.map((row) => {
      return {
        ...row,
        // Ejemplo: renombrar o quitar campos
        // NuevoCampo: row.algo
      };
    });

    // Crear la hoja excel
    const worksheet = XLSX.utils.json_to_sheet(dataTransformada);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Abonos");

    // Generar archivo Excel en buffer
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    // Crear blob para descargar
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
  }
}
</script>

<template>
  <div class="subir-excel">
    <div class="boton-container">
      <button class="boton" @click="downloadAbonosExcel">
        Descargar Abonos
      </button>
    </div>
  </div>
</template>

<style scoped>
.boton-container {
  text-align: center;
  margin: 30px 0;
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
