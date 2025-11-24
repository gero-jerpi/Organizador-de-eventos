
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home-user',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './home-user.html',
  styleUrl: './home-user.css',
})
export class HomeUser {

  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }
}

