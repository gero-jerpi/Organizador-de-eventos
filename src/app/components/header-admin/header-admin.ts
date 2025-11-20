import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../services/user-service';

@Component({
  selector: 'app-header-admin',
  imports: [CommonModule, RouterModule],
  templateUrl: './header-admin.html',
  styleUrl: './header-admin.css',
})
export class HeaderAdmin {
  private userService = inject(UserService);
  private router = inject(Router);

  // ABRIR Y CERRAR MENU
  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  logout(){
    this.userService.logout();
    this.router.navigate(['/login'])
    this.closeMenu();
  }
}
