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
const localLatitud = ref("");
const localLongitud = ref("");
const mensajeError = ref("");
const confirmado = ref("no");



// Control de estados UI
const camposDeshabilitados = ref(false);
const confirmacionHabilitada = ref(false);

// Precargado flags (🆕 agregamos latitud y longitud)
const precargado = {
  localScoring: ref(false),
  localCupo: ref(false),
  localLatitud: ref(false),
  localLongitud: ref(false),
};

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

    if (registro.Latitud) {
      localLatitud.value = registro.Latitud;
      precargado.localLatitud.value = true;
    }

    if (registro.Longitud) {
      localLongitud.value = registro.Longitud;
      precargado.localLongitud.value = true;
    }
  }

  const bancoRegistro = props.bancowData.find(
    item => String(item.IdFlujoRegistro) === String(props.data.Id)
  );

  if (bancoRegistro?.Aprobacion_Cupo_sugerido === "si") {
    camposDeshabilitados.value = true;
    confirmacionHabilitada.value = true;
  } else {
    camposDeshabilitados.value = false;
    confirmacionHabilitada.value = false;
  }

if (registro?.Cliente_Acepto === 'si' || registro?.Cliente_Acepto === 'SI') {
  confirmado.value = 'si';
} else {
  confirmado.value = 'no';
}


});

const puedeConfirmar = computed(() => {
  const camposLlenos =
    precargado.localScoring.value &&
    precargado.localCupo.value &&
    precargado.localLatitud.value &&
    precargado.localLongitud.value; // 🆕 agregado
  const bancoRegistro = props.bancowData.find(
    item => String(item.IdFlujoRegistro) === String(props.data.Id)
  );
  const aprobadoBanco = bancoRegistro?.Aprobacion_Cupo_sugerido === "si";
  return camposLlenos && aprobadoBanco;
});

const datosCompletos = computed(() => {
  return (
    precargado.localScoring.value &&
    precargado.localCupo.value &&
    precargado.localLatitud.value &&
    precargado.localLongitud.value
  );
});

const handleconfirmado = async () => {
  if (!confirmado.value) {
    mensajeError.value = "Por favor, confirma si el usuario aceptó el cupo";
    return;
  }

  mensajeError.value = "";

  const id = props.data.Id;

  const payload = {
    Scoring: localScoring.value.toString(),
    Cupo: localCupo.value.toString(),
    Latitud: localLatitud.value.toString(),
    Longitud: localLongitud.value.toString(),
    IdFlujoRegistro: id,
    Cliente_Acepto: confirmado.value,
    Cedula_Cliente: props.data.Cedula_Cliente.toString(),
    Numero_Cliente: props.data.Numero_Celular.toString(),
  };

  const payloadput = { Estado: "confirmado" };
  const paylaodClienteAcepto = { respuestaCliente: confirmado.value };

  try {
    if (confirmado.value === "si" && localScoring.value && localCupo.value) {
      await axios.put(`api/flujoRegistroEnlace/estado/pendiente/${id}`, payloadput, {
        headers: {
          Authorization: `Bearer ${props.token}`,
          "Content-Type": "application/json",
        },
      });
      await axios.put(`api/scoring/estado/update/${id}`, payloadput, {
        headers: {
          Authorization: `Bearer ${props.token}`,
          "Content-Type": "application/json",
        },
      });
      await axios.put(`api/flujoRegistroEnlace/clienteAcepto/${id}`, paylaodClienteAcepto, {
        headers: {
          Authorization: `Bearer ${props.token}`,
          "Content-Type": "application/json",
        },
      });
    }
    window.location.reload();
  } catch (error) {
    console.error('Error al enviar al banco:', error);
  }
};

const handleScoringCupo = async () => {
  if (!localScoring.value || !localCupo.value || !localLatitud.value || !localLongitud.value) {
    mensajeError.value = "Por favor, completa Scoring, Cupo, Latitud y Longitud para guardar";
    return;
  }

  mensajeError.value = "";

  const id = props.data.Id;

  const payload = {
    Scoring: localScoring.value.toString(),
    Cupo: localCupo.value.toString(),
    Latitud: localLatitud.value.toString(),
    Longitud: localLongitud.value.toString(),
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
// ✅ AQUÍ VA ESTO
precargado.localScoring.value = true;
precargado.localCupo.value = true;
precargado.localLatitud.value = true;
precargado.localLongitud.value = true;

    window.location.reload();
  } catch (error) {
    console.error('Error al enviar al banco:', error);
  }
};

