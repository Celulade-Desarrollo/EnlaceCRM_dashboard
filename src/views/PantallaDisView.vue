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
  <HeaderDis />
  
  <div class="main-container">
    <!-- Tarjeta 1 -->
      <div class="card">
        <button class="btn" @click="downloadExcel">
          <!-- <img src="/dispersion.png" alt="dispersion" class="icon" /> -->
          <span>Descargar estados cupo</span>
        </button>
      </div>

    <div class="card">
      <button class="btn" @click="goToTesoreria">
        <img src="/dispersion.png" alt="dispersion" class="icon" />
        <span>Dispersión</span>
      </button>
    </div>

    <div class="card">
      <button class="btn" @click="goToDistribuidores">
        <img src="/ruta.png" alt="ruta" class="icon" />
        <span>Cierre de Ruta</span>
      </button>
    </div>
  </div>
  <SesionExpiradaLogin />
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
  background-color: #251786;
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
  gap: 35px;   /* antes 20px */
  width: 280px;
  min-height: 260px;
  background-color: #251786;
  border: none;
  outline: none;
  box-shadow: none;
  transition: transform 0.3s ease;
}


.card:hover {
  transform: translateY(-5px);
    gap: 35px;
}


.btn {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #e53e8d;
  color: white;
  font-size: 25px;
  font-weight: 600;
  border-radius: 30px;
  cursor: pointer;
  width: 350px;
  height: 150px;
  transition: all 0.3s ease;
  box-shadow: 2px 3px 5px rgba(0, 0, 0, 0.25);
}

.btn:hover {
  background-color: #ff64b5;
  transform: scale(1.05);
}

.icon {
  position: absolute;
  top: 10px;
  left: 15px;
  width: 50px;
  height: 50px;
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

