<script setup>
import { ref, reactive } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
const router = useRouter();

// Referencias para los campos del formulario
const telefono = ref("");
const password = ref("");
const errorMessage = ref("");
const telefonoRegex = /^[0-9]{10}$/;

// Función para obtener datos
const fetchData = async () => {
  try {
    const response = await axios.get(
      `https://enlacecrm.com/api/get_data.php?tipo=login&&usuario=${telefono.value}&&pass=${password.value}`
    );
    if (response.data == "NO") {
      errorMessage.value = "Usuario y clave incorrecto";
      setTimeout(() => {
        errorMessage.value = "";
      }, 3000);
      return;
    } else {
      let data = response.data;
      data = JSON.stringify(data);
      console.log(data);
      localStorage.setItem("data", data);

      let respuesta = JSON.parse(localStorage.getItem("data"));
      localStorage.setItem("isAuthenticated", "true");
      router.push("/Pantalla1View");
    }
  } catch (error) {
    alerta.mensaje = "Error al conectarse al servidor";
    alerta.tipo = "error";
    setTimeout(() => {
      alerta.mensaje = "";
      alerta.tipo = "";
    }, 3000);
  }
};

const goToPantalla9 = () => {
  window.open("/Pantalla9View", "_parent");
};

const soloNumeros = (e) => {
  telefono.value = e.target.value.replace(/\D/g, ""); // Reemplaza todo lo que no sea dígito
};

const handleSubmit = async (event) => {
  event.preventDefault(); // Evita el envío del formulario por defecto
  await fetchData(); // Llama a la función fetchData para obtener datos
};

const validar = async () => {
  if (!telefono.value || !password.value) {
    errorMessage.value = "Todos los campos son obligatorios";
    setTimeout(() => {
      alerta.mensaje = "";
      alerta.tipo = "";
    }, 3000);
  } else if (!telefonoRegex.test(telefono.value)) {
    errorMessage.value = "Ingrese un número de teléfono válido";
    setTimeout(() => {
      errorMessage.value = "";
    }, 3000);
  } else if (!password.value) {
    errorMessage.value = "La contraseña no puede estar vacía";
    setTimeout(() => {
      errorMessage.value = "";
    }, 3000);
  } else {
    errorMessage.value = "";
    await fetchData();
    return;
  }
};
</script>

<template>
  <section class="logo-container">
    <picture class="logo">
      <img
        src="/public/enlaceFiado.png"
        alt="logo"
        class="img-fluid"
        loading="lazy"
        title="logo"
      />
    </picture>
  </section>

  <!-- Contenido de login centrado -->
  <h3 class="titulo-login">Ingresa a tu cuenta</h3>
  <section class="login-container">
    <div class="login-card">
      <form id="myForm" class="myForm" @submit.prevent="validar">
        <div class="form-group">
          <label
            for="telefono"
            class="input-label flex text-center justify-center items-center"
          >
            <input
              class="form-control"
              v-model="telefono"
              type="tel"
              placeholder="Número Telefónico"
              @input="soloNumeros"
              maxlength="10"
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
              placeholder="Contraseña"
            />
            <span class="floating-label">Ingresa contraseña</span>
          </label>
        </div>
        <button type="submit" class="button mt-4" @click="handleSubmit">
          Ingresar
        </button>
        <p v-if="errorMessage.value" class="text-danger mt-2">
          {{ errorMessage.value }}
        </p>
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
