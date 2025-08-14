<script setup>
import { useRouter } from 'vue-router'
import { computed } from 'vue'

const router = useRouter()

const canGoBack = computed(() => {
  return window.history.length > 1
})

const goBack = () => {
  if (canGoBack.value) {
    router.go(-1)
  }
}
</script>

<template>
  <button
    @click="goBack"
    class="back-button"
    :disabled="!canGoBack"
    :title="canGoBack ? 'Regresar' : 'No hay página anterior'"
  >
    <svg
      class="back-icon"
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
    <span class="back-text">Atrás</span>
  </button>
</template>

<style scoped>
.back-button {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 8px;
  background: white;
  color: #021066;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  min-width: 80px;
  justify-content: center;
}

.back-button:hover:not(:disabled) {
  background: #f8f9fa;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  transform: translateY(-1px);
}

.back-button:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.back-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: #f8f9fa;
  color: #6c757d;
  box-shadow: none;
}

.back-icon {
  transition: transform 0.2s ease;
}

.back-button:hover:not(:disabled) .back-icon {
  transform: translateX(-1px);
}

.back-text {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* Responsive design */
@media (max-width: 768px) {
  .back-button {
    padding: 6px 10px;
    font-size: 13px;
    min-width: 60px;
  }
  
  .back-text {
    display: none;
  }
  
  .back-button {
    justify-content: center;
  }
  
  .back-icon {
    width: 18px;
    height: 18px;
  }
}
</style>