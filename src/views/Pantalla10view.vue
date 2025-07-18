<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import Heading from "../components/UI/Heading.vue";
import { fadeInUp } from "../motion/pageAnimation";
import { motion } from "motion-v";
import * as XLSX from 'xlsx';
import CreditBancoCard from "../components/UI/CreditBancoCard.vue";
import axios from "axios";

const creditDataRecords = ref([])
const bancowData = ref([]);

const token = localStorage.getItem("admin_token");
const company = localStorage.getItem("company");

const router = useRouter();

const logout = () => {  
  localStorage.removeItem("admin_token");
  localStorage.removeItem("company");
  localStorage.removeItem("admin_tipo");
  localStorage.removeItem("admin_userData");
  localStorage.removeItem("admin_isAuthenticated");

  router.push("/LoginView");
}

onMounted(async () => {
  if (!token || company !== "bancow" || company == null) {
    router.push("/LoginView");
    return
  }
  try {
      const [pendientesRes, bancowRes] = await Promise.all([
      axios.get('api/scoring/estado/pendiente-aprobado',
         {
        headers: {  
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
      ),
      axios.get('api/bancow',
       {
        headers: {  
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
      ),
      axios.get('api/scoring/estado/pendiente-aprobado',
        {
        headers: {  
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
      ),
      axios.get('api/bancow',
         {
        headers: {  
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
      )
    ]);
    creditDataRecords.value = pendientesRes.data;
    bancowData.value = bancowRes.data;
  } catch (error) {
    console.error('Error cargando datos:', error)
  }
})

async function downloadExcel() {
  try {
    const response = await fetch('/api/excel', {
        headers: {  
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
    if (!response.ok) throw new Error('Error al obtener datos');
    const data = await response.json();

    // Si data no es un array, lo envolvemos en uno
    const dataArray = Array.isArray(data) ? data : [data];

    // se quita el campo id
    const dataTransformada = dataArray.map(({ Id, Estado, Estado_Scoring, ...rest }) => {
      return {
      ...rest,
      Estatus: Estado_Scoring, // nuevo estatus en el Excel
      };
  })

    // crear la hoja excel
    const worksheet = XLSX.utils.json_to_sheet(dataTransformada);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Datos');

    // Generar archivo Excel en buffer

    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    // Crear blob para descargar
    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    //toma el Blob (archivo en memoria) que se genro antes y lo convierte en una URL temporal del navegador
    // que apunta a ese archivo.
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    //Asigna la URL del blob
    link.href = url;
    //esto le dice al navegador no abras el archivo, descargalo
    link.setAttribute('download', 'historicoUsuarios.xlsx');
     //agrega el enlace temporalmente al DOM (al documento HTML).
    //esto es necesario para poder hacerle clic desde el script.
    document.body.appendChild(link);
    link.click();
    //elimina el enlace del DOM para que no se quede ahí ocupando memoria.
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

  } catch (error) {
    console.error('Error al generar Excel:', error);
    alert('No se pudo descargar el archivo');
  }
}

</script>
<template>
  <motion.div v-bind="fadeInUp">
    <section class="logo-container">
      <img
        src="/public/enlaceFiado.png"
        alt="logo Enlace CRM"
        class="logo-main"
      />
    </section>

    <Heading
       :mensaje=" 'Hola, Administrador'"
    />

    <div class="descargar-container">
      <button  @click="downloadExcel" class="boton">
        Descargar Excel
      </button>
    </div>
    <div class="logout">
      <button class="boton-logout" @click="logout">Cerrar sesión</button>
    </div>
     <section class="content">
      <CreditBancoCard
        v-for="record in creditDataRecords"
        :key="record.id"
        :data="record"
        :bancowData="bancowData"
      />
    </section>
  </motion.div>
</template>

<style scoped>
.logout {
  display: flex;
  justify-content: right;
  margin-top: 1rem;
}
.boton-logout {
  padding: 10px 30px;
  font-size: 15px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  background: #dd3590;
  color: #fff;
  outline: none;
  border: none;
}
.boton-logout:hover {
  background-color: #f15bab;
}
.logo-container {
  text-align: center;
  margin-block: 1.5rem;
}

.logo-main {
  width: min(180px, 80%);
  height: auto;
  display: inline;
}

.content {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  align-items: center;
}

.descargar-container {
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.boton {
  background-color: #dd3590;
  color: white;
  padding: 12px 50px;
  border: none;
  border-radius: 20px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
  outline: none;
  box-shadow: none;
}

.boton:hover {
  background-color: #f15bab;
}
</style>
