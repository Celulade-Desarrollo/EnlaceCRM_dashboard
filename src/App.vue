<script setup>
import { RouterView } from "vue-router";
import { AnimatePresence } from "motion-v";
</script>

<template>
  <AnimatePresence>
    <RouterView />
  </AnimatePresence>
</template>

