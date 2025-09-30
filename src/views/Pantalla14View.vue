<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const goToRegistro = () => {
  router.push("/Pantalla11View"); 
};

const goToAbonos = () => {
  router.push("/PantallaBajarExcelView"); 
};

const goToActualizar = () => {
  router.push("/actualizar-saldos"); 
};
</script>

<template>
  <div class="container">
    <button class="btn" @click="goToRegistro">Registro</button>
    <button class="btn" @click="goToAbonos">Abonos a Crédito</button>
    <button class="btn" @click="goToActualizar">Actualizar saldos</button>

  </div>
</template>

<style scoped>
.container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 60px;
  background-color: #251786;
}

.btn {
  background-color: #2a6fa1;
  color: white;
  font-size: 28px;
  font-weight: bold;
  padding: 30px;
  min-width: 350px;
  white-space: nowrap;
  text-align: center;
  border: none;
  border-radius: 18px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.btn:hover {
  background-color: #368cc4;
  transform: scale(1.08);
}
</style>
