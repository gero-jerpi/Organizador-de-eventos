import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { ElementForm } from './pages/admin/element-form/element-form';
import { ElementList } from './pages/admin/element-list/element-list';
import { EventList } from './pages/admin/event-list/event-list';
import { EventForm } from './pages/user/event-form/event-form';
import { Register } from './pages/user/register/register';
import { Login } from './pages/user/login/login';
import { authGuard } from './auth-guard';
import { Landing } from './pages/landing/landing';
import { EventsUser } from './pages/user/events-user/events-user';
import { HomeAdmin } from './pages/admin/home-admin/home-admin';
import { HomeUser } from './pages/user/home-user/home-user';
import { EventDetail } from './pages/event-detail/event-detail';

export const routes: Routes = [
  // Página inicial
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Públicas
  { path: '', component: Landing },
  { path: 'login', component: Login },
  { path: 'landing-container', component: Landing, canActivate: [authGuard] },

  // Usuario
  { path: 'home-user', component: HomeUser, canActivate: [authGuard] },
  { path: 'events-user', component: EventsUser, canActivate: [authGuard] },
  { path: 'user/event-form', component: EventForm, canActivate: [authGuard] },
  { path: 'register', component: Register },

  // Admin
  { path: 'home-admin', component: HomeAdmin, canActivate: [authGuard] },
  { path: 'admin/element-form', component: ElementForm, canActivate: [authGuard] },
  { path: 'admin/element-list', component: ElementList, canActivate: [authGuard] },
  { path: 'admin/event-list', component: EventList, canActivate: [authGuard] },

  // detalle del evento
  { path: 'eventos/:id', component: EventDetail, canActivate: [authGuard] },

  // 404
  { path: '**', redirectTo: 'login' },
];
