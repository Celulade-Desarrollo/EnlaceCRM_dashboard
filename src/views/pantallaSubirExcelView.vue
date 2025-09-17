<script setup>
import { ref } from 'vue'
import * as XLSX from 'xlsx'
import axios from 'axios'

const excelData = ref([])
const fileLoaded = ref(false) // estado para saber si hay archivo cargado

const triggerFileInput = () => {
  document.getElementById('fileUpload').click()
}

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (!file) {
    fileLoaded.value = false
    return
  }

  const reader = new FileReader()

  reader.onload = (e) => {
    const data = new Uint8Array(e.target.result)

    // leer con cellDates para que traiga fechas
    const workbook = XLSX.read(data, { type: 'array', cellDates: true })
    const firstSheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[firstSheetName]

    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })

    const headers = jsonData[0]
    const rows = jsonData.slice(1).map(row => {
      let obj = {}
      headers.forEach((h, i) => {
        let value = row[i] ?? null
        if (value instanceof Date) {
          value = value.toISOString().split("T")[0]
        }
        obj[h] = value
      })
      return obj
    })

    excelData.value = rows
    fileLoaded.value = true // marcamos como cargado
  }

  reader.readAsArrayBuffer(file)
}

const enviarCSV = async () => {
  try {
    await axios.post("http://localhost:3000/api/abonos/upload", {
      data: excelData.value
    })
    alert("Archivo cargado exitosamente")
    fileLoaded.value = false // reiniciamos el estado tras enviar
  } catch (err) {
    console.error(err)
    alert("Error al cargar archivo")
  }
}
</script>

<template>
  <div class="subir-excel">
    <div class="boton-container">
      <input
        type="file"
        id="fileUpload"
        @change="handleFileUpload"
        accept=".xlsx, .xls, .csv"
        hidden
      />
      <button class="boton" @click="triggerFileInput">Subir archivo</button>
    </div>

    <div v-if="fileLoaded" class="mensaje"> Archivo cargado y listo para enviar</div>
    <div v-else class="mensaje"> Ningún archivo cargado</div>

    <div v-if="fileLoaded">
      <button class="boton" @click="enviarCSV">Enviar al backend</button>
    </div>
  </div>
</template>

<style scoped>
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
.mensaje {
  text-align: center;
  font-weight: bold;
  margin: 15px 0;
}
</style>
