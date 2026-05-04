<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const goToHome = () => {
  router.push('/LoginView');
};
</script>

<template>
  <header class="header-asesor">
    <div class="header-container">
      
      <div class="section-left">
        <div class="icon-circle" @click="goToHome">
          <img src="/casa.png" alt="Inicio" class="img-icon" />
        </div>
      </div>

      <div class="section-center">
        <h1 class="user-greeting">¡Hola! Bienvenido</h1>
      </div>

      <!-- SECCIÓN DERECHA: BRANDING (Sin logout por pedido) -->
      <div class="section-right">
        <div class="brand-group">
          <!-- Logo de Enlace CRM y Banco W alineados -->
          <img src="/enlaceFiado.png" alt="Enlace CRM" class="logo-enlace" />
          <img src="/bancoW.png" alt="Banco W" class="logo-banco" />
        </div>
      </div>

    </div>
  </header>
</template>

<style scoped>
/* Unificamos el morado y el borde inferior del Proyecto Enlace */
.header-asesor {
  width: 100%;
  background-color: #5e50a1;
  color: white;
  border-bottom: 4px solid #3a2c87;
  position: sticky;
  top: 0;
  z-index: 1000;
  padding: 15px 0; /* Un poco más de aire */
  box-sizing: border-box;
}

.header-container {
  max-width: 1200px; /* Alineado con el max-width de tu dashboard */
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}

/* Botón Home circular tipo Glassmorphism */
.icon-circle {
  cursor: pointer;
  width: 44px;
  height: 44px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.3s ease;
}

.icon-circle:hover {
  background-color: rgba(255, 255, 255, 0.35);
  transform: scale(1.05);
}

.img-icon {
  width: 22px;
  height: 22px;
  filter: brightness(0) invert(1); /* Asegura que el icono sea blanco puro */
}

/* Título central limpio */
.user-greeting {
  margin: 0;
  font-size: 1.4rem;
  font-weight: 700;
  letter-spacing: -0.5px;
}

/* Branding derecho */
.section-right {
  display: flex;
  align-items: center;
}

.brand-group {
  display: flex;
  align-items: center;
  gap: 20px; /* Más espacio entre logos */
}

.logo-enlace { 
  height: 26px; 
  object-fit: contain;
}

.logo-banco { 
  height: 55px; 
  object-fit: contain;
}

/* RESPONSIVE: Ajustes para que en móvil no se amontone */
@media (max-width: 768px) {
  .header-container {
    flex-direction: column;
    gap: 12px;
    padding: 10px;
  }

  .section-center {
    order: -1; /* El saludo arriba en móvil */
  }

  .user-greeting {
    font-size: 1.2rem;
  }

  .logo-banco {
    height: 45px;
  }
}
</style>