<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const goToLogin = () => {
router.push('/LoginView');
};

</script>

<template>
  <header class="header-bar">
    <div class="left-section">
      <img 
        src="/public/cerrar.png" 
        alt="Inicio" 
        class="home-icon"
        @click="goToLogin"
      />
    </div>

    <h1 class="title">Bienvenido al Portal de gestión enlaceCRM
</h1>

    <div class="right-section">
      <img src="/public/enlaceFiado.png" alt="Enlace CRM" class="logo enlace" />
    </div>
  </header>
</template>



<style scoped>
.header-bar {
  width: 100vw;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #5A44D1;
  color: white;
  padding: 30px 40px;
  border-bottom: 4px solid #3a2c87;
  box-sizing: border-box;
  flex-wrap: wrap; 
}

.left-section {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}


.home-icon {
  cursor: pointer;
  width: 40px;
  height: 40px;
  background-color: rgba(247, 243, 243, 0.39);
  border-radius: 70%;
  padding: 6px;
  display: flex;
  justify-content: center;
  align-items: center;
}


.home-icon:hover {
  background-color: #0c0c0c4f;
  transform: scale(1.05);
}


.title {
  flex: 1;
  text-align: center;
  font-weight: 700;
  font-size: 22px;
  color: #ffffff;
  margin-left: 150px;
  transition: all 0.3s ease;
}

.right-section {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-shrink: 0;
}

.logo {
  height: 40px;
  object-fit: contain;
}

.enlace {
  height: 35px;
  object-fit: contain;
}

.banco {
  height: 70px;
  object-fit: contain;
}


@media (max-width: 1024px) {
  .title {
    margin-left: 80px;
    font-size: 20px;
  }

  .right-section img {
    height: 35px;
  }
}

@media (max-width: 768px) {
  .header-bar {
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 15px 20px;
  }

  .title {
    margin-left: 0;
    margin-top: 10px;
    font-size: 20px;
    order: 2; /* el título baja debajo del ícono */
  }

  .left-section {
    order: 1;
  }

  .right-section {
    order: 3;
    margin-top: 10px;
    gap: 12px;
  }


  .logo,
  .enlace {
    height: 28px;
  }
}

@media (max-width: 480px) {
  .header-bar {
    padding: 10px 15px;
  }

  .title {
    font-size: 18px;
  }

  .home-icon {
    width: 35px;
    height: 35px;
    padding: 6px;
  }

  .right-section {
    flex-wrap: wrap;
    justify-content: center;
    gap: 8px;
  }


  .logo,
  .enlace {
    height: 25px;
  }
}
</style>

