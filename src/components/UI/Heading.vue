<template>
  <header class="header">
    <span class="icon-left icon-circle"><i class="fas fa-user"></i></span>
    <p>{{ mensaje }}</p>
    <span class="icon-right icon-circle"><i class="fas fa-question-circle"></i></span>
    <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
      />
  </header>
</template>

<script setup>
defineProps({
  mensaje: {
    type: String,
    required: true
  }
});
</script>

<style scoped>
.header {
  background-color: #021066;
  color: rgb(255, 255, 255);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  border-radius: 16px;
  margin: 1rem auto;
  width: 90%;
  font-size: 1.1rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.icon-left,
.icon-right {
  font-size: 1.2rem;
  background-color: white;
  color: #2b008b;
  padding: 0.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
