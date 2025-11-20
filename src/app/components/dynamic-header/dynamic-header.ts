import { Component } from '@angular/core';
import { HeaderAdmin } from '../header-admin/header-admin';
import { HeaderUser } from '../header-user/header-user';
import { Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs';
import { HeaderPublic } from '../header-public/header-public';
@Component({
  selector: 'app-dynamic-header',
  imports: [CommonModule, HeaderAdmin, HeaderUser, HeaderPublic],
  templateUrl: './dynamic-header.html',
  styleUrl: './dynamic-header.css',
})
export class DynamicHeader {
  isLandingPage = false;
  role: 'admin' | 'client' | null = null;

  constructor(private router: Router) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        const current = event.urlAfterRedirects;
        console.log('ROL DESDE STORAGE:', localStorage.getItem('role'));
        // Detect landing
        this.isLandingPage = current === '/' || current === '/landing';

        // Detect role
        this.role = localStorage.getItem('role') as any;
      });
  }
}
