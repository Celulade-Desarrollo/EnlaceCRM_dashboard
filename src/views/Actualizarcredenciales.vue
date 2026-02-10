<script setup>
import { ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

const router = useRouter();

// Campos
const password = ref("");
const confirmPassword = ref("");

// Mensajes
const errorMessage = ref("");
const successMessage = ref("");

// Enviar formulario
const handleSubmit = async () => {
  // Validaciones
  if (!password.value || !confirmPassword.value) {
    errorMessage.value = "Todos los campos son obligatorios";
    limpiar();
    return;
  }

  if (password.value !== confirmPassword.value) {
    errorMessage.value = "Las contraseñas no coinciden";
    limpiar();
    return;
  }

  // Sesión
  const token = localStorage.getItem("admin_token");
  let adminId = localStorage.getItem("admin_id");

  // Fallback: obtener ID desde userData
  if (!adminId || adminId === "undefined") {
    try {
      const userData = JSON.parse(
        localStorage.getItem("admin_userData") || "{}"
      );
      adminId = userData.id ?? userData.Id;
    } catch (_) {}
  }

  // 🔹 Log mínimo importante
  console.log("🆔 Admin ID usado para cambio de contraseña:", adminId);

  if (!token || !adminId) {
    errorMessage.value = "Sesión inválida. Inicia sesión de nuevo.";
    limpiar();
    return;
  }

  try {
    await axios.put(
      "/api/admin/updateContrasena",
      {
        id: Number(adminId),
        nuevaContrasena: password.value.trim(),
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    successMessage.value = "Contraseña actualizada correctamente";

    setTimeout(() => {
      localStorage.clear();
      router.push("/LoginView");
    }, 2000);

  } catch (error) {
    errorMessage.value =
      error.response?.data?.error || "Error al actualizar la contraseña";
    limpiar();
  }
};

// Limpiar mensajes
const limpiar = () => {
  setTimeout(() => {
    errorMessage.value = "";
    successMessage.value = "";
  }, 3000);
};
</script>

<template>
  <motion.div v-bind="fadeInUp">
    <section class="logo-container">
      <picture class="logo">
        <img src="/public/enlaceFiado.png" alt="logo" class="img-fluid" />
      </picture>
    </section>

    <h3 class="titulo-login">Cambiar contraseña</h3>

    <section class="login-container">
      <div class="login-card">
        <form class="myForm" @submit.prevent="handleSubmit">

          <div class="form-group">
            <label class="input-label">
              <input
                class="form-control"
                v-model="password"
                type="password"
              />
              <span class="floating-label">Nueva contraseña</span>
            </label>
          </div>

          <div class="form-group">
            <label class="input-label">
              <input
                class="form-control"
                v-model="confirmPassword"
                type="password"
              />
              <span class="floating-label">Confirmar contraseña</span>
            </label>
          </div>

          <button type="submit" class="button">
            Actualizar contraseña
          </button>

          <p v-if="errorMessage" class="text-danger mt-2">
            {{ errorMessage }}
          </p>

          <p v-if="successMessage" class="text-success mt-2">
            {{ successMessage }}
          </p>

        </form>
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
/* TODO TU CSS SE QUEDA IGUAL */

.form-control[readonly] {
  opacity: 0.75;
  cursor: not-allowed;
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