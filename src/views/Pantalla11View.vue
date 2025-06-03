<script setup>
import { ref } from "vue";
import Heading from "../components/UI/Heading.vue";
import { motion } from "motion-v";

const scoring = ref("");
const cupo = ref("");

const enviarAlBanco = () => {
  console.log("Enviando al banco:", {
    scoring: scoring.value,
    cupo: cupo.value,
  });
};
</script>

<template>
  <section class="logo-container">
    <img
      src="/public/enlaceFiado.png"
      alt="logo Enlace CRM"
      class="logo-main"
    />
    <Heading />
  </section>

  <div class="tarjeta">
    <div class="tarjeta-header">
      <p class="cedula">Cédula: 1.234.567.890</p>
    </div>

    <div class="tarjeta-subtitulo">
      <strong>flujo de enlace</strong>
    </div>

    <!-- Etapas alineadas horizontalmente -->
    <div class="etapas-container">
      <div class="etapa">Genero</div>
      <div class="etapa">Estado Civil</div>
      <div class="etapa">Nivel Educativo</div>
      <div class="etapa">Estrato</div>
      <div class="etapa">Declara Renta</div>
      <div class="etapa">Esta obligado a tener RUT por tu actividad economica</div>
      <div class="etapa">Ubicacion del Negocio-Departamento</div>
      <div class="etapa">Ubicacion del Negocio-Ciudad</div>
      <div class="etapa">Numero de neveras que tiene la tienda</div>
      <div class="etapa">Registrado en Camara deComercio</div>
      <div class="etapa">Rango de Ingreso</div>
    </div>

    <!-- Tabla Scoring y Cupo -->
    <motion.div
      class="tabla-contenedor"
      v-motion="{
        initial: { opacity: 0, y: 20 },
        enter: { opacity: 1, y: 0, transition: { duration: 0.5 } }
      }"
    >
      <table class="tabla">
        <thead>
          <tr>
            <th>Scoring</th>
            <th>Cupo</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <input
                v-model="scoring"
                class="tabla-input"
                type="number"
                placeholder="Ej: 720"
              />
            </td>
            <td>
              <input
                v-model="cupo"
                class="tabla-input"
                type="number"
                placeholder="Ej: 2500000"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </motion.div>

    <div class="tarjeta-acciones">
      <button class="boton-enviar" @click="enviarAlBanco">Enviar</button>
    </div>
  </div>
</template>

<style scoped>
/* Logo */
.logo-container {
  text-align: center;
  margin-block: 1.5rem;
}
.logo-main {
  width: min(180px, 80%);
  height: auto;
  display: inline;
}

/* Tarjeta general */
.tarjeta {
  width: 1200px;
  margin: 2rem auto;
  padding: 1.5rem;
  border: 2px solid #563e93;
  border-radius: 1rem;
  background-color: #fefefe;
  font-family: sans-serif;
}
.tarjeta-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
}
.cedula {
  background: #f0f0f0;
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 0.95rem;
  white-space: nowrap;
  border: 2px solid #f15bab;
}
.tarjeta-subtitulo {
  margin-block: 1rem;
  font-size: 1.1rem;
  color: #333;
  text-align: center;
}

/* Etapas horizontal en varias filas */
.etapas-container {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin: 2rem auto;
  justify-content: flex-start;
}
.etapa {
  font-size: 1rem;
  font-weight: 500;
  text-align: center;
  padding: 0.5rem 1rem;
  border-bottom: 3px solid #f15bab;
  border-radius: 0 0 10px 10px;
  background: #f9f9f9;
  min-width: 250px;
  flex: 1 0 auto;
}

/* Tabla Scoring/Cupo */
.tabla-contenedor {
  overflow-x: auto;
  margin-bottom: 1.5rem;
  border-radius: 10px;
}
.tabla {
  width: 100%;
  border-collapse: collapse;
  text-align: center;
  font-size: 0.95rem;
  background-color: #ffffff;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  border-radius: 10px;
  overflow: hidden;
}
.tabla th,
.tabla td {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #e5e7eb;
}
.tabla th {
  background-color: #251886;
  font-weight: bold;
  color: #f0f0f0;
}
.tabla-input {
  width: 100%;
  padding: 0.4rem;
  font-size: 0.95rem;
  border: 2px solid #1012a3;
  border-radius: 6px;
  text-align: center;
  outline: none;
  background-color: #fff;
}
.tabla-input:focus {
  border-color: #251886;
  box-shadow: 0 0 0 2px rgba(37, 24, 134, 0.2);
}

/* Botón enviar */
.tarjeta-acciones {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
}
.boton-enviar {
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
.boton-enviar:hover {
  background-color: #f15bab;
}
</style>
