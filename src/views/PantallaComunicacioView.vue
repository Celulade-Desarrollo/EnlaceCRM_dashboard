<script setup>
import { useRouter } from "vue-router";
import HeaderBanco from "../components/UI/headerBanco.vue";

const router = useRouter();

const goToRegistro = () => router.push("/Pantalla10View");
const goToPagos = () => router.push("/PantallaPagos");
const goToAbonos = () => router.push("/PantallasubirExcelView");
const gotoDispercion = () => router.push("/PantallaBajarDispercionView");
</script>

<template>
  <HeaderBanco />
  
  <div class="main-container">
    <!-- Tarjeta 1 -->
    <div class="card">
      <button class="btn" @click="goToRegistro">
        <img src="/registro.png" alt="registro" class="icon" />
        <span>Registro</span>
      </button>
      <div class="desc">
        Gestión del proceso de <br />
        registro de nuevos usuarios
      </div>
    </div>

    <!-- Tarjeta 2 -->
    <div class="card">
      <button class="btn" @click="goToPagos">
        <img src="/utilizacion.png" alt="utilización" class="icon" />
        <span>Utilización</span>
      </button>
      <div class="desc">
        Visualización y descarga de la
        utilización del crédito por los tenderos
      </div>
    </div>

    <!-- Tarjeta 3 -->
    <div class="card">
      <button class="btn" @click="goToAbonos">
        <img src="/abonos.png" alt="abonos" class="icon" />
        <span>Abonos a Crédito</span>
      </button>
      <div class="desc">
        Carga de información sobre <br />
        abonos a créditos realizados por los tenderos
      </div>
    </div>

     <div class="card">
      <button class="btn" @click="gotoDispercion">
        <img src="/dispersion.png" alt="dispersión" class="icon" />
        <span>Dispersión</span>
      </button>
      <div class="desc">
        Descarga la información <br />
        sobre la dispersión deseada por surtimientos
      </div>
    </div>
  </div>
</template>

<style scoped>
.main-container {
  display: flex;
  padding: 60px;
  height: auto;
  min-height: 70vh;
  background-color: #5c4cb8;
  border: 9px solid #251786;
  margin-top: 70px;
  flex-wrap: wrap;
  box-sizing: border-box;
  flex-direction: row;
  justify-content: space-between;
  align-items: stretch;
  gap: 20px;
}

.card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 20px;
  width: 280px;
  min-height: 260px;
  background-color: #5c4cb8;
  border: none;
  outline: none;
  box-shadow: none;
  transition: transform 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
}


.btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1px;
  background-color: #e53e8d;
  color: white;
  font-size: 16px;
  font-weight: bold;
  width: 280px;
  height: 70px;
  border-radius: 60px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
  position: relative;
}

.icon {
  width: 45px;
  height: 40px;
  object-fit: contain;
  transition: transform 0.3s ease;
}


.btn:hover {
  background-color: #ff64b5;
  transform: translateY(-3px);
  box-shadow: 0px 6px 15px rgba(0, 0, 0, 0.4);
}

.btn:hover .icon {
  transform: scale(1.1);
}


.desc {
  background-color: rgba(139, 124, 235, 0.85);
  text-align: center;
  padding: 20px;
  width: 260px;
  height: 200px;
  font-size: 15px;
  line-height: 1.4;
  box-shadow: 1px 2px 4px rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
}


@media (max-width: 1024px) {
  .main-container {
    gap: 50px;
    padding: 40px;
  }

  .card {
    width: 240px;
  }

  .desc {
    width: 220px;
    height: 180px;
    font-size: 14px;
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

  .desc {
    width: 90%;
    height: auto;
    min-height: 160px;
    font-size: 14px;
    padding: 15px;
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

  .desc {
    font-size: 13px;
    padding: 12px;
  }
}
</style>

