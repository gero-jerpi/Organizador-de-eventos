import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderUser } from './components/header-user/header-user';
import { HeaderAdmin } from './components/header-admin/header-admin';
import { Register } from './pages/user/register/register';
import { Login } from './pages/user/login/login';
import { Footer } from './components/footer/footer';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Register, Login, HeaderUser, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('Organizador-de-eventos');
}
