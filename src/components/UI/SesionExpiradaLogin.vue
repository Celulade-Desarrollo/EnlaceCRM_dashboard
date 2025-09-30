<script setup>
import { onMounted, onUnmounted } from 'vue';
import { sesionExpirada, activarSesionExpirada, cerrarSesion } from '../../stores/session.js';
import { useRouter } from "vue-router";

let verificarTokenInterval = null;
const router = useRouter();

const volverAlLogin = () => { cerrarSesion(); router.push('/loginView'); };

function isTokenExpirado(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  } catch (error) {
    console.error('Error al decodificar token:', error);
    return true;
  }
}

onMounted(() => {
  verificarTokenInterval = setInterval(() => {
    const token = localStorage.getItem('admin_token');
    if (token && isTokenExpirado(token)) {
      activarSesionExpirada();
      clearInterval(verificarTokenInterval);
    }
  }, 5000);
});

onUnmounted(() => {
  
  if (verificarTokenInterval) clearInterval(verificarTokenInterval);
});
</script>

<template>
  <div v-if="sesionExpirada" class="modal-overlay">
    <div class="modal-content">
      <h2>Tu sesión ha expirado</h2>
      <p>inicia sesión nuevamente.</p>
      <button class="botonL" @click="volverAlLogin">Ir a Login</button>
    </div>
  </div>
</template>

<style scoped>
.botonL { 
  margin-top: 1rem;
  padding: 0.75rem 1.5rem; 
  background-color: #2e008b; 
  color: white; 
  border: none; 
  border-radius: 7px;
}
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  text-align: center;
  width: 80%;
  max-width: 400px;
}
</style>