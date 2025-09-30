<script setup>
import { onMounted, onUnmounted } from 'vue';
import { sesionExpirada, activarSesionExpirada } from '../../stores/session.js';

let verificarTokenInterval = null;

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
    const token = localStorage.getItem('token');
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
      <h2>Sesión expirada</h2>
      <p>Por favor, regresa a la tienda y accede microcréditos.</p>
    </div>
  </div>
</template>

<style scoped>
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