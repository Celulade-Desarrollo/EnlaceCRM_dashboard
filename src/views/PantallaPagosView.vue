<script setup>
import { ref } from "vue";
import axios from "axios";
import BotonAtras from "../components/UI/BotonAtras.vue";
import { useRouter } from "vue-router";
import SesionExpiradaLogin from "../components/UI/SesionExpiradaLogin.vue";
import { activarSesionExpirada } from "../stores/session.js";

const token = localStorage.getItem("admin_token");

const router = useRouter();
// Descargar Excel
const exportarExcel = async () => {
  try {
    const res = await axios.get("/api/transacciones/excel", {
      responseType: "blob",
      headers: {
        Authorization: `Bearer ${token}`,
      },
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
    if (error.response?.status === 401) {
      activarSesionExpirada();
    }
  }
};

const logout = () => {
  localStorage.removeItem("admin_token");
  router.push("/LoginView");
};

// Refrescar / ver todas transacciones
const cargarTransacciones = async () => {
  try {
    const res = await axios.get("/api/transacciones", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Transacciones:", res.data);
    alert("Se actualizaron los datos.");
  } catch (error) {
    console.error("Error al refrescar:", error);
    alert("No se pudo refrescar.");
    if (error.response?.status === 401) {
      activarSesionExpirada();
    }
  }

};

</script>

<template>
    <BotonAtras />

<div class="card-botones">
  <h3 class="titulo-card">Utilización</h3>

  <div class="botones-container">
    <button class="btn" @click="cargarTransacciones">
      <img src="/public/actualizar.png" alt="Refrescar" />
      Refrescar
    </button>

    <button class="btn" @click="exportarExcel">
      <img src="/public/descargar.png" alt="Descargar Excel" />
      Descargar Excel
    </button>
  </div>
</div>

  <SesionExpiradaLogin />
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


.titulo-card {
  width: 100%;  
  text-align: center; 
  color: white;
  font-size: 1.6rem;
  font-weight: 500;
  margin-bottom: 50px;
}



.logout {
  display: flex;
  justify-content: right;
  margin-top: 1rem;
}
/* TARJETA */
.card-botones {
   display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 80px;
  padding:50px;
  height: auto;
  min-height: 70vh;
  background-color: #5c4cb8;
  border: 9px solid #251786;
  margin-top: 60px;
  flex-wrap: wrap;
  box-sizing: border-box;
}

/* CONTENEDOR DE BOTONES */
.botones-container {
  display: flex;
  gap: 30px;
  justify-content: center;
  padding:50px;

}

/* BOTONES */
.btn {
  background-color: #dd3590;
  color: white;
  font-size: 1rem;
  padding: 14px 26px;
  border: none;
  border-radius: 29px;
  cursor: pointer;
  min-width: 220px;
 display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: -40px;
  transform: translateY(-100px);
}

.btn img {
  width: 20px;
  height: 20px;
}

.btn:hover {
  background-color: #f15bab;
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


.btn:hover {
  background-color: #f15bab;
}
</style>