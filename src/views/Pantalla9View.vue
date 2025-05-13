<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import RouterLink from "../components/UI/Routerlink.vue";
import Heading from "../components/UI/Heading.vue";

const email = ref('');
const emailErrorMessage = ref('');
const mensajeError = ref('');

// Regex para validar formato de email
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Validación del formato del email (tiempo real)
watch(email, (newEmail) => {
  if (!newEmail) {
    emailErrorMessage.value = "";
  } else if (!emailRegex.test(newEmail)) {
    emailErrorMessage.value = "Por favor, ingresa un correo electrónico válido.";
  } else {
    emailErrorMessage.value = "";
  }
});

// Redirigir a la pantalla de recuperación de contraseña
const goToPantallaInicio = () => {
    window.open("/", "_parent");
};

// Manejar el envío del formulario
const handleSubmit = async (event) => {
    event.preventDefault();
    await fetchData();
};

// Asignar el evento al montar el componente
onMounted(() => {
    const form = document.getElementById('myForm');
    if (form) {
        form.addEventListener('submit', handleSubmit);
    }
});
</script>


<template>
  <!-- Contenido de login centrado -->
    <section class="logo-container">
      <img src="/public/enlaceFiado.png" alt="logo Enlace CRM" class="logo-main" /><br><br>
    </section>

   <h4 class="titulo-login">¿Olvidaste tu contraseña?</h4>
  <section class="login-container">
    <div class="login-card">
      <form id="myForm" class="myForm">
        <p class="subtitulo mt-4">Ingresa tu correo electrónico registrado y te enviaremos instrucciones para restablecer tu contraseña.</p>
        <div class="form-group">
          <label for="email" class="input-label">
            <input
              class="form-control"
              aria-required="true"
              aria-invalid="false"
              aria-labelledby="label-email"
              name="email"
              v-model="email"
              type="email"
              placeholder=""
              autocomplete="off"
              aria-describedby="error-email"
            />
             <span class="floating-label">Ingresa tu correo</span>
          </label>
        </div>

        <div class="button-container mt-4">
            <button type="submit" class="button mt-4">
              Enviar Instrucciones
            </button>
            <button type="submit" class="button mt-4" @click="goToPantallaInicio">
              Volver a la pagina principal
            </button> 
        </div>
      </form>
    </div>
  </section>
</template>

<style scoped>
* {
  box-sizing: border-box;
}

.logo-container {
  text-align: center;
  margin-top: 1rem;
}

.logo-main {
  width: 200px;
  height: auto;
  display: inline-block;
}

.titulo-login {
  text-align: center;
  color: #fff;
  font-weight: bold;
  font-size: 1.875rem;
}

.login-container {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  padding: 16px;
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

input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

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
  left: 50%;
  top: 0;
  transform: translateX(-50%);
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
  display: flex;
  justify-content: center;
  align-items: center;
}

.button:hover {
  background-color: #f15bab;
}

button:focus {
  outline: none;
  box-shadow: none;
}

.myForm {
  text-align: center;
}

.subtitulo {
  color: black;
  font-weight: bold;
}

.fpassword {
  font-size: smaller;
  color: black;
}

.img-logo {
  margin-top: 20px;
  width: 100%;
  max-width: 300px;
  padding: 0 20px;
  margin-bottom: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
}


/* Tablets y pantallas medianas */
@media (max-width: 768px) {
  .login-card {
    padding: 20px;
    border-radius: 14px;
    margin-top: 16px;
  }

  .form-control {
    font-size: 15px;
  }

  button {
    height: 2.8rem;
    font-size: 14px;
  }
}

/* Teléfonos muy pequeños */
@media (max-width: 480px) {
  .titulo-login {
    font-size: 1.5rem;
  }

  .login-card {
    padding: 16px;
    border-radius: 12px;
    margin-top: 12px;
  }

  .form-control {
    font-size: 14px;
  }

  button {
    height: 2.6rem;
    font-size: 13px;
  }

  .img-logo {
    width: 90%;
    margin-left: auto;
    margin-right: auto;
  }
}
</style>

