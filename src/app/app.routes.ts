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

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '', component: Home },
  { path: '', component: Landing },

  { path: 'admin/element-form', component: ElementForm, canActivate: [authGuard] },
  { path: 'admin/element-list', component: ElementList, canActivate: [authGuard] },
  { path: 'admin/element-form', component: ElementForm, canActivate: [authGuard] },
  { path: 'admin/event-list', component: EventList, canActivate: [authGuard] },
  { path: 'user/event-form', component: EventForm, canActivate: [authGuard] },

  { path: 'register', component: Register },
  { path: 'login', component: Login },
];
