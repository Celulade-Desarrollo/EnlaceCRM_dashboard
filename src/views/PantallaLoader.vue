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

const REDIRECCIONES_SIMPLES = {
  IncompletoBloqCorreo: "http://localhost:5173/nombres",
  IncompletoBloqCedula: "http://localhost:5173/negocio",
  IncompletoBloqUbiNegocio: "http://localhost:5173/informacionNegocio",
  IncompletoBloqInfoNegocio: "http://localhost:5173/ventas",
  IncompletoBloqVentas: "http://localhost:5173/informacionFinanciera",
  IncompletoBloqInfoFinanciera: "http://localhost:5173/antesDeTerminar",
  
};

onMounted(async () => {
  const queryParams = new URLSearchParams(window.location.search);
  const nbCliente = queryParams.get('nbCliente');
  const nbAgenteComercial = queryParams.get('nbAgenteComercial');
  const tokenAlpina = queryParams.get('token')

  const datos = {
    nbCliente: nbCliente,
    nbAgenteComercial: nbAgenteComercial,
    token: tokenAlpina,
  };

  try {
    const response = await axios.post("api/user/login", datos);
    const data = response.data;
    const estado = data.estado?.trim();

    console.log("Status:", response.status);
    console.log("Data completa:", data);

    if (response.status === 200 && response.data && Object.keys(response.data).length > 0) {
      // La cookie ya trae el token; solo guardamos lo que no es sensible
      localStorage.setItem("tipo", data.tipo);
      localStorage.setItem("idUsuario", data.idUsuario);
      localStorage.setItem("datosCuenta", JSON.stringify(data.cuenta));
      localStorage.setItem("cliente", JSON.stringify(data.cliente || {}));
      router.push("/Pantalla1View");

    } else if (response.status === 207) {
      // Ya no guardamos token aquí, la cookie lo maneja

      if (['Asesor', 'Incompleto'].includes(estado)) {
        const params = new URLSearchParams({
          nbCliente: data.nbCliente,
          nbAgenteComercial: data.nbAgenteComercial,
          Id: data.Id
        }).toString();
        window.location.href = `http://localhost:5173/correoElectronico?${params}`;

      } else if (REDIRECCIONES_SIMPLES[estado]) {
        window.location.href = REDIRECCIONES_SIMPLES[estado]; // sin token en la URL

      } else if (["pendiente", "confirmado", "aprobado"].includes(estado)) {
        switch (data.confirmacionIdentidad) {
          case "failure":
            window.location.href = "https://enlace-crm.com/PantallaFailedTruora";
            break;
          case "pending":
            window.location.href = "https://enlace-crm.com/PantallaPendingTruora";
            break;
          case "success":
            window.location.href = "https://enlace-crm.com/Terminado";
            break;
          case null:
          default:
            window.location.href = "https://enlace-crm.com/Pantalla17View";
            break;
        }
      }
    }
  } catch (error) {
    if (error.response?.status === 404) {
      router.push("/PantallaNoInfo");
      return;
    }
    if (error.response && error.response.status === 400) {
      // Este caso especial: el backend manda el token en el BODY (no cookie) cuando no existe cuenta
      const params = new URLSearchParams({
        nbCliente: datos.nbCliente || '',
        nbAgenteComercial: datos.nbAgenteComercial || ''
      }).toString();
      window.location.href = `http://localhost:5173/?${params}`;

    } else if (error.response && error.response.status === 403) {
      window.location.href = `https://enlace-crm.com/Tendero`;
    } else {
      console.error("Error inesperado:", error);
    }
  }
});;

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