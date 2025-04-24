<script setup>
import { computed } from 'vue';

// Definir el prop "alerta" que se recibirá
const props = defineProps({
  alerta: {
    type: Object,
    required: true
  }
});

// Computed para verificar si es un error
const isError = computed(() => {
  return props.alerta.tipo === 'error';
});
</script>

<template>
  <!-- Si hay un mensaje en el objeto alerta, se muestra la alerta -->
  <div
    v-if="props.alerta.mensaje"
    :class="[isError ? 'bg-red-500' : 'bg-green-500']"
    class="text-white text-center p-3 uppercase font-bold mb-3 rounded-md"
  >
    {{ props.alerta.mensaje }}
  </div>
</template>