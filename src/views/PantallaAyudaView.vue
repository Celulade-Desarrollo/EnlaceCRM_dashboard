<template>
  <div class="ayuda-wrapper">
    <h1 class="titulo">¿Cómo podemos ayudarte?</h1>

    <p class="subtitulo">Preguntas frecuentes sobre:</p>

    <div class="cards-container">
      <div class="faq-card" @click="goToTransacciones">
        <div>
          <h2>Transacciones</h2>
          <p>¿Qué puedo pagar?</p>
        </div>
        <i class="fas fa-chevron-right flecha"></i>
      </div>

      <div class="faq-card" @click="goToProductos">
        <div>
          <h2>Manejo de los productos</h2>
          <p>Tasa, plazo</p>
        </div>
        <i class="fas fa-chevron-right flecha"></i>
      </div>
    </div>

    <a
      class="whatsapp-btn"
      :href="whatsappLink"
      target="_blank"
      rel="noopener noreferrer"
    >
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
        alt="WhatsApp"
        class="whatsapp-logo"
      />
      Comunícate con nosotros
    </a>
  </div>
</template>

<script setup>
const whatsappLink = "https://wa.me/573001234567"; // Cambia al número de WhatsApp real

function goToTransacciones() {
  alert("Aquí podrías mostrar detalles sobre transacciones.");
}

function goToProductos() {
  alert("Aquí podrías mostrar detalles sobre productos.");
}
</script>

<style scoped>
.ayuda-wrapper {
  max-width: 480px;
  margin: auto;
  padding: 2rem 1rem;
  font-family: 'Segoe UI', sans-serif;
  background-color: #f0f4f8;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.titulo {
  font-size: 1.6rem;
  font-weight: bold;
  color: #0047ab;
  margin-bottom: 1rem;
  text-align: center;
}

.subtitulo {
  font-size: 1rem;
  color: #555;
  margin-bottom: 1rem;
  text-align: center;
}

.cards-container {
  width: 100%;
}

.faq-card {
  background-color: white;
  border-radius: 14px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  padding: 1rem;
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.faq-card:hover {
  transform: scale(1.02);
}

.faq-card h2 {
  font-size: 1.1rem;
  margin: 0;
  color: #00398d;
}

.faq-card p {
  margin: 0.3rem 0 0;
  color: #666;
  font-size: 0.9rem;
}

.flecha {
  font-size: 1rem;
  color: #999;
}

.whatsapp-btn {
  margin-top: auto;
  background-color: #25d366;
  color: white;
  text-decoration: none;
  font-weight: bold;
  font-size: 1rem;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
  transition: background-color 0.3s ease;
}

.whatsapp-btn:hover {
  background-color: #1ebe5b;
}

.whatsapp-logo {
  width: 24px;
  height: 24px;
  margin-right: 0.75rem;
}
</style>
