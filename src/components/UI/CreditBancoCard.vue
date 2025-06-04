<script setup>
import { ref } from "vue";
import axios from "axios";

const props = defineProps({
  
  // 'data' contendrá la información específica de cada persona/registro
  data: {
    type: Object,
    required: true,
    default: () => ({
      cedula: "", 
    }),
  },
});
console.log("Data recibida en Card:", props.data);

// Variables reactivas para los inputs dentro de CADA INSTANCIA de la card
// Son locales a cada card para que no interfieran entre sí
const bancoListas = ref("");
const aprobacionCupoSugerido = ref("");
const pagareDigital = ref("");
const creacionCoreBancario = ref("");
const usuarioAprobado = ref("");
const cupoFinal = ref("");
const mensajeError = ref("");
// Define los eventos que este componente puede emitir al padre
const emit = defineEmits(['descargar']);

// funcion boton aprobado
// 1 post enviasmos datos del banco
// put estado cambia a completado 
// 2 post creamos un usuario final
const handleSiClick = async () => {
    if (
    !bancoListas.value ||
    !aprobacionCupoSugerido.value ||
    !pagareDigital.value ||
    !creacionCoreBancario.value ||
    !usuarioAprobado.value ||
    !cupoFinal.value
  ) {
     mensajeError.value = "Por favor, completa todos los campos ";
    return;
  }
  mensajeError.value = "";
  const id = props.data.IdFlujoRegistro;

  const payloadPost= {
    IdFlujoRegistro: props.data.IdFlujoRegistro,
    Validacion_Banco_listas: bancoListas.value,
    Aprobacion_Cupo_sugerido: aprobacionCupoSugerido.value,
    Pagare_Digital_Firmado: pagareDigital.value,
    Creacion_Core_Bancario: creacionCoreBancario.value,
    UsuarioAprobado: usuarioAprobado.value,
  };
 const payloadPut = {
    Estado: "completado",
  };
  const usuarioCupoFinal = {
    IdFlujoRegistro: id,
    Numero_Cliente:props.data.Numero_Cliente,
    CupoFinal: cupoFinal.value.toString()
  }
  try {
    const postInfo = await axios.post('http://localhost:8080/api/bancow', payloadPost);
    const putInfo = await axios.put(`http://localhost:8080/api/scoring/estado/update/${id}`, payloadPut)
    const postUser = await axios.post('http://localhost:8080/api/bancow/user', usuarioCupoFinal)
    window.location.reload();
  } catch (error) {
    console.error("Error en alguno de los pasos:", error);
  }
};

//funcion boton no aprobado
// put actualizamos el estado a rechazado
const handleNoClick = async () => {
    if (
    !bancoListas.value ||
    !aprobacionCupoSugerido.value ||
    !pagareDigital.value ||
    !creacionCoreBancario.value ||
    !usuarioAprobado.value ||
    !cupoFinal.value
  ) {
     mensajeError.value = "Por favor, completa todos los campos";
    return;
  }
   mensajeError.value = "";
   const id = props.data.IdFlujoRegistro;
   
   const payloadPut = {
    Estado: "rechazado",
  };
  try{
    const putInfo = await axios.put(`http://localhost:8080/api/scoring/estado/update/${id}`, payloadPut)
    window.location.reload();

  }catch(error){
    console.error("Error en alguno de los pasos:", error);
  }
};

</script>

