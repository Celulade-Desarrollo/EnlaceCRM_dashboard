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
    <section class="logo-container">
        <img src="/public/enlaceFiado.png" alt="logo Enlace CRM" class="logo-main" />
    </section>
    <Heading :mensaje="'Hola, ' + dataInfoapp[0].nombre" />

    <section class="container banners py-4">
        <div class="d-flex flex-column align-items-center">
            <!-- Banner 1 -->
            <div class="banner1 mb-4">
                <div class="info-banner">
                    <div class="d-flex justify-content-between w-100">
                        <div class="text-start">
                            <h2 class="deuda-total">Deuda total</h2>
                            <p class="cantidad-total mb-2" id="deuda-total">${{ deudaTotal }}</p>
                        </div>
                        <div class="text-end">
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
            <div class="button-banner mb-4">
                <button type="button" class="button" id="Pantalla6">
                    Abonar
                </button>
            </div>

            <!-- Banner 2: Hoy -->
            <div class="banner2 mb-4">
                <h2 class="proveedores mb-1">Hoy</h2>
                <div class="info-banner">
                    <div class="card-pago">
                        <div class="pago-item">
                            <picture class="logo">
                                <img src="/public/Alpina.png" alt="logo" class="img-fluid" loading="lazy" title="logo" />
                            </picture>
                            <div class="text-section pago-boton">
                                <p class="parrafo-marcas"></p>
                                <p class="dinero-pagado">Pagaste $58.000</p>
                            </div>
                        </div>
                    </div>
                    <div class="card-pago">
                        <div class="pago-item">
                            <picture class="logo">
                                <img src="/public/Alpina.png" alt="logo" class="img-fluid" loading="lazy" title="logo" />
                            </picture>
                            <div class="text-section pago-boton">
                                <p class="parrafo-marcas"></p>
                                <p class="dinero-pagado">Pagaste $58.000</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Banner 3: Ayer -->
            <div class="banner2 mb-4">
                <h2 class="proveedores mb-1">Ayer</h2>
                <div class="info-banner">
                    <div class="card-pago">
                        <div class="pago-item">
                            <picture class="logo">
                                <img src="/public/Alpina.png" alt="logo" class="img-fluid" loading="lazy" title="logo" />
                            </picture>
                            <div class="text-section pago-boton">
                                <p class="parrafo-marcas"></p>
                                <p class="dinero-pagado">Pagaste $58.000</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Banner 4: Ago 10 -->
            <div class="banner2 mb-4">
                <h2 class="proveedores mb-1">Ago 10</h2>
                <div class="info-banner">
                    <div class="card-pago">
                        <div class="pago-item">
                            <picture class="logo">
                                <img src="/public/Alpina.png" alt="logo" class="img-fluid" loading="lazy" title="logo" />
                            </picture>
                            <div class="text-section pago-boton">
                                <p class="parrafo-marcas"></p>
                                <p class="dinero-pagado">Pagaste $58.000</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>
.banners {
    background-color: #ffffff;
    min-height: 100vh;
    border-radius: 10px;
}
.logo-container {
  text-align: center;
  margin-top: 1rem;
}

.logo-main {
  width: 200px;
  height: auto;
  display: inline-block;
}

.banner1,
.banner2 {
    background-color: #ffffff;
    border: 2px solid #2b008b;
    border-radius: 15px;
    padding: 20px;
    width: 100%;
    max-width: 400px;
}

.img-fluid {
    height: 60px;
    width: 60px;
    object-fit: contain;
    margin-bottom: 0;
}

.text-section {
    margin-left: 15px;
    flex-grow: 1;
}

.proveedores {
    font-weight: bold;
    color: #fff;
    background-color: #2e008b;
    padding: 10px;
    text-align: center;
    border-radius: 10px;
}

.dinero-pagado {
    font-size: small;
    text-align: center;
}

.progress {
    margin-top: 10px;
    height: 25px;
    background-color: #ddd;
    border-radius: 10px;
    overflow: hidden;
}

.progress-bar {
    transition: width 0.5s ease;
    height: 100%;
}

.button-banner {
    display: flex;
    justify-content: center;
}

.button {
    background-color: #dd3590;
    color: white;
    border: none;
    padding: 14px 32px;
    border-radius: 25px;
    font-weight: bold;
    cursor: pointer;
    width: 100%;
    max-width: 500px;
    text-align: center;
    font-size: 1.1rem;
    transition: background-color 0.3s ease;
}

.button:hover {
  background-color: #f15bab;
}

button:focus {
  outline: none;
  box-shadow: none;
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
    background-color: #ffffff;
    color: #2b008b;
    padding: 10px;
    border-radius: 10px;
    width: 200px;
}

.pago-item {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
}

.logo {
    flex-shrink: 0;
}

.card-pago {
    border: 2px solid #2b008b;
    border-radius: 10px;
    padding: 10px;
    margin-bottom: 10px;
    background-color: #ffffff;
}
</style>
