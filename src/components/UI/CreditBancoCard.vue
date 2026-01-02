<script setup>
import { ref } from "vue";
import axios from "axios";
import { onMounted } from 'vue';
const props = defineProps({
  data: {
    type: Object,
    required: true,
    default: () => ({
      cedula: "", 
    }),
  },
  bancowData: {
    type: Array,
    required: true,
  },
  token: {
    type: String,
    required: true
  }
});

console.log("Data recibida en Card:", props.data);
console.log("Data w:", props.bancowData);

const bancoListas = ref("");
const cupoAprobado = ref("");
const pagareDigital = ref("");
const pagareEnviado = ref("");
const usuarioAprobado = ref("");
const mensajeError = ref("");
const botonAprobado = true;
const camposBloqueados = ref(false);
const token = localStorage.getItem("token");
const payloadPut = { Estado: ""};

const precargado = {
  bancoListas: ref(false),
  cupoAprobado: ref(false),
  pagareDigital: ref(false),
  pagareEnviado: ref(false),
  usuarioAprobado: ref(false),
};

console.log("bancowdata en card:", props.bancowData);

onMounted(() => {
  const registro = props.bancowData.find(
    item => item.IdFlujoRegistro === props.data.IdFlujoRegistro
  );

  if (registro) {
    bancoListas.value = registro.Validacion_Banco_listas || null;
    precargado.bancoListas.value = !!registro.Validacion_Banco_listas;

    cupoAprobado.value = registro.Aprobacion_Cupo_sugerido || null;
    precargado.cupoAprobado.value = !!registro.Aprobacion_Cupo_sugerido;

    pagareDigital.value = registro.Pagare_Digital_Firmado || null;
    precargado.pagareDigital.value = !!registro.Pagare_Digital_Firmado;

    pagareEnviado.value = registro.Pagare_Digital_Enviado || null;
    precargado.pagareEnviado.value = !!registro.Pagare_Digital_Enviado;

    usuarioAprobado.value = registro.UsuarioAprobado || null;
    precargado.usuarioAprobado.value = !!registro.UsuarioAprobado;
  }
});

const isFieldDisabled = (campo) => {
  const camposFinales = ['pagareDigital', 'pagareEnviado', 'usuarioAprobado'];

  if (precargado[campo] && precargado[campo].value) {
    return true;
  }

  if (campo === 'usuarioAprobado') {
    return (
      pagareDigital.value !== 'si' ||
      pagareEnviado.value !== 'si' ||
      camposBloqueados.value
    );
  }
  if (camposFinales.includes(campo) && props.data.Estado === 'pendiente') {
    return true;
  }

  return camposBloqueados.value;
};

const handleSiClick = async () => {
  if (
    !pagareDigital.value &&
    !pagareEnviado.value &&
    !usuarioAprobado.value
  ) {
    mensajeError.value = "Por favor, completa al menos un campo para guardar";
    return;
  }

  if(props.bancowData.Pagare_Digital_Enviado === "" && pagareEnviado.value === "si"){
        const number = props.data.Numero_Cliente;
        const customer_name = props.data.Nombres;
        const correo = props.data.Correo_Electronico || "";
        await axios.post(`https://enlace-crm.com:3000/backend/whatsapp/meta/firma-digital/${number}/${customer_name}/${correo}`)
  }
  

  if(usuarioAprobado.value === "si"){
    const number = props.data.Numero_Cliente;
    const customer_name = props.data.Nombres
    await axios.post(`https://enlace-crm.com:3000/backend/whatsapp/meta/cupo-activo/${number}/${customer_name}`)
  }

  mensajeError.value = "";
  const id = props.data.IdFlujoRegistro;

  const payloadPost = {
    Pagare_Digital_Firmado: pagareDigital.value,
    Pagare_Digital_Enviado: pagareEnviado.value,
    UsuarioAprobado: usuarioAprobado.value,
  };

  const usuarioCupoFinal = {
    IdFlujoRegistro: id,
    CupoFinal: props.data.Cupo,
    Numero_Cliente: props.data.Numero_Cliente,
    Cedula_Usuario: props.data.Cedula_Cliente,
    CupoDisponible: Number(props.data.Cupo.replace(/\./g, '')),
  };

  try {
    await axios.put(`api/coreBancario/${id}`, payloadPost, {
      headers: {
        Authorization: `Bearer ${props.token}`,
        "Content-Type": "application/json",
      },
    });

    if (usuarioAprobado.value === "si") {
      await axios.post("api/user", usuarioCupoFinal, {
        headers: {
          Authorization: `Bearer ${props.token}`,
          "Content-Type": "application/json",
        },
      });

      await axios.put(`api/scoring/estado/update/${id}`, {
        Estado: "creado",
      }, {
        headers: {
          Authorization: `Bearer ${props.token}`,
          "Content-Type": "application/json",
        },
      });
      await axios.put(`api/flujoRegistroEnlace/estado/pendiente/${id}`, {
        Estado: "creado",
      }, {
        headers: {
          Authorization: `Bearer ${props.token}`,
          "Content-Type": "application/json",
        },
      });
    }

    window.location.reload();
  } catch (error) {
    console.error("Error en alguno de los pasos:", error);
  }
};

