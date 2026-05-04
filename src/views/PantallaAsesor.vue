<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import { motion } from "motion-v";
import Heading from "../components/UI/Heading.vue";
import HeaderAsesor from '../components/UI/HeaderAsesor.vue';

const registros = ref([]);
const busqueda = ref("");
const cargando = ref(true);
const errorConexion = ref(false);

const obtenerDatos = async () => {
  const token = localStorage.getItem("admin_token");
  if (!token) {
    cargando.value = false;
    return;
  }

  cargando.value = true;
  errorConexion.value = false;
  
  try {
    const resLocal = await axios.get('http://localhost:3000/api/asesoria/pendientes', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const pendientesRaw = Array.isArray(resLocal.data) ? resLocal.data : [];

    const promesas = pendientesRaw.map(async (reg) => {
      try {
        const resAlpina = await axios.post(
          'http://localhost:3000/api/alpina-cliente/consultar-nombre',
          { nbCliente: reg.nbCliente, nbAgenteComercial: reg.nbAgenteComercial }
        );

        const nombreFinal = [resAlpina.data?.nombre, resAlpina.data?.apellido]
          .filter(Boolean).join(' ').trim() || null;

        return {
          ...reg,
          nombreAlpina: nombreFinal || `Cliente ${reg.nbCliente}`,
        };

      } catch {
        return { ...reg, nombreAlpina: `Cliente ${reg.nbCliente}` };
      }
    });

    registros.value = await Promise.all(promesas);

  } catch {
    errorConexion.value = true;
  } finally {
    cargando.value = false;
  }
};

const registrosFiltrados = computed(() => {
  const q = busqueda.value.toLowerCase().trim();
  if (!registros.value.length) return [];
  return registros.value.filter(reg => {
    const nombre = reg.nombreAlpina?.toLowerCase() || '';
    const id = reg.nbCliente?.toString() || '';
    return nombre.includes(q) || id.includes(q);
  });
});

const gestionar = (reg) => {
  const url = `https://enlace-crm.com:3000/?nbAgenteComercial=${reg.nbAgenteComercial}&nbCliente=${reg.nbCliente}`;
  window.open(url, '_blank');
};

const formatNombre = (nombre) => {
  if (!nombre) return 'Cargando...';
  if (nombre.startsWith('Cliente')) return nombre; 
  return nombre.toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
};

onMounted(obtenerDatos);
</script>

<template>
  <HeaderAsesor />
  <div class="dashboard-container">
    <!-- Header Adaptable -->
    <header class="app-header">
      <div class="header-inner">
        <div class="title-section">
          <h1>Clientes pendientes</h1>
          <span class="counter-badge">{{ registrosFiltrados.length }}</span>
        </div>
        <div class="search-wrapper">
          <input v-model="busqueda" type="text" placeholder="Buscar cliente..." class="search-input" />
        </div>
      </div>
    </header>

    <main class="main-content">
      <div v-if="cargando" class="loading-state">
        <div class="spinner"></div>
        <p>Cargando datos...</p>
      </div>

      <div v-else class="cards-grid">
        <div v-for="reg in registrosFiltrados" :key="reg.nbCliente" class="client-card">
          <div class="card-body">
            <div class="user-info">
              <div class="avatar-box">
                {{ reg.nombreAlpina.startsWith('Cliente') ? 'C' : reg.nombreAlpina[0].toUpperCase() }}
              </div>
              <div class="user-details">
                <span class="user-name">{{ formatNombre(reg.nombreAlpina) }}</span>
                <span class="user-id">ID: {{ reg.nbCliente }}</span>
              </div>
            </div>
            
            <!-- El botón que se adapta -->
            <button @click="gestionar(reg)" class="btn-manage">
              Gestionar
            </button>
          </div>
        </div>
      </div>

      <div v-if="!cargando && registrosFiltrados.length === 0" class="empty-state">
        <p>No hay asesorías pendientes.</p>
      </div>
    </main>
  </div>
</template>

<style scoped>
.dashboard-container {
  background-color: #f5f7fb;
  min-height: 100vh;
  font-family: 'Inter', sans-serif;
}

/* Header con diseño fluido */
.app-header {
  background: white;
  padding: 20px 0;
  border-bottom: 1px solid #eef1f6;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  flex-direction: column; /* Celular: uno sobre otro */
  gap: 15px;
}

@media (min-width: 768px) {
  .header-inner {
    flex-direction: row; /* PC: uno al lado del otro */
    justify-content: space-between;
    align-items: center;
  }
}

.title-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.title-section h1 {
  font-size: 24px;
  color: #1e293b;
  margin: 0;
}

.counter-badge {
  background: #4f46e5;
  color: white;
  padding: 4px 10px;
  border-radius: 50%;
  font-weight: bold;
  font-size: 14px;
}

.search-input {
  width: 100%;
  max-width: 400px;
  padding: 12px 16px;
  background: #f1f5f9;
  border: none;
  border-radius: 12px;
  font-size: 16px;
}

/* Contenido Principal */
.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.cards-grid {
  display: grid;
  gap: 16px;
}

/* LA TARJETA ADAPTABLE */
.client-card {
  background: white;
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.card-body {
  display: flex;
  flex-direction: column; /* Vertical por defecto (Móvil) */
  gap: 20px;
}

/* Transformación a Fila en PC */
@media (min-width: 768px) {
  .card-body {
    flex-direction: row; 
    align-items: center;
    justify-content: space-between;
  }
}

.user-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.avatar-box {
  width: 50px;
  height: 50px;
  background: #eff6ff;
  color: #3b82f6;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 20px;
}

.user-name {
  display: block;
  font-weight: 700;
  color: #1e293b;
  font-size: 16px;
}

.user-id {
  font-size: 13px;
  color: #64748b;
}

/* Botón que se ajusta */
.btn-manage {
  background: #4f46e5;
  color: white;
  border: none;
  padding: 14px 24px;
  border-radius: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.1s active;
  width: 100%; /* Ancho completo en Celular */
}

@media (min-width: 768px) {
  .btn-manage {
    width: auto; /* Ancho automático en PC */
  }
}

.btn-manage:active {
  transform: scale(0.96);
}

/* Estados */
.loading-state, .empty-state {
  text-align: center;
  padding: 50px;
  color: #64748b;
}

.spinner {
  width: 30px;
  height: 30px;
  border: 3px solid #e2e8f0;
  border-top-color: #4f46e5;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 10px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>