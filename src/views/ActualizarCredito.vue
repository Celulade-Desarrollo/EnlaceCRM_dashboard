<template>
  <div class="movimientos-container">
    <div v-for="movimiento in movimientos" :key="movimiento.IdMovimiento" class="movimiento-card">
      <div class="card-header">
        <h3>Movimiento #{{ movimiento.IdMovimiento }}</h3>
        <span class="fecha"> Realizado el {{ formatearFecha(movimiento.FechaHoraMovimiento) }}</span>
      </div>
      <div class="card-body">
        <p><strong>Cédula:</strong> {{ movimiento.Cedula_Usuario }}</p>
        <p>
          <strong>Monto:</strong>
          <template v-if="movimiento.editando">
            <input 
              type="number" 
              v-model="movimiento.nuevoMonto" 
              class="monto-input"
            >
          </template>
          <template v-else>
            ${{ formatearMonto(movimiento.Monto) }}
          </template>
        </p>
        <p><strong>Descripción:</strong> {{ movimiento.Descripcion }}</p>
        <p><strong>Fecha de Pago Programado:</strong> {{ formatearFecha(movimiento.FechaPagoProgramado) }}</p>
        
        <div class="botones">
          <template v-if="movimiento.editando">
            <button @click="actualizarMonto(movimiento)" class="p-2 bg-green-400 rounded-xl pl-3 pr-3 text-green-800">Guardar</button>
            <button @click="cancelarEdicion(movimiento)" class="text-gray-400 p-2 border-2 rounded-xl border-solid border-gray-400">Cancelar</button>
          </template>
          <template v-else>
            <button @click="iniciarEdicion(movimiento)" class="bg-[#dd3590] text-white p-2 pl-4 pr-4 rounded-xl">Actualizar Saldo</button>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'ActualizarCreditor',
  data() {
    return {
      movimientos: []
    }
  },
  methods: {
    async obtenerMovimientos() {
      try {
        const response = await axios.get('/api/listar/enlace/movimientos')
        const data = response.data
        this.movimientos = data.map(mov => ({
          ...mov,
          editando: false,
          nuevoMonto: mov.Monto
        }))
      } catch (error) {
        console.error('Error al obtener movimientos:', error)
      }
    },

    iniciarEdicion(movimiento) {
      movimiento.editando = true
      movimiento.nuevoMonto = movimiento.Monto
    },

    cancelarEdicion(movimiento) {
      movimiento.editando = false
      movimiento.nuevoMonto = movimiento.Monto
    },

    async actualizarMonto(movimiento) {
      try {
        await axios.post('/api/calcular-intereses', {
          idMovimiento: movimiento.IdMovimiento,
          nuevoMonto: Number(movimiento.nuevoMonto)
        })
        
        movimiento.Monto = movimiento.nuevoMonto
        movimiento.editando = false
        
      
      } catch (error) {
        console.error('Error al actualizar monto:', error)

      }
    },

    formatearFecha(fecha) {
      return new Date(fecha).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    },

    formatearMonto(monto) {
      return monto.toLocaleString('es-CO')
    },

    obtenerEstado(idEstado) {
      const estados = {
        1: 'Pendiente',
        2: 'Completado',
        3: 'Cancelado'
      }
      return estados[idEstado] || 'Desconocido'
    }
  },
  mounted() {
    this.obtenerMovimientos()
  }
}
</script>

<style scoped>
.movimientos-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
  padding: 1rem;
}

.movimiento-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.card-header {
  border-bottom: 1px solid #eee;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
}

.card-header h3 {
  margin: 0;
  color: #2c3e50;
}

.fecha {
  color: #666;
  font-size: 0.9rem;
}

.card-body p {
  margin: 0.5rem 0;
}

strong {
  color: #2c3e50;
}

.botones {
  margin-top: 1rem;
  display: flex;
  gap: 0.5rem;
}

.btn-editar,
.btn-actualizar,
.btn-cancelar {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-weight: bold;
}

.btn-editar {
  background-color: #3498db;
  color: white;
}

.btn-actualizar {
  background-color: #2ecc71;
  color: white;
}

.btn-cancelar {
  background-color: #e74c3c;
  color: white;
}

.monto-input {
  width: 120px;
  padding: 0.3rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button:hover {
  opacity: 0.9;
}
</style>