const handleNoClick = async () => {
  if (
    !bancoListas.value ||
    !cupoAprobado.value 
  ) {
    mensajeError.value = "Por favor, completa los campos banco listas y cupo aprobado";
    return;
  }
  mensajeError.value = "";
  const id = props.data.IdFlujoRegistro;
   
  const payloadPut = {
    Estado: "negado",
  };
  try{
    const putInfo = await axios.put(`api/scoring/estado/update/${id}`, 
      payloadPut,
      {
        headers: {  
          Authorization: `Bearer ${props.token}`,
          "Content-Type": "application/json"
        }
      })
    window.location.reload();
  }catch(error){
    console.error("Error en alguno de los pasos:", error);
  }
};

const handleAprobadoClick = async () => {
  if (!cupoAprobado.value) {
    mensajeError.value = "Por favor, completa el campo cupo aprobado";
    return;
  }
  mensajeError.value = "";
  const id = props.data.IdFlujoRegistro;
   
  const payloadAprobado = {
    IdFlujoRegistro: props.data.IdFlujoRegistro,
    Aprobacion_Cupo_sugerido: cupoAprobado.value,
  };
  console.log("Payload que se va a enviar:", payloadAprobado,);

  if (cupoAprobado.value === 'si') {
    payloadPut.Estado = "aprobado";

    const number = props.data.Numero_Cliente;
    const customer_name = props.data.Nombres
    const monto = props.data.Cupo
      await axios.post(`https://enlace-crm.com:3000/backend/whatsapp/meta/cupo/${number}/${customer_name}/${monto}`)
    
  } else if (cupoAprobado.value === 'No' || cupoAprobado.value === 'no') {
    payloadPut.Estado = "negado";
  }


  console.log("Payload que se va a enviar al put:", payloadPut,);



  try{
    await axios.post('/api/bancow', 
      payloadAprobado,
      {
        headers: {  
          Authorization: `Bearer ${props.token}`,
          "Content-Type": "application/json"
        }
      }
    );
      await axios.put(`api/scoring/estado/update/${id}`, 
      payloadPut,
      {
        headers: {  
          Authorization: `Bearer ${props.token}`,
          "Content-Type": "application/json"
        }
      })
      await axios.put(`api/flujoRegistroEnlace/estado/pendiente/${id}`,
        payloadPut,
       {
        headers: {
          Authorization: `Bearer ${props.token}`,
          "Content-Type": "application/json",
        },
      });
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
      <div class="cedula-display-text">
        Nombre: {{ data.Nombres }} {{ data.Primer_Apellido }}
      </div>
    </div>

    <div class="form-inputs-container">
      <label for="aprobacion-cupo-sugerido" class="input-label main-input" 
        v-if="props.data.Estado === 'pendiente'"
       >
        <select
          class="form-control text-center"
          id="aprobacion-cupo-sugerido"
          :disabled="isFieldDisabled('cupoAprobado')"
          v-model="cupoAprobado"
        >
         <option value="">Selecciona</option>
         <option value="si">Sí</option>
         <option value="no">No</option>
        </select>
        <span class="floating-label">Cupo aprobado</span>
      </label>

      <p class="mensajeConfirmar" 
        v-if="props.data.Estado === 'aprobado'"
       >
        Cliente pendiente por confirmar cupo asignado 
      </p>
    </div>

    <div v-if="props.data.Estado === 'confirmado'" class="form-inputs-container">
      <label for="pagareEnviado" class="input-label main-input">
        <select
          class="form-control text-center"
          id="pagareEnviado"
          v-model="pagareEnviado"
          :disabled="isFieldDisabled('pagareEnviado')"
        >
          <option value="">No</option>
          <option value="si">Sí</option>
        </select>
        <span class="floating-label">Pagare digital enviado</span>
      </label>
      <label for="pagare-digital" class="input-label main-input">
        <select
          class="form-control text-center"
          id="pagare-digital"
          v-model="pagareDigital"
          :disabled="isFieldDisabled('pagareDigital')"
        >
          <option value="">No</option>
          <option value="si">Sí</option>
        </select>
        <span class="floating-label">Pagare digital firmado</span>
      </label>

      <label for="usuario-aprobado" class="input-label main-input">
        <select
          class="form-control text-center"
          id="usuario-aprobado"
          v-model="usuarioAprobado"
          :disabled="isFieldDisabled('usuarioAprobado')"
        >
          <option value="">No</option>
          <option value="si">Sí</option>
        </select>
        <span class="floating-label">Usuario creado</span>
      </label>
    </div>

    <div v-if="mensajeError" style="color: red; margin-bottom: 1rem; text-align: center;">
      {{ mensajeError }}
    </div>

    <div class="button-group">
      <div class="action-buttons-left">
        <button 
          v-if="props.data.Estado === 'pendiente'"
          type="button" 
          class="btn-si"
          @click="handleAprobadoClick"
        >
          Guardar
        </button>
        <button 
          v-if="props.data.Estado === 'confirmado'"
          type="button" 
          class="btn-si"
          @click="handleSiClick"
        >
          Guardar
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
select:disabled {
  color: #b4b2b2;
  opacity: 1;
}
.btn-no:disabled {
  background-color: #ccc !important;
  color: #666 !important;
  cursor: not-allowed !important;
  border: 1px solid #aaa !important;
}
.btn-si:disabled {
  background-color: #ccc !important;
  color: #666 !important;
  cursor: not-allowed !important;
  border: 1px solid #aaa !important;
}

.card {
  background: #fff;
  border-radius: 15px;
  padding: 1.5rem;
  width: 95%;
  text-align: left;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  margin-left: auto;
  margin-right: auto;
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
  flex-direction: column;
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
  flex-wrap: nowrap;
  justify-content: center;
  gap: 15px;
  margin-bottom: 20px;
  width: 100%;
}

.input-label {
  position: relative;
  display: block;
  margin-top: 24px;
}

.main-input {
  flex-basis: calc(20% - 15px);
  min-width: 150px;
  max-width: 200px;
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
  order: 1;
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
  background: #dd3590;
}

.btn-no:hover {
  background-color: #f15bab;
}
.btn-download {
  background-color: #007bff;
  color: white;
  min-width: 120px;
  white-space: nowrap;
  margin-top: 0 !important;
  margin-bottom: 0 !important;
  order: 2;
}

.btn-download:hover {
  background-color: #0056b3;
}
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

@media (min-width: 1025px) {
.card {
    width: fit-content;
    min-width: 950px;
    max-width: unset;
    margin-left: auto;
    margin-right: auto;
}

.form-inputs-container {
    flex-wrap: nowrap;
    justify-content: center;
}

.main-input {
    flex-basis: calc(20% - 15px);
    min-width: 160px;
    max-width: 220px;
}
}
@media (max-width: 1024px) {
  .card {
    max-width: 900px;
    margin-left: auto;
    margin-right: auto;
  }
  .main-input {
    flex-basis: calc(25% - 15px);
    min-width: 150px;
    max-width: 180px;
  }
  .main-input .floating-label {
    font-size: 14px;
  }
}

@media (max-width: 768px) {
  .card {
    max-width: 600px;
    padding: 1rem;
    margin-left: auto;
    margin-right: auto;
  }
  .header-display-info {
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }
  .empty-space-left {
    display: none;
  }
  .info-card-group,
  .cedula-display-text {
    width: 90%;
    max-width: 400px;
    order: unset;
  }
  .info-card-group {
    flex-direction: column;
    align-items: center;
    gap: 10px;
    padding: 15px 10px;
  }
  .info-fields-wrapper {
    flex-direction: column;
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
    flex-wrap: wrap;
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
    margin-left: auto;
    margin-right: auto;
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