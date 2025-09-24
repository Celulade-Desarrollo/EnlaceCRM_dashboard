<script setup>
import { sesionExpirada, cerrarSesion } from '../stores/session.js';
</script>

<template>
  <div v-if="sesionExpirada" class="modal-overlay">
    <div class="modal-content">
      <h2>Sesión expirada</h2>
      <p>Por favor, regresa a la tienda y accede microcreditos.</p>
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
