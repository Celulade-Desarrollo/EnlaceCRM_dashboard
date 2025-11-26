import { createRouter, createWebHistory } from "vue-router";
const routes = [
  {
    path: "/",
    name: "inicio",
    component: () => import("../views/PantallaLoader.vue"),
  },
  {
    path: "/actualizar-saldos",
    name: "actualizar-saldos",  
    component: () => import("../views/ActualizarCredito.vue"),
     meta: { requiresAuth: true, role: "admin", empresa: "enlace"}
  },
  {
    path: "/actualizar-intereses",
    name: "actualizar-intereses",  
    component: () => import("../views/ActualizarIntereses.vue"),
     meta: { requiresAuth: true, role: "admin", empresa: "enlace"}
  },
  {
    path: "/ayuda",
    name: "ayuda",
    component: () => import("../views/PantallaAyudaView.vue"),
    meta: { requiresAuth: true },
  },

{
    path: "/Pantalla13View",
    name: "Comunicacion",
    component: () => import("../views/PantallaComunicacioView.vue"),
    meta: { requiresAuth: true },
  },

{
    path: "/PantallaPagos",
    name: "Pagos",
    component: () => import("../views/PantallaPagosView.vue"),
    meta: { requiresAuth: true },
  },

  {
    path: "/Pantalla1View",
    name: "pantalla1",
    component: () => import("../views/Pantalla1View.vue"),
    meta: { requiresAuth: true, role: "usuario" },
  },
   {
    path: "/LoginView",
    name: "LoginView",
    component: () => import("../views/LoginView.vue"),
    meta: { requiresAuth: false },
  },
  {
    path: "/Pantalla3View",
    name: "pantalla3",
    component: () => import("../views/Pantalla3View.vue"),
    meta: { requiresAuth: true, role: "usuario" },
  },
  {
    path: "/Pantalla4View",
    name: "pantalla4",
    component: () => import("../views/Pantalla4View.vue"),
    meta: { requiresAuth: true, role:"usuario" },
  },
  {
    path: "/Pantalla5View",
    name: "pantalla5",
    component: () => import("../views/Pantalla5View.vue"),
    meta: { requiresAuth: true, role: "usuario" }
  },

    {
    path: "/Pantalla6View",
    name: "pantalla6",
    component: () => import("../views/Pantalla6View.vue"),
    meta: { requiresAuth: true, role:"usuario" },
  },

  // {
  //   path: "/Pantalla9View",
  //   name: "pantalla9",
  //   component: () => import("../views/Pantalla9View.vue"),
  //   meta: { requiresAuth: true, role:"usuario" }
  // },
  {
    path: "/Pantalla10view",
    name: "pantalla10",
  component: () => import("../views/Pantalla10view.vue"),
  meta: { requiresAuth: true, role: "admin", empresa: "bancow"}
  },
  {
    path: "/Pantalla11View",
    name: "pantalla11",
    component: () => import("../views/Pantalla11View.vue"),
    meta: { requiresAuth: true, role: "admin", empresa: "enlace"}
  },
  {
    path: "/Pantalla12View",
    name: "pantalla12",
    component: () => import("../views/Pantalla12View.vue"),
    meta: { requiresAuth: true }
  },
  {
    path: "/PantallaFacturasView",
    name: "PantallaFacturas",
    component: () => import("../views/PantallaFacturasDView.vue"),
    meta: { requiresAuth: true,  role: "usuario" },
  },
    {
    path: "/PantallaAbonoView",
    name: "PantallaAbono",
    component: () => import("../views/PantallaAbonoView.vue"),
    meta: { requiresAuth: true,  role: "usuario" },
  }, 
  {
    path: "/PantallasubirExcelView",
    name: "PantallasubirExcel",
    component: () => import("../views/pantallaSubirExcelView.vue"),
    meta: { requiresAuth: true,  role: "admin" },
  },
    {
  path: "/PantallaCorresponsalView",
  name: "PantallaCorresponsal",
  component: () => import("../views/PantallaCorresponsalView.vue"),
  meta: { requiresAuth: true,  role: "usuario" },
  },
  {
  path: "/Pantalla14View",
  name: "PantallaBajarExcel",
  component: () => import("../views/Pantalla14View.vue"),
  meta: { requiresAuth: true,  role: "admin" },
  },
  {
  path: "/PantallaBajarExcelView",
  name: "PantallaBajarExcelV",
  component: () => import("../views/PantallaBajarExcelView.vue"),
  meta: { requiresAuth: true,  role: "admin" },
  },
  {
  path: "/PantallaDistribuidoresView",
  name: "PantallaDistribuidores",
  component: () => import("../views/PantallaDistribuidoresView.vue"),
  meta: { requiresAuth: true,  role: "admin" },
  }
  
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const role = (localStorage.getItem("tipo") || "").toLowerCase(); // "admin" o "usuario"
  const company = (localStorage.getItem("company") || "").toLowerCase(); // "bancow" o "enlace"
  const requiresAuth = to.meta.requiresAuth;
  const requiredRole = (to.meta.role || "").toLowerCase();
  const requiredCompany = (to.meta.empresa || "").toLowerCase();

  console.log("ruta:", to.name, "| role:", role, "| company:", company);

  // Solo bloquear si requiere autenticación y no tiene rol
  if (requiresAuth && !role) {
    return next("/");
  }

  // Validar rol si se requiere
  if (requiredRole && role !== requiredRole) {
    return next("/");
  }

  // Validar empresa si se requiere
  if (requiredCompany && company !== requiredCompany) {
    return next("/");
  }

  return next();
});




export default router;
