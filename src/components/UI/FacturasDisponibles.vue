<!-- src/components/FacturasCheckbox.vue -->
<template>
  <div class="facturas">
    <label v-for="factura in facturas" :key="factura.factura">
      <input
        type="checkbox"
        class="custom-checkbox"
        :value="factura"
        v-model="seleccionadas"
        @change="emitirTotal"
      />
      <span class="checkbox-visual"></span>
      Factura {{ factura.factura }}: $ {{ factura.valor.toLocaleString() }}
    </label>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  facturas: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(["update-total"]);

const seleccionadas = ref([]);

const emitirTotal = () => {
  const total = seleccionadas.value.reduce((sum, f) => sum + f.valor, 0);
  emit("update-total", total, seleccionadas.value); // ← también envía seleccionadas
};

</script>
<style scoped>
.facturas label {
    display: flex;
    align-items: center;
    cursor: pointer;
    margin-bottom: 15px; 
}

.facturas input[type="checkbox"] { /* Asegurarse de seleccionar solo los checkboxes */
    /* Oculta el checkbox nativo */
    display: none;
}

.checkbox-visual {
    width: 28px;
    height: 28px;
    border: 2px solid #412ece;
    background-color: transparent;
    display: inline-block;
    position: relative;
    border-radius: 6px;
    margin-right: 12px;
}

/* Estilo cuando el checkbox está marcado */
.facturas input[type="checkbox"]:checked + .checkbox-visual {
    background-color: #dd3590;
}

.facturas input[type="checkbox"]:checked + .checkbox-visual::after {
    content: '';
    position: absolute;
    left: 7px;
    top: 3px;
    width: 8px;
    height: 16px;
    border: solid white;
    border-width: 0 4px 4px 0;
    transform: rotate(45deg);
}
</style>