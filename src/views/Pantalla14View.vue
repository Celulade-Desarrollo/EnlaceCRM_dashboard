<script setup>
import { useRouter } from "vue-router";
import headerEnlace from "../components/UI/headerEnlace.vue";

const router = useRouter();

const goToRegistro = () => {
  router.push("/Pantalla11View"); 
};
const goToAbonos = () => {
  router.push("/PantallaBajarExcelView"); 
};

const goToActualizar = () => {
  router.push("/actualizar-saldos"); 
};
const goToActualizarIntereses = () => {
  router.push("/actualizar-intereses"); 
};
const goToEditarIntereses = () => {
  router.push("/editar-tasa-intereses"); 
};
</script>

<template>
  <headerEnlace />

   <div class="main-container">
    <div class="card">
      <button class="btn" @click="goToRegistro">
        <img src="/usuario.png" alt="registro" class="icon" />
        <span>Registro</span>
      </button>
    </div>

    <div class="card">
      <button class="btn" @click="goToActualizarIntereses">
        <img src="/intereses.png" alt="Actualizar saldos" class="icon" />
        <span>Actualizar intereses</span>
      </button>
    </div>

    <div class="card">
      <button class="btn" @click="goToActualizar">
        <img src="/saldo.png" alt="Actualizar intereses" class="icon" />
        <span>Actualizar saldos</span>
      </button>
    </div>
    <div class="card">
      <button class="btn" @click="goToEditarIntereses">
        <img src="/tasa.png" alt="Actualizar intereses" class="icon" />
        <span>Actualizar tasa intereses</span>
      </button>
    </div>
  </div>
</template>


<style scoped>
.main-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 80px;
  padding: 60px;
  height: auto;
  min-height: 70vh;
  background-color: #ffffff;
  border: 9px solid #251786;
  margin-top: 70px;
  flex-wrap: wrap;
  box-sizing: border-box;
}

.card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 20px;
  width: 240px;
  min-height: 260px;
  background-color: #ffffff;
  border: none;
  outline: none;
  box-shadow: none;
  transition: transform 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
}


.btn {
  background-color: #5A44D1;
  color: white;
  border: 2px solid #6C63FF;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 2px 3px 5px rgba(0, 0, 0, 0.25);
  
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  
  width: 300px;
  
  /* --- CONTROL DE ALTURA UNIFORME --- */
  /* Sube este número para hacerlos más largos hacia abajo */
  min-height: 150px;    
  height: auto;
  
  /* Ajusta el padding para que el contenido respire */
  padding: 20px;
  font-size: 1.4rem;    
  font-weight: 800;
  line-height: 1.1;
  gap: 12px;
  text-align: center; /* Por si el texto ocupa dos líneas */
}

.btn:hover {
  background-color: #3A2CA8;
  transform: scale(1.05);
}


.icon {
  /* Quitamos el absolute para que el flex lo ponga arriba */
  width: 40px;
  height: 40px;
  object-fit: contain;
  transition: transform 0.3s ease;
  position: static;     /* Importante para anular el anterior */
}


.btn:hover .icon {
  transform: scale(1.2);
}



.desc {
  background-color: rgba(139, 124, 235, 0.85);
  text-align: center;
  padding: 20px;
  width: 260px;
  height: 200px;
  font-size: 15px;
  line-height: 1.4;
  box-shadow: 1px 2px 4px rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
}


@media (max-width: 1024px) {
  .main-container {
    gap: 50px;
    padding: 40px;
  }

  .card {
    width: 240px;
  }

  .desc {
    width: 220px;
    height: 180px;
    font-size: 14px;
  }
}

@media (max-width: 768px) {
  .main-container {
    flex-direction: column;
    align-items: center;
    gap: 40px;
    padding: 30px;
    border-width: 7px;
  }

  .card {
    width: 80%;
    max-width: 300px;
  }

  .btn {
    font-size: 16px;
    padding: 10px 28px;
  }

  .desc {
    width: 90%;
    height: auto;
    min-height: 160px;
    font-size: 14px;
    padding: 15px;
  }
}

@media (max-width: 480px) {
  .main-container {
    border-width: 6px;
    padding: 20px;
  }

  .card {
    width: 100%;
    max-width: 280px;
  }

  .btn {
    font-size: 15px;
    padding: 10px 20px;
  }

  .desc {
    font-size: 13px;
    padding: 12px;
  }
}
</style>




