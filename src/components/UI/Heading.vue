<template>
  <header class="header">
    <div class="header-icons">
      <!-- Ícono de ayuda a la izquierda -->
      <span class="icon-left">
        <i class="fas fa-user"></i>
      </span>
      
      <!-- Ícono de usuario a la derecha -->
      <span class="icon-right">
        <i class="fas fa-question-circle"></i>
      </span>
    </div>
    
    <!-- Mensaje de saludo -->
    <div class="header-text">
      <p>Hola, </p>
    </div>
  </header>
</template>

<style >
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');

body {
    margin: 0;
    font-family: Verdana, Geneva, Tahoma, sans-serif;
    background-color: #251886;
    color: white;
}

.header {   
    width: 100%;
    height:120px;
    padding: 10px 20px;
    background-color: #251886;
    display: flex;
    flex-direction: column;
    align-items: start;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}

.header-icons {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
}

.icon-left,
.icon-right {
    font-size: 1.5rem;
    cursor: pointer;
    color: white;
}

.icon-left{
  background-color: #463c8d;
  border-radius: 50%;
  padding: 7px;
}

.header-text {
    text-align: center;
}

.header-text p {
    margin: 0;
    font-size: 1.2rem;
}

</style>
