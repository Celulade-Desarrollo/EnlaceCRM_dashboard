<script setup>
import { ref } from "vue";
import * as XLSX from "xlsx";

const datos = ref([
  { cedula: "71378171", transaccion: "123456789", factura: "FV823474", valor: "$88.200", fecha: "5/09/2025", hora: "10:05:24" }
]);

// 🔹 Descargar como Excel
const exportarExcel = () => {
  const hoja = XLSX.utils.json_to_sheet(datos.value);
  const libro = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(libro, hoja, "Hoja1");
  XLSX.writeFile(libro, "tabla.xlsx");
};

// 🔹 Refrescar (ejemplo: cambia los datos)
const refrescar = () => {
  datos.value = [
    { cedula: "98765432", transaccion: "555666777", factura: "FV999888", valor: "$120.000", fecha: "6/09/2025", hora: "11:30:45" }
  ];
};
</script>

<template>
  <div class="container">
    <h2>Pagos Autorizados</h2>
    
    <table border="1" class="tabla">
      <thead>
        <tr>
          <th>Código Tendero (Cédula)</th>
          <th>Código Transacción</th>
          <th>Código Factura</th>
          <th>Valor Autorizado Pago</th>
          <th>Fecha</th>
          <th>Hora</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(fila, index) in datos" :key="index">
          <td>{{ fila.cedula }}</td>
          <td>{{ fila.transaccion }}</td>
          <td>{{ fila.factura }}</td>
          <td>{{ fila.valor }}</td>
          <td>{{ fila.fecha }}</td>
          <td>{{ fila.hora }}</td>
        </tr>
      </tbody>
    </table>

    <div class="botones">
      <button @click="refrescar">🔄 Refrescar</button>
      <button @click="exportarExcel">⬇️ Descargar Excel</button>
    </div>
  </div>
</template>

<style scoped>
.container {
  padding: 20px;
  text-align: center;
}

.tabla {
  margin: 20px auto;
  border-collapse: collapse;
  width: 95%;
}

.tabla th, .tabla td {
  padding: 10px;
  text-align: center;
}

.botones {
  margin-top: 20px;
  display: flex;
  gap: 15px;
  justify-content: center;
}

button {
  background: #2a6fa1;
  color: white;
  border: none;
  padding: 12px 25px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.3s;
}

button:hover {
  background: #368cc4;
  transform: scale(1.05);
}
</style>
