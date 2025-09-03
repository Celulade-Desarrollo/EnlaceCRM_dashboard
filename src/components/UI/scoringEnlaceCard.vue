<script setup>
import axios from 'axios';
import { defineProps, ref, onMounted, computed } from 'vue';

const props = defineProps({
  data: {
    type: Object,
    required: true,
    default: () => ({ cedula: "" }),
  },
  token: {
    type: String,
    required: true,
  },
  scoringData: {
    type: Array,
    required: true
  },
  bancowData: {
    type: Array,
    required: true
  }
});

// Refs principales
const localScoring = ref("");
const localCupo = ref("");
const mensajeError = ref("");
const confirmado = ref("")
// Precargado flags
const precargado = {
  localScoring: ref(false),
  localCupo: ref(false),
};
console.log("Props data:", props.data);
console.log("scoringData en card:", props.scoringData);
console.log("bancowData en card:", props.bancowData);
onMounted(() => {
  const registro = props.scoringData.find(
    item => String(item.IdFlujoRegistro) === String(props.data.Id)
  );

  if (registro) {
    if (registro.Scoring) {
      localScoring.value = registro.Scoring;
      precargado.localScoring.value = true;
    }

    if (registro.Cupo) {
      localCupo.value = registro.Cupo;
      precargado.localCupo.value = true;
    }
  }
});

const puedeConfirmar = computed(() => {
  const camposLlenos = precargado.localScoring.value && precargado.localCupo.value;

  const bancoRegistro = props.bancowData.find(
    item => String(item.IdFlujoRegistro) === String(props.data.Id)
  );

  const aprobadoBanco = bancoRegistro?.Aprobacion_Cupo_sugerido === "si";

  return camposLlenos && aprobadoBanco;
});

const handleconfirmado = async () => {
  if (
    !confirmado.value
  ) {
    mensajeError.value = "Por favor, confirma si el usuario acepto el cupo";
    return;
  }

  mensajeError.value = "";

  const id = props.data.Id;

  const payload = {
    Scoring: localScoring.value.toString(),
    Cupo: localCupo.value.toString(),
    IdFlujoRegistro: id,
    Cliente_Acepto: confirmado.value,
    Cedula_Cliente: props.data.Cedula_Cliente.toString(),
    Numero_Cliente: props.data.Numero_Celular.toString(),
  };

  const payloadput = { Estado: "confirmado" };

  try {
    if (confirmado.value === "si" && localScoring.value && localCupo.value)   {
      
       await axios.put(`/api/flujoRegistroEnlace/estado/pendiente/${id}`, payloadput, {
      headers: {
        Authorization: `Bearer ${props.token}`,
        "Content-Type": "application/json",
      },
    });
    }
    await axios.put(`api/scoring/estado/update/${id}`, 
      payloadput, 
      {
        headers: {
          Authorization: `Bearer ${props.token}`,
          "Content-Type": "application/json",
        },
    });

    window.location.reload();
  } catch (error) {
    console.error('Error al enviar al banco:', error);
  }
};

const handleScoringCupo = async () => {
  if (
    !localScoring.value ||
    !localCupo.value
  ) {
    mensajeError.value = "Por favor, completa los campos scoring y cupo para guardar";
    return;
  }

  mensajeError.value = "";

  const id = props.data.Id;

  const payload = {
    Scoring: localScoring.value.toString(),
    Cupo: localCupo.value.toString(),
    IdFlujoRegistro: id,
    Cliente_Acepto: confirmado.value,
    Cedula_Cliente: props.data.Cedula_Cliente.toString(),
    Numero_Cliente: props.data.Numero_Celular.toString(),
  };

  const payloadput = { Estado: "aprobado" };

  try {
    await axios.put(`/api/flujoRegistroEnlace/estado/pendiente/${id}`, payloadput, {
      headers: {
        Authorization: `Bearer ${props.token}`,
        "Content-Type": "application/json",
      },
    });

    await axios.post('/api/scoring', payload, {
      headers: {
        Authorization: `Bearer ${props.token}`,
        "Content-Type": "application/json",
      },
    });

    window.location.reload();
  } catch (error) {
    console.error('Error al enviar al banco:', error);
  }
};


