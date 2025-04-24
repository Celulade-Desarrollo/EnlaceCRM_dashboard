<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router'; // Importa useRouter para navegar entre vistas
import RouterLink from "../components/UI/Routerlink.vue"; 
import Heading from "../components/UI/Heading.vue";

// Variables reactivas
const celular = ref('');
const data = ref(null);
const error = ref('');

const deudaTotal = ref(0);
const cupoTotal = ref(0);

// Instancia de router
const router = useRouter();

let dataInfoapp = JSON.parse(localStorage.getItem('data'));

deudaTotal.value = parseFloat(dataInfoapp[0].saldorestante.replace(/[$,]/g, ''));
cupoTotal.value = parseFloat(dataInfoapp[0].saldoabonado.replace(/[$,]/g, ''));

const handlePantalla6Click = () => {
    window.open("/Pantalla6View", "_parent");
};

// Función para calcular y ajustar la barra de progreso
const updateProgressBar = () => {
    const total = deudaTotal.value + cupoTotal.value;
    const deudaPercentage = (deudaTotal.value / total) * 100;
    const cupoPercentage = (cupoTotal.value / total) * 100;

    document.getElementById('deuda-bar').style.width = `${deudaPercentage}%`;
    document.getElementById('cupo-bar').style.width = `${cupoPercentage}%`;
};

// Montar el event listener para el envío del formulario
onMounted(() => {
    const Pantalla5Button = document.getElementById('Pantalla6');
    if (Pantalla5Button) {
        Pantalla5Button.addEventListener('click', handlePantalla6Click); // Agrega el event listener al botón
    }
    
    // Actualizar la barra de progreso al montar el componente
    updateProgressBar();
});

// Observar cambios en los valores para actualizar la barra de progreso
watch([deudaTotal, cupoTotal], updateProgressBar);
</script>

<template>
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
                <h2 class="deuda-total mr-5">Deuda total</h2>
                <h2 class="deuda-total">Cupo disponible</h2>            
            </div>
            <div class="info-banner">
                <p class="cantidad-total mb-2" id="deuda-total">{{ dataInfoapp[0].saldorestante }}</p>
                <p class="cupo-total mb-2" id="cupo-total">{{ dataInfoapp[0].saldoabonado }}</p>
            </div>
            <div class="progress">
                <div id="deuda-bar" class="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                <div id="cupo-bar" class="progress-bar bg-success" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
            </div>
            <div class="button-banner"> 
                <button type="submit" class="btn btn-primary mt-2 btn-size" id="Pantalla6">
                    Abonar
                </button>
            </div>
        </div>
        <!-- Línea separadora -->
    <div class="separator"></div>

<!-- Banner 2 -->

<div class="col-md-4 mb-4 banner2">
    <h2 class="proveedores mb-1">Hoy</h2>
    <div class="info-banner">
            <div class="d-flex align-items-center">
            <div class="image-section">
                <picture class="logo">
                    <img src="/public/Alpina.png" alt="logo" class="img-fluid" loading="lazy" title="logo" />
                </picture>
            </div>
            <div class="text-section ml-3">
                <p class="parrafo-marcas">Alpina</p>
                <p class="dinero-pagado">pagaste $58.000</p>
            </div>
        </div>          
    </div>
</div>
<div class="col-md-4 mb-4 banner2">
    <div class="info-banner">
            <div class="d-flex align-items-center">
            <div class="image-section">
                <picture class="logo">
                    <img src="/public/Alpina.png" alt="logo" class="img-fluid" loading="lazy" title="logo" />
                </picture>
            </div>
            <div class="text-section ml-3">
                <p class="parrafo-marcas">Alpina</p>
                <p class="dinero-pagado">pagaste $58.000</p>
            </div>
        </div>          
    </div>
</div>
    <!-- Banner 3 -->

<div class="col-md-4 mb-4 banner2">
    <h2 class="proveedores mb-1">Ayer</h2>
<div class="info-banner">
    <div class="d-flex align-items-center">
    <div class="image-section">
        <picture class="logo">
            <img src="/public/Alpina.png" alt="logo" class="img-fluid" loading="lazy" title="logo" />
        </picture>
    </div>
    <div class="text-section ml-3">
        <p class="parrafo-marcas">Alpina</p>
        <p class="dinero-pagado">pagaste $58.000</p>
    </div>
</div>          
</div>
</div>
    <!-- Banner 4 -->
     
    <div class="col-md-4 mb-4 banner2">
        <h2 class="proveedores mb-1">Ago 10</h2>
<div class="info-banner">
    <div class="d-flex align-items-center">
    <div class="image-section">
        <picture class="logo">
            <img src="/public/Alpina.png" alt="logo" class="img-fluid" loading="lazy" title="logo" />
        </picture>
    </div>
    <div class="text-section ml-3">
        <p class="parrafo-marcas">Alpina</p>
        <p class="dinero-pagado">pagaste $58.000</p>
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
.row{
    margin-top: 0;
    margin-bottom: 0;
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
    border-radius: 6.25rem;
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

.button-banner button {
    background-color: #dd3590;
    color: white;
}

.deuda-total {
    font-weight: bold;
}

.progress{
    margin-top: -40px;
}

.fecha-pago {
    font-weight: bold;
}

.cantidad-total{
    margin-right: 80px;
    margin-top: -40px;
}

.cupo-total{
    margin-top: -40px;
}

.cupo-disponible-dinero {
    font-weight: bold;
}

.separator {
    width: 100%;
    background-color: #b3b0b0;
    height: 1px;
    margin: 0 auto;
    z-index: 1;
}

.parrafo-marcas{
    margin-left: -20px;
    font-weight: bold;
    text-align: center;
}

.img-fluid{
    height: 30%;
    width: 30%;
}
.text-section {
    flex-grow: 1;
    margin-left: 20px;
}

.proveedores{
    font-weight: bold;
    color: black;
    width: 100%;
    letter-spacing: -0.03em;
    line-height: 1.2;
    background-color: #fff;
    padding: 24px;
    display: flex;
    align-items: center;
    margin-bottom: -80px;
}
.dinero-pagado{
    font-size: small;
}
.progress {
    margin-top: -40px;
    height: 25px;
}

.progress-bar {
    transition: width 0.5s ease;
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
        align-items: flex-start;
    }

    .text-section {
        margin-left: 0;
        margin-top: 10px;
    }
}


</style>
