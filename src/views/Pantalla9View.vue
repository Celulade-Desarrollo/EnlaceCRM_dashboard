<script setup>
import { ref, watch } from 'vue';

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

// Validación al enviar formulario
const handleSubmit = (event) => {
  event.preventDefault();

  // Validación si está vacío
  if (email.value.trim() === '') {
    mensajeError.value = "Por favor, ingresa tu correo electrónico";
    return;
  }

  // Validación de formato
  if (!emailRegex.test(email.value)) {
    mensajeError.value = "Formato de correo electrónico inválido";
    return;
  }

  mensajeError.value = ""; // Todo bien, limpiar error
  window.open("/", "_parent");
};
</script>


<template>
  <img src="/public/enlaceFiado.png" alt="" class="img-logo">
  <h4 class="titulo-login">¿Olvidaste tu contraseña?</h4>

  <section class="login-container">
    <div class="login-card">
      <form @submit="handleSubmit" class="myForm">
        <div class="form-group">
          <p class="subtitulo mt-4">
            Ingresa tu correo electrónico registrado y te enviaremos instrucciones para restablecer tu contraseña.
          </p>

          <label for="email" class="input-label">
            <input
              id="email"
              class="form-control"
              name="email"
              v-model="email"
              type="email"
              placeholder=""
              autocomplete="off"
              aria-describedby="error-email"
            />
            <p
              v-if="emailErrorMessage"
              id="error-email"
              class="text-danger mt-1"
            >
              {{ emailErrorMessage }}
            </p>
            <span class="floating-label">Ingresa tu correo</span>
          </label>
        </div>

        <div class="button-container mt-4">
          <button type="submit" class="button mt-4">Enviar Instrucciones</button>

          <button type="button" @click="window.open('/', '_parent')" class="button mt-4">
            Volver a la página principal
          </button>

          <p v-if="mensajeError" class="text-danger mt-1">
            {{ mensajeError }}
          </p>
        </div>
      </form>
    </div>
  </section>
</template>


<style>
body {
    font-family: Verdana, Geneva, Tahoma, sans-serif;
    background-color: #251886;
    margin: 0;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
}
.text-danger {
    color: red;
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
  padding: 16px; /* añade espacio interno en pantallas pequeñas */
}

.form-group button{
  width: 100%;
  margin-top: 10px;
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
  box-sizing: border-box; /* importante para el ancho real */
}

/* Opcional: mejor ajuste en pantallas MUY pequeñas */
@media (max-width: 360px) {
  .login-card {
    padding: 16px;
    border-radius: 12px;
    margin-top: 16px;
  }
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
.img-logo{
  margin-top: 20px;
  width: 80%;
  padding-left: 20px;
  padding-right: 20px;
  margin-bottom: 40px;
  margin-left: 30px;
  align-items: center;
  justify-content: center;
}
</style>
