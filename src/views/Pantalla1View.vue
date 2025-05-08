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

let dataInfoapp = $.parseJSON(localStorage.getItem('data'))

// Función para manejar el clic en el botón "Pantalla2"
const handlePantalla2Click = () => {
    window.open("/Pantalla2View", "_parent");
};
const handlePantalla5Click = () => {
    window.open("/Pantalla5View", "_parent");
};

// Montar el event listener para el envío del formulario
onMounted(() => {
  const Pantalla5Button = document.getElementById('Pantalla5');
  if (Pantalla5Button) {
    Pantalla5Button.addEventListener('click', handlePantalla5Click); // Agrega el event listener al botón
  }
  const Pantalla2Button = document.getElementById('Pantalla2');
  if (Pantalla2Button) {
    Pantalla2Button.addEventListener('click', handlePantalla2Click); // Agrega el event listener al botón
  }
});

</script>

<template>
      <section class="logo-container">
    <picture class="logo">
      <img src="/public/Enlace-Logo_Azul.jpg" alt="logo" class="img-fluid" loading="lazy" title="logo" />
    </picture>
  </section>

   <header class="header">
    <div class="header-icons">
      <!-- Ícono de ayuda a la izquierda -->
      <span class="icon-left">
        <i class="fas fa-user"></i>
      </span>
      
      <!-- Ícono de usuario a la derecha -->
      <span class="icon-right">
        <i class="fas fa-question-circle"></i>
      </span>
    </div>
    
    <!-- Mensaje de saludo -->
    <div class="header-text">
      <p>Hola, {{dataInfoapp[0].nombre}}</p>
    </div>
  </header>

  <section class="container banners">
    <div class="row">
      <!-- Banner 1 -->
      <div class="col-md-4 banner1">
        <div class="info-banner">
          <h2>Deuda total</h2>
          <p class="deuda-total mb-2" id="deuda-total">{{dataInfoapp[0].saldorestante}}</p>
          <p class="fecha-pago mb-2" id="fecha-pago">Fecha siguiente abono:  </p>
          <p class="cupo-disponible mb-2" id="cupo-disponible">Cupo disponible: <span class="cupo-disponible-dinero">{{dataInfoapp[0].saldoabonado}}</span></p>
          <div class="button-banner">
            <button type="submit" class="btn btn-primary mt-2 btn-size" id="Pantalla5">
              Ver más
            </button>
          </div>
        </div>
      </div>
      
      <!-- Línea separadora -->
      <div class="separator"></div>
      
      <!-- Banner 2  v-for = "(item,index) in dataInfoapp"-->
      <div class="col-md-4 mb-4 banner2" >
        <div class="info-banner">
            <h2 class="proveedores">Proveedores disponibles para recibir pago.</h2>
            <div class="d-flex align-items-center" >
            <div class="image-section">
                <picture class="logo">
                    <img src="/public/Alpina.png" alt="logo" class="img-fluid" loading="lazy" title="logo" />
                </picture>
            </div>
            <div class="text-section ml-3">
                <p class="parrafo-marcas">Alpina</p>
                <div class="button-banner">
                    <button type="submit" class="btn btn-primary mt-2 btn-size" id="Pantalla2">
                        Pagar
                    </button>
                    </div>
                </div>
            </div>          
        </div>
      </div>
    </div>
  </section>
</template>

<style>
body {
    font-family: Verdana, Geneva, Tahoma, sans-serif;
    background-color: white;
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

.form-group input {
    background-color: transparent;
    border-width: 0 0 1px;
    border-bottom: solid 1px rgba(17, 17, 17, 0.2);
    color: rgb(17, 17, 17);
    padding: 8px 0;
    width: 100%;
    outline: none;
}

.container button {
    padding: 0.5rem 1rem;
    border-radius: 5.25rem;
    background: #dd3590;
    color: #fff;
    display: flex;
    margin-bottom: 1rem;
    cursor: pointer;
    border: none;
    align-items: center;
    position: relative;
    font-size: 1rem;
    justify-content: center;
    width: auto;
}
.logo-container {
    width: 300px;
    height: auto;
    float: left;
    margin: 10px;
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
    margin-top: -80px; 
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
.button-banner-alpina button {
    background-color: #dd3590;
    color: white;
    margin-left: 50px;
}
.button-banner button {
    background-color: #dd3590;
    color: white;
    width: 300%;
    height: auto;
    margin: 5px;
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
    background-color: #b0b0b3;
    height: 1px;
    margin: 0 auto;
}

.parrafo-marcas-alpina{
    font-weight: bold;
    text-align: center;
    margin-left: 50px;
}

.parrafo-marcas{
    font-weight: bold;
    text-align: center;
}

.img-fluid{
    height: 40%;
    width: 40%;
}

.text-section {
    flex-grow: 1;
    margin-left: 20px;
}

.proveedores{
    font-weight: bold;
    background-color: #251886;;
    border: 2px solid #ccc;
    padding: 10px 20px;
    border-radius: 10px;
    display: inline-block;
    color: #fff;
    width: 100%;
    margin: 0%;
    text-align: center;

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
        padding: 10px;
        border-radius: 15px;
        margin: 14px;
        border: 2px solid #251886;
    }

    .header{
        width: 100%;
        height: 120px;
        padding: 10px 20px;
        background-color: #251886;
        display: flex;
        flex-direction: column;
        align-items: start;
        box-shadow: none;
        border-radius: 15px;
    }

    .header-icons {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}
.contenedor-targetas{
    display: flex;
    flex-wrap: 0;
    padding: 0;
    margin: 0;
    gap: 16px;
}
.targeta{
    flex: 1 1 100%;
    padding: 15px;
    border: 1px solid #ccc;
    border-radius: 10px;
}
    .text-section {
        margin-left: 0;
        margin-top: 10px;
    }
}
</style>
