<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import HeadingEnlace from '../components/UI/headingEnlace.vue'

const token = localStorage.getItem("admin_token");
const company = localStorage.getItem("company");

const tasaData = ref({
  tasaEfectivaAnual: 0,
  valorFactorSeguro: 0,
  Id: null,
  diasDuracionCuota:0,
})

const showModal = ref(false)

onMounted(async () => {
  try {
    const response = await axios.get('/api/tasaIntereses', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    if (response.data.length > 0) {
      tasaData.value = response.data[0]
    }
  } catch (error) {
    console.error('Error fetching data:', error)
  }
})

const openModal = () => {
  showModal.value = true
}

const confirmUpdate = async () => {
  try {
    await axios.put(`/api/tasaIntereses/${tasaData.value.Id}`, {
      tasaEfectivaAnual: tasaData.value.tasaEfectivaAnual,
      valorFactorSeguro: tasaData.value.valorFactorSeguro,
      diasDuracionCuota: tasaData.value.diasDuracionCuota
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    showModal.value = false
    window.location.reload();
  } catch (error) {
    console.error('Error updating:', error)
    alert('Error al actualizar')
  }
}

const cancelUpdate = () => {
  showModal.value = false
}
const bloquearCaracteres = (e) => {
  if (['.', ',', '-', '+', 'e', 'E'].includes(e.key)) {
    e.preventDefault()
  }
}

const limpiarEntero = (e) => {
  let valor = e.target.value

  valor = valor.replace(/[^0-9]/g, '')

  tasaData.value.diasDuracionCuota = valor ? parseInt(valor, 10) : null
}
</script>

<template>
  <HeadingEnlace />
  <div class="container-main">
    <h1 class="title">Editar tasa de intereses</h1>
    
    <div class="form-box">
      <div>
        <label class="label">Tasa Efectiva Anual:</label>
        <input 
          type="number" 
          v-model.number="tasaData.tasaEfectivaAnual"
          class="input"
          step="0.01"
        />
      </div>
      
      <div>
        <label class="label">Valor Factor Seguro:</label>
        <input 
          type="number" 
          v-model.number="tasaData.valorFactorSeguro"
          class="input"
          step="0.00001"
        />
      </div>

      <div>
        <label class="label">Dias duracion cuota:</label>
        <input 
          type="number"
          step="1"
          min="0"
          v-model.number="tasaData.diasDuracionCuota"
          class="input"
          @keydown="bloquearCaracteres"
          @input="limpiarEntero"
          @paste.prevent
        />
      </div>
      
      <button 
        @click="openModal"
        class="btn-save"
      >
        Guardar
      </button>
    </div>
    
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-box">
        <p class="modal-text">
          ¿Seguro que deseas actualizar las tasas de interes?
        </p>
        <div class="modal-buttons">
          <button @click="confirmUpdate" class="btn-confirm">
            Sí
          </button>
          <button @click="cancelUpdate" class="btn-cancel">
            No
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

.container-main{
  max-width: 1200px;
  margin: auto;
  padding: 16px;
}

.title{
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 24px;
  color: white;
}

.form-box{
  max-width: 400px;
  margin: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.label{
  display: block;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 4px;
  color: white;
}

.input{
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  outline: none;
}

.input:focus{
  border-color: #3b82f6;
}

.btn-save{
  width: 100%;
  background-color: #3b82f6;
  color: white;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
}

.btn-save:hover{
  background-color: #2563eb;
}

.modal-overlay{
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-box{
  background: white;
  padding: 24px;
  border-radius: 8px;
  width: 100%;
  max-width: 320px;
}

.modal-text{
  text-align: center;
  margin-bottom: 16px;
}

.modal-buttons{
  display: flex;
  justify-content: center;
  gap: 16px;
}

.btn-confirm{
  background: #22c55e;
  color: white;
  padding: 8px 16px;
  border-radius: 6px;
}

.btn-confirm:hover{
  background: #16a34a;
}

.btn-cancel{
  background: #ef4444;
  color: white;
  padding: 8px 16px;
  border-radius: 6px;
}

.btn-cancel:hover{
  background: #dc2626;
}

</style>