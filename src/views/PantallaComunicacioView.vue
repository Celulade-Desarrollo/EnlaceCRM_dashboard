<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const goToRegistro = () => {
  router.push("/Pantalla10View");
};
const goToPagos = () => {
  router.push("/PantallaPagos");
};
const goToAbonos = () => {
  router.push("/PantallaAbonos");
};
const goToPagosExtra = () => {
  router.push("/Pagos");
};
</script>

<template>
  <div class="container">
    <button class="btn" @click="goToRegistro">Registro</button>
    <button class="btn" @click="goToPagos">Utilización</button>
    <button class="btn" @click="goToAbonos">Abonos a Crédito</button>

  </div>
</template>

<style scoped>
.container {
  height: 100vh;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 30px;
  background-color: #251786;
  padding: 20px;
}

.btn {
  background-color: #2a6fa1;
  color: white;
  font-size: 22px;
  font-weight: bold;
  padding: 20px;
  min-width: 250px;
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


@media (max-width: 768px) {
  .btn {
    font-size: 18px;
    padding: 15px;
    min-width: 180px;
  }
  .container {
    gap: 20px;
  }
}


@media (max-width: 480px) {
  .btn {
    font-size: 16px;
    padding: 12px;
    min-width: 140px;
  }
}
</style>
