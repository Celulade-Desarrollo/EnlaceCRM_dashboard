<template>
  <div class="facturas">
    <label v-for="factura in facturas" :key="factura.factura">
      <!-- Checkbox oculto pero funcional -->
      <input
        type="checkbox"
        class="custom-checkbox"
        :value="factura"
        v-model="seleccionadas"
        @change="emitirTotal"
      />
      <!-- Estilo visual del checkbox -->
      <span class="checkbox-visual"></span>

      <!-- Contenedor de texto de la factura -->
      <div class="factura-info">
        <!-- Línea principal -->
        <div class="factura-linea">
          Factura {{ factura.factura }} — Total: ${{ factura.valor.toLocaleString() }}
        </div>
        <!-- Detalles debajo -->
        <div class="factura-detalle">
          Pagado: ${{ factura.pagado.toLocaleString() }}<br />
          Faltante: ${{ factura.faltante.toLocaleString() }}
        </div>
      </div>
    </label>
  </div>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  facturas: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(["update-total"]);

const seleccionadas = ref([]);

const emitirTotal = () => {
  const total = seleccionadas.value.reduce((sum, f) => sum + f.faltante, 0); // Se suma solo el faltante
  emit("update-total", total, seleccionadas.value);
};
</script>

<style scoped>
.facturas label {
  display: flex;
  align-items: flex-start; /* Alinea el texto arriba del checkbox */
  cursor: pointer;
  margin-bottom: 15px;
}

.facturas input[type="checkbox"] {
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
  margin-top: 4px;
}

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

/* Estilos nuevos para estructurar la info */
.factura-info {
  display: flex;
  flex-direction: column;
}

.factura-linea {
  font-weight: bold;
  margin-bottom: 4px;
}

.factura-detalle {
  font-size: 14px;
  color: #444;
  line-height: 1.4;
}
</style>
