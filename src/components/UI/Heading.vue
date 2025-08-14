<template>
  <header class="header">
    <div class="izquierda">
      <div class="top-row">
        <BackButton v-if="showBackButton" class="back-button-container" />
        <span class="icon-left icon-circle">
          <i class="fas fa-user"></i>
        </span>
      </div>
      <p class="mensaje">{{ mensaje }}</p>
    </div>
 
    <button class="icon-right icon-circle" @click="irAAyuda">
      <i class="fas fa-question-circle"></i>
    </button>
 
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
    />
  </header>
</template>
 
 
<script setup>
import { useRouter } from 'vue-router';
import BackButton from './BackButton.vue';
 
const router = useRouter();
 
function irAAyuda() {
  router.push('/ayuda'); // Cambia '/ayuda' por la ruta real que tengas
}
 
defineProps({
  mensaje: {
    type: String,
    required: true
  },
  showBackButton: {
    type: Boolean,
    default: false
  }
});
</script>
 
<style scoped>
.header {
  background-color: #021066;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1rem 1.5rem;
  width: 100vw;
}
 
 
.izquierda {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.3rem;
}

.top-row {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.back-button-container {
  margin-right: 0.5rem;
}
 
 
.icon-left {
  font-size: 1.2rem;
  background-color: white;
  color: #2b008b;
  padding: 0.9rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
}


.icon-right {
  font-size: 1.2rem;
  background-color: rgb(238, 237, 237);
  color: #2b008b;
  padding: 0.9rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
}


.mensaje {
  font-size: 1.1rem;
  font-weight: bold;
  margin: 0;
  text-align: left;
  margin-top: 30px;
}

/* Responsive design */
@media (max-width: 768px) {
  .top-row {
    gap: 0.5rem;
  }
  
  .back-button-container {
    margin-right: 0.25rem;
  }
  
  .mensaje {
    font-size: 1rem;
    margin-top: 20px;
  }
}

</style>