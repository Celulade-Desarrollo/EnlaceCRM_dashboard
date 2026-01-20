<script setup>
import Heading from "../components/UI/Heading.vue";
import { motion } from "motion-v";
import { ref, onMounted } from "vue";
import axios from "axios";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const datosCuenta = JSON.parse(localStorage.getItem("datosCuenta")) || {};
const deudaTotal = ref(0);

const estadoCuenta = ref({
  CupoFinal: "",
  CupoDisponible: "",
  FechaPagoProgramado: "",
  deudaTotal: "",
});

const formatoMiles = (numero) => {
  return new Intl.NumberFormat("es-ES").format(Number(numero));
};

function formatFecha(fechaISO) {
  if (!fechaISO) return "";
  const fecha = new Date(fechaISO);
  return fecha.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).href,
  iconUrl: new URL('leaflet/dist/images/marker-icon.png', import.meta.url).href,
  shadowUrl: new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).href,
});


onMounted(async () => {
  const IdUsuario = localStorage.getItem("idUsuario");
  const token = localStorage.getItem("token");
  console.log("token",token);
 
  try {
    const response = await axios.get(`/api/user/estado-cuenta/${IdUsuario}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    estadoCuenta.value = response.data;

    const cupoFinal = parseInt(estadoCuenta.value.CupoFinal.replace(/\./g, ""));
    const cupoDisponible = parseInt(estadoCuenta.value.CupoDisponible);
    const deuda = cupoFinal - cupoDisponible;
    estadoCuenta.value.deudaTotal = deuda;
  } catch (error) {
    console.error("Error al obtener el estado de cuenta:", error);
  }


  const map = L.map("map").setView([4.711, -74.0721], 12);

    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
    attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
  }).addTo(map);

  const redIcon = new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  map.locate({ setView: true, maxZoom: 16 });

  map.on("locationfound", (e) => {
    L.marker(e.latlng, { icon: redIcon })
      .addTo(map)
      .bindPopup("<b>📍 Estás aquí</b>")
      .openPopup();
  });

  try {
  const ubicacionesResponse = await axios.get("/api/mapa/ubicaciones", {
  headers: {
    Authorization: `Bearer ${token}`,
    },
  });
  const ubicaciones = ubicacionesResponse.data;

  console.log("Ubicaciones recibidas:", ubicaciones);

  ubicaciones.forEach((ubi) => {
    if (ubi.lat && ubi.lon) {
      L.marker([ubi.lat, ubi.lon])
        .addTo(map)
        .bindPopup(`
          <b>${ubi.municipio}, ${ubi.departamento}</b><br>
          ${ubi.direccion}<br>
          <small>${ubi.horarioSemana}</small>
        `);
    }
  });

  // Centrar mapa en la primera ubicación válida
  const primera = ubicaciones.find((u) => u.lat && u.lon);
  if (primera) {
    map.setView([primera.lat, primera.lon], 13);
  }
} catch (error) {
  console.error("Error al obtener ubicaciones:", error);
  }

});
</script>

<template>
  <Heading :mensaje="'Hola, ' + datosCuenta.Nombres" :showBackButton="true" />
  <motion.div v-bind="fadeInUp">
    <section class="content">
      <div class="card">
        <div class="provider-content">
          <div class="info-container">
            <!-- <div class="info-texts">
              <h2 class="title">
                Deuda total $
                <span class="bold-text">{{
                  formatoMiles(estadoCuenta.deudaTotal)
                }}</span>
              </h2>
              <h3 class="subtitle">
                Fecha del siguiente abono:
                <span class="bold-text">{{
                  formatFecha(estadoCuenta.FechaPagoProgramado)
                }}</span>
              </h3>
            </div>  -->
            <h2 class="centered-title">
              Puedes realizar tus pagos en corresponsales Efecty y oficinas del Banco w cerca de ti 
            </h2>
            <div
              id="map"
              style="height: 400px; width: 100%; border-radius: 10px; margin-top: 1rem"
            ></div>
          </div>
        </div>
      </div>
    </section>
  </motion.div>
</template>

<style scoped>
.content {
  border: none;
  outline: none;
  box-shadow: none;
}
.card {
  background: #fff;
  padding: 1.5rem;
  text-align: left;
  border-radius: 0;
  width: 100%;
  min-height: calc(100vh - 80px);
}

.provider-content {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.info-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 500px;
}

.info-texts {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.title {
  font-size: 1.25rem;
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

.subtitle {
  font-size: 13px;
  display: flex;
  gap: 0.5rem;
}

.bold-text {
  font-weight: bold;
}

.centered-title {
  font-weight: bold;
  text-align: center;
  margin-bottom: 1rem;
}

@media (max-width: 600px) {
  .provider-content {
    flex-direction: column;
  }
}
</style>