<script setup>
import { useRouter } from 'vue-router'
import { computed } from 'vue'

const router = useRouter()

const canGoBack = computed(() => window.history.length > 1)

const goBack = () => {
  if (canGoBack.value) {
    router.go(-1)
  }
}
</script>

<template>
  <button
    @click="goBack"
    class="btn-atras"
    :disabled="!canGoBack"
    :title="canGoBack ? 'Regresar' : 'No hay página anterior'"
  >
    <svg
      class="icono-atras"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M19 12H5M12 19L5 12L12 5"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
    <span class="texto-atras">Atrás</span>
  </button>
</template>

<style scoped>
.btn-atras {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 8px;
  background: #dd3590;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  min-width: 80px;
  justify-content: center;
  position: absolute;
  top: 20px;
  left: 20px;
}

.btn-atras:hover:not(:disabled) {
  background: #f15bab;
  transform: translateY(-1px);
}

.btn-atras:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.icono-atras {
  transition: transform 0.2s ease;
}

.btn-atras:hover:not(:disabled) .icono-atras {
  transform: translateX(-2px);
}

.texto-atras {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

@media (max-width: 768px) {
  .btn-atras {
    font-size: 13px;
    padding: 6px 10px;
  }

  .texto-atras {
    display: none;
  }
}
</style>
