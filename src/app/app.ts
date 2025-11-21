import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from './components/footer/footer';
import { DynamicHeader } from './components/dynamic-header/dynamic-header';
@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    Footer,
    DynamicHeader,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('Organizador-de-eventos');
}
