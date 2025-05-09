<script setup>
    import RouterLink from "../components/UI/Routerlink.vue"; 
    import Heading from "../components/UI/Heading.vue";
    import { onMounted } from 'vue';   

    const handleCheckboxChange = (event) => {
        const checkboxes = document.querySelectorAll('.single-checkbox');
        checkboxes.forEach(checkbox => {
            if (checkbox !== event.target) {
                checkbox.checked = false;
            }
        });
    };

    const handleCheckboxChange1 = (event) => {
        const checkboxes = document.querySelectorAll('.single-checkbox-1');
        checkboxes.forEach(checkbox => {
            if (checkbox !== event.target) {
                checkbox.checked = false;
            }
        });
    };

    onMounted(() => {
        const checkboxes = document.querySelectorAll('.single-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', handleCheckboxChange);
        });

        const checkboxes1 = document.querySelectorAll('.single-checkbox-1');
        checkboxes1.forEach(checkbox => {
            checkbox.addEventListener('change', handleCheckboxChange1);
        });
    });

    const validateCheckboxes = () => {
        const group1Checked = Array.from(document.querySelectorAll('.single-checkbox')).some(checkbox => checkbox.checked);
        const group2Checked = Array.from(document.querySelectorAll('.single-checkbox-1')).some(checkbox => checkbox.checked);

        return group1Checked && group2Checked;
    };

    const handleSubmit = (event) => {
        if (!validateCheckboxes()) {
            event.preventDefault(); // Prevent form submission
            alert('Por favor, selecciona al menos una opción en cada grupo de checkboxes.');
        }
    };
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

    <section class="container py-5 registro">
        <div class="row align-items-center ">
            <div class="col-lg-6 desktop">
                <picture>
                    <img src="/public/pago.png" alt="Pago" class="img-fluid" loading="lazy" title="Pago">
                </picture>
            </div>
            <div class="col-lg-6">
                <div class="mt-4 tarjeta">
                    <form @submit="handleSubmit" action="Pantalla11View">
                        <div class="form-group">
                            <h3 class="titulo mb-4">Antes de terminar</h3>
                            <h6 class="mb-4">Falta poco. Solo necesitamos que respondas un par de preguntas más</h6>
                            <h4 class="sub-titulo">¿Eres una Persona Expuesta Politicamente (PEP) o lo has sido en los ultimos años?</h4>
                            <div class="checklist" aria-required="true">
                                <label class="check-item">
                                    <input type="checkbox" name="pep" value="si" class="single-checkbox">
                                    <span class="checkmark"></span>
                                    Si
                                </label>
                                <label class="check-item mb-4">
                                    <input type="checkbox" name="pep" value="no" class="single-checkbox">
                                    <span class="checkmark"></span>
                                    No
                                </label>
                            </div>
                            <h4 class="sub-titulo">¿Tu pareja, familiar directo o asociado cercano es una Persona Expuesta Politicamente (PEP) o lo has sido en los ultimos años?</h4>
                            <p>Tu familia directa incluye padres, hermanos, abuelos o nietos</p>
                            <div class="checklist" aria-required="true">
                                <label class="check-item">
                                    <input type="checkbox" name="familiar_pep" value="si" class="single-checkbox-1">
                                    <span class="checkmark"></span>
                                    Si
                                </label>
                                <label class="check-item mb-4">
                                    <input type="checkbox" name="familiar_pep" value="no" class="single-checkbox-1">
                                    <span class="checkmark"></span>
                                    No
                                </label>
                            </div>
                        </div>
                        <button type="submit" id="email-on-hero-submit-btn" data-testid="email-on-hero-submit-btn" data-gtm="home-hero-email-cta-btn" class="btn btn-primary">
                            Continuar
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 21 20" class="ml-2" color="currentColor" role="img">
                                <title>Arrow Right</title>
                                <g>
                                    <path d="M18.5 10H2.5M18.5 10L12 16.5M18.5 10L12 3.5" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="round"></path>
                                </g>
                            </svg>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>
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
        border-width: 0px 0px 1px;
        border-top-style: initial;
        border-right-style: initial;
        border-left-style: initial;
        border-top-color: initial;
        border-right-color: initial;
        border-left-color: initial;
        border-image: initial;
        border-radius: 0px;
        box-sizing: border-box;
        color: rgb(17, 17, 17);
        caret-color: currentcolor;
        display: block;
        margin: 0px;
        padding: 8px 0px;
        text-align: left;
        outline: none;
        width: 100%;
        border-bottom-style: solid;
        border-bottom-color: rgba(17, 17, 17, 0.2);
        --inputCurrentColor: #111111;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .container button {
        padding-left: 1.25rem;
        padding-right: 1.25rem;
        border-radius: 6.25rem;
        background: #dd3590;
        color: rgb(255, 255, 255);
        --rippleLayerColor: rgba(255,255,255,0.2);
        height: 3rem;
        display: flex;
        width: 100%;
        -webkit-box-pack: justify;
        justify-content: space-between;
        cursor: pointer;    
        outline: 0px;
        -webkit-box-align: center;
        align-items: center;
        vertical-align: bottom;
        text-align: center;
        overflow: hidden;
        position: relative;
        border: 0px;
        transform: translate3d(0px, 0px, 0px);
    }
    .container {
        background-color: white;
        color: #111111;
    }
    .parrafo {
        font-size: medium;
    }
    .info-banner {
        font-family: Graphik-Medium, Graphik-Regular, "Gotham SSm A", "Gotham SSm B", "Helvetica Neue", Helvetica, Arial, sans-serif;
        margin: 0px 0px 12px;
        font-weight: 500;
        letter-spacing: -0.03em;
        font-size: 1.875rem;
        line-height: 1.2;
    }
    .h5 {
        font-weight: bold;
    }
    p {
        color: gray;
        font-size: 1rem;
        margin-bottom: 15px;
    }
    .checklist {
        max-width: 300px;
        margin-top: 30px;
        margin: 0 auto;
    }
    .sub-titulo {
        font-weight: bold;
        font-size: larger;
        margin-bottom: 15px;
    }
    .check-item {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        font-size: 16px;
        position: relative;
    }
    .check-item input[type="checkbox"] {
        opacity: 0;
        position: absolute;
    }
    .checkmark {
        display: inline-block;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background-color: #e0e0e0;
        margin-right: 10px;
        position: relative;
    }
    .check-item input[type="checkbox"]:checked + .checkmark {
        background-color: #dd3590;
        border: 2px solid #dd3590;
    }
    .check-item input[type="checkbox"]:checked + .checkmark::after {
        display: block;
    }
    @media (max-width: 767px) {
        .desktop {
            display: none;
        }
        .titulo {
            font-weight: bold;
        }
        .tarjeta {
            background-color: rgb(255, 255, 255);
            padding: 24px;
            border-radius: 16px;
            width: 100%;
        }
    }
</style>