function formatCurrency(event) {
  let input = event.target;
  let digits = input.value.replace(/\D/g, '');
  let formatted = digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  input.value = formatted;
  localCupo.value = formatted;
}
</script>


<template>
  <div class="tarjeta">
    <div class="tarjeta-header">
      <p class="cedula">Cédula: {{ data.Cedula_Cliente }}</p>
    </div>
    <div class="etapas-container">
      <div class="etapa">Género: {{ data.Genero }}</div>
      <div class="etapa">Estado Civil: {{ data.Estado_Civil }}</div>
      <div class="etapa">Nivel Educativo: {{data.Nivel_Educativo }}</div>
      <div class="etapa">Estrato: {{ data.Estrato }}</div>
      <div class="etapa">Declara Renta: {{ data.Declara_Renta ? 'Si' : 'No' }}</div>
      <div class="etapa">Esta obligado a tener RUT por tu actividad economica: {{ data.Esta_obligado_a_tener_RUT_por_tu_actividad_economica ? 'Si' : 'No' }}</div>
      <div class="etapa">Ubicación del Negocio-Departamento: {{ data.Ubicacion_del_Negocio_Departamento }}</div>
      <div class="etapa">Ubicación del Negocio-Ciudad: {{ data.Ubicacion_del_Negocio_Ciudad }}</div>
      <div class="etapa">Numero de neveras que tiene la tienda: {{ data.Numero_de_neveras }}</div>
      <div class="etapa">Reguistrado en Camara de Comercio: {{ data.Registrado_Camara_Comercio ? 'Si' : 'No' }}</div>
      <div class="etapa">Rango Ingreso: {{ data.Rango_de_Ingresos }}</div>
    </div>

    <div class="tabla-contenedor">
      <table class="tabla">
        <thead>
          <tr>
            <th>Scoring</th>
            <th>Cupo</th>
            <th>Usuario confirmo</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td :disabled="precargado.localCupo.value">
              <input
                v-model="localScoring"
                class="tabla-input"
                type="number"
                :disabled="precargado.localScoring.value"
                placeholder="Ej: 40"
              />
            </td>
            <td :disabled="precargado.localCupo.value">
              <input
                v-model="localCupo"
                class="tabla-input"
                type="text"
                @input="formatCurrency"
                :disabled="precargado.localCupo.value"
                placeholder="Ej: 1.000.000"
              />
            </td>
            <td>
              <select
                class="tabla-input" 
                v-model="confirmado"
                :disabled="!puedeConfirmar">
                <option value="" selected>Selecciona una opción</option>
                <option value="si">Si</option>
              </select>
            <p v-if="!puedeConfirmar" style="color: #999; font-size: 0.85rem;">
               Asegúrate de guardar Scoring y Cupo, y que el banco haya aprobado el cupo sugerido.
            </p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="mensajeError" style="color: red; margin-bottom: 1rem; text-align: center;">
      {{ mensajeError }}
    </div>
    <div class="tarjeta-acciones">
      <button 
          v-if="props.data.Estado === 'pendiente'"
          class="boton-enviar"
          @click="handleScoringCupo"
        >
          Guardar
        </button>
         <button 
          v-if="props.data.Estado === 'aprobado'"
          class="boton-enviar"
          @click="handleconfirmado"
        >
          Guardar
        </button>
    </div>
  </div>
</template>

<style scoped>
input:disabled {
  color: #6b6a6a;
  background-color: #f0f0f0;
  border: 2px solid #ccc !important;
  box-shadow: none !important;
}
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
  background-color: #f0f0f0;
  padding: 5px 15px;
  border-radius: 5px;
  font-weight: bold;
  color: #333;
  font-size: 1.1em;
  white-space: nowrap;
  order: 3;
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
  border-bottom: 3px solid #ffffff;
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
