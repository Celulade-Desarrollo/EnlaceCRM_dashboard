import { ref } from 'vue';

export const sesionExpirada = ref(false);

export function activarSesionExpirada() {
  sesionExpirada.value = true;
}

export function cerrarSesion() {
  localStorage.clear();
  sesionExpirada.value = false;
}