function autoFormatCoordenada(event, tipo) {
  let valor = event.target.value.replace(/[^0-9-]/g, '');
  const esNegativo = valor.startsWith("-");
  valor = valor.replace(/-/g, "");
  if (valor.length > 2) {
    valor = valor.slice(0, 2) + "." + valor.slice(2);
  }
  if (esNegativo) {
    valor = "-" + valor;
  }
  event.target.value = valor;
  if (tipo === "lat") localLatitud.value = valor;
  else if (tipo === "lon") localLongitud.value = valor;
}

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
      <div class="etapa">Nivel Educativo: {{ data.Nivel_Educativo }}</div>
      <div class="etapa">Estrato: {{ data.Estrato }}</div>
      <div class="etapa">Declara Renta: {{ data.Declara_Renta ? 'Sí' : 'No' }}</div>
      <div class="etapa">RUT por actividad económica: {{ data.Esta_obligado_a_tener_RUT_por_tu_actividad_economica ? 'Sí' : 'No' }}</div>
      <div class="etapa">Depto Negocio: {{ data.Ubicacion_del_Negocio_Departamento }}</div>
      <div class="etapa">Ciudad Negocio: {{ data.Ubicacion_del_Negocio_Ciudad }}</div>
      <div class="etapa">Neveras: {{ data.Numero_de_neveras }}</div>
      <div class="etapa">Cámara de Comercio: {{ data.Registrado_Camara_Comercio ? 'Sí' : 'No' }}</div>
      <div class="etapa">Rango Ingreso: {{ data.Rango_de_Ingresos }}</div>
    </div>

    <div class="tabla-contenedor">
      <table class="tabla">
        <thead>
          <tr>
            <th>Scoring</th>
            <th>Cupo</th>
            <th>Latitud</th>
            <th>Longitud</th>
            <th>Usuario confirmo</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <input
                v-model="localScoring"
                class="tabla-input"
                type="number"
                placeholder="Ej: 40"
                :disabled="precargado.localScoring.value"
              />
            </td>
            <td>
              <input
                v-model="localCupo"
                class="tabla-input"
                type="text"
                @input="formatCurrency"
                placeholder="Ej: 1.000.000"
                :disabled="precargado.localCupo.value"
              />
            </td>
            <td>
              <input
                v-model="localLatitud"
                class="tabla-input"
                type="text"
                placeholder="Ej: 4.6486"
                @input="autoFormatCoordenada($event, 'lat')"
                :disabled="precargado.localLatitud.value"
              />
            </td>
            <td>
              <input
                v-model="localLongitud"
                class="tabla-input"
                type="text"
                placeholder="Ej: -74.2479"
                @input="autoFormatCoordenada($event, 'lon')"
                :disabled="precargado.localLongitud.value"
              />
            </td>
            <td>

  <template v-if="!datosCompletos">
  </template>

  <template v-else-if="confirmado === 'no'">
    <span class="estado-confirmacion estado-no">NO</span>
    <p class="nota">Pendiente por respuesta del cliente.</p>
  </template>

  <template v-else>
    <span class="estado-confirmacion estado-si">SÍ</span>
  </template>
<p v-if="!datosCompletos" class="nota">
  Asegúrate de guardar Scoring, Cupo, Latitud y Longitud, y que el banco haya aprobado.
</p>

            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="mensajeError" class="mensaje-error">
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

.tarjeta {
  width: 1200px;
  margin: 2rem auto;
  padding: 1.5rem;
  border: 2px solid #563e93;
  border-radius: 1rem;
  background-color: #fefefe;
  font-family: sans-serif;
}
.estado-confirmacion {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 10px;
  font-weight: bold;
  font-size: 0.95rem;
}

.estado-no {
  background-color: #fdecea;
  color: #d93025;
  border: 2px solid #d93025;
}

.estado-si {
  background-color: #e6f7ee;
  color: #1e8e5a;
  border: 2px solid #1e8e5a;
}


.cedula {
  background-color: #f0f0f0;
  padding: 5px 15px;
  border-radius: 5px;
  font-weight: bold;
  color: #333;
  font-size: 1.1em;
}

.etapas-container {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin: 2rem auto;
}

.etapa {
  font-size: 1rem;
  font-weight: 500;
  padding: 0.5rem 1rem;
  background: #f9f9f9;
  border-bottom: 3px solid #ffffff;
  border-radius: 0 0 10px 10px;
  min-width: 250px;
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

.nota {
  color: #999;
  font-size: 0.85rem;
}

.mensaje-error {
  color: red;
  margin-bottom: 1rem;
  text-align: center;
}

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
  background: #5A44D1;
  color: #fff;
  outline: none;
  border: none;
}

.boton-enviar:hover {
  background-color: #3A2CA8;
}
</style>