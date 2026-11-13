import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.page').then(m => m.RegisterPage)
  },
  {
    path: 'admin',
    loadChildren: () => import('./pages/admin/admin-routing.module').then(m => m.AdminRoutingModule),
    canActivate: [AuthGuard],
    data: { admin: true }
  },

  {
    path: 'home',
    loadComponent: () =>
      import('./pages/home/home.page').then(m => m.HomePage),
    canActivate: [AuthGuard]
  },
  {
    path: 'productos',
    loadComponent: () => import('./pages/productos/productos.page').then( m => m.ProductosPage),
    canActivate: [AuthGuard]
  },
  {
    path: 'carrito',
    loadComponent: () => import('./pages/carrito/carrito.page').then( m => m.CarritoPage),
    canActivate: [AuthGuard]
  },
  {
    path: 'pago',
    loadComponent: () => import('./pages/pago/pago.page').then( m => m.PagoPage),
    canActivate: [AuthGuard]
  },
  {
    path: 'exito',
    loadComponent: () => import('./pages/exito/exito.page').then( m => m.ExitoPage),
    canActivate: [AuthGuard]
  },
  {
    path: 'contacto',
    loadComponent: () => import('./pages/contacto/contacto.page').then( m => m.ContactoPage),
    canActivate: [AuthGuard]
  },
  {
    path: 'conocenos',
    loadComponent: () => import('./pages/conocenos/conocenos.page').then( m => m.ConocenosPage),
    canActivate: [AuthGuard]
  },
  {
    path: 'perfil',
    loadComponent: () => import('./pages/perfil/perfil.page').then( m => m.PerfilPage),
    canActivate: [AuthGuard]
  },
  {
    path: 'seguimiento',
    loadComponent: () => import('./pages/seguimiento/seguimiento.page').then( m => m.SeguimientoPage),
    canActivate: [AuthGuard]
  },
  

];