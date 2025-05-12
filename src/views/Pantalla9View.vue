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
          <p class="subtitulo mt-4">Ingresa tu correo</p>
          <label for="email" id="label-email">
            <input
              class="form-control text-center"
              aria-required="true"
              aria-invalid="false"
              aria-labelledby="label-email"
              name="email"
              v-model="email"
              type="email"
              placeholder="Correo electrónico"
              autocomplete="off"
              id="email"
              required
              aria-describedby="error-email"
            />
          </label>
        </div>
        <div class="button-container mt-4">
            <button type="submit" class="btn btn-primary">
              Enviar Instrucciones
            </button>
            <button type="submit" class="btn btn-primary">
              Volver a la pagina principal
            </button> 
          </div>
      </form>
    </div>
  </section>
</template>

<style scoped>
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

span {
    color: #dd3590;
}

.login-container {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    width: 90%;
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
}

.myForm {
    text-align: center;
}

.form-group input {
    background-color: transparent;
    border-width: 0 0 1px;
    border-bottom: solid 1px rgba(17, 17, 17, 0.2);
    color: rgb(17, 17, 17);
    padding: 8px 0;
    width: 100%;
    outline: none;
}

button {
    padding-left: 1.25rem;
    padding-right: 1.25rem;
    border-radius: 6.25rem;
    background: #dd3590;
    color: #fff;
    height: 3rem;
    width: 100%;
    margin-top: 20px;
    cursor: pointer;
    border: none;
    align-items: center;
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
