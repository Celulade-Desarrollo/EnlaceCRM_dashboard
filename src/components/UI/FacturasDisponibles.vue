<script setup>
import { ref } from "vue";

const props = defineProps({
  facturas: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(["update-total"]);

const seleccionadas = ref(null);

const emitirTotal = () => {
  const total = seleccionadas.value ? seleccionadas.value.faltante : 0;
  emit("update-total", total, seleccionadas.value ? [seleccionadas.value]: []);
};
</script>

<template>
  <div class="facturas">
    <label v-for="factura in facturas" :key="factura.factura">
      <input
        type="radio"
        class="custom-radio"
        :value="factura"
        v-model="seleccionadas"
        @change="emitirTotal"
      />
      <span class="checkbox-visual"></span>

      <div class="factura-info">
        <div class="factura-linea">
          Factura {{ factura.factura }} — Total: ${{ factura.valor.toLocaleString() }}<br/><br/>
        </div>
        
      </div>
    </label>
  </div>
</template>

<style scoped>
.facturas label {
  display: flex;
  align-items: flex-start;
  cursor: pointer;
  margin-bottom: 15px;
}

.facturas input[type="radio"] {
  display: none;
}

.checkbox-visual {
  width: 26px;
  height: 26px;
  border: 2px solid #412ece;
  background-color: transparent;
  display: inline-block;
  position: relative;
  border-radius: 50%;
  margin-right: 12px;
  margin-top: 4px;
}

.facturas input[type="radio"]:checked + .checkbox-visual {
  background-color: #dd3590;
}

.facturas input[type="radio"]:checked + .checkbox-visual::after {
  content: '';
  position: absolute;
  left: 6px;
  top: 6px;
  width: 10px;
  height: 10px;
  border: white;
 border-radius: 50%;
}

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
