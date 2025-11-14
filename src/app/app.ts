import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderUser } from "./components/header-user/header-user";
import { Register } from "./pages/user/register/register";
import { Login } from "./pages/user/login/login";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Organizador-de-eventos');
}
