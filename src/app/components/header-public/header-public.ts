import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header-public',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './header-public.html',
  styleUrls: ['./header-public.css'],
})
export class HeaderPublic {
  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }
}
