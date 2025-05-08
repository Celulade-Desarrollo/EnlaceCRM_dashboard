<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import RouterLink from "../components/UI/Routerlink.vue";
import Heading from "../components/UI/Heading.vue";

// Datos de email y contraseña
const email = ref('');
const password = ref('');

// Función para obtener datos
const fetchData = async () => {
    const response = await axios.get(`https://enlacecrm.com/api/get_data.php?tipo=login&&usuario=${email.value}&&pass=${password.value}`);
    if (response.data === "NO") {
        alert("Usuario y clave incorrectos");
        return;
    } else {
        let data = response.data;
        data = JSON.stringify(data);
        console.log(data);
        localStorage.setItem('data', data);

        let respuesta = JSON.parse(localStorage.getItem('data'));
        window.open("/Pantalla1View", "_parent");
    }
};

// Redirigir a la pantalla de recuperación de contraseña
const goToPantalla9 = () => {
    window.open("/Pantalla9View", "_parent");
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
   <img src="/public/enlaceFiado.png" alt="" class="img-logo">
   <h4 class="titulo-login">¿Olvidaste tu contraseña?</h4>
  <section class="login-container">
    <div class="login-card">
      <form id="myForm" class="myForm">
        <div class="form-group">
          <p class="subtitulo mt-4">Ingresa tu correo electrónico registrado y te enviaremos instrucciones para restablecer tu contraseña.</p>
          
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
              id="email"
              required
              aria-describedby="error-email"
            />
             <span class="floating-label">Ingresa tu correo</span>
          </label>
        </div>
        <div class="button-container mt-4">
            <button type="submit" class="button mt-4">
              Enviar Instrucciones
            </button>
            <button type="submit" class="button mt-4">
              Volver a la pagina principal
            </button> 
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
