<script setup>
import { ref } from "vue";
import axios from "axios";
import BotonAtras from "../components/UI/BotonAtras.vue";
import { useRouter } from "vue-router";
import SesionExpiradaLogin from "../components/UI/SesionExpiradaLogin.vue";
import { activarSesionExpirada } from "../stores/session.js";

const token = localStorage.getItem("admin_token");
const router = useRouter();
const cargando = ref(false);

/* ============================================================
   1. TRANSACCIONES
   ============================================================ */
const exportarExcel = async () => {
  try {
    const res = await axios.get("/api/transacciones/excel", {
      responseType: "blob",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "transacciones.xlsx");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error al descargar el Excel:", error);
    alert("No se pudo descargar el archivo Excel.");
    if (error.response?.status === 401) activarSesionExpirada();
  }
};

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
    if (error.response?.status === 401) activarSesionExpirada();
  }
};

/* ============================================================
   2. SUBIR EXCEL (UTILIZACION)
   ============================================================ */
const inputArchivo = ref(null);

const abrirSelectorArchivo = () => {
  inputArchivo.value.click();
};

const manejarArchivo = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);

  cargando.value = true;
  try {
    await axios.post("/api/utilizacion/subir-banco", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    alert("Excel de intereses subido correctamente ✅");
  } catch (error) {
    console.error("Error al subir Excel:", error);
    alert("No se pudo subir el Excel de intereses.");
    if (error.response?.status === 401) activarSesionExpirada();
  } finally {
    cargando.value = false;
    event.target.value = "";
  }
};

/* ============================================================
   4. LOGOUT
   ============================================================ */
const logout = () => {
  localStorage.removeItem("admin_token");
  router.push("/LoginView");
};
</script>

<template>
  <BotonAtras />

  <div class="card-botones">
    <h3 class="titulo-card">Módulo de Utilización</h3>

    <div class="botones-container">

      <div class="bloque-boton">
        <button class="btn" @click="exportarExcel" :disabled="cargando">
          <img src="/descargar.png" alt="Descargar Excel" />
          Descargar Excel
        </button>
        <div class="descripcion">
          Descarga de la utilización del crédito por los tenderos
        </div>
      </div>

      <div class="bloque-boton">
        <button class="btn" @click="abrirSelectorArchivo" :disabled="cargando">
          <img src="/archivo.png" alt="Subir Excel" />
          {{ cargando ? 'Subiendo...' : 'Subir Excel' }}
        </button>
        <input
          type="file"
          ref="inputArchivo"
          accept=".xlsx,.xls"
          style="display:none"
          @change="manejarArchivo"
        />
        <div class="descripcion">
          Carga de intereses proyectados definidos por el core bancario
        </div>
      </div>

    </div>
  </div>

  <SesionExpiradaLogin />
</template>

<style scoped>
/* Tus estilos originales se mantienen perfectos */
.btn:disabled {
  background-color: #a5a5a5;
  cursor: not-allowed;
}

/* TARJETA PRINCIPAL */
.card-botones {
  padding: 60px;
  min-height: 70vh;
  background-color: #5c4cb8;
  border: 9px solid #251786;
  margin-top: 60px;
  box-sizing: border-box;
  text-align: center;
}

/* TITULO */
.titulo-card {
  color: white;
  font-size: 1.6rem;
  font-weight: 500;
  margin-bottom: 50px;
}

/* CONTENEDOR */
.botones-container {
  display: flex;
  justify-content: center;
  gap: 60px;
  flex-wrap: wrap;
}

/* COLUMNA */
.bloque-boton {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 280px;
}

.btn {
  background-color: #dd3590;
  color: white;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  width: 100%;
  transition: 0.3s ease;
  box-shadow: 2px 3px 5px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column; 
  align-items: center;
  justify-content: center;
  padding-top: 0px;
  padding-bottom: 5px;
  margin-bottom: 20px;
  gap: 0px;
  min-height: 0;
  height: auto;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.1;
}

.btn:hover {
  background-color: #f15bab;
  transform: translateY(-3px);
}
.btn img {
  width: 30px;
  height: 34px;
  object-fit: contain;
  margin-bottom: 1px;
}

/* DESCRIPCION */
.descripcion {
  background-color: #D4CFF5;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  font-size: 14px;
  min-height: 110px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.6s ease;
}

.descripcion:hover {
  transform: translateY(-5px);
}

</style>