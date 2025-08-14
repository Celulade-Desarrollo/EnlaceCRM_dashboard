<script setup>
import { ref } from 'vue';
import Heading from '../components/UI/Heading.vue';

const datosCuentaUser = JSON.parse(localStorage.getItem("datosCuenta")) || {};
const datosCuenta = JSON.parse(localStorage.getItem("datosCuenta")) || {};


const whatsappLink = "https://wa.me/573001234545";
const categoriaSeleccionada = ref(null);


function toggleCategoria(categoria) {
  categoriaSeleccionada.value =
    categoriaSeleccionada.value === categoria ? null : categoria;
}
</script>

<template>
<Heading :mensaje="'Hola, ' + datosCuentaUser.Nombres" :showBackButton="true" />

  <div class="ayuda-wrapper">
    <h1 class="titulo">¿Cómo podemos ayudarte?</h1>

    <p class="subtitulo">Preguntas frecuentes sobre:</p>

    <div class="cards-container">
      <!-- Categoría: Transacciones -->
      <div class="faq-card" @click="toggleCategoria('transacciones')">
        <div>
          <h2>Transacciones</h2>
          <p>¿Qué puedo pagar?</p>
        </div>
        <i class="fas fa-chevron-right flecha"></i>
      </div>

      <div v-if="categoriaSeleccionada === 'transacciones'" class="contenido">
        <div class="respuesta-card">
          <p><strong>¿Cómo realizo mis pagos?</strong></p>
          <p>✅ Puedes pagar de forma digital desde tu cuenta de cualquier banco (incluido Nequi y Daviplata) a través de PSE, o de forma física en oficinas o corresponsales del Banco W (ej. Efecty).</p>
        </div>
        <div class="respuesta-card">
          <p><strong>¿Qué pasa si me atraso en un pago?</strong></p>
          <p>✅ Se bloqueará tu cuenta y se aplicarán intereses moratorios.</p>
        </div>
        <div class="respuesta-card">
          <p><strong>¿Puedo pagar antes del plazo?</strong></p>
          <p>✅ Sí, puedes liquidar el crédito anticipadamente sin penalización. Esto reduce el costo total del préstamo.</p>
        </div>
      </div>

      <!-- Categoría: Productos -->
      <div class="faq-card" @click="toggleCategoria('productos')">
        <div>
          <h2>Manejo de los productos</h2>
          <p>Tasa, plazo</p>
        </div>
        <i class="fas fa-chevron-right flecha"></i>
      </div>

      <div v-if="categoriaSeleccionada === 'productos'" class="contenido">
        <div class="respuesta-card">
          <p><strong>¿Cuál es el monto mínimo y máximo que puedo utilizar?</strong></p>
          <p>✅ El mínimo es $20.000 y el máximo depende del cupo disponible y el valor de la factura de algún fabricante.</p>
        </div>
        <div class="respuesta-card">
          <p><strong>¿Cuál es el plazo de pago?</strong></p>
          <p>✅ El plazo es de 14 días, lo cual se alinea con el flujo de caja del negocio.</p>
        </div>
        <div class="respuesta-card">
          <p><strong>¿Cuál es la tasa de interés?</strong></p>
          <p>
            ✅ Se aplica la tasa vigente de microcréditos al momento de usar el cupo.
            Puedes consultarla en:
            <a
              href="https://www.bancow.com.co/informacion-consumidor-financiero/tasas-tarifas"
              target="_blank"
              rel="noopener noreferrer"
            >bancow.com.co</a>
          </p>
        </div>
      </div>

      <!-- Categoría: General -->
      <div class="faq-card" @click="toggleCategoria('general')">
        <div>
          <h2>General</h2>
          <p>¿Qué es un microcrédito?</p>
        </div>
        <i class="fas fa-chevron-right flecha"></i>
      </div>

      <div v-if="categoriaSeleccionada === 'general'" class="contenido">
        <div class="respuesta-card">
          <p><strong>¿Qué es un microcrédito?</strong></p>
          <p>✅ Es un préstamo de bajo monto, dirigido principalmente a emprendedores, trabajadores independientes o personas sin acceso a la banca tradicional, que buscan financiar actividades productivas o necesidades personales urgentes.</p>
        </div>
        <div class="respuesta-card">
          <p><strong>¿Para qué puedo usar este microcrédito?</strong></p>
          <p>✅ Puedes usarlo para comprar mercancía a varios fabricantes (inicialmente Alpina), que permita tener completamente abastecido el negocio.</p>
        </div>
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



<style scoped>
.ayuda-wrapper {
  background-color: #ffffff;
  padding: 2rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  min-height: calc(100vh - 80px);
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
  max-width: 480px;
  border-radius: none;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  padding: 1rem;
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: transform 0.2s ease;
  min-height: 120px;
}

.faq-card:hover {
  transform: scale(1.02);
}

.faq-card h2 {
  font-size: 1.1rem;
  margin: 0;
  color: #0047ab;
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

.contenido {
  margin-top: 0.5rem;
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  width: 100%;
  min-height: calc(100vh - 80px);
}

.respuesta-card {
  background-color: #ffffff;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
  text-align: left;
  font-size: 0.95rem;
  color: #333;
}

.respuesta-card p {
  margin: 0.3rem 0;
}

.respuesta-card a {
  color: #0047ab;
  text-decoration: underline;
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
