<script setup>
import { ref, } from "vue";
import { useRouter } from "vue-router";
import Heading from "../components/UI/Heading.vue";
import { fadeInUp } from "../motion/pageAnimation";
import { motion } from "motion-v";
import * as XLSX from 'xlsx';

const creditDataRecords = ref([]);
const router = useRouter();


async function downloadExcel() {
  try {
    const response = await fetch('http://localhost:8080/api/flujoRegistroEnlace/estado/pendiente');
    if (!response.ok) throw new Error('Error al obtener datos');
    const data = await response.json();

    // Si data no es un array, lo envolvemos en uno
    const dataArray = Array.isArray(data) ? data : [data];

    // se quita el campo id
    const dataSinId = dataArray.map(({ Id, ...rest }) => rest);

    // crear la hoja excel
    const worksheet = XLSX.utils.json_to_sheet(dataSinId);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Datos');

    // Generar archivo Excel en buffer

    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    // Crear blob para descargar
    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    //toma el Blob (archivo en memoria) que se genro antes y lo convierte en una URL temporal del navegador
    // que apunta a ese archivo.
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    //Asigna la URL del blob
    link.href = url;
    //esto le dice al navegador no abras el archivo, descargalo
    link.setAttribute('download', 'historicoUsuariosPendientes.xlsx');
     //agrega el enlace temporalmente al DOM (al documento HTML).
    //esto es necesario para poder hacerle clic desde el script.
    document.body.appendChild(link);
    link.click();
    //elimina el enlace del DOM para que no se quede ahí ocupando memoria.
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

  } catch (error) {
    console.error('Error al generar Excel:', error);
    alert('No se pudo descargar el archivo');
  }
}
</script>
<template>
  <motion.div v-bind="fadeInUp">
    <section class="logo-container">
      <img
        src="/public/enlaceFiado.png"
        alt="logo Enlace CRM"
        class="logo-main"
      />
    </section>

    <Heading
      :mensaje="creditDataRecords?.[0]?.nombre ? `Hola, ${creditDataRecords[0].nombre}` : 'Hola, Administrador'"
    />

    <div class="descargar-container">
      <button  @click="downloadExcel" class="boton">
        Descargar Excel
      </button>
    </div>
  </motion.div>
</template>

<style scoped>
.logo-container {
  text-align: center;
  margin-block: 1.5rem;
}

.logo-main {
  width: min(180px, 80%);
  height: auto;
  display: inline;
}

.content {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  align-items: center;
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
</style>
