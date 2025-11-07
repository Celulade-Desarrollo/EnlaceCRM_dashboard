<script setup>
import { ref } from 'vue'
import * as XLSX from 'xlsx'
import axios from 'axios'
import { motion } from "motion-v";
import { fadeInUp } from "../motion/pageAnimation";
import BotonAtras from "../components/UI/BotonAtras.vue";
import { useRouter } from "vue-router";
import SesionExpiradaLogin from "../components/UI/SesionExpiradaLogin.vue";
import { activarSesionExpirada } from "../stores/session.js";

const token = localStorage.getItem("admin_token");
const excelData = ref([])
const fileLoaded = ref(false)
const router = useRouter();
const fileInputRef = ref(null)

const triggerFileInput = () => {
   fileInputRef.value?.click()
}

const logout = () => {
  localStorage.removeItem("admin_token");
  router.push("/LoginView");
};

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (!file) {
    fileLoaded.value = false;
    return;
  }

  const reader = new FileReader();

  reader.onload = (e) => {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: "array", cellDates: true });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];

    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    const headers = jsonData[0];

    const rows = jsonData.slice(1).map((row) => {
      const obj = {};
      headers.forEach((h, i) => {
        let value = row[i];
        if (value === undefined || value === null) {
          value = "";
        }
        else if (value instanceof Date) {
          value = value.toISOString().split("T")[0];
        }
        else if (typeof value === "number" && h.toLowerCase().includes("fec")) {
          const dateValue = XLSX.SSF.parse_date_code(value);
          if (dateValue && dateValue.y && dateValue.m && dateValue.d) {
            const yyyy = dateValue.y;
            const mm = String(dateValue.m).padStart(2, "0");
            const dd = String(dateValue.d).padStart(2, "0");
            value = `${yyyy}-${mm}-${dd}`;
          } else {
            value = "";
          }
        }

        obj[h] = typeof value === "string" ? value.trim() : value;
      });
      return obj;
    });
    const filteredRows = rows.filter((fila) => {
      return Object.values(fila).some(
        (v) => v !== "" && v !== null && v !== undefined
      );
    });

    excelData.value = filteredRows;
    fileLoaded.value = true;
  };

  reader.readAsArrayBuffer(file);
};

  const camposObligatorios =  [
    "Operacion", "CuentaCliente", "NumeroID", "Persona",
    "IdEstadoProducto", "FecTransaccion", "CAPITAL", "TOTAL_PAGADO",
    "INTERESES",	"INTERES_MORA",	"SEGUROS",	"TOTAL_PAGADO",	"DIAS_MORA"
  ];

const validarDatos = (data) => {
  const errores = [];

  data.forEach((fila, index) => {
    const camposFaltantes = camposObligatorios.filter((campo) => {
      const valor = fila[campo];
      const esVacio =
        valor === null ||
        valor === undefined ||
        (typeof valor === "string" && valor.trim() === "") ||
        (typeof valor === "number" && isNaN(valor));

      return esVacio;
    });

    if (camposFaltantes.length > 0) {
      errores.push(
        `Fila ${index + 2}: Faltan los campos -> ${camposFaltantes.join(", ")}`
      );
    }
  });

  return errores;
};

const enviarCSV = async () => {
  const errores = validarDatos(excelData.value);

  if (errores.length > 0) {
    alert("Errores encontrados:\n" + errores.join("\n"));
    return;
  }

  try {
    const duplicadas = [];

    for (const fila of excelData.value) {
      const operacion = fila.Operacion;

      const resp = await axios.get(`/api/abonos/existe/${operacion}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (resp.data.existe) {
        duplicadas.push(operacion);
      }
    }

    if (duplicadas.length > 0) {
      alert(
        "Operaciones duplicadas encontradas:\n" +
        duplicadas.join(", ") +
        "\nEstas operaciones ya existen y no se pueden repetir."
      );
      return;
    }

    await axios.post(
      "/api/abonos/upload",
      { data: excelData.value },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    alert("Archivo cargado correctamente");
    fileLoaded.value = false;
    window.location.reload();

  } catch (err) {
    console.error(err);
    alert("Error al cargar archivo");
    if (err.response?.status === 401) {
      activarSesionExpirada();
    }
  }
};

</script>

<template>
  <BotonAtras />
  <motion.div v-bind="fadeInUp" class="page-container">
    <section class="logo-container">
      <img
        src="/public/enlaceFiado.png"
        alt="logo Enlace CRM"
        class="logo-main"
      />
    </section>

    <p class="titulo">Hola, Administrador banco w</p>

    <div class="subir-excel">
      <div class="boton-container">
        <input
          ref="fileInputRef"
          type="file"
          @change="handleFileUpload"
          accept=".xlsx, .xls, .csv"
          hidden
        />
        <button class="boton" @click="triggerFileInput">Subir Archivo</button>
      </div>
      <div class="logout">
        <button class="boton-logout" @click="logout">Cerrar sesión</button>
      </div>

      <p v-if="fileLoaded" class="mensaje">Archivo cargado y listo para enviar</p>
      <p v-else class="mensaje">Ningún archivo cargado</p>

      <div v-if="fileLoaded">
        <button class="boton" @click="enviarCSV">Enviar</button>
      </div>
    </div>
    <SesionExpiradaLogin />
  </motion.div>
</template>

<style scoped>

.page-container {
  display: flex;
  flex-direction: column;
  justify-content: center; 
  align-items: center;
  min-height: 100vh;
  text-align: center;
}

.logo-main {
  width: min(180px, 80%);
  height: auto;
  display: inline;
  margin-bottom: 1rem;
}

.titulo {
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
  margin-bottom: 20px;
}

.mensaje {
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
  margin: 15px 0;
}

.boton-logout {
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
  margin: 10px 0;
}
.boton-logout:hover {
  background-color: #f15bab;
}


.boton-container {
  text-align: center;
  margin: 30px 0;
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
  margin: 10px 0;
}
.boton:hover {
  background-color: #f15bab;
}
</style>