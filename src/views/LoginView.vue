<script setup>
import { ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

const router = useRouter();

const cedula = ref("");
const password = ref("");
const errorMessage = ref("");
const telefonoRegex = /^[0-9]{10}$/;

const soloNumeros = (e) => {
  cedula.value = e.target.value.replace(/\D/g, "");
};

const handleSubmit = async (event) => {
  event.preventDefault();

  if (!cedula.value || !password.value) {
    errorMessage.value = "Todos los campos son obligatorios";
    setTimeout(() => (errorMessage.value = ""), 3000);
    return;
  }

  const dataLogin = {
    Cedula: cedula.value,
    Password: password.value,
  };

  try {
    const response = await axios.post("/api/admin/login", dataLogin);

    if (response.data?.state !== "Authenticated") {
      errorMessage.value = "Cédula o contraseña incorrecta";
      setTimeout(() => (errorMessage.value = ""), 3000);
      return;
    } 

    // Guardar datos del login administrador con prefijo para evitar conflictos
    localStorage.setItem("admin_token", response.data.token);
    localStorage.setItem("company", response.data.company);
    localStorage.setItem("tipo", response.data.tipo);
    localStorage.setItem("admin_userData", JSON.stringify(response.data));
    localStorage.setItem("admin_isAuthenticated", "true");

    // Redirigir según la compañía
    if (response.data.company === "enlace") {
      router.push("/Pantalla14View");
    } else if (response.data.company === "bancow") {
      router.push("/Pantalla13View");
    } else {
      errorMessage.value = "Empresa no reconocida";
      setTimeout(() => (errorMessage.value = ""), 3000);
    }

  } catch (error) {
    if (error.response) {
      // El backend está respondiendo con error 500 aunque debería ser 401
      if (error.response.status === 500) {
        errorMessage.value = "Cédula o contraseña incorrecta";
      } else if (error.response.status === 401 || error.response.status === 403) {
        errorMessage.value = "Cédula o contraseña incorrecta";
      } else {
        errorMessage.value = `Error del servidor: ${error.response.status}`;
      }
    } else {
      errorMessage.value = "No se pudo conectar al servidor";
    }

    setTimeout(() => (errorMessage.value = ""), 3000);
  }
};


</script>

<template>
  <motion.div v-bind="fadeInUp">
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
        <form id="myForm" class="myForm" @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="telefono" class="input-label">
            <input
              class="form-control"
              v-model="cedula"
              type="tel"
              placeholder=""
              maxlength="10"
              @input="soloNumeros"
            />
            <span class="floating-label">Cédula</span>
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
            <span class="floating-label">Contraseña</span>
          </label>
        </div>
        <button type="submit" class="button mt-4">Ingresar</button>
        <p v-if="errorMessage" class="text-danger mt-2">
          {{ errorMessage }}
        </p>
      </form>
        <!-- <p class="subtitulo mt-4">
          ¿No estás registrado?<br />
          Regístrate
          <a href="https://fiado.enlacecrm.com/"><span>AQUÍ</span></a>
        </p> -->
        <!-- <p class="fpassword mt-4" @click="goToPantalla9">
          ¿Olvidaste tu contraseña?<br />
          Haz click <span>AQUÍ</span>
        </p> -->
      </div>
    </section>
  </motion.div>
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
  left: 50%;
  top: 0;
  transform: translateX(-50%);
  color: black;
  font-size: 16px;
  pointer-events: none;
  transition: 0.3s ease all;
  font-family: sans-serif;
  white-space: nowrap;
  max-width: 90%;
  overflow: hidden;
  text-overflow: ellipsis;
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
@media (max-width: 600px) {
  .login-card {
    width: 90%;
    padding: 16px;
    margin-top: 10px;
    border-radius: 12px;
  }

  .titulo-login {
    font-size: 1.5rem;
  }

  .form-control {
    font-size: 14px;
  }

  .floating-label {
    font-size: 14px;
  }

  button {
    font-size: 14px;
    height: 2.5rem;
  }

  .logo .img-fluid {
    max-width: 200px;
    margin-top: 15px;
    margin-bottom: 15px;
  }
}
</style>
