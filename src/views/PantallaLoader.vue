<template>
  <motion.div v-bind="fadeInUp">
    <div class="loader-container">
      <img src="/enlaceFiado.png" alt="" class="h-[60px] w-[250px]" />
      <div class="spinner"></div>
    </div>
  </motion.div>
</template>

<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { fadeInUp } from "../motion/pageAnimation";
import { motion } from "motion-v";
import axios from 'axios';

const router = useRouter();

const datos = {
  nbCliente: "8100000470",
  nbAgenteComercial: "841891",
  token:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NTIwNzMxMzIsImV4cCI6MTc1MjA3NjczMiwianRpIjoiZjViMTk2M2EtNTM4ZS00NzcyLTkxZjMtNzk0NjIxNzFhYTI0In0.Q_cJy-6sZJCz7QRLRnjGe4vJFA2JyANKotit4XvdeT8",
};

onMounted(async () => {
  try {
    const response = await axios.post("http://localhost:3000/api/user/login", datos);
    const data = response.data;

    // Validamos si los datos están vacíos
    const datosVacios = !data || (Array.isArray(data) && data.length === 0) || (typeof data === "object" && Object.keys(data).length === 0);

    if (datosVacios) {
    window.location.href = `http://localhost:5174/?nbCliente=${datos.nbCliente}&nbAgenteComercial=${datos.nbAgenteComercial}`;

    } else {
      router.push("/Pantalla1View");
    }

  } catch (error) {
    console.error("Error en la petición:", error);
  }
});
</script>

<style scoped>
.loader-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

.spinner {
  margin-top: 20px;
  width: 40px;
  height: 40px;
  border: 5px solid #5708eb;
  border-top: 5px solid #ff00f2;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
