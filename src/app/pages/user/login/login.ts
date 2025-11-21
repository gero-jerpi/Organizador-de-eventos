import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../services/user-service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private router = inject(Router);

  errorMsg = '';

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  login() {
    if (this.loginForm.invalid) {
      this.errorMsg = 'Por favor complete correctamente los campos.';
      return;
    }

    const email = this.loginForm.value.email!;
    const password = this.loginForm.value.password!;

    this.userService.login(email, password).subscribe({
      next: (user) => {
        localStorage.setItem('role', user.role);
        if (user.role === 'admin') {
          this.router.navigate(['home-admin']);
        } else {
          this.router.navigate(['home-user']);
        }
      },
      error: (err) => {
        this.errorMsg = err.message;
      },
    });
  }
}