<template>
  <div class="card">
    <div class="header-display-info">
      <div class="empty-space-left"></div>

      <div class="info-card-group">
        <div class="info-fields-wrapper">
          <div class="info-field">
            <span class="info-field-label">Scoring:</span>
            <span class="info-field-value">{{ data.Scoring }}</span>
          </div>
          <div class="info-field">
            <span class="info-field-label">Cupo:</span>
            <span class="info-field-value">{{ data.Cupo }}</span>
          </div>
        </div>
      </div>

      <div class="cedula-display-text">
        Cédula: {{ data.Cedula_Cliente }}
      </div>
    </div>

    <div class="form-inputs-container">
      <label for="banco-listas" class="input-label main-input">
        <input
          class="form-control text-center"
          aria-required="true"
          aria-invalid="false"
          name="banco-listas"
          type="text"
          placeholder=""
          autocomplete="off"
          id="banco-listas"
          v-model="bancoListas"
        />
        <span class="floating-label">Banco listas</span>
      </label>
      <label for="aprobacion-cupo-sugerido" class="input-label main-input">
        <input
          class="form-control text-center"
          aria-required="true"
          aria-invalid="false"
          name="aprobacion-cupo-sugerido"
          type="text"
          placeholder=""
          autocomplete="off"
          id="aprobacion-cupo-sugerido"
          v-model="aprobacionCupoSugerido"
        />
        <span class="floating-label">Aprobacion cupo sugerido</span>
      </label>
      <label for="pagare-digital" class="input-label main-input">
        <input
          class="form-control text-center"
          aria-required="true"
          aria-invalid="false"
          name="aprobacion-cupo-2"
          type="text"
          placeholder=""
          autocomplete="off"
          id="pagare-digital"
          v-model="pagareDigital"
        />
        <span class="floating-label">Pagare digital firmado</span>
      </label>
      <label for="creacion-core-bancario" class="input-label main-input">
        <input
          class="form-control text-center"
          aria-required="true"
          aria-invalid="false"
          name="aprobacion-cupo-3"
          type="text"
          placeholder=""
          autocomplete="off"
          id="'creacion-core-bancario"
          v-model="creacionCoreBancario"
        />
        <span class="floating-label">Creacion core bancario</span>
      </label>
      <label for="usuario-aprobado" class="input-label main-input">
        <input
          class="form-control text-center"
          aria-required="true"
          aria-invalid="false"
          name="aprobacion-cupo-4"
          type="text"
          placeholder=""
          autocomplete="off"
          id="usuario-aprobado"
          v-model="usuarioAprobado"
        />
        <span class="floating-label">Usuario aprobado</span>
      </label>
      <label for="cupo-fnal" class="input-label main-input">
        <input
          class="form-control text-center"
          aria-required="true"
          aria-invalid="false"
          name="aprobacion-cupo-5"
          type="number"
          placeholder=""
          autocomplete="off"
          id="cupoFinal"
          v-model="cupoFinal"
        />
        <span class="floating-label">Cupo final</span>
      </label>
    </div>
    <div v-if="mensajeError" style="color: red; margin-bottom: 1rem; text-align: center;">
      {{ mensajeError }}
    </div>
    <div class="button-group">
      <div class="action-buttons-left">
        <button type="button" class="btn-si" @click="handleSiClick">Aprobado</button>
        <button type="button" class="btn-no" @click="handleNoClick">No aprobado</button>
      </div>
    </div>
  </div>
</template>

<style scoped>

.card {
  background: #fff;
  border-radius: 15px;
  padding: 1.5rem;
  max-width: 1200px;
  width: 95%;
  text-align: left;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.header-display-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
  width: 100%;
}

.info-card-group {
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 10px 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 15px;
  white-space: nowrap;
  order: 1; 
}

.info-fields-wrapper {
  display: flex;
  flex-direction: row; 
  align-items: center;
  gap: 10px;
}

.info-field {
  border-radius: 4px;
  padding: 2px 5px;
  display: flex;
  flex-direction: column; /* Label y valor apilados dentro de CADA CAMPO */
  align-items: flex-start;
  min-width: 80px;
  white-space: nowrap;
}

.info-field-label {
  font-size: 0.8em;
  color: #777;
  text-align: left;
  width: 100%;
}

.info-field-value {
  font-weight: bold;
  color: #333;
  font-size: 0.9em;
  text-align: left;
  width: 100%;
}

/* Espacio vacío para empujar contenido */
.empty-space-left {
  flex-grow: 1;
  order: 2; 
}
.cedula-display-text {
  background-color: #f0f0f0;
  padding: 5px 15px;
  border-radius: 5px;
  font-weight: bold;
  color: #333;
  font-size: 1.1em;
  white-space: nowrap;
  order: 3;
}

.form-inputs-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 15px;
  margin-bottom: 20px;
}

.input-label {
  position: relative;
  display: block;
  margin-top: 24px;
}

.main-input {
  flex-basis: calc(16.66% - 15px);
  min-width: 130px;
  max-width: 180px;
}

.form-control {
  width: 100%;
  padding: 10px 0;
  font-size: 16px;
  border: none;
  border-bottom: 2px solid #09008be1;
  background: transparent;
  font-family: sans-serif;
  outline: none;
  transition: border-color 0.3s ease;
}

