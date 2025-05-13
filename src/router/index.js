import { createRouter, createWebHistory } from "vue-router";
import InicioView from "../views/InicioView.vue";

const routes = [
  {
    path: "/",
    name: "inicio",
    component: InicioView,
  },
  {
    path: "/Pantalla1View",
    name: "pantalla1",
    component: () => import("../views/Pantalla1View.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/Pantalla2View",
    name: "pantalla2",
    component: () => import("../views/Pantalla2View.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/Pantalla3View",
    name: "pantalla3",
    component: () => import("../views/Pantalla3View.vue"),
    meta: { requiresAuth: true },
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
    path: "/Pantalla10View",
    name: "pantalla10",
    component: () => import("../views/Pantalla10View.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/Pantalla11View",
    name: "pantalla11",
    component: () => import("../views/Pantalla11View.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/Pantalla12View",
    name: "pantalla12",
    component: () => import("../views/Pantalla12View.vue"),
    meta: { requiresAuth: true },
  },
];
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Comentar si es necesario para desactivar temporalmente las protección de las rutas.

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";

  if (to.meta.requiresAuth && !isAuthenticated) {
    next("/");
  } else {
    next();
  }
});

export default router;
