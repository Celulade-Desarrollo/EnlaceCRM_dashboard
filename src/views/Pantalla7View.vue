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
const handlePantalla2Click = () => {
    window.open("/Pantalla2View", "_parent");
};

// Montar el event listener para el envío del formulario
onMounted(() => {
  const Pantalla8Button = document.getElementById('Pantalla8');
  const Pantalla2Button = document.querySelectorAll('.pantalla2');

  if (Pantalla8Button) {
    Pantalla8Button.addEventListener('click', handlePantalla8Click); // Agrega el event listener al botón
  }
  Pantalla2Button.forEach(btn => {
    btn.addEventListener('click', handlePantalla2Click);
  });
});

</script>

<template>
  <section class="logo-container">
    <img src="/public/enlaceFiado.png" alt="logo Enlace CRM" class="logo-main" />
  </section>

  <Heading :mensaje="'Hola, ' + (dataInfoapp && dataInfoapp.length > 0 ? dataInfoapp[0].nombre : 'Usuario')" />

  <h2 class="proveedores">¿Como quieres pagar?</h2>
  <h2 class="valor">${{dataInfoapp[0].pagoMinimo}}</h2>
  <section class="container banners">
    <div class="card banner1">
      <div class="info-banner">
        <p>Desde tu billeteraW</p>
        <div class="d-flex align-items-center">
          <div class="image-section">
            <picture class="logo">
              <img src="/public/billeteraW.png" alt="logo" class="img-fluid" loading="lazy" title="logo" />
            </picture>
          </div>
          <div class="text-section ml-3">
            <div class="button-banner">
              <button type="submit" class="button pantalla2">
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
              <button type="submit" class="button pantalla2">
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
              <button type="submit" class="button pantalla2">
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
              <button type="submit" class="button pantalla2">
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

<style scoped>
.logo-container {
  text-align: center;
  margin-top: 1rem;
}

.logo-main {
  width: 200px;
  height: auto;
  display: inline-block;
}
.card {
  background: #fff;
  border-radius: 15px;
  padding: 1.5rem;
  max-width: 500px;
  width: 100%;
  text-align: center;
  font-size: 17px;
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
  color: white;
  width: 100%;
  letter-spacing: -0.03em;
  padding: 24px;
  display: flex;
  justify-content: center;
}
.valor{
  font-weight: bold;
  color: white;
  width: 100%;
  letter-spacing: -0.03em;
  padding: 24px;
  display: flex;
  justify-content: center;
  margin-top: -22px
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
    width: 100%;
  }
}
</style>
