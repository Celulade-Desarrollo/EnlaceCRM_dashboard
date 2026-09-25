<script setup>
import { useRouter } from "vue-router";
import HeaderDis from "../components/UI/headerDis.vue";
import SesionExpiradaLogin from "../components/UI/SesionExpiradaLogin.vue";
import { activarSesionExpirada } from "../stores/session.js";
import axios from "axios";
import * as XLSX from "xlsx";

const token = localStorage.getItem("admin_token");

const router = useRouter();

const goToTesoreria = () => router.push("/PantallaTesoreriaView");
const goToDistribuidores = () => router.push("/PantallaDistribuidoresView");

async function downloadExcel() {
  try {
    const response = await axios.get("/api/flujoRegistroEnlace/consultarEstadoCupo/todos", {
       headers: {
         Authorization: `Bearer ${token}`,
         "Content-Type": "application/json",
       },
    });

    const data = response.data;
    
    const dataArray = Array.isArray(data) ? data : [data];

    //  const formattedData = dataArray.map(item => ({
    //   ...item,
      
    //   tesoreria_status: item.tesoreria_status === true
    //     ? "Confirmado"  
    //     : "No confirmado",
    //   banco_status: item.banco_status === true
    //     ? "Confirmado"
    //     : "No confirmado",
    // }));

    const worksheet = XLSX.utils.json_to_sheet(dataArray);
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
    link.setAttribute("download", "EstadoCupoDisponible.xlsx");
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
};
</script>

<template>
  <div class="pantalla-full">

    <HeaderDis />
    <main class="main-content">
      <div class="full-width-container">

        <h1 class="main-title">
          Panel principal
        </h1>

        <p class="main-subtitle">
          Selecciona una opción para continuar
        </p>

        <div class="modules-grid">

          <button class="module-card" @click="goToDistribuidores">
            <div class="module-icon">
              <img src="/ruta.png" alt="Cierre de Ruta" />
            </div>

            <div class="module-content">
              <h2>Cierre de Ruta</h2>
              <p>
                Consulta y gestiona los cierres de ruta.
              </p>
            </div>

            <div class="module-arrow">
              →
            </div>
          </button>


          <button class="module-card" @click="goToTesoreria">
            <div class="module-icon">
              <img src="/dispersion.png" alt="Dispersión" />
            </div>

            <div class="module-content">
              <h2>Dispersión</h2>
              <p>
                Consulta y gestiona las dispersiones.
              </p>
            </div>

            <div class="module-arrow">
              →
            </div>
          </button>


          <button class="module-card" @click="downloadExcel">
            <div class="module-icon">
              <img src="/cupo.png" alt="Estados de cupo" />
            </div>

            <div class="module-content">
              <h2>Estados de cupo</h2>
              <p>
                Descarga el reporte de estados de cupo.
              </p>
            </div>

            <div class="module-arrow">
              ↓
            </div>
          </button>

        </div>

      </div>
    </main>

    <SesionExpiradaLogin />

  </div>
</template>

<style scoped>
.pantalla-full {
  background-color: #3338a0;
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  font-family: system-ui, -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, sans-serif;
}

.main-content {
  flex: 1;
  padding: 40px;
  display: flex;
  justify-content: center;
  background-color: #3338a0;
  box-sizing: border-box;
}

.full-width-container {
  width: 100%;
  max-width: 1400px;
}

.main-title {
  font-size: 26px;
  font-weight: 800;
  color: #ffffff;
  margin: 0 0 6px 0;
}

.main-subtitle {
  margin: 0 0 30px 0;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.75);
}

.modules-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  width: 100%;
}

.module-card {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  min-height: 165px;
  padding: 26px;
  background-color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 10px;
  cursor: pointer;
  text-align: left;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease;
  box-sizing: border-box;
  outline: none;
}

.module-card:hover {
  transform: translateY(-4px);
  border-color: #ffffff;
  box-shadow:
    0 10px 25px rgba(0, 0, 0, 0.18);
}


.module-icon {
  width: 58px;
  height: 58px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #3338a0;
  border: none;
  border-radius: 8px;
  margin-right: 18px;
  overflow: hidden;
}

.module-icon img {
  width: 38px;
  height: 38px;
  object-fit: contain;
  filter: none;
  transition: transform 0.2s ease;
}

.module-card:hover .module-icon img {
  transform: scale(1.12);
}

.module-content {
  padding-right: 28px;
}

.module-content h2 {
  margin: 0 0 7px 0;

  font-size: 17px;
  font-weight: 700;

  color: #111827;
}

.module-content p {
  margin: 0;

  font-size: 13px;
  line-height: 1.5;

  color: #6b7280;
}

.module-arrow {
  position: absolute;

  right: 20px;
  top: 50%;

  transform: translateY(-50%);

  font-size: 22px;
  font-weight: 400;

  color: #9ca3af;

  transition:
    color 0.2s ease,
    transform 0.2s ease;
}

.module-card:hover .module-arrow {
  color: #3338a0;
  transform: translateY(-50%) translateX(4px);
}


.module-arrow.download {
  font-size: 23px;
}

.module-card:hover .module-arrow.download {
  transform: translateY(-50%) translateY(2px);
}

@media (max-width: 1000px) {
  .modules-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}


@media (max-width: 650px) {
  .main-content {
    padding: 28px 20px;
  }

  .main-title {
    font-size: 23px;
  }

  .modules-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .module-card {
    min-height: 135px;
    padding: 20px;
  }

  .module-icon {
    width: 58px;
    height: 58px;
    background-color: #3338a0 ;
  }

  .module-icon img {
    width: 42px;
    height: 42px;
  }
}
</style>