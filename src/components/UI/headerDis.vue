<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const goToLogin = () => {
  router.push('/PantallaDisView');
};

const logout = () => {
  sessionStorage.clear();
  localStorage.clear();
  router.push('/LoginView');
};
</script>

<template>
  <header class="header-bar">
    <div class="left-section">
      <img 
        src="/public/casa.png" 
        alt="Inicio" 
        class="home-icon"
        @click="goToLogin"
      />
    </div>

    <h1 class="title">Hola, Karen Obando </h1>

    <div class="right-section">
      <!-- LOGOS -->
      <div class="logos">
        <img src="/public/enlaceFiado.png" alt="Enlace CRM" class="logo enlace" />
        <img src="/public/bancoW.png" alt="Banco W" class="logo banco" />
      </div>

      <!-- BOTÓN DEBAJO -->
<button class="btn-logout" @click="logout">
  <img src="/public/sesion.png" alt="Usuario" class="logout-icon" />
  Cerrar sesión
</button>

    </div>
  </header>
</template>

<style scoped>
.header-bar {
  width: 100vw;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #5e50a1;
  color: white;
  padding: 5px 40px;
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
  border-radius: 50%;
  padding: 8px;
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

/* 🔥 CAMBIO MÍNIMO AQUÍ */
.right-section {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
  flex-shrink: 0;
}

.logos {
  display: flex;
  align-items: center;
  gap: 16px;
}

.logout-icon {
  width: 20px;
  height: 20px;
  object-fit: contain;
}


.logo {
  height: 40px;
  object-fit: contain;
}

.enlace {
  height: 25px;
}

.banco {
  height: 70px;
}

/* 📱 Responsividad */
@media (max-width: 1024px) {
  .title {
    margin-left: 80px;
    font-size: 20px;
  }

  .logos img {
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
    order: 2;
  }

  .left-section {
    order: 1;
  }

  .right-section {
    order: 3;
    align-items: center;
    margin-top: 10px;
  }

  .banco {
    height: 50px;
  }

  .logo,
  .enlace {
    height: 28px;
  }
}

.btn-logout {
  background-color: #e83e8c;
  color: #fff;
  border: none;
  border-radius: 20px;
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.btn-logout:hover {
  background-color: #d63384;
  transform: scale(1.05);
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
    gap: 8px;
  }

  .banco {
    height: 45px;
  }

  .logo,
  .enlace {
    height: 25px;
  }
}
</style>
