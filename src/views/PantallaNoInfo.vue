<template>
  <div class="pantalla">
    <div class="card">
      <img src="/enlaceFiado.png" alt="Enlace Fiado" class="logo" />

      <div class="icono">
        !
      </div>

      <h2>
        No encontramos información del cliente
      </h2>

      <p>
        No es posible continuar con el proceso porque no encontramos datos
        asociados a este cliente.
      </p>

      <p>
      </p>
    </div>
  </div>
</template>

<style scoped>
.pantalla {
  min-height: 100vh;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.card {
  max-width: 400px;
  width: 100%;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.logo {
  width: 250px;
  height: 60px;
  object-fit: contain;
  margin-bottom: 40px;
}

.icono {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #dd3590;
  color: white;
  font-size: 40px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 25px;
}

h2 {
  font-size: 1.7rem;
  font-weight: 600;
  color: #111;
  margin-bottom: 20px;
}

p {
  color: #555;
  font-size: 1rem;
  line-height: 1.5;
  margin-bottom: 10px;
}

.btn {
  margin-top: 30px;
  width: 100%;
  height: 48px;
  border: none;
  border-radius: 100px;
  background: #dd3590;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: .3s;
}

.btn:hover {
  background: #c42f7e;
}
</style>