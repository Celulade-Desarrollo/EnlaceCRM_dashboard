<script setup>
import { ref } from "vue";
import Heading from "../components/UI/Heading.vue";
import { motion } from "motion-v";

const scoring = ref("");
const cupo = ref("");

const campo1 = ref("Texto  1");
const campo2 = ref("Texto 2");
const campo3 = ref("Texto 3");

const enviarAlBanco = () => {
  console.log("Enviando al banco:", {
    campo1: campo1.value,
    campo2: campo2.value,
    campo3: campo3.value,
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

    <!-- Campos mostrados como tarjetas estáticas -->
    <div class="campos-tarjetas">
      <div class="tarjeta-campo">{{ campo1 }}</div>
      <div class="tarjeta-campo">{{ campo2 }}</div>
      <div class="tarjeta-campo">{{ campo3 }}</div>
    </div>

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
.logo-container {
  text-align: center;
  margin-block: 1.5rem;
}

.logo-main {
  width: min(180px, 80%);
  height: auto;
  display: inline;
}

.tarjeta {
  width: min(90%, 500px);
  margin-inline: auto;
  margin-block: 2rem;
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
  flex-wrap: wrap;
}

.cedula {
  background: #f0f0f0;
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 0.95rem;
  white-space: nowrap;
  float: right;
  margin-left: auto;
  border: 2px solid #f15bab;
}

.tarjeta-subtitulo {
  margin-block: 1rem;
  font-size: 1.1rem;
  color: #333;
}

.campos-tarjetas {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.tarjeta-campo {
  flex: 1;
  min-width: 150px;
  padding: 10px;
  font-size: 0.95rem;
  font-weight: 500;
  border: 2px solid #251886;
  border-radius: 10px;
  background-color: #fafafa;
  text-align: center;
  user-select: none; /* para que no puedan copiar texto si quieres */
}

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

.tarjeta-acciones {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  flex-wrap: wrap;
}

.boton-enviar {
  width: max-content;
  padding: 10px 30px;
  font-size: 15px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  background: #dd3590;
  color: #fff;
  outline: none;
  border: none;
  box-shadow: none;
  margin: 0 auto;
}

.boton-enviar:hover {
  background-color: #f15bab;
}

@media (min-width: 480px) {
  .tarjeta-contenido {
    grid-template-columns: 1fr 1fr;
  }
}

@media (min-width: 768px) {
  .tarjeta {
    padding: 2rem;
  }

  .campo,
  .cedula {
    font-size: 1.05rem;
  }
}

@media (min-width: 1200px) {
  .tarjeta {
    width: 650px;
  }
}
</style>
