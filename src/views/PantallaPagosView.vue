<script setup>
import { ref } from "vue";
import axios from "axios";

// Token almacenado
const token = localStorage.getItem("admin_token");

// Configuración de Axios
const api = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: { 
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
});

// Descargar Excel
const exportarExcel = async () => {
  try {
    const res = await api.get("/transacciones/excel", {
      responseType: "blob",
    });

    // Crear enlace temporal para descargar
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "transacciones.xlsx");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url); // Liberar memoria
  } catch (error) {
    console.error("Error al descargar el Excel:", error);
    alert("No se pudo descargar el archivo Excel.");
  }
};

// Refrescar / ver todas transacciones
const cargarTransacciones = async () => {
  try {
    const res = await api.get("/transacciones");
    console.log("Transacciones:", res.data); // opcional, ver en consola
    alert("Se actualizaron los datos.");
  } catch (error) {
    console.error("Error al refrescar:", error);
    alert("No se pudo refrescar.");
  }
};
</script>

<template>
  <section class="logo-container">
    <img
      src="/public/enlaceFiado.png"
      alt="logo Enlace CRM"
      class="logo-main"
    />
  </section>
         <p class="titulo">Hola, Administrador banco w</p>

  <div class="botones-container">
    <button class="btn" @click="cargarTransacciones">Refrescar</button>
    <button class="btn" @click="exportarExcel">Descargar Excel</button>
  </div>
</template>

<style scoped>

.titulo {
  font-size: 1.5rem;
  font-weight: bold;
  color:white;
  margin-bottom: 10px;
  margin-left: -200px;
    margin-top: 20px;
  
}

.botones-container {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
}

.logo-main {
  width: min(195px, 80%);
  height: auto;
  display: block;
  margin: 20px auto 0 auto;
    margin-top: 100px;
}

.btn {
  background-color: #dd3590;
  color: white;
  font-size: 1.25rem;
  font-weight: normal;
  padding: 1rem 1rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background 0.2s;
  border-radius: 25px;
  min-width: 250px;
  text-align: center;

}

.btn:hover {
  background-color: #dd3590;
}
</style>