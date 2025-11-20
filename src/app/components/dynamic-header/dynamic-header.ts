import { Component, effect, inject } from '@angular/core';
import { HeaderAdmin } from '../header-admin/header-admin';
import { HeaderUser } from '../header-user/header-user';
import { Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs';
import { HeaderPublic } from '../header-public/header-public';
import { UserService } from '../../services/user-service';
@Component({
  selector: 'app-dynamic-header',
  imports: [CommonModule, HeaderAdmin, HeaderUser, HeaderPublic],
  templateUrl: './dynamic-header.html',
  styleUrl: './dynamic-header.css',
})
export class DynamicHeader {
  private userService = inject(UserService);
  currentUser = this.userService.currentUser;

  isLandingPage = false;
  role: 'admin' | 'client' | null = null;

  constructor(private router: Router) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        const current = event.urlAfterRedirects;
        this.isLandingPage = current === '/' || current === '/landing';

        // Actualizamos el rol según el currentUser
        const user = this.currentUser();
        this.role = user ? user.role : null;
      });

    // efecto para actualizar rol al cambiar currentUser
    effect(() => {
      const user = this.currentUser();
      this.role = user ? user.role : null;
    });
  }
}

