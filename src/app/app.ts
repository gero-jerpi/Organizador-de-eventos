import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderUser } from './components/header-user/header-user';
import { HeaderAdmin } from './components/header-admin/header-admin';
import { Register } from './pages/user/register/register';
import { Login } from './pages/user/login/login';
import { Footer } from './components/footer/footer';
import { EventForm } from './pages/user/event-form/event-form';
import { EventList } from './pages/admin/event-list/event-list';
import { Landing } from './pages/landing/landing';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Register, Login, HeaderAdmin, Footer, EventForm, EventList, Landing],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('Organizador-de-eventos');
}
