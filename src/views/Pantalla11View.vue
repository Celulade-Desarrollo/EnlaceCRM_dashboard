<script setup>
    import RouterLink from "../components/UI/Routerlink.vue"; 
    import Heading from "../components/UI/Heading.vue";
    import { FormKit } from "@formkit/vue";   



</script>

<template>   
    <   <header class="header">
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

    <section class="container py-5">
  <div class="row align-items-center ">
    <div class="col-lg-6 desktop">
      <picture>
        <img src="/public/aprobado.png" alt="Pago" class="img-fluid" loading="lazy" title="Pago">
      </picture>
    </div>
    <div class="col-lg-6">
      <div>
        <h2 class="display-4 titulo text-center"> Tu registro ha finalizado <span>exitosamente!</span><br> Gracias por compartirnos tu información</h2>
      </div>
      <picture>
        <img src="/public/celebracion.png" alt="Pago" class="img-fluid mt-auto" loading="lazy" title="Pago">
      </picture>
      <div>
        <h2 class="display-4 titulo text-center"> <span>Tu cupo aprobado es de <br> $1.000.000</span></h2>
      </div>
      <div class="mt-4 tarjeta">
        <form action="">
          <button type="submit" id="email-on-hero-submit-btn" data-testid="email-on-hero-submit-btn" data-gtm="home-hero-email-cta-btn" class="btn btn-primary mt-2 text-center">
            Finalizar Solicitud

          </button>
        </form>
      </div>
    </div>
  </div>
</section>
</template>

<style>
    body {
        font-family:Verdana, Geneva, Tahoma, sans-serif;
        background-color:white;
    }
    
    .formkit-wrapper{
        align-items: center;
        width: 100%;
    }
    .formkit-input{
        text-align: center;
    }
    .formkit-help{
        margin-left: 50px;
    }
    .form-group input{
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
    .container button{
        padding-left: 1.25rem;
        padding-right: 1.25rem;
        border-radius: 6.25rem;
        background: #dd3590;
        color: rgb(255, 255, 255);
        --rippleLayerColor: rgba(255,255,255,0.2);
        height: 3rem;
        display: flex;
        width: 100%;
        margin-bottom: 1rem;
        -webkit-box-pack: justify;
        justify-content: space-between;
        cursor: pointer;    
        outline: 0px;
        -webkit-box-align: center;
        align-items: center;
        vertical-align: middle;
        overflow: hidden;
        position: relative;
        border: 0px;
        transform: translate3d(0px, 0px, 0px);
    }
    span{
        color: #dd3590;
    }
    .parrafo{
        margin-top: 20px;
        margin-bottom: 20px;
        font-size: medium;
    }
    .info-banner{
        margin: 0px 0px 12px;
        font-weight: 500;
        letter-spacing: -0.03em;
        font-size: 1.875rem;
        line-height: 1.2;
        background-color: #dd3590;
        color: white;
        border-radius: 16px;
        padding: 24px;
        width: 100%;
    }
    .titulo-1{
      font-weight: bold;
    }
    .titulo{
    margin: 0px 0px 16px;
    color: inherit;
    font-weight: 500;
    letter-spacing: -0.03em;
    font-size: 1.875rem;
    line-height: 1.2;
    }
    .registro{
      background-color:#251886 ;
      color: white;
    }
    .banners{
      background-color: white;
    }
    .button-banner button{
      background-color: white;
      color: #dd3590;
    }
    @media (max-width: 767px){
        .img-fluid{
          margin-top: -90px;
        }
        .titulo{
            font-weight: bold;
        }
        .tarjeta{
            background-color: rgb(255, 255, 255);
            padding: 24px;
            border-radius: 16px;
            width: 100%;
 
        }
        
    }
 
</style>