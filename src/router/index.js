import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/inicio",
    name: "inicio",
    component: () => import("../views/InicioView.vue"),
  },
  {
    path: "/Pantalla1View",
    name: "pantalla1",
    component: () => import("../views/Pantalla1View.vue"),
    meta: { requiresAuth: true, role: "usuario" },
  },
  {
    path: "/Pantalla2View",
    name: "pantalla2",
    component: () => import("../views/Pantalla2View.vue"),
    meta: { requiresAuth: true, role: "admin", empresa: "bancow" },
  },
  {
    path: "/Pantalla3View",
    name: "pantalla3",
    component: () => import("../views/Pantalla3View.vue"),
    meta: { requiresAuth: true, role: "admin", empresa: "enlace" },
  },
  {
    path: "/Pantalla4View",
    name: "pantalla4",
    component: () => import("../views/Pantalla4View.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/Pantalla5View",
    name: "pantalla5",
    component: () => import("../views/Pantalla5View.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/Pantalla6View",
    name: "pantalla6",
    component: () => import("../views/Pantalla6View.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/Pantalla7View",
    name: "pantalla7",
    component: () => import("../views/Pantalla7View.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/Pantalla8View",
    name: "pantalla8",
    component: () => import("../views/Pantalla8View.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/Pantalla9View",
    name: "pantalla9",
    component: () => import("../views/Pantalla9View.vue"),
  },
  {
    path: "/Pantalla12View",
    name: "pantalla12",
    component: () => import("../views/Pantalla12View.vue"),
    meta: { requiresAuth: true, role: "usuario" },
  },
];
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

/* 
Usuario 
  meta: { requiresAuth: true, role: "usuario" },

Admin 
  meta: { requiresAuth: true, role: "admin" empresa: "bancow" },


*/

// Comentar si es necesario para desactivar temporalmente las protección de las rutas.

router.beforeEach((to, from, next) => {
  const userType = localStorage.getItem("userType"); // "admin" o "usuario"
  const userCompany = localStorage.getItem("userCompany"); // "bancow" o "enlace"
  const requiresAuth = to.meta.requiresAuth;
  const requiredRole = to.meta.role;
  const requiredCompany = to.meta.empresa;

  // Si la ruta requiere autenticación pero no hay tipo guardado (no autenticado)
  if (requiresAuth && !userType && !userCompany) {
    return next("/");
  }

  // Si la ruta requiere un tipo específico y no coincide
  if (
    requiredRole &&
    userType !== requiredRole &&
    userCompany !== requiredCompany
  ) {
    return next("/"); // O redirige a una vista específica según el tipo
  }

  return next();
});

export default router;
