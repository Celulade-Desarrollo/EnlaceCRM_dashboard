<template>
  <div class="subir-excel">
    <div class="boton-container">
      <input type="file" id="fileUpload" @change="handleFileUpload" accept=".xlsx, .xls" hidden />
      <button class="boton" @click="triggerFileInput">Bajar archivo</button>
    </div>

    <div v-if="excelData.length">
      <ul>
        <li v-for="(row, rowIndex) in excelData" :key="rowIndex">
          {{ row }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import * as XLSX from 'xlsx'

const excelData = ref([])

const triggerFileInput = () => {
  document.getElementById('fileUpload').click()
}

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (!file) return

  const reader = new FileReader()

  reader.onload = (e) => {
    const data = new Uint8Array(e.target.result)
    const workbook = XLSX.read(data, { type: 'array' })

    const firstSheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[firstSheetName]

    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
    excelData.value = jsonData
  }

  reader.readAsArrayBuffer(file)
}
</script>

<style scoped>
/* Botón centrado */
.boton-container {
  text-align: center;
  margin: 30px 0;
}

/* Botón con tu estilo */
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

/* Lista de datos (opcionalmente mejorada) */
ul {
  list-style: none;
  padding: 0;
  max-width: 800px;
  margin: 0 auto;
  font-family: monospace;
}

li {
  margin-bottom: 6px;
}
</style>
