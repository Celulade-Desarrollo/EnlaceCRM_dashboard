<script setup>
import { ref, onMounted, reactive } from 'vue';
import axios from 'axios';
import Alerta from '../components/UI/Alerta.vue';

// Referencias para los campos del formulario
const telefono = ref('');
const password = ref('');

// Función para obtener datos
const fetchData = async () => {
  try {
    const response = await axios.get(`https://enlacecrm.com/api/get_data.php?tipo=login&&usuario=${telefono.value}&&pass=${password.value}`);
    if (response.data == "NO") {
      alerta.mensaje = 'Usuario y clave incorrecto';
      alerta.tipo = 'error';
      setTimeout(() => {
        alerta.mensaje = '';
        alerta.tipo = '';
      }, 3000);
      return;
    } else {
      let data = response.data;
      data = JSON.stringify(data);
      console.log(data);
      localStorage.setItem('data', data);

      let respuesta = JSON.parse(localStorage.getItem('data'));
      window.open("/Pantalla1View", "_parent");
    }
  } catch (error) {
    alerta.mensaje = 'Error al conectarse al servidor';
    alerta.tipo = 'error';
    setTimeout(() => {
      alerta.mensaje = '';
      alerta.tipo = '';
    }, 3000);
  }
};

const goToPantalla9 = () => {
  window.open("/Pantalla9View", "_parent");
};

const handleSubmit = async (event) => {
  event.preventDefault(); // Evita el envío del formulario por defecto
  await fetchData(); // Llama a la función fetchData para obtener datos
};

const alerta = reactive({
  tipo: '',
  mensaje: ''
});

const validar = () => {
  if (!telefono.value || !password.value) {
    // alerta.mensaje = 'Todos los campos son obligatorios';
    alerta.tipo = 'error';
    setTimeout(() => {
      alerta.mensaje = '';
      alerta.tipo = '';
    }, 3000);
    return false;
  }
  return true;
};

onMounted(() => {
  const form = document.getElementById('myForm');
  if (form) {
    form.addEventListener('submit', handleSubmit);
  }
});
</script>

<template>
  <section class="logo-container">
    <picture class="logo">
      <img src="/public/enlaceFiado.png" alt="logo" class="img-fluid" loading="lazy" title="logo" />
    </picture>
  </section>

  <!-- Mostrar la alerta solo si existe un mensaje -->
  <Alerta v-if="alerta.mensaje" :alerta="alerta" />

  <!-- Contenido de login centrado -->
  <h3 class="titulo-login">Ingresa a tu cuenta</h3>
  <section class="login-container">
    <div class="login-card">
      <form id="myForm" class="myForm" @submit.prevent="validar">
        <div class="form-group">
          <label for="telefono" class="input-label">
            <input
              class="form-control"
              v-model="telefono"
              placeholder=""
              type="tel"
              pattern="[0-9]{10}"
            />
             <span class="floating-label">Ingresa tu teléfono</span>
          </label>
        </div>
        <div class="form-group">
          <label for="password" class="input-label">
            <input
              class="form-control"
              v-model="password"
              type="password"
              placeholder=""
              
            />
             <span class="floating-label">Ingresa contraseña</span>
          </label>
        </div>
        <button type="submit" class="button mt-4">Ingresar</button>
      </form>
      <p class="subtitulo mt-4">
        ¿No estás registrado?<br />
        Regístrate <a href="https://fiado.enlacecrm.com/"><span>AQUÍ</span></a>
      </p>
      <p class="fpassword mt-4" @click="goToPantalla9">
        ¿Olvidaste tu contraseña?<br />
        Haz click <span>AQUÍ</span>
      </p>
    </div>
  </section>
</template>

<style scoped>
.input-label {
  position: relative;
  display: block;
  width: 100%;
  margin-top: 24px;
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
  left: 0;
  top: 0px;
  color: black;
  font-size: 16px;
  pointer-events: none;
  transition: 0.3s ease all;
  font-family: sans-serif;
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



.logo-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 7px;
}

.logo .img-fluid {
  margin-top: 30px;
  margin-bottom: 30px;
  max-width: 300px;
  height: auto;

}

.titulo-login {
  text-align: center;
  color: #fff;
  font-weight: bold;
  font-size: 1.875rem;
}

.btn-primary {
  color: #fff;
  background-color: #251886;
  border-color: #251886;
}

span {
  color: #dd3590;
}

.login-container {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
}

.login-card {
  background-color: #fff;
  padding: 24px;
  border-radius: 16px;
  margin-top: 20px;
  width: 100%;
  max-width: 380px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  margin-bottom: 100px;
}

.myForm {
  text-align: center;
}

button {
  padding-left: 1.25rem;
  padding-right: 1.25rem;
  border-radius: 6.25rem;
  background: #dd3590;
  color: white;
  height: 3rem;
  width: 100%;
  margin-top: 20px;
  cursor: pointer;
  border: none;
  outline: none;
  align-items: center;
}
.button:hover {
  background-color: #f15bab;
}

button:focus {
  outline: none;
  box-shadow: none;
}

.subtitulo {
  color: black;
  font-weight: bold;
}

.fpassword {
  font-size: smaller;
  color: black;
}
</style>
