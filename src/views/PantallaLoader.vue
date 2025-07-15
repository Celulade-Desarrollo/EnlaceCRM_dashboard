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
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NTI1OTU1NjYsImV4cCI6MTc1MjU5OTE2NiwianRpIjoiOGExMDQ1MzEtNjQ5ZS00NTY3LTk0N2QtZTI0OWE0OTlhZmI3In0.3zEXVPo_tjMORzrUibWXDdmOi4JSX14n19g9YaMKZCs",
};

onMounted(async () => {
  try {
    const response = await axios.post("http://localhost:3000/api/user/login", datos);
    const data = response.data;
    if (response.status === 200 && response.data && Object.keys(response.data).length > 0) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("tipo", data.tipo);
      localStorage.setItem("idUsuario", data.idUsuario);
      localStorage.setItem("datosCuenta", JSON.stringify(data.cuenta));
      router.push("/Pantalla1View");
    } else {
      redirigirAFormulario(datos);
    }

  } catch (error) {
    if (error.response && error.response.status === 400) {
      redirigirAFormulario(datos);
    } else {
      console.error("Error inesperado en la petición:", error);
    }
  }
});

// Función para redirigir con los datos por query string
function redirigirAFormulario(datos) {
  const params = new URLSearchParams({
    nbCliente: datos.nbCliente,
    nbAgenteComercial: datos.nbAgenteComercial
  }).toString();

  window.location.href = `http://localhost:5173/?${params}`;
}

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