.floating-label {
  position: absolute;
  left: 50%;
  top: 0;
  transform: translateX(-50%);
  color: black;
  font-size: 16px;
  pointer-events: none;
  transition: 0.3s ease all;
  font-family: sans-serif;
  white-space: nowrap;
}

/* Animación al enfocar o escribir */
.form-control:focus + .floating-label,
.form-control:not(:placeholder-shown) + .floating-label {
  top: -15px;
  font-size: 12px;
  color: black;
}

.input-label:hover .form-control {
  border-bottom-color: #ff00f2;
}

.form-control:focus {
  border-bottom-color: #0064e6cc;
  outline: none;
  box-shadow: none;
}

/* Grupo de botones inferior */
.button-group {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 30px;
  flex-wrap: wrap;
  width: 100%;
}

.action-buttons-left {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  align-items: center;
  order: 1; /* Mantiene este grupo a la izquierda dentro del button-group */
}

.button-group button {
  padding: 10px 20px;
  border-radius: 6.25rem;
  color: white;
  height: 3rem;
  min-width: 150px;
  cursor: pointer;
  border: none;
  outline: none;
  font-size: 16px;
  transition: background-color 0.3s ease;
  text-align: center;
  white-space: nowrap;
}

.btn-si {
  background: #dd3590;
}

.btn-si:hover {
  background-color: #f15bab;
}

.btn-no {
  background: #251886;
}

.btn-no:hover {
  background-color: #3b2c9b;
}

.btn-download {
  background-color: #007bff;
  color: white;
  min-width: 120px;
  white-space: nowrap;
  margin-top: 0 !important;
  margin-bottom: 0 !important;
  order: 2; /* Mueve este botón a la derecha dentro del button-group */
}

.btn-download:hover {
  background-color: #0056b3;
}

/* Quitar spin buttons de inputs tipo number */
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* MEDIA QUERIES DENTRO DEL COMPONENTE CreditInfoCard.vue */
@media (max-width: 1024px) {
  .card {
    max-width: 900px;
  }
  .main-input {
    flex-basis: calc(25% - 15px);
    min-width: 150px;
  }
  .main-input .floating-label {
    font-size: 14px;
  }
}

@media (max-width: 768px) {
  .card {
    max-width: 600px;
    padding: 1rem;
  }
  .header-display-info {
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }
  .empty-space-left { /* Ocultar el espacio vacío en móvil */
    display: none;
  }
  .info-card-group,
  .cedula-display-text {
    width: 90%;
    max-width: 400px;
    order: unset; /* Quitar el orden para que se apilen naturalmente */
  }
  .info-card-group { /* Para la card de Scoring/Cupo en móvil */
    flex-direction: column; /* Vuelve a apilar "Scoring" y "Cupo" en móvil */
    align-items: center;
    gap: 10px;
    padding: 15px 10px;
  }
  .info-fields-wrapper { /* Para los campos dentro de Scoring/Cupo en móvil */
    flex-direction: column; /* Apilar "Scoring" y "Cupo" en móvil */
    width: 100%;
    align-items: center;
    gap: 5px;
  }
  .info-field {
    width: 90%;
    max-width: 200px;
    align-items: center;
  }
  .info-field-label,
  .info-field-value {
    text-align: center;
  }

  .form-inputs-container {
    justify-content: center;
  }
  .main-input {
    flex-basis: calc(33.33% - 15px);
    min-width: 150px;
  }
  .main-input .floating-label {
    font-size: 13px;
    left: 50%;
    transform: translateX(-50%);
  }
  .button-group {
    flex-direction: column;
    align-items: center;
  }
  .action-buttons-left {
      flex-direction: column;
      width: 100%;
      align-items: center;
  }
  .button-group button {
      width: 90%;
      max-width: 250px;
  }
  .btn-download {
      width: 90%;
      max-width: 250px;
  }
}

@media (max-width: 480px) {
  .card {
    padding: 1rem;
    max-width: 90%;
  }
  .main-input {
    flex-basis: calc(50% - 15px);
    min-width: 140px;
  }
  .main-input .floating-label {
    font-size: 10px;
    left: 5px;
    transform: translateX(0);
    white-space: normal;
    top: -10px;
  }
  .info-card-group {
    padding: 10px;
  }
  .info-field {
    min-width: auto;
  }
}
</style>