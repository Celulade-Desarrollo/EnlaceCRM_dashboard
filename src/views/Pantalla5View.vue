<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import RouterLink from "../components/UI/Routerlink.vue"; 
import Heading from "../components/UI/Heading.vue";

const celular = ref('');
const data = ref(null);
const error = ref('');

const deudaTotal = ref(50000);
const cupoTotal = ref(100000);

const router = useRouter();

let dataInfoapp = JSON.parse(localStorage.getItem('data'));

const handlePantalla6Click = () => {
    window.open("/Pantalla6View", "_parent");
};

const updateProgressBar = () => {
    const total = deudaTotal.value + cupoTotal.value;
    const deudaPercentage = (deudaTotal.value / total) * 100;
    const cupoPercentage = (cupoTotal.value / total) * 100;

    document.getElementById('deuda-bar').style.width = `${deudaPercentage}%`;
    document.getElementById('cupo-bar').style.width = `${cupoPercentage}%`;
};

onMounted(() => {
    const Pantalla5Button = document.getElementById('Pantalla6');
    if (Pantalla5Button) {
        Pantalla5Button.addEventListener('click', handlePantalla6Click);
    }

    updateProgressBar();
});

watch([deudaTotal, cupoTotal], updateProgressBar);
</script>

<template>
    <Heading :mensaje="'Hola, ' + dataInfoapp[0].nombre" />

    <section class="container-fluid banners">
        <div class="row justify-content-center">
            <!-- Banner 1 -->
            <div class="col-12 col-md-10 col-lg-8 banner1 mb-4">
                <div class="info-banner">
                    <div class="d-flex justify-content-between flex-wrap">
                        <div class="d-flex flex-column">
                            <h2 class="deuda-total">Deuda total</h2>
                            <p class="cantidad-total mb-2" id="deuda-total">${{ deudaTotal }}</p>
                        </div>
                        <div class="d-flex flex-column">
                            <h2 class="cupo-total">Cupo disponible</h2>
                            <p class="cantidad-total mb-2" id="cupo-total">${{ cupoTotal }}</p>
                        </div>
                    </div>
                </div>
                <div class="progress">
                    <div id="deuda-bar" class="progress-bar deuda-bar" role="progressbar"></div>
                    <div id="cupo-bar" class="progress-bar cupo-bar" role="progressbar"></div>
                </div>
            </div>

            <!-- Botón Abonar -->
            <div class="col-12 col-md-4 mb-4">
                <div class="button-banner">
                    <button type="button" class="button" id="Pantalla6">
                        Abonar
                    </button>
                </div>
            </div>

            <!-- Banner 2: Hoy -->
            <div class="col-12 col-md-4 mb-4 banner2">
                <h2 class="proveedores mb-1">Hoy</h2>
                <div class="info-banner">
                    <div class="d-flex align-items-center">
                        <div class="image-section">
                            <picture class="logo">
                                <img src="/public/Alpina.png" alt="logo" class="img-fluid" loading="lazy" title="logo" />
                            </picture>
                        </div>
                        <div class="text-section pago-boton">
                            <p class="parrafo-marcas">Alpina</p>
                            <p class="dinero-pagado">pagaste $58.000</p>
                        </div>
                    </div>
                    <div class="d-flex align-items-center mt-4">
                        <div class="image-section">
                            <picture class="logo">
                                <img src="/public/Alpina.png" alt="logo" class="img-fluid" loading="lazy" title="logo" />
                            </picture>
                        </div>
                        <div class="text-section pago-boton">
                            <p class="parrafo-marcas">Alpina</p>
                            <p class="dinero-pagado">pagaste $58.000</p>
                        </div>
                    </div>              
                </div>
            </div>

            <!-- Banner 3: Ayer -->
            <div class="col-12 col-md-4 mb-4 banner2">
                <h2 class="proveedores mb-1">Ayer</h2>
                <div class="info-banner">
                    <div class="d-flex align-items-center">
                        <div class="image-section">
                            <picture class="logo">
                                <img src="/public/Alpina.png" alt="logo" class="img-fluid" loading="lazy" title="logo" />
                            </picture>
                        </div>
                        <div class="text-section pago-boton">
                            <p class="parrafo-marcas">Alpina</p>
                            <p class="dinero-pagado">pagaste $58.000</p>
                        </div>
                    </div>          
                </div>
            </div>

            <!-- Banner 4: Ago 10 -->
            <div class="col-12 col-md-4 mb-4 banner2">
                <h2 class="proveedores mb-1">Ago 10</h2>
                <div class="info-banner">
                    <div class="d-flex align-items-center">
                        <div class="image-section">
                            <picture class="logo">
                                <img src="/public/Alpina.png" alt="logo" class="img-fluid" loading="lazy" title="logo" />
                            </picture>
                        </div>
                        <div class="text-section pago-boton">
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
    background-color: #2e008b;
}

.row {
    margin-top: 0;
    margin-bottom: 0;
}

.banner1,
.banner2 {
    margin-bottom: 20px;
    background-color: #ffffff;
}

.parrafo-marcas {
    margin-left: -20px;
    font-weight: bold;
    text-align: center;
}

.img-fluid {
    height: 50%;
    width: 50%;
}

.text-section {
    flex-grow: 55px;
    margin-left: 40px;
}

.proveedores {
    font-weight: bold;
    color: rgb(255, 255, 255);
    width: 20%;
    letter-spacing: -0.03em;
    line-height: 1.2;
    background-color: #2e008b;
    padding: 10px;
    display: flex;
    align-items: center;
    border: solid #dd3590;
    display: block;
    margin: 20px 0 0 0;
    text-align: center;
}

.dinero-pagado {
    font-size: small;
    text-align: right;  /* Siempre alineado a la derecha */
}

.progress {
    margin-top: 10px;
    height: 25px;
    background-color: #ddd;
}

.progress-bar {
    transition: width 0.5s ease;
    height: 100%;
    display: inline-block;
}

.button-banner {
    display: flex;
    justify-content: center;
    align-items: center;
}

.button {
    background-color: #dd3590;
    color: white;
    border: none;
    padding: 14px 32px;
    border-radius: 25px;
    font-weight: bold;
    margin-top: 1rem;
    cursor: pointer;
    width: 400px;
    max-width: 100%;
    text-align: center;
    font-size: 1.1rem;
    transition: background-color 0.3s ease;
}

.button:hover {
    background-color: #c02680 !important;
}

.deuda-bar {
    background-color: #007bff;
    width: 0%;
}

.cupo-bar {
    background-color: #0aba33;
    width: 0%;
}

.pago-boton {
    border: 2px solid #dd3590;
    border-radius: 10px;
    padding: 12px;
    text-align: center;
    background-color: #f9f9f9;
    cursor: default;
    transition: none;
}

@media (max-width: 767px) {
    .banner1,
    .banner2 {
        margin-bottom: 15px;
        margin-top: 30px;
        border-radius: 10px;
        border: 2px solid #dd3590;
        padding: 0% 35px;
        height: 100%;
    }

    .img-fluid {
        margin-top: -90px;
    }

    .text-section {
        margin-left: 10px;
        margin-top: 10px;
        background-color: #2e008b;
        color: #ffffff;
        padding: 15px 70px;
        border-radius: 0px;
    }
}
</style>
