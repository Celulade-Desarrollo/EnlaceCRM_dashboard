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
  IncompletoBloqCorreo: "https://enlace-crm.com/nombres",
  IncompletoBloqCedula: "https://enlace-crm.com/negocio",
  IncompletoBloqUbiNegocio: "https://enlace-crm.com/informacionNegocio",
  IncompletoBloqInfoNegocio: "https://enlace-crm.com/ventas",
  IncompletoBloqVentas: "https://enlace-crm.com/informacionFinanciera",
  IncompletoBloqInfoFinanciera: "https://enlace-crm.com/antesDeTerminar",
  
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
       localStorage.setItem("token", data.token);
      router.push("/Pantalla1View");

    } else if (response.status === 207) {
      // Ya no guardamos token aquí, la cookie lo maneja

      if (['Asesor', 'Incompleto'].includes(estado)) {
        const params = new URLSearchParams({
          nbCliente: data.nbCliente,
          nbAgenteComercial: data.nbAgenteComercial,
          Id: data.Id
        }).toString();
        window.location.href = `https://enlace-crm.com/correoElectronico?${params}`;

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
      const params = new URLSearchParams({
        nbCliente: datos.nbCliente || '',
        nbAgenteComercial: datos.nbAgenteComercial || ''
      }).toString();
      window.location.href = `https://enlace-crm.com/?${params}`;

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