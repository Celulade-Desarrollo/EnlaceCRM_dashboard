import { createRouter, createWebHistory } from 'vue-router'
import InicioView from "../views/InicioView.vue";

const routes =[
  {
    path: '/',
    name: 'inicio',
    component: InicioView 
  },
  {
    path: '/Pantalla1View',
    name: 'pantalla1',
    component: () => import("../views/Pantalla1View.vue") 
  },
  {
    path: '/Pantalla2View',
    name: 'pantalla2',
    component: () => import("../views/Pantalla2View.vue") 
  },
  {
    path: '/Pantalla3View',
    name: 'pantalla3',
    component: () => import("../views/Pantalla3View.vue") 
  },
  {
    path: '/Pantalla4View',
    name: 'pantalla4',
    component: () => import("../views/Pantalla4View.vue") 
  },
  {
    path: '/Pantalla5View',
    name: 'pantalla5',
    component: () => import("../views/Pantalla5View.vue") 
  },
  {
    path: '/Pantalla6View',
    name: 'pantalla6',
    component: () => import("../views/Pantalla6View.vue") 
  },
  {
    path: '/Pantalla7View',
    name: 'pantalla7',
    component: () => import("../views/Pantalla7View.vue") 
  },
  {
    path: '/Pantalla8View',
    name: 'pantalla8',
    component: () => import("../views/Pantalla8View.vue") 
  },
  {
    path: '/Pantalla9View',
    name: 'pantalla9',
    component: () => import("../views/Pantalla9View.vue") 
  },
  {
    path: '/Pantalla10View',
    name: 'pantalla10',
    component: () => import("../views/Pantalla10View.vue") 
  },{
    path: '/Pantalla11View',
    name: 'pantalla11',
    component: () => import("../views/Pantalla11View.vue") 
  },{
    path: '/Pantalla12View',
    name: 'pantalla12',
    component: () => import("../views/Pantalla12View.vue"),
    meta: { requiresAuth: true, role: 'admin' }
  },
]
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// router.beforeEach((to, from, next) => {
//   // Obtener datos del usuario desde localStorage
//   const data = JSON.parse(localStorage.getItem('data'));

//   // Verificar si la ruta requiere autenticación
//   if (to.meta.requiresAuth) {
//     if (data) {
//       // Ejemplo de redirección según el proveedor
//       if (data.proveedor === 'Nutresa' && to.name !== 'pantalla12') {
//         next({ name: 'pantalla12' }); // Redirige a Pantalla12 si el proveedor es Nutresa
//       } else if (data.proveedor !== 'Nutresa' && to.name !== 'pantalla1') {
//         next({ name: 'pantalla1' }); // Redirige a Pantalla1 para otros proveedores
//       } else {
//         next(); 
//       }
//     } else {
//       next('/'); 
//     }
//   } else {
//     next(); 
//   }
// });

export default router