<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router'; // Importa useRouter para navegar entre vistas
import RouterLink from "../components/UI/Routerlink.vue"; 
import Heading from "../components/UI/Heading.vue";

// Variables reactivas
const celular = ref('');
const data = ref(null);
const error = ref('');

// Instancia de router
const router = useRouter();

let dataInfoapp = JSON.parse(localStorage.getItem('data'));


// Función para manejar el clic en el botón "Pantalla2"
const handlePantalla8Click = () => {
    window.open("/Pantalla8View", "_parent");
};

// Montar el event listener para el envío del formulario
onMounted(() => {
  const Pantalla8Button = document.getElementById('Pantalla8');
  if (Pantalla8Button) {
    Pantalla8Button.addEventListener('click', handlePantalla8Click); // Agrega el event listener al botón
  }

});

</script>

<template>
  <section class="logo-container">
    <img src="/public/enlaceFiado.png" alt="logo Enlace CRM" class="logo-main" />
  </section>

  <Heading :mensaje="'Hola, ' + (dataInfoapp && dataInfoapp.length > 0 ? dataInfoapp[0].nombre : 'Usuario')" />

  <section class="container banners">
    <div class="card banner1">
      <div class="header-container">
        <h2 class="proveedores">¿Como quieres pagar?<br>${{dataInfoapp[0].pagoMinimo}}</h2>
        <div class="info-banner">
          <p class="mt-5">Desde tu billeteraW</p>
          <div class="d-flex align-items-center">
            <div class="image-section">
              <picture class="logo">
                <img src="/public/billeteraW.png" alt="logo" class="img-fluid" loading="lazy" title="logo" />
              </picture>
            </div>
          </div>
          <div class="text-section ml-3">
            <div class="button-banner">
              <button type="submit" class="button" id="Pantalla2">
                Pagar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="card banner2">
      <div class="info-banner">
        <p>Desde PSE</p>
        <div class="d-flex align-items-center">
          <div class="image-section">
            <picture class="logo">
              <img src="/public/PSELOGO.png" alt="logo" class="img-fluid" loading="lazy" title="logo" />
            </picture>
          </div>
          <div class="text-section ml-3">
            <div class="button-banner">
              <button type="submit" class="button" id="Pantalla2">
                Pagar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="card banner3">
      <div class="info-banner">
        <p>Desde tu cuenta nequi</p>
        <div class="d-flex align-items-center">
          <div class="image-section">
            <picture class="logo">
              <img src="/public/Nequi.png" alt="logo" class="img-fluid" loading="lazy" title="logo" />
            </picture>
          </div>
          <div class="text-section ml-3">
            <div class="button-banner">
              <button type="submit" class="button" id="Pantalla2">
                Pagar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="card banner4">
      <div class="info-banner">
        <p>Desde tu cuenta daviplata</p>
        <div class="d-flex align-items-center">
          <div class="image-section">
            <picture class="logo">
              <img src="/public/Daviplata.png" alt="logo" class="img-fluid" loading="lazy" title="logo" />
            </picture>
          </div>
          <div class="text-section ml-3">
            <div class="button-banner">
              <button type="submit" class="button" id="Pantalla2">
                Pagar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="card banner5">
      <div class="info-banner">
        <p>Paga en efectivo</p>
        <div class="d-flex align-items-center">
          <p>Abona a tu dueda a tu medida</p>
          <div class="text-section ml-3">
            <div class="button-banner">
              <button type="submit" class="button" id="Pantalla8">
                Pagar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style>
body {
  font-family: 'Verdana', sans-serif;
  background-color: #2e008b; /* Fondo morado */
  margin: 0;
  padding: 0;
}

.formkit-wrapper {
  align-items: center;
  width: 100%;
}

.formkit-input {
  text-align: center;
}

.formkit-help {
  margin-left: 50px;
}
.button {
  font-weight: bold;
  margin-top: 1rem;
  cursor: pointer;
  width: 200px;
  margin-left: auto;
  display: block;
  text-align: center;
}
.form-group input {
  background-color: transparent;
  border-width: 0 0 1px;
  border-bottom: solid 1px rgba(17, 17, 17, 0.2);
  color: rgb(17, 17, 17);
  padding: 8px 0;
  width: 100%;
  outline: none;
}

.logo .img-fluid {
  margin-top: 20px;
  margin-bottom: 30px;
  max-width: 300px;
  height: 60%;
  width: 60%;
}

.container button svg {
  margin-left: 8px;
}

.parrafo {
  margin: 20px 0;
  font-size: medium;
}

.info-banner {
  width: 100%;
  letter-spacing: -0.03em;
  line-height: 1.2;
  background-color: #fff;
  color: black;
  padding: 24px;
  display: flex;
  align-items: center;
}

.info-banner3 {
  width: 100%;
  letter-spacing: -0.03em;
  line-height: 1.2;
  background-color: #fff;
  color: black;
  padding: 24px;
  display: flex;
  align-items: center;
}

.titulo-1 {
  font-weight: bold;
}

.titulo {
  margin: 0 0 16px;
  color: inherit;
  font-weight: bold;
  letter-spacing: -0.03em;
  font-size: 1.875rem;
  line-height: 1.2;
}

.subtitulo {
  color: black;
}

.deuda-total {
  font-weight: bold;
}

.fecha-pago {
  font-weight: bold;
}

.cupo-disponible-dinero {
  font-weight: bold;
}

.separator {
  width: 100%;
  background-color: #b3b0b0;
  height: 1px;
  margin: 0 auto;
}

.parrafo-marcas {
  font-weight: bold;
  text-align: center;
}

.img-fluid {
  height: 80%;
  width: 80%;
}

.text-section {
  flex-grow: 1;
  margin-left: 20px;
}

.proveedores {
  font-weight: bold;
  color: black;
  width: 100%;
  letter-spacing: -0.03em;
  line-height: 1.2;
  background-color: #fff;
  padding: 24px;
  display: flex;
  align-items: center;
  margin-bottom: -40px;
}

.banners {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.banners .card {
  width: 100%;
  margin-bottom: 20px;
}

@media (max-width: 767px) {
  .img-fluid {
    margin-top: -90px;
  }

  .tarjeta {
    background-color: #fff;
    padding: 24px;
    border-radius: 16px;
    width: 100%;
  }

  .info-banner {
    flex-direction: column;
    align-items: flex-start;
  }

  .text-section {
    margin-left: 0;
    margin-top: 10px;
  }

  .banners .card {
    width: 100%; /* Se asegura que sigan ocupando el ancho completo en responsive */
  }
}
</